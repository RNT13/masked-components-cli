'use client'

import { ButtonVariantMap } from '../../MaskedButton.types'
import { NeonButtonContainer } from './NeonButton.styles'

type props = { variant: 'neon' } & ButtonVariantMap['neon']

export default function NeonButton(props: props) {
  return <NeonButtonContainer $isActive={props.$isActive} $isError={props.state === 'error'} {...props} />
}
