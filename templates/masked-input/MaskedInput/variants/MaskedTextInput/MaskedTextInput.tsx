'use client'

import { ErrorDiv, InputIconWrapper, InputLabel, MaskedInputContainer } from '../../MaskedInput.styles'
import { InputVariantMap } from '../../MaskedInput.types'

type Props = { variant: 'masked' } & InputVariantMap['masked']

/* ============================================================
 * REMOVE TODOS OS CARACTERES NÃO NUMÉRICOS
 * ============================================================ */
function removeMask(value: string) {
  return value.replace(/\D/g, '')
}

/* ============================================================
 * APLICA UMA MÁSCARA STRING EX: 000.000.000-00
 * ============================================================ */
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
    } else {
      if (numbers[numberIndex]) {
        result += maskChar
      }
    }
  }

  return result
}

/* ============================================================
 * RESOLVE SE A MASK É FIXA OU DINÂMICA
 * ============================================================ */
function resolveMask(mask: string | ((value: string) => string), value: string) {
  return typeof mask === 'function' ? mask(value) : mask
}

export function MaskedTextInput(props: Props) {
  const hasError = props.touched && props.error

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value

    const currentMask = resolveMask(props.mask, rawValue)

    const maskedValue = applyMask(rawValue, currentMask)

    props.onChange?.(maskedValue)
  }

  return (
    <MaskedInputContainer $variant="masked" $radius={props.radius} data-error={hasError} $icon={!props.icon}>
      {props.label && (
        <InputLabel htmlFor={props.id} $required={props.required}>
          <span>{props.label}</span>
        </InputLabel>
      )}

      {props.icon && <InputIconWrapper>{props.icon}</InputIconWrapper>}

      <input
        id={props.id}
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
