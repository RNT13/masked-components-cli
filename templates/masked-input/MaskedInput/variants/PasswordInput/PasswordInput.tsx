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
import { PasswordToggle } from './PasswordInput.styles'
import { EyeIcon, EyeOffIcon } from '../../icons'

type Props = { variant: 'password' } & InputVariantMap['password']

export function PasswordInput(props: Props) {
  const [show, setShow] = useState(false)
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

  const showIcon = props.showIcon ?? <EyeIcon />
  const hideIcon = props.hideIcon ?? <EyeOffIcon />
  const toggleLabel = show
    ? (props.hideLabel ?? 'Ocultar senha')
    : (props.showLabel ?? 'Mostrar senha')

  return (
    <MaskedInputContainer
      $variant="password"
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
        type={show ? 'text' : 'password'}
        value={current ?? ''}
        onChange={(e) => handleChange(e.target.value)}
        className={hasError ? 'error' : ''}
        placeholder={props.placeholder}
        aria-invalid={hasError ? 'true' : undefined}
        aria-describedby={hasError ? `${props.id}-error` : undefined}
        disabled={props.disabled}
      />

      <PasswordToggle
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={toggleLabel}
        aria-pressed={show}
        disabled={props.disabled}
      >
        {show ? hideIcon : showIcon}
      </PasswordToggle>

      {hasError && <ErrorDiv id={`${props.id}-error`}>{props.error}</ErrorDiv>}
    </MaskedInputContainer>
  )
}
