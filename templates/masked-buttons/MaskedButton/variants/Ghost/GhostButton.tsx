'use client'

import { ButtonVariantMap } from '../../MaskedButton.types'
import { GhostButtonContainer, GhostButtonWrapper } from './GhostButton.styles'

type props = { $variant: 'ghost' } & ButtonVariantMap['ghost']

export default function GhostButton(props: props) {
  return (
    <GhostButtonWrapper $position={props.$position}>
      <GhostButtonContainer 
        {...props} 
        $isActive={props.$isActive} 
        $isError={props.state === 'error'} 
        $isDisabled={props.state === 'disabled'} 
      />
    </GhostButtonWrapper>
  )
}
