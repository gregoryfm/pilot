import {
  __,
  T,
  allPass,
  always,
  anyPass,
  append,
  apply,
  applySpec,
  assoc,
  assocPath,
  complement,
  cond,
  contains,
  dec,
  defaultTo,
  equals,
  flatten,
  has,
  head,
  ifElse,
  is,
  isEmpty,
  isNil,
  join,
  juxt,
  last,
  mergeAll,
  multiply,
  nth,
  of,
  pipe,
  prop,
  propSatisfies,
  props,
  reduce,
  reject,
  toPairs,
  when,
} from 'ramda'

const termsKeys = [
  'id',
  'customer.document_number',
  'customer.email',
  'customer.name',
]

const mapDashboardPropsToES = {
  'payment.paid_amount': 'paid_amount',
  'payment.cost_amount': 'cost',
  'payment.method': 'payment_method',
  created_at: 'date_created',
  'card.number': 'card_number',
}

const defaultTerm = {
  terms: {},
}

const internationalCreditCardTerm = [
  {
    terms: {
      payment_method: ['credit_card'],
    },
  },
  {
    not: {
      term: {
        'card.country': 'brazil',
      },
    },
  },
]

const aggregations = {
  total_amount: {
    sum: {
      field: 'amount',
    },
  },
  total_cost: {
    sum: {
      field: 'cost',
    },
  },
  total_per_day: {
    date_histogram: {
      field: 'date_created',
      interval: 'day',
      format: 'MM/dd/yyyy',
    },
    aggregations: {
      per_status: {
        terms: {
          field: 'status',
        },
        aggregations: {
          amount: {
            sum: {
              field: 'amount',
            },
          },
        },
      },
    },
  },
}

const isInternationalCreditCard = contains('international_credit_card')

const buildFilterTerm = (acc, value) => {
  const key = head(value)

  const buildTermsValues = assocPath(['terms', key], __, defaultTerm)

  const buildIntlCreditCardCondition = ifElse(
    isEmpty,
    always(internationalCreditCardTerm),
    applySpec({
      or: pipe(
        buildTermsValues,
        of,
        append({ and: internationalCreditCardTerm })
      ),
    })
  )

  const buildInternationalCreditCardTerms = pipe(
    reject(anyPass([equals('credit_card'), equals('international_credit_card')])),
    buildIntlCreditCardCondition
  )

  const buildTerm = pipe(
    nth(1),
    cond([
      [isEmpty, always([])],
      [isInternationalCreditCard, buildInternationalCreditCardTerms],
      [T, buildTermsValues],
    ]),
    append(__, acc)
  )

  return buildTerm(value)
}

const parseFilters = pipe(
  toPairs,
  reduce(buildFilterTerm, []),
  flatten
)

const parseSearch = keys => (search) => {
  if (!search) {
    return []
  }

  const terms = reduce((acc, key) => {
    if (key === 'id') {
      const value = Number(search)

      if (!Number.isNaN(value)) {
        return [
          ...acc,
          {
            term: {
              id: value,
            },
          },
        ]
      }

      return acc
    }

    return [
      ...acc,
      {
        term: {
          [key]: search,
        },
      },
    ]
  }, [], keys)

  return assoc('or', terms, {})
}

const toISOString = obj => obj.toISOString()

const buildRangeFormatter = (period, comparator) => ifElse(
  allPass([
    has(period),
    propSatisfies(complement(isNil), period),
  ]),
  pipe(
    prop(period),
    toISOString,
    assoc(comparator, __, {})
  ),
  always({})
)

const formatDates = juxt([
  buildRangeFormatter('start', 'gte'),
  buildRangeFormatter('end', 'lte'),
])

const buildRange = pipe(formatDates, mergeAll)

const parseDates = ifElse(
  allPass([
    propSatisfies(isNil, 'start'),
    propSatisfies(isNil, 'end'),
  ]),
  always([]),
  applySpec({
    range: {
      date_created: buildRange,
    },
  })
)

const buildCondition = (
  propName,
  parseFunction,
  additionalCondition = T
) => ifElse(
  allPass([
    has(propName),
    pipe(prop(propName), additionalCondition),
  ]),
  pipe(prop(propName), parseFunction),
  always([])
)

const buildFilters = buildCondition('filters', parseFilters)

const buildSearch = buildCondition(
  'search',
  parseSearch(termsKeys),
  allPass([is(String), complement(isEmpty)])
)

const buildDates = buildCondition('dates', parseDates, is(Object))

const buildAndCondition = pipe(
  juxt([buildFilters, buildSearch, buildDates]),
  flatten
)

const buildSortField = ({ field, order }) => {
  const formatField = pipe(
    join('.'),
    when(
      has(__, mapDashboardPropsToES),
      prop(__, mapDashboardPropsToES)
    )
  )

  const ascNames = anyPass([equals('asc'), equals('ascending')])
  const descNames = anyPass([equals('desc'), equals('descending')])

  const formatOrder = cond([
    [ascNames, always('asc')],
    [descNames, always('desc')],
    [T, always('asc')],
  ])

  return {
    fieldName: formatField(field),
    order: formatOrder(order),
  }
}

const buildSortItems = ({ fieldName, order }) => [{
  [fieldName]: {
    order,
  },
}]

const areSortPropsEmpty = anyPass([
  propSatisfies(isNil, 'order'),
  propSatisfies(isNil, 'field'),
])

const buildSort = pipe(
  prop('sort'),
  ifElse(
    anyPass([
      isNil,
      isEmpty,
      areSortPropsEmpty,
    ]),
    always({}),
    pipe(buildSortField, buildSortItems)
  )
)

const defaultFrom = defaultTo(1)
const defaultSize = defaultTo(15)

const defaultFiltered = {
  query: {
    match_all: {},
  },
}

const buildFiltered = pipe(
  buildAndCondition,
  ifElse(
    isEmpty,
    always(defaultFiltered),
    assocPath(['filter', 'and'], __, defaultFiltered)
  )
)

const buildQuery = applySpec({
  from: pipe(
    props(['offset', 'count']),
    juxt([
      pipe(head, when(isNil, defaultFrom), dec),
      pipe(last, when(isNil, defaultSize)),
    ]),
    apply(multiply)
  ),
  size: pipe(prop('count'), defaultSize),
  sort: buildSort,
  query: {
    filtered: buildFiltered,
  },
  aggregations: always(aggregations),
})

export default buildQuery
