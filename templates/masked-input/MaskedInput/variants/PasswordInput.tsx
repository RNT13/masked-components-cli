'use client'

import { useState } from 'react'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { ErrorDiv, InputLabel, MaskedInputContainer, PasswordToggle } from '../MaskedInput.styles'
import { InputVariantMap } from '../MaskedInput.types'

type Props = { variant: 'password' } & InputVariantMap['password']

export function PasswordInput(props: Props) {
  const [show, setShow] = useState(false)
  const hasError = props.touched && props.error

  return (
    <MaskedInputContainer $variant="password" $radius={props.radius} data-error={hasError}>
      {props.label && (
        <InputLabel htmlFor={props.id}>
          {props.icon && props.icon}
          <span>{props.label}</span>
        </InputLabel>
      )}

      <input
        id={props.id}
        type={show ? 'text' : 'password'}
        value={props.value ?? ''}
        onChange={e => props.onChange?.(e.target.value)}
        className={hasError ? 'error' : ''}
        placeholder={props.placeholder}
        aria-invalid={hasError ? 'true' : undefined}
        aria-describedby={hasError ? `${props.id}-error` : undefined}
      />

      <PasswordToggle onClick={() => setShow(s => !s)}>{show ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}</PasswordToggle>

      {props.showError && hasError && <ErrorDiv id={`${props.id}-error`}>{props.error}</ErrorDiv>}
    </MaskedInputContainer>
  )
}
