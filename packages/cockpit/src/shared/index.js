import {
  ifElse,
  complement,
  equals,
  T,
  F,
  pipe,
  prop,
  isNil,
  path,
  pathSatisfies,
  cond,
  always,
  applySpec,
  has,
  is,
  allPass,
} from 'ramda'

const isInternational = ifElse(
  complement(equals('BRAZIL')),
  T,
  F
)

const isAntifraudScoreNil = pipe(
  prop('antifraud_score'),
  isNil
)

const isRefuseReasonNil = pipe(
  prop('refuse_reason'),
  isNil
)

const getCardProp = subProp => ifElse(
  pipe(
    prop('card'),
    allPass([is(Object), has(subProp)])
  ),
  path(['card', subProp]),
  prop(`card_${subProp}`)
)

const isRefuseReasonAntifraud = pipe(
  prop('refuse_reason'),
  equals('antifraud')
)

const antifraudRecommendation = cond([
  [isAntifraudScoreNil, always(null)],
  [isRefuseReasonNil, always(null)],
  [isRefuseReasonAntifraud, always('refused')],
  [T, always('approved')],
])

const getAntifraudProp = ifElse(
  pipe(prop('antifraud_score'), isNil),
  always(null),
  applySpec({
    recommendation: antifraudRecommendation,
    score: prop('antifraud_score'),
  })
)

const getCustomerSubProp = subProp => ifElse(
  pathSatisfies(complement(isNil), ['customer', subProp]),
  path(['customer', subProp]),
  always(null)
)

const getCustomerProp = ifElse(
  pipe(prop('customer'), isNil),
  always(null),
  applySpec({
    name: getCustomerSubProp('name'),
    document_number: getCustomerSubProp('document_number'),
    document_type: getCustomerSubProp('document_type'),
    email: getCustomerSubProp('email'),
    birth_date: getCustomerSubProp('birthday'),
    country: getCustomerSubProp('country'),
    phones: getCustomerSubProp('phone_numbers'),
  })
)

const transactionObj = {
  id: prop('id'),
  status: prop('status'),
  refuse_reason: prop('refuse_reason'),
  created_at: prop('date_created'),
  updated_at: prop('date_updated'),
  boleto: {
    url: prop('boleto_url'),
  },
  payment: {
    method: prop('payment_method'),
    paid_amount: prop('paid_amount'),
    net_amount: prop('amount'),
    cost_amount: prop('cost'),
    installments: prop('installments'),
  },
  antifraud: getAntifraudProp,
  customer: getCustomerProp,
  card: {
    holder_name: getCardProp('holder_name'),
    brand_name: getCardProp('brand'),
    international: pipe(getCardProp('country'), isInternational),
  },
}

export {
  getAntifraudProp,
  getCustomerProp,
  getCardProp,
  isInternational,
  transactionObj,
}
