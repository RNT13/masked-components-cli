'use client'

import { MouseEvent, useState } from 'react'
import { ButtonVariantMap } from '../../MaskedButton.types'
import { SwitchContainer, SwitchLabel, SwitchWrapper } from './SwitchButton.styles'
import { resolveButtonTokens } from '../../buttonTokens'

type Props = { $variant: 'switch' } & ButtonVariantMap['switch']

export default function SwitchButton({
  $position = 'center',
  checked,
  defaultChecked = false,
  onCheckedChange,
  onClick,
  state = 'default',
  ariaLabel,
  switchLabel,
  className,
  colorTheme,
  tokens
}: Props) {
  const isControlled = checked !== undefined
  const [internal, setInternal] = useState(defaultChecked)
  const isChecked = isControlled ? checked : internal
  const isDisabled = state === 'disabled' || state === 'loading'

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (isDisabled) return
    const next = !isChecked
    if (!isControlled) setInternal(next)
    onCheckedChange?.(next)
    onClick?.(event)
  }

  return (
    <SwitchWrapper $position={$position}>
      <SwitchContainer
        type="button"
        role="switch"
        aria-checked={isChecked}
        aria-label={ariaLabel}
        disabled={isDisabled}
        onClick={handleClick}
        className={className}
        $isChecked={isChecked}
        data-testid="switch-button"
        style={resolveButtonTokens({ colorTheme, tokens })}
      />
      {switchLabel && <SwitchLabel>{switchLabel}</SwitchLabel>}
    </SwitchWrapper>
  )
}
