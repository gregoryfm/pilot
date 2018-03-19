import React from 'react'
import PropTypes from 'prop-types'

import {
  Card,
  CardContent,

  Button,
  Legend,
} from 'former-kit'

import style from './style.css'
import statusLegend from '../../models/statusLegends'

const TransactionHead = ({
  id,
  status,
  installments,
  actions,
  t,
}) => (
  <Card>
    <CardContent className={style.transactionCard}>
      <div className={style.transactionInformation}>
        <div>
          <span className={style.transactionLabel}>{t('transaction.title')}</span>
          <h2 className={style.transactionId}>#{id}</h2>
        </div>

        <div className={style.transactionStatus}>
          <span className={style.transactionLabel}>{t('transaction.status')}</span>
          <Legend
            color={statusLegend[status].color}
            acronym={statusLegend[status].text}
          >
            { installments }
          </Legend>
        </div>
      </div>

      <div className={style.transactionActions}>
        {
          actions.map(action => (
            <Button
              key={action.title}
              onClick={action.onClick}
              fill="outline"
              size="large"
              icon={action.icon}
            >
              {action.title}
            </Button>
          ))
        }
      </div>
    </CardContent>
  </Card>
)

TransactionHead.propTypes = {
  id: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  installments: PropTypes.string.isRequired,
  actions: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    icon: PropTypes.element.isRequired,
    onClick: PropTypes.func.isRequired,
  })).isRequired,
  t: PropTypes.func,
}

TransactionHead.defaultProps = {
  t: t => t,
}

export default TransactionHead
