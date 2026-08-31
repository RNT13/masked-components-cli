'use client'

import { ButtonVariantMap } from '../../MaskedButton.types'
import { NeonButtonContainer, NeonButtonWrapper } from './NeonButton.styles'

type props = { $variant: 'neon' } & ButtonVariantMap['neon']

export default function NeonButton(props: props) {
  return (
    <NeonButtonWrapper $position={props.$position}>
      <NeonButtonContainer 
        {...props} 
        data-testid="neon-button"
        $isError={props.state === 'error'} 
        $isDisabled={props.state === 'disabled'} 
      />
    </NeonButtonWrapper>
  )
}
