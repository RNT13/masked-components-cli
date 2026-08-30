'use client'

import { ButtonVariantMap } from '../../MaskedButton.types'
import { ToggleButtonContainer, ToggleWrapper } from './ToggleButton.styles'

type Props = {
  $variant: 'toggle'
} & ButtonVariantMap['toggle']

export default function ToggleButton({ $position = 'center', $isActive = false, $toggleLabel, ...buttonProps }: Props) {
  return (
    <ToggleWrapper $position={$position}>
      <ToggleButtonContainer $isActive={$isActive} {...buttonProps} />

      {$toggleLabel}
    </ToggleWrapper>
  )
}
