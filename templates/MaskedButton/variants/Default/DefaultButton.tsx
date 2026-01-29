'use client'

import { ButtonVariantMap } from '../../MaskedButton.types'
import { DefaultButtonContainer } from './DefaultButton.styles'

type props = { variant: 'default' } & ButtonVariantMap['default']

export default function DefaultButton(props: props) {
  return <DefaultButtonContainer $isActive={props.$isActive} $isError={props.state === 'error'} {...props} />
}
