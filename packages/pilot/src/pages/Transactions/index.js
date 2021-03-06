import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import cockpit from 'cockpit'
import { withRouter } from 'react-router-dom'

import { connect } from 'react-redux'

import {
  compose,
  findIndex,
  nth,
  path,
  pipe,
  prop,
  propEq,
  pick,
} from 'ramda'

import {
  requestSearch,
  receiveSearch,
} from './actions'

import TransactionsList from '../../containers/TransactionsList'
import renderCardBrand from '../../containers/TransactionsList/renderCardBrand'
import renderStatusLegend from '../../containers/TransactionsList/renderStatusLegend'

import filterOptions from '../../models/transactionFilterOptions'
import dateSelectorPresets from '../../models/dateSelectorPresets'
import formatCurrency from '../../formatters/currency'
import formatPaymentMethod from '../../formatters/paymentMethod'
import formatRefuseReason from '../../formatters/refuseReason'
import formatCpfCnpj from '../../formatters/cpfCnpj'
import formatDate from '../../formatters/longDate'

const convertPaymentValue = property => pipe(
  path(['payment', property]),
  formatCurrency
)

const mapStateToProps = ({
  account: { client },
  transactions: { loading, query },
}) => ({ client, loading, query })

const mapDispatchToProps = dispatch => ({
  onRequestSearch: (query) => {
    dispatch(requestSearch(query))
  },

  onReceiveSearch: ({ query }) => {
    dispatch(receiveSearch({ query }))
  },
})

const enhanced = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withRouter
)

const columnsDefault = [
  {
    title: 'Status',
    renderer: renderStatusLegend,
    accessor: ['status'],
    orderable: true,
  },
  { title: 'Transaction Id', accessor: ['id'], orderable: true },
  {
    title: 'Date created',
    accessor: ['created_at'],
    orderable: true,
    renderer: pipe(prop('created_at'), formatDate),
  },
  {
    title: 'CPF / CNPJ',
    accessor: ['customer', 'document_number'],
    renderer: pipe(
      path(['customer', 'document_number']),
      formatCpfCnpj
    ),
  },
  {
    title: 'Payment method',
    accessor: ['payment', 'method'],
    orderable: true,
    renderer: pipe(
      prop('payment'),
      pick(['method', 'international']),
      formatPaymentMethod
    ),
  },
  {
    title: 'Paid amount',
    accessor: ['payment', 'paid_amount'],
    orderable: true,
    renderer: convertPaymentValue('paid_amount'),
  },
  {
    title: 'Cost',
    accessor: ['payment', 'cost_amount'],
    orderable: true,
    renderer: convertPaymentValue('cost_amount'),
  },
  {
    title: 'Net amount',
    accessor: ['payment', 'net_amount'],
    renderer: convertPaymentValue('net_amount'),
  },
  { title: 'E-mail', accessor: ['customer', 'email'], orderable: true },
  {
    title: 'Refuse Reason',
    accessor: ['refuse_reason'],
    orderable: true,
    renderer: pipe(
      prop('refuse_reason'),
      formatRefuseReason
    ),
  },
  { title: 'Antifraud', accessor: ['antifraud', 'recommendation'], orderable: true },
  { title: 'Installments', accessor: ['payment', 'installments'], orderable: true },
  { title: 'Name', accessor: ['customer', 'name'], orderable: true },
  {
    title: 'Card brand',
    accessor: ['card', 'brand_name'],
    orderable: true,
    renderer: renderCardBrand,
  },
  { title: 'Boleto Link', accessor: ['boleto', 'url'], orderable: true },
]

const getOrderColumn = field => findIndex(
  propEq('accessor', field),
  columnsDefault
)

const getColumnAccessor = index => pipe(
  nth(index),
  prop('accessor')
)

class Transactions extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      client: cockpit(props.client),
      columns: columnsDefault,
      collapsed: true,
      result: {
        total: {},
        list: {
          rows: [],
        },
        chart: {
          dataset: [],
        },
      },
    }

    this.handleChartsCollapse = this.handleChartsCollapse.bind(this)
    this.handleFilterChange = this.handleFilterChange.bind(this)
    this.handleOrderChange = this.handleOrderChange.bind(this)
    this.handlePageChange = this.handlePageChange.bind(this)
    this.handlePageCountChange = this.handlePageCountChange.bind(this)

    this.requestData = this.requestData.bind(this)
  }

  componentDidMount () {
    const { query } = this.props
    this.requestData(query)
  }

  requestData (query) {
    this.props.onRequestSearch({ query })

    return this.state.client
      .transactions
      .search(query)
      .then((res) => {
        this.setState(res)
        this.props.onReceiveSearch(res)
      })
  }

  handlePageCountChange (count) {
    const query = {
      ...this.props.query,
      offset: 1,
      count: parseInt(count, 10),
    }

    this.requestData(query)
  }

  handleOrderChange (index, order) {
    const getAccessor = getColumnAccessor(index)

    const query = {
      ...this.props.query,
      sort: {
        field: getAccessor(columnsDefault),
        order,
      },
      offset: 1,
    }

    this.requestData(query)
  }

  handleFilterChange (filters) {
    const {
      search,
      dates,
      values,
    } = filters

    const query = {
      ...this.props.query,
      search,
      dates,
      filters: values,
      offset: 1,
    }

    this.requestData(query)
  }

  handlePageChange (page) {
    const query = {
      ...this.props.query,
      offset: page,
    }

    this.requestData(query)
  }

  handleChartsCollapse () {
    const { collapsed } = this.state

    this.setState({
      collapsed: !collapsed,
    })
  }

  render () {
    const {
      collapsed,
      columns,
      result: {
        total,
        list,
        chart,
      },
    } = this.state

    const {
      loading,
      query: {
        search,
        dates,
        filters,
        sort,
        count,
        offset,
      },
    } = this.props

    const orderColumn = getOrderColumn(sort.field)

    const pagination = {
      offset,
      total: Math.ceil(
        total.count / count
      ),
    }

    return (
      <TransactionsList
        count={total.count}
        amount={total.payment ? total.payment.paid_amount : 0}
        search={search}
        values={filters}
        dates={dates}
        filterOptions={filterOptions}
        dateSelectorPresets={dateSelectorPresets}
        collapsed={collapsed}
        order={sort ? sort.order : ''}
        rows={list.rows}
        columns={columns}
        orderColumn={orderColumn}
        pagination={pagination}
        handlePageChange={this.handlePageChange}
        handleOrderChange={this.handleOrderChange}
        handleFilterChange={this.handleFilterChange}
        handleChartsCollapse={this.handleChartsCollapse}
        handlePageCountChange={this.handlePageCountChange}
        data={chart.dataset}
        loading={loading}
        selectedPage={count}
      />
    )
  }
}

Transactions.propTypes = {
  client: PropTypes.shape({}).isRequired,
  onReceiveSearch: PropTypes.func.isRequired,
  onRequestSearch: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  query: PropTypes.shape({
    search: PropTypes.string,
    dates: PropTypes.shape({
      start: PropTypes.instanceOf(moment),
      end: PropTypes.instanceOf(moment),
    }),
    filters: PropTypes.shape({}),
    offset: PropTypes.number.isRequired,
    count: PropTypes.number.isRequired,
    sort: PropTypes.shape({
      field: PropTypes.arrayOf(PropTypes.string),
      order: PropTypes.string,
    }),
  }).isRequired,
}

export default enhanced(Transactions)
