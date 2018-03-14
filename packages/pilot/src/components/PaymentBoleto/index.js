import React from 'react'
import PropTypes from 'prop-types'
import {
  Card,
  CardTitle,
  CardContent,

  Button,
} from 'former-kit'
import IconCopy from 'emblematic-icons/svg/Copy24.svg'
import IconBarCode from './IconBarCode'

import style from './style.css'

const copyToClipBoard = (text) => {
  const textarea = document.createElement('textarea')
  textarea.textContent = text

  textarea.style.opacity = 0
  textarea.style.position = 'absolute'

  document.body.appendChild(textarea)
  textarea.select()

  document.execCommand('copy')
  document.body.removeChild(textarea)
}

const PaymentBoleto = ({
  dueDate,
  barcode,
  onClick,
  t,
}) => (
  <Card className={style.card}>
    <CardContent className={style.cardContent}>
      <CardTitle
        title={t('boleto.title')}
        subtitle={
          <Button
            fill="clean"
            size="tiny"
            onClick={onClick}
          >
            { t('boleto.see') }
          </Button>
        }
      />

      <div className={style.cardBarCode}>
        <IconBarCode />
        <strong>{ barcode }</strong>
      </div>

      <div className={style.cardDueDate}>
        <p>{ t('boleto.due') }: {dueDate}</p>
        <Button
          fill="clean"
          size="tiny"
          icon={<IconCopy width="12px" height="12px" />}
          onClick={() => copyToClipBoard(barcode)}
        >
          { t('boleto.copy') }
        </Button>
      </div>
    </CardContent>
  </Card>
)

PaymentBoleto.propTypes = {
  t: PropTypes.func,
  onClick: PropTypes.func.isRequired,
  barcode: PropTypes.string.isRequired,
  dueDate: PropTypes.string.isRequired,
}

PaymentBoleto.defaultProps = {
  t: t => t,
}

export default PaymentBoleto

