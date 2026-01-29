'use client'

import { ButtonVariantMap } from '../../MaskedButton.types'
import { OutlineButtonContainer } from './OutlineButton.styles'

type Props = { variant: 'outline' } & ButtonVariantMap['outline']

export default function OutlineButton(props: Props) {
  return <OutlineButtonContainer $isActive={props.$isActive} $isError={props.state === 'error'} {...props} />
}
