'use client'

import type { ChangeEvent } from 'react'
import { resolveInputTokens } from '../../inputTokens'
import {
  ErrorDiv,
  InputIconWrapper,
  InputLabel,
  MaskedInputContainer
} from '../../MaskedInput.styles'
import { InputVariantMap } from '../../MaskedInput.types'

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
  const hasError = props.touched && props.error

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value
    const currentMask = resolveMask(props.mask, rawValue)
    props.onChange?.(applyMask(rawValue, currentMask))
  }

  return (
    <MaskedInputContainer
      $variant="masked"
      $radius={props.radius}
      data-error={hasError}
      $icon={!props.icon}
      className={props.className}
      style={{
        ...resolveInputTokens({ colorTheme: props.colorTheme, tokens: props.tokens }),
        ...props.containerStyle
      }}
    >
      {props.label && (
        <InputLabel htmlFor={props.id} $required={props.required}>
          <span>{props.label}</span>
        </InputLabel>
      )}

      {props.icon && <InputIconWrapper>{props.icon}</InputIconWrapper>}

      <input
        id={props.id}
        name={props.name}
        inputMode="numeric"
        value={props.value ?? ''}
        onChange={handleChange}
        placeholder={props.placeholder}
        className={hasError ? 'error' : ''}
        aria-invalid={hasError ? 'true' : undefined}
        aria-describedby={hasError ? `${props.id}-error` : undefined}
        disabled={props.disabled}
      />

      {hasError && <ErrorDiv id={`${props.id}-error`}>{props.error}</ErrorDiv>}
    </MaskedInputContainer>
  )
}
