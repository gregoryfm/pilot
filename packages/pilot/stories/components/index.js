import React from 'react'
import { storiesOf } from '@storybook/react'

import PaymentCards from './PaymentCards'

storiesOf('Components', module)
  .add('Payment card', () => (
    <PaymentCards />
  ))

