'use client'

import { ButtonVariantMap } from '../../MaskedButton.types'
import { DefaultButtonContainer, DefaultButtonWrapper } from './DefaultButton.styles'

type props = { $variant: 'default' } & ButtonVariantMap['default']

export default function DefaultButton(props: props) {
  return (
    <DefaultButtonWrapper $position={props.$position}>
      <DefaultButtonContainer $isActive={props.$isActive} $isError={props.state === 'error'} $isDisabled={props.state === 'disabled'} {...props} />
    </DefaultButtonWrapper>
  )
}
