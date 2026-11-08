'use client'

import { useState } from 'react'
import { resolveInputTokens } from '../../inputTokens'
import {
  ErrorDiv,
  InputIconWrapper,
  InputLabel,
  MaskedInputContainer
} from '../../MaskedInput.styles'
import { InputVariantMap } from '../../MaskedInput.types'

type Props = { variant: 'textarea' } & InputVariantMap['textarea']

export function TextareaInput(props: Props) {
  const hasError = props.touched && props.error

  /* Híbrido: se `value` for passado, o componente é controlado pelo pai.
     Se não, mantém estado interno — o campo funciona sozinho em demos. */
  const isControlled = props.value !== undefined
  const [internal, setInternal] = useState('')
  const current = isControlled ? props.value : internal

  const handleChange = (v: string) => {
    if (!isControlled) setInternal(v)
    props.onChange?.(v)
  }

  return (
    <MaskedInputContainer
      $variant="textarea"
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

      <textarea
        id={props.id}
        name={props.name}
        value={current ?? ''}
        onChange={(e) => handleChange(e.target.value)}
        className={hasError ? 'error' : ''}
        placeholder={props.placeholder}
        aria-invalid={hasError ? 'true' : undefined}
        aria-describedby={hasError ? `${props.id}-error` : undefined}
        disabled={props.disabled}
      />

      {hasError && <ErrorDiv id={`${props.id}-error`}>{props.error}</ErrorDiv>}
    </MaskedInputContainer>
  )
}
