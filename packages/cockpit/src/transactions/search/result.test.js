import buildResult from './result'
import requestResultMock from '../transactionsMock.json'

const query = {
  search: '12345',
  dates: {
    start: new Date(),
    end: new Date(),
  },
  filters: {
    payment_method: ['credit_card', 'debit_card'],
    status: ['paid'],
  },
  offset: 2,
  count: 20,
  aggregations: {
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
  },
}

const buildResultToDashboard = buildResult(query)

const mock = {
  query,
  result: {
    total: {
      count: 15,
      payment: {
        net_amount: 464926,
        paid_amount: 464926,
      },
    },
    list: {
      count: 15,
      offset: query.offset,
      rows: [
        {
          id: 1565115,
          status: 'refunded',
          refuse_reason: null,
          created_at: '2017-05-24T18:52:08.826Z',
          updated_at: '2017-05-25T19:13:22.859Z',
          boleto: {
            url: null,
          },
          payment: {
            method: 'credit_card',
            paid_amount: 2000,
            net_amount: 2000,
            cost_amount: 0,
            installments: 1,
          },
          antifraud: null,
          customer: {
            name: 'Test',
            document_number: '02105421016',
            email: 'test@test.com',
            birth_date: null,
            country: null,
            document_type: "cpf",
            phones: null,
          },
          card: {
            holder_name: 'Test',
            brand_name: 'visa',
            international: true,
          },
        },
        {
          id: 1301999,
          status: 'refused',
          refuse_reason: 'capture_timeout',
          created_at: '2017-02-15T16:41:45.624Z',
          updated_at: '2017-02-15T21:45:05.198Z',
          boleto: {
            url: null,
          },
          payment: {
            method: 'credit_card',
            paid_amount: 0,
            net_amount: 5490,
            cost_amount: 0,
            installments: 1,
          },
          antifraud: null,
          customer: {
            name: 'Test',
            document_number: '02105421016',
            email: 'test@test.com',
            birth_date: null,
            country: null,
            document_type: "cpf",
            phones: null,
          },
          card: {
            holder_name: 'Test',
            brand_name: 'visa',
            international: true,
          },
        },
        {
          id: 1301925,
          status: 'refused',
          refuse_reason: 'capture_timeout',
          created_at: '2017-02-15T16:03:46.931Z',
          updated_at: '2017-02-15T21:05:05.126Z',
          boleto: {
            url: null,
          },
          payment: {
            method: 'credit_card',
            paid_amount: 0,
            net_amount: 5490,
            cost_amount: 0,
            installments: 1,
          },
          antifraud: null,
          customer: {
            name: 'Test',
            document_number: '02105421016',
            email: 'test@test.com',
            birth_date: null,
            country: null,
            document_type: "cpf",
            phones: null,
          },
          card: {
            holder_name: 'Test',
            brand_name: 'visa',
            international: true,
          },
        },
        {
          id: 1280667,
          status: 'refused',
          refuse_reason: 'capture_timeout',
          created_at: '2017-02-08T12:57:36.103Z',
          updated_at: '2017-02-08T18:00:04.905Z',
          boleto: {
            url: null,
          },
          payment: {
            method: 'credit_card',
            paid_amount: 0,
            net_amount: 100000,
            cost_amount: 0,
            installments: 1,
          },
          antifraud: null,
          customer: null,
          card: {
            holder_name: 'Test',
            brand_name: 'visa',
            international: true,
          },
        },
        {
          id: 1280910,
          status: 'refused',
          refuse_reason: 'acquirer',
          created_at: '2017-02-08T13:07:47.332Z',
          updated_at: '2017-02-08T13:07:47.540Z',
          boleto: {
            url: null,
          },
          payment: {
            method: 'credit_card',
            paid_amount: 0,
            net_amount: 100000,
            cost_amount: 0,
            installments: 1,
          },
          antifraud: null,
          customer: null,
          card: {
            holder_name: 'Test',
            brand_name: 'visa',
            international: true,
          },
        },
        {
          id: 1732031,
          status: 'paid',
          refuse_reason: null,
          created_at: '2017-07-19T19:42:53.785Z',
          updated_at: '2017-07-19T19:42:54.215Z',
          boleto: {
            url: null,
          },
          payment: {
            method: 'credit_card',
            paid_amount: 1000,
            net_amount: 1000,
            cost_amount: 50,
            installments: 1,
          },
          antifraud: null,
          customer: {
            name: 'Aardvark da Silva',
            document_number: '18152564000105',
            email: 'aardvark.silva@gmail.com',
            birth_date: null,
            country: null,
            document_type: "cnpj",
            phones: null,
          },
          card: {
            holder_name: 'Aardvark da Silva',
            brand_name: 'visa',
            international: true,
          },
        },
        {
          id: 1761390,
          status: 'paid',
          refuse_reason: null,
          created_at: '2017-07-26T15:16:26.099Z',
          updated_at: '2017-07-26T15:16:26.650Z',
          boleto: {
            url: null,
          },
          payment: {
            method: 'credit_card',
            paid_amount: 1000,
            net_amount: 1000,
            cost_amount: 50,
            installments: 1,
          },
          antifraud: null,
          customer: {
            name: 'Test',
            document_number: '27814318505',
            email: 'test@test.com',
            birth_date: null,
            country: null,
            document_type: "cpf",
            phones: null,
          },
          card: {
            holder_name: 'Test',
            brand_name: 'visa',
            international: true,
          },
        },
        {
          id: 1761674,
          status: 'paid',
          refuse_reason: null,
          created_at: '2017-07-26T15:56:54.165Z',
          updated_at: '2017-07-26T15:56:54.544Z',
          boleto: {
            url: null,
          },
          payment: {
            method: 'credit_card',
            paid_amount: 48521,
            net_amount: 48521,
            cost_amount: 50,
            installments: 1,
          },
          antifraud: null,
          customer: {
            name: 'Test',
            document_number: '95557289682',
            email: 'test@test.com',
            birth_date: null,
            country: null,
            document_type: "cpf",
            phones: null,
          },
          card: {
            holder_name: 'Test',
            brand_name: 'visa',
            international: true,
          },
        },
        {
          id: 1815318,
          status: 'paid',
          refuse_reason: null,
          created_at: '2017-08-10T19:12:23.518Z',
          updated_at: '2017-08-10T19:12:23.999Z',
          boleto: {
            url: null,
          },
          payment: {
            method: 'credit_card',
            paid_amount: 20000,
            net_amount: 20000,
            cost_amount: 50,
            installments: 1,
          },
          antifraud: null,
          customer: {
            name: 'Test',
            document_number: '08724362921',
            email: 'test@test.com',
            birth_date: null,
            country: null,
            document_type: "cpf",
            phones: null,
          },
          card: {
            holder_name: 'Test',
            brand_name: 'visa',
            international: true,
          },
        },
        {
          id: 2956651,
          status: 'refunded',
          refuse_reason: null,
          created_at: '2018-02-22T20:54:06.644Z',
          updated_at: '2018-02-22T20:54:52.109Z',
          boleto: {
            url: null,
          },
          payment: {
            method: 'credit_card',
            paid_amount: 56435,
            net_amount: 56435,
            cost_amount: 0,
            installments: 1,
          },
          antifraud: null,
          customer: null,
          card: {
            holder_name: 'Test',
            brand_name: 'visa',
            international: true,
          },
        },
        {
          id: 2956649,
          status: 'paid',
          refuse_reason: null,
          created_at: '2018-02-22T20:53:36.841Z',
          updated_at: '2018-02-22T20:53:37.228Z',
          boleto: {
            url: null,
          },
          payment: {
            method: 'credit_card',
            paid_amount: 5646,
            net_amount: 5646,
            cost_amount: 50,
            installments: 1,
          },
          antifraud: null,
          customer: null,
          card: {
            holder_name: 'Test',
            brand_name: 'visa',
            international: true,
          },
        },
        {
          id: 2956657,
          status: 'refused',
          refuse_reason: 'acquirer',
          created_at: '2018-02-22T20:55:35.192Z',
          updated_at: '2018-02-22T20:55:35.571Z',
          boleto: {
            url: null,
          },
          payment: {
            method: 'credit_card',
            paid_amount: 0,
            net_amount: 34567,
            cost_amount: 0,
            installments: 1,
          },
          antifraud: null,
          customer: null,
          card: {
            holder_name: 'Test',
            brand_name: 'visa',
            international: true,
          },
        },
        {
          id: 2956655,
          status: 'refused',
          refuse_reason: 'acquirer',
          created_at: '2018-02-22T20:55:07.416Z',
          updated_at: '2018-02-22T20:55:07.771Z',
          boleto: {
            url: null,
          },
          payment: {
            method: 'credit_card',
            paid_amount: 0,
            net_amount: 4567,
            cost_amount: 0,
            installments: 1,
          },
          antifraud: null,
          customer: null,
          card: {
            holder_name: 'Test',
            brand_name: 'visa',
            international: true,
          },
        },
        {
          id: 2956647,
          status: 'paid',
          refuse_reason: null,
          created_at: '2018-02-22T20:53:10.779Z',
          updated_at: '2018-02-22T20:53:11.403Z',
          boleto: {
            url: null,
          },
          payment: {
            method: 'credit_card',
            paid_amount: 45643,
            net_amount: 45643,
            cost_amount: 50,
            installments: 1,
          },
          antifraud: null,
          customer: null,
          card: {
            holder_name: 'Test',
            brand_name: 'visa',
            international: true,
          },
        },
        {
          id: 2956654,
          status: 'refunded',
          refuse_reason: null,
          created_at: '2018-02-22T20:54:32.543Z',
          updated_at: '2018-02-22T20:54:49.589Z',
          boleto: {
            url: null,
          },
          payment: {
            method: 'credit_card',
            paid_amount: 34567,
            net_amount: 34567,
            cost_amount: 0,
            installments: 1,
          },
          antifraud: null,
          customer: null,
          card: {
            holder_name: 'Test',
            brand_name: 'visa',
            international: true,
          },
        },
      ],
    },
    chart: {
      dataset: [
        {
          name: '02/08/2017',
          refused: 200000,
        },
        {
          name: '02/15/2017',
          refused: 10980,
        },
        {
          name: '05/24/2017',
          refunded: 2000,
        },
        {
          name: '07/19/2017',
          paid: 1000,
        },
        {
          name: '07/26/2017',
          paid: 49521,
        },
        {
          name: '08/10/2017',
          paid: 20000,
        },
        {
          name: '02/22/2018',
          paid: 51289,
          refunded: 91002,
          refused: 39134,
        },

      ],
    },
  },
}

describe('Transactions to dashboard', () => {
  it('should work when transactions are returned', () => {
    const result = buildResultToDashboard(requestResultMock)

    expect(result).toEqual(mock)
  })

  it('should work when hits is empty', () => {
    const apiMock = {
      took: 2,
      timed_out: false,
      _shards: {
        total: 5,
        successful: 5,
        failed: 0,
      },
      hits: {
        total: 0,
        max_score: null,
        hits: [],
      },
    }

    const result = buildResultToDashboard(apiMock)

    const expectedResult = {
      query,
      result: {
        chart: {
          dataset: [],
        },
        list: {
          offset: query.offset,
          count: 0,
          rows: [],
        },
        total: {
          count: 0,
          payment: {
            net_amount: 0,
            paid_amount: 0,
          },
        },
      },
    }
    expect(result).toEqual(expectedResult)
  })
})
