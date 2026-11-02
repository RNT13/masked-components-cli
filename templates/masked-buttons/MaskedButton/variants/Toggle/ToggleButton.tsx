'use client'

import { MouseEvent, useState } from 'react'
import { resolveButtonTokens } from '../../buttonTokens'
import { ButtonVariantMap } from '../../MaskedButton.types'
import { ToggleButtonContainer, ToggleLabel, ToggleWrapper } from './ToggleButton.styles'

type Props = { $variant: 'toggle' } & ButtonVariantMap['toggle']

export default function ToggleButton({
  $position = 'center',
  $isActive = false,
  $toggleLabel,
  onToggle,
  onClick,
  state = 'default',
  ariaLabel,
  className,
  colorTheme,
  tokens
}: Props) {
  // sincroniza quando controlado por fora (ex.: MaskedButtonGroup)
  const [active, setActive] = useState($isActive)
  const [prevActive, setPrevActive] = useState($isActive)
  if (prevActive !== $isActive) {
    setPrevActive($isActive)
    setActive($isActive)
  }
  const isDisabled = state === 'disabled' || state === 'loading'

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (isDisabled) return
    const next = !active
    setActive(next)
    onToggle?.(next)
    onClick?.(event)
  }

  return (
    <ToggleWrapper $position={$position}>
      <ToggleButtonContainer
        type="button"
        role="switch"
        aria-checked={active}
        aria-label={ariaLabel ?? $toggleLabel}
        disabled={isDisabled}
        onClick={handleClick}
        className={className}
        $isActive={active}
        data-testid="toggle-button"
        style={resolveButtonTokens({ colorTheme, tokens })}
      />
      {$toggleLabel && <ToggleLabel>{$toggleLabel}</ToggleLabel>}
    </ToggleWrapper>
  )
}
