import React from 'react'
import {
  cond,
  equals,
} from 'ramda'

import IconVisa from 'emblematic-icons/svg/VisaCard16.svg'
import IconMaster from 'emblematic-icons/svg/MasterCard16.svg'
import IconDiners from 'emblematic-icons/svg/DinersCard16.svg'
import IconAmex from 'emblematic-icons/svg/AmexCard16.svg'
import IconJcb from 'emblematic-icons/svg/JCBCard16.svg'

const renderBrandIcon = cond([
  [equals('amex'), () => <IconAmex width="30px" height="30px" />],
  [equals('diners'), () => <IconDiners width="30px" height="30px" />],
  [equals('jcb'), () => <IconJcb width="30px" height="30px" />],
  [equals('mastercard'), () => <IconMaster width="30px" height="30px" />],
  [equals('visa'), () => <IconVisa width="30px" height="30px" />],
])

export default renderBrandIcon

