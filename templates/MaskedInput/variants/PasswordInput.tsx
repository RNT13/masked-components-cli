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
    <MaskedInputContainer $variant="password">
      {props.label && (
        <InputLabel>
          {props.icon && props.icon}
          {props.label && <label>{props.label}</label>}
        </InputLabel>
      )}

      <input
        type={show ? 'text' : 'password'}
        value={props.value ?? ''}
        onChange={e => props.onChange?.(e.target.value)}
        className={hasError ? 'error' : ''}
        placeholder={props.placeholder}
      />

      <PasswordToggle onClick={() => setShow(s => !s)}>{show ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}</PasswordToggle>

      {props.showError && hasError && <ErrorDiv>{props.error}</ErrorDiv>}
    </MaskedInputContainer>
  )
}
