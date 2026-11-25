'use client'

import { useId } from 'react'
import { useTheme } from 'styled-components'
import { useControllable } from '@/hooks/useControllable'
import { resolveButtonTokens } from '../../buttonTokens'
import { ButtonVariantMap } from '../../MaskedButton.types'
import { HiddenInput, SwitchContainer, SwitchLabel, SwitchWrapper } from './SwitchButton.styles'

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
  tokens,
  name,
  value,
  required = false,
  error,
  helperText
}: Props) {
  const theme = useTheme()
  const uid = useId()
  const inputId = `${uid}-switch`

  const [isChecked, setChecked] = useControllable<boolean>({
    value: checked,
    defaultValue: defaultChecked,
    onChange: onCheckedChange
  })

  const isDisabled = state === 'disabled' || state === 'loading'
  const hasError = Boolean(error)

  const describedby =
    [hasError ? `${inputId}-error` : null, helperText ? `${inputId}-helper` : null]
      .filter(Boolean)
      .join(' ') || undefined

  return (
    <SwitchWrapper $position={$position}>
      <SwitchContainer
        as="label"
        htmlFor={inputId}
        aria-label={ariaLabel ?? switchLabel}
        className={className}
        $isChecked={isChecked}
        $hasError={hasError}
        data-testid="switch-button"
        style={resolveButtonTokens({ colorTheme, tokens, theme })}
      >
        <HiddenInput
          id={inputId}
          type="checkbox"
          role="switch"
          checked={isChecked}
          name={name}
          value={value}
          required={required}
          disabled={isDisabled}
          aria-invalid={hasError || undefined}
          aria-describedby={describedby}
          onChange={(e) => {
            if (isDisabled) return
            setChecked(e.target.checked)
            onClick?.(e as unknown as React.MouseEvent<HTMLButtonElement>)
          }}
        />
      </SwitchContainer>

      {switchLabel && (
        <SwitchLabel as="label" htmlFor={inputId}>
          {switchLabel}
        </SwitchLabel>
      )}

      {hasError && (
        <span id={`${inputId}-error`} role="alert">
          {error}
        </span>
      )}
      {helperText && <span id={`${inputId}-helper`}>{helperText}</span>}
    </SwitchWrapper>
  )
}
