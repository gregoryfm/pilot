import {
  __,
  T,
  always,
  anyPass,
  apply,
  applySpec,
  cond,
  defaultTo,
  equals,
  flatten,
  isEmpty,
  isNil,
  juxt,
  length,
  map,
  mergeAll,
  mergeDeepWith,
  objOf,
  path,
  pipe,
  prop,
  subtract,
  unless,
  when,
} from 'ramda'

import { transactionObj } from '../../shared'

const mapSourceToTableRows = applySpec(transactionObj)

const buildTableRows = map(pipe(prop('_source'), mapSourceToTableRows))

const parseStatusValue = pipe(
  juxt([
    prop('key'),
    path(['amount', 'value']),
  ]),
  apply(objOf)
)

const buildStatusesValues = pipe(
  map(parseStatusValue),
  mergeAll
)

const buildDataSet = ({
  key_as_string: date,
  per_status: perStatus,
}) => ({
  name: date,
  ...buildStatusesValues(perStatus.buckets),
})

const buildChartDataSet = pipe(
  when(anyPass([isNil, isEmpty]), always([])),
  map(buildDataSet),
  flatten
)

const defaultTotalAmount = defaultTo(0)

const getAggregationTotal = amountPath => pipe(
  path(amountPath),
  defaultTotalAmount
)

const getPaidAmount = getAggregationTotal([
  'aggregations',
  'total_amount',
  'value',
])

const getCostAmount = getAggregationTotal([
  'aggregations',
  'total_cost',
  'value',
])

const getNetAmount = pipe(
  juxt([getPaidAmount, getCostAmount]),
  apply(subtract)
)

const ascNames = anyPass([equals('asc'), equals('ascending')])
const descNames = anyPass([equals('desc'), equals('descending')])

const formatOrder = cond([
  [ascNames, always('ascending')],
  [descNames, always('descending')],
  [T, always('ascending')],
])

const buildQuery = unless(
  pipe(prop('sort'), isNil),
  mergeDeepWith(formatOrder, __, { sort: { order: null } })
)

const buildResult = query => applySpec({
  query: always(buildQuery(query)),
  result: {
    total: {
      count: path(['hits', 'total']),
      payment: {
        paid_amount: getPaidAmount,
        net_amount: getNetAmount,
      },
    },
    list: {
      offset: always(query.offset),
      count: pipe(path(['hits', 'hits']), length),
      rows: pipe(path(['hits', 'hits']), buildTableRows),
    },
    chart: {
      dataset: pipe(path([
        'aggregations',
        'total_per_day',
        'buckets',
      ]), buildChartDataSet),
    },
  },
})

export default buildResult
