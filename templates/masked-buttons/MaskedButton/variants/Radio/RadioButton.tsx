'use client'

import { MouseEvent, useState } from 'react'
import { resolveButtonTokens } from '../../buttonTokens'
import { ButtonVariantMap } from '../../MaskedButton.types'
import { RadioDot, RadioLabel, RadioWrapper } from './RadioButton.styles'

type Props = { $variant: 'radio' } & ButtonVariantMap['radio']

export default function RadioButton({
  checked,
  defaultChecked = false,
  onCheckedChange,
  onClick,
  radioLabel,
  deselectable = false,
  name,
  value,
  optionValue,
  state = 'default',
  ariaLabel,
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

    if (isChecked) {
      // radio de grupo não desmarca; radio avulso pode (deselectable)
      if (!deselectable) return
      if (!isControlled) setInternal(false)
      onCheckedChange?.(false)
      onClick?.(event)
      return
    }

    if (!isControlled) setInternal(true)
    onCheckedChange?.(true)
    onClick?.(event)
  }

  return (
    <RadioWrapper>
      <RadioDot
        type="button"
        role="radio"
        aria-checked={isChecked}
        aria-label={ariaLabel ?? radioLabel}
        name={name}
        value={value ?? optionValue}
        disabled={isDisabled}
        onClick={handleClick}
        className={className}
        $isChecked={isChecked}
        data-testid="radio-button"
        style={resolveButtonTokens({ colorTheme, tokens })}
      />
      {radioLabel && <RadioLabel>{radioLabel}</RadioLabel>}
    </RadioWrapper>
  )
}
