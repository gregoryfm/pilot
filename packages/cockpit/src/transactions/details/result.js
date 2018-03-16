import {
  apply,
  always,
  applySpec,
  dissoc,
  ifElse,
  isNil,
  juxt,
  map,
  mergeAll,
  path,
  pipe,
  prop,
  propEq,
  props,
  reject,
  subtract,
  sum,
  pluck,
} from 'ramda'

import { transactionObj } from '../shared'

const buildOperations = applySpec({
  operations: map(applySpec({
    id: prop('id'),
    date_created: prop('date_created'),
    type: prop('type'),
    status: prop('status'),
  })),
})

const sumInstallmentsAmount = pipe(
  prop('installments'),
  pluck('amount'),
  sum
)

const sumPayableFees = pipe(props(['fee', 'anticipation_fee']), sum)

const sumInstallmentsCostAmount = pipe(
  prop('installments'),
  map(sumPayableFees),
  sum
)

const buildRecipients = applySpec({
  recipients: map(applySpec({
    name: path(['recipient', 'bank_account', 'legal_name']),
    amount: sumInstallmentsAmount,
    net_amount: pipe(
      juxt([
        sumInstallmentsAmount,
        sumInstallmentsCostAmount,
      ]),
      apply(subtract)
    ),
    liabilities: pipe(
      juxt([
        ifElse(
          propEq('charge_processing_fee', true),
          always('mdr'),
          always(null)
        ),
        ifElse(
          propEq('liable', true),
          always('chargeback'),
          always(null)
        ),
      ]),
      reject(isNil)
    ),
    installments: pipe(
      prop('installments'),
      map(applySpec({
        number: prop('installment'),
        payment_date: prop('payment_date'),
        original_payment_date: prop('original_payment_date'),
        amount: prop('amount'),
        net_amount: sumPayableFees,
        costs: {
          mdr: prop('fee'),
          anticipation: prop('anticipation_fee'),
        },
      }))
    ),
  })),
})

const mapTransactionToResult = applySpec({
  transaction: pipe(
    juxt([
      pipe(prop('transaction'), applySpec(transactionObj)),
      pipe(prop('operations'), buildOperations),
      pipe(prop('split_rules'), buildRecipients),
    ]),
    mergeAll
  ),
  rest: pipe(
    dissoc('transaction'),
    dissoc('operations'),
    dissoc('split_rules')
  ),
})

export default mapTransactionToResult
