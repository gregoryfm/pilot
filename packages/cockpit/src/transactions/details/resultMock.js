module.exports = {
  transaction: {
    id: 2840943,
    created_at: new Date(),
    status: new Date(),
    installments: 1,
    card: {
      holder_name: 'Jose',
      brand_name: 'visa',
      international: true,
    },
    boleto: {
      id: 'lskdjfdsf',
      url: 'sdkfjljdsfd',
    },
    payment: {
      method: 'credit_card',
      paid_amount: 1000,
      net_amount: 990,
      costs: 10,
      installments: 1,
    },
    customer: {
      name: '',
      document_number: '123456789',
      email: 'a@b.c',
      birth_date: new Date(),
      gender: 'male',
      phone_number: 'ksdljslkfdjf',
      document_type: '',
      country: '',
      phones: ['280928344'],
    },
    receivables: {
      amount: 1023,
      payment_date: new Date(), // payables
    },
    discount: {
      mdr_amount: 10,
      refund_amount: 100,
      other_taxes: 100,
    },
    recipients: [
      {
        name: 'lkdsjflkf', // SplitRules -> Recipients -> BankAccounts
        liabilities: ['mdr', 'chargeback'], // SplitRules { mdr: charge_processing_fee, chargeback: liable } 
        amount: 100, // SplitRule
        net_amount: 10, // SplitRule -> Payable
        installments: [
          {
            number: 1,
            status: 'waiting_payment',
            payment_date: new Date(),
            original_payment_date: new Date(),
            net_amount: 10,
            costs: {
              mdr: 10,
              anticipation: 10,
              chargeback: 10,
              refund: 10,
            },
          },
        ],
      },
    ],
    operations: [ // transactions/transaction_id/operations
      {
        type: 'capture',
        date_created: '2017-06-18T02:38:18.664Z',
      },
      {
        type: 'chargeback',
        date_created: '2017-06-18T02:38:18.664Z',
        // -> vem de recipients 
      },
    ],
  },
}
