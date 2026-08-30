'use client'

import { ButtonVariantMap } from '../../MaskedButton.types'
import { GradientButtonContainer, GradientButtonWrapper } from './GradientButton.styles'

type props = { $variant: 'gradient' } & ButtonVariantMap['gradient']

export default function GradientButton(props: props) {
  return (
    <GradientButtonWrapper $position={props.$position}>
      <GradientButtonContainer $isActive={props.$isActive} $isError={props.state === 'error'} $isDisabled={props.state === 'disabled'} {...props} />
    </GradientButtonWrapper>
  )
}
