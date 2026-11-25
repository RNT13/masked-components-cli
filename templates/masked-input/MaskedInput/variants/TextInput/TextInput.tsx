'use client'

import { useId } from 'react'
import { useControllable } from '@/hooks/useControllable'
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

type Props = { variant: 'default' } & InputVariantMap['default']

export function TextInput(props: Props) {
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

  const handleChange = (v: string) => {
    setCurrent(v)
  }

  return (
    <MaskedInputContainer
      $variant="default"
      $radius={props.radius}
      data-error={hasError}
      $icon={!props.icon}
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
        type={props.type ?? 'text'}
        value={current ?? ''}
        onChange={(e) => handleChange(e.target.value)}
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
