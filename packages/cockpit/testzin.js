const pagarme = require('pagarme')
const cockpit = require('.')

process.on('unhandledRejection', err => console.log(err))

pagarme.client.connect({ api_key: 'ak_test_NQ' })
  .then(cockpit)
  .then(cli => cli.transactions.details(3082517))
  .then(result => console.log(JSON.stringify(result, undefined, 2)))
  .catch(err => console.log(JSON.stringify(err.response, undefined, 2)))

/* Vou apagando as propriedade q sao colocadas. Alguns dados nao da pra pegar
e eu comentei eles na issue #388
 {
  transaction: {
    receivables: {
      amount: 1023,
      payment_date: new Date(), // payables
    },
    discount: {
      mdr_amount: 10,
      refund_amount: 100,
      other_taxes: 100,
    },
}
*/
