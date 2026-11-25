'use client'

import { useId } from 'react'
import { useTheme } from 'styled-components'
import { useControllable } from '@/hooks/useControllable'
import { CheckIcon, SpinnerIcon } from '../../Base/icons'
import { resolveButtonTokens } from '../../buttonTokens'
import { ButtonVariantMap } from '../../MaskedButton.types'
import { CheckboxBox, CheckboxLabel, CheckboxWrapper, HiddenInput } from './CheckboxButton.styles'

type Props = {
  $variant: 'checkbox'
} & ButtonVariantMap['checkbox']

export default function CheckboxButton({
  $position = 'left',
  checked,
  defaultChecked = false,
  onCheckedChange,
  onClick,
  $checkboxLabel,
  state = 'default',
  ariaLabel,
  className,
  colorTheme,
  tokens,
  name,
  value,
  indeterminate = false,
  required = false,
  error,
  helperText
}: Props) {
  const theme = useTheme()
  const uid = useId()
  const inputId = `${uid}-checkbox`

  const [isChecked, setChecked] = useControllable<boolean>({
    value: checked,
    defaultValue: defaultChecked,
    onChange: onCheckedChange
  })

  const isLoading = state === 'loading'
  const isDisabled = state === 'disabled' || isLoading
  const hasError = Boolean(error)

  const describedby =
    [hasError ? `${inputId}-error` : null, helperText ? `${inputId}-helper` : null]
      .filter(Boolean)
      .join(' ') || undefined

  return (
    <CheckboxWrapper $position={$position}>
      <CheckboxBox
        as="label"
        htmlFor={inputId}
        aria-label={ariaLabel ?? $checkboxLabel}
        className={className}
        $isChecked={isChecked}
        $isLoading={isLoading}
        $hasError={hasError}
        data-testid="checkbox-button"
        style={resolveButtonTokens({ colorTheme, tokens, theme })}
      >
        <HiddenInput
          id={inputId}
          type="checkbox"
          checked={isChecked}
          name={name}
          value={value}
          required={required}
          disabled={isDisabled}
          aria-invalid={hasError || undefined}
          aria-describedby={describedby}
          ref={(el) => {
            if (el) el.indeterminate = indeterminate && !isChecked
          }}
          onChange={(e) => {
            if (isDisabled) return
            setChecked(e.target.checked)
            onClick?.(e as unknown as React.MouseEvent<HTMLButtonElement>)
          }}
        />
        {isLoading ? <SpinnerIcon /> : isChecked && <CheckIcon />}
      </CheckboxBox>

      {$checkboxLabel && (
        <CheckboxLabel as="label" htmlFor={inputId}>
          {$checkboxLabel}
        </CheckboxLabel>
      )}

      {hasError && (
        <span id={`${inputId}-error`} role="alert">
          {error}
        </span>
      )}
      {helperText && <span id={`${inputId}-helper`}>{helperText}</span>}
    </CheckboxWrapper>
  )
}
