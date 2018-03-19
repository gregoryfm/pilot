import React from 'react'

import IconReprocess from 'emblematic-icons/svg/Reprocess24.svg'
import IconReverse from 'emblematic-icons/svg/Reverse24.svg'
import IconDownload from 'emblematic-icons/svg/Download24.svg'

import { action } from '@storybook/addon-actions'

import Section from '../Section'
import TransactionHead from '../../../src/components/TransactionHead'

const TransactionHeadExample = () => (
  <Section>
    <TransactionHead
      id="1234567"
      status="paid"
      installments="Pagamento à vista"
      actions={[
        { title: 'Reprocessar', icon: <IconReprocess width={12} height={12} />, onClick: action('reprocessar'), },
        { title: 'Estornar', icon: <IconReverse width={12} height={12} />, onClick: action('extornar'), },
        { title: 'Exportar', icon: <IconDownload width={12} height={12} />, onClick: action('exportar'), },
      ]}
    />
  </Section>
)

export default TransactionHeadExample
