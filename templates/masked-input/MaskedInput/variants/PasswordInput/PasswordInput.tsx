'use client'

import { useId, useState } from 'react'
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
import { PasswordFieldWrapper, PasswordToggle } from './PasswordInput.styles'
import { EyeIcon, EyeOffIcon } from '../../icons'
import { useControllable } from '@/hooks/useControllable'

type Props = { variant: 'password' } & InputVariantMap['password']

export function PasswordInput(props: Props) {
  const [show, setShow] = useState(false)
  const uid = useId()
  const inputId = props.id ?? uid
  const theme = useMaskedTheme()
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
        ...resolveInputTokens({ colorTheme: props.colorTheme, tokens: props.tokens }, theme),
        ...props.containerStyle
      }}
    >
      {props.label && (
        <InputLabel htmlFor={inputId} $required={props.required}>
          <span>{props.label}</span>
        </InputLabel>
      )}

      <PasswordFieldWrapper>
        {props.icon && <InputIconWrapper>{props.icon}</InputIconWrapper>}

        <input
          id={inputId}
          name={props.name}
          type={show ? 'text' : 'password'}
          value={current ?? ''}
          onChange={(e) => setCurrent(e.target.value)}
          className={hasError ? 'error' : ''}
          placeholder={props.placeholder}
          aria-invalid={hasError ? 'true' : undefined}
          aria-describedby={describedBy}
          disabled={props.disabled}
        />

        <PasswordToggle
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={toggleLabel}
          aria-pressed={show}
          disabled={props.disabled}
        >
          {show ? showIcon : hideIcon}
        </PasswordToggle>
      </PasswordFieldWrapper>

      {hasError && <ErrorDiv id={`${inputId}-error`}>{props.error}</ErrorDiv>}
      {props.helperText && <HelperDiv id={helperId}>{props.helperText}</HelperDiv>}
    </MaskedInputContainer>
  )
}
