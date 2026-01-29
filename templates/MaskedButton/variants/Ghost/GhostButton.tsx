'use client'

import { ButtonVariantMap } from '../../MaskedButton.types'
import { GhostButtonContainer } from './GhostButton.styles'

type props = { variant: 'ghost' } & ButtonVariantMap['ghost']

export default function GhostButton(props: props) {
  return <GhostButtonContainer $isActive={props.$isActive} $isError={props.state === 'error'} {...props} />
}
