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

type Props = { variant: 'default' } & InputVariantMap['default']

export function TextInput(props: Props) {
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
      $variant="default"
      $radius={props.radius}
      data-error={hasError}
      $icon={!props.icon}
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
        type={props.type ?? 'text'}
        value={current ?? ''}
        onChange={(e) => handleChange(e.target.value)}
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
