'use client'

import { ButtonVariantMap } from '../../MaskedButton.types'
import { GradientButtonContainer } from './GradientButton.styles'

type props = { variant: 'gradient' } & ButtonVariantMap['gradient']

export default function GradientButton(props: props) {
  return <GradientButtonContainer $isActive={props.$isActive} $isError={props.state === 'error'} {...props} />
}
