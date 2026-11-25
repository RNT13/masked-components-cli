'use client'

import { useId } from 'react'
import { useMaskedTheme } from '@/styles/useMaskedTheme'
import { useControllable } from '@/hooks/useControllable'
import { resolveButtonTokens } from '../../buttonTokens'
import { ButtonVariantMap } from '../../MaskedButton.types'
import { HiddenInput, RadioDot, RadioLabel, RadioWrapper } from './RadioButton.styles'

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
  tokens,
  required = false,
  error,
  helperText
}: Props) {
  const theme = useMaskedTheme()
  const uid = useId()
  const inputId = `${uid}-radio`

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
    <RadioWrapper>
      <RadioDot
        as="label"
        htmlFor={inputId}
        aria-label={radioLabel ? undefined : ariaLabel}
        className={className}
        $isChecked={isChecked}
        $hasError={hasError}
        data-testid="radio-button"
        style={resolveButtonTokens({ colorTheme, tokens, theme })}
      >
        <HiddenInput
          id={inputId}
          type="radio"
          checked={isChecked}
          name={name}
          value={value ?? optionValue}
          required={required}
          disabled={isDisabled}
          aria-invalid={hasError || undefined}
          aria-describedby={describedby}
          onChange={() => {
            if (isDisabled) return
            setChecked(true)
            onClick?.({} as React.MouseEvent<HTMLButtonElement>)
          }}
          onClick={(e) => {
            // radio de grupo não desmarca; avulso pode (deselectable)
            if (isChecked && deselectable) {
              e.preventDefault()
              setChecked(false)
            }
          }}
        />
      </RadioDot>

      {radioLabel && (
        <RadioLabel as="label" htmlFor={inputId}>
          {radioLabel}
        </RadioLabel>
      )}

      {hasError && (
        <span id={`${inputId}-error`} role="alert">
          {error}
        </span>
      )}
      {helperText && <span id={`${inputId}-helper`}>{helperText}</span>}
    </RadioWrapper>
  )
}
