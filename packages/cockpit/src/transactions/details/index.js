import {
  all,
  props,
} from 'bluebird'

import {
  __,
  assoc,
  map,
  merge,
  pipe,
  path,
  always,
  ifElse,
  isNil,
  pathSatisfies,
  uncurryN,
} from 'ramda'

import result from './result'

const fetchRecipient = client => splitRule =>
  client.recipients.find({ id: splitRule.recipient_id })
    .then(recipient => merge(splitRule, { recipient }))

const fetchRecipients = uncurryN(2, client =>
  ifElse(
    pathSatisfies(isNil, ['transaction', 'split_rules']),
    always(null),
    pipe(
      path(['transaction', 'split_rules']),
      map(fetchRecipient(client)),
      all
    )
  ))

/* eslint-disable-next-line camelcase */
const groupInstallments = (client, { split_rules, payables }) =>
  map(rule => merge(
    rule,
    { installments: payables.filter(p => p.split_rule_id === rule.id) }
  ), split_rules)

const details = client => transactionId =>
  props({
    transaction: client.transactions.find({ id: transactionId }),
    operations: client.gatewayOperations.find({ transactionId }),
    payables: client.payables.find({ transactionId }),
    chargebacks: client.chargebacks.find({ transaction_id: transactionId }),
  })
    .then(data => fetchRecipients(client, data).then(assoc('split_rules', __, data)))
    .then(data => assoc('split_rules', groupInstallments(client, data), data))
    .then(result)


export default details
