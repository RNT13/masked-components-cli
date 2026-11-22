'use client'

import { useMaskedTheme } from '@/styles/useMaskedTheme'
import { resolveInputTokens } from '../../inputTokens'
import {
  ErrorDiv,
  HelperDiv,
  InputIconWrapper,
  InputLabel,
  MaskedInputContainer
} from '../../MaskedInput.styles'
import { InputVariantMap } from '../../MaskedInput.types'
import { useControllable } from '@/hooks/useControllable'
import { ChangeEvent, useId } from 'react'

type Props = { variant: 'masked' } & InputVariantMap['masked']

/* Remove todos os caracteres não numéricos */
function removeMask(value: string) {
  return value.replace(/\D/g, '')
}

/* Aplica uma máscara string, ex: 000.000.000-00 */
function applyMask(value: string, maskPattern: string) {
  const numbers = removeMask(value)

  let result = ''
  let numberIndex = 0

  for (let i = 0; i < maskPattern.length; i++) {
    const maskChar = maskPattern[i]

    if (maskChar === '0') {
      if (numbers[numberIndex]) {
        result += numbers[numberIndex]
        numberIndex++
      } else {
        break
      }
    } else if (numbers[numberIndex]) {
      result += maskChar
    }
  }

  return result
}

/* Resolve se a máscara é fixa ou dinâmica */
function resolveMask(mask: string | ((value: string) => string), value: string) {
  return typeof mask === 'function' ? mask(value) : mask
}

export function MaskedTextInput(props: Props) {
  const theme = useMaskedTheme()
  const uid = useId()
  const inputId = props.id ?? uid
  const hasError = props.touched && props.error
  const helperId = `${inputId}-helper`
  const describedBy =
    [hasError ? `${inputId}-error` : null, props.helperText ? helperId : null]
      .filter(Boolean)
      .join(' ') || undefined

  const [current, setCurrent] = useControllable({
    value: props.value,
    defaultValue: '',
    onChange: props.onChange
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value
    const masked =
      props.mask === undefined ? rawValue : applyMask(rawValue, resolveMask(props.mask, rawValue))

    setCurrent(masked)
  }

  return (
    <MaskedInputContainer
      $variant="masked"
      $radius={props.radius}
      data-error={hasError}
      $icon={!props.icon}
      className={props.className}
      style={{
        ...resolveInputTokens({ colorTheme: props.colorTheme, tokens: props.tokens }, theme),
        ...props.containerStyle
      }}
    >
      {props.label && (
        <InputLabel htmlFor={inputId} $required={props.required}>
          <span>{props.label}</span>
        </InputLabel>
      )}

      {props.icon && <InputIconWrapper>{props.icon}</InputIconWrapper>}

      <input
        id={inputId}
        name={props.name}
        inputMode="numeric"
        value={current ?? ''}
        onChange={handleChange}
        placeholder={props.placeholder}
        className={hasError ? 'error' : ''}
        aria-invalid={hasError ? 'true' : undefined}
        aria-describedby={describedBy}
        disabled={props.disabled}
      />

      {hasError && <ErrorDiv id={`${inputId}-error`}>{props.error}</ErrorDiv>}
      {props.helperText && <HelperDiv id={helperId}>{props.helperText}</HelperDiv>}
    </MaskedInputContainer>
  )
}
