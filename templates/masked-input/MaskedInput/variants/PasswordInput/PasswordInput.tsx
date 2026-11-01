'use client'

import { useState } from 'react'
import {
  ErrorDiv,
  InputIconWrapper,
  InputLabel,
  MaskedInputContainer
} from '../../MaskedInput.styles'
import { InputVariantMap } from '../../MaskedInput.types'
import { resolveInputTokens } from '../../inputTokens'
import { EyeIcon, EyeOffIcon } from '../../icons'
import { PasswordToggle } from './PasswordInput.styles'

type Props = { variant: 'password' } & InputVariantMap['password']

export function PasswordInput(props: Props) {
  const [show, setShow] = useState(false)
  const hasError = props.touched && props.error

  return (
    <MaskedInputContainer
      $variant="password"
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
        type={show ? 'text' : 'password'}
        value={props.value ?? ''}
        onChange={(e) => props.onChange?.(e.target.value)}
        className={hasError ? 'error' : ''}
        placeholder={props.placeholder}
        aria-invalid={hasError ? 'true' : undefined}
        aria-describedby={hasError ? `${props.id}-error` : undefined}
        disabled={props.disabled}
      />

      <PasswordToggle
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? 'Ocultar senha' : 'Mostrar senha'}
        aria-pressed={show}
      >
        {show ? (props.hideIcon ?? <EyeOffIcon />) : (props.showIcon ?? <EyeIcon />)}
      </PasswordToggle>

      {hasError && <ErrorDiv id={`${props.id}-error`}>{props.error}</ErrorDiv>}
    </MaskedInputContainer>
  )
}
