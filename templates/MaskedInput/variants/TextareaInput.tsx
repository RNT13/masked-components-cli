'use client'

import { ErrorDiv, InputLabel, MaskedInputContainer } from '../MaskedInput.styles'
import { InputVariantMap } from '../MaskedInput.types'

type Props = { variant: 'textarea' } & InputVariantMap['textarea']

export function TextareaInput(props: Props) {
  const hasError = props.touched && props.error

  return (
    <MaskedInputContainer $variant="textarea">
      {props.label && (
        <InputLabel>
          {props.icon && props.icon}
          {props.label && <label>{props.label}</label>}
        </InputLabel>
      )}

      <textarea
        value={props.value ?? ''}
        onChange={e => props.onChange?.(e.target.value)}
        className={hasError ? 'error' : ''}
        placeholder={props.placeholder}
      />

      {props.showError && hasError && <ErrorDiv>{props.error}</ErrorDiv>}
    </MaskedInputContainer>
  )
}
