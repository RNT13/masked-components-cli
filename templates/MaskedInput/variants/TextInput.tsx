'use client'

import { ErrorDiv, InputLabel, MaskedInputContainer } from '../MaskedInput.styles'
import { InputVariantMap } from '../MaskedInput.types'

type Props = { variant: 'default' } & InputVariantMap['default']

export function TextInput(props: Props) {
  const hasError = props.touched && props.error

  return (
    <MaskedInputContainer $variant="default">
      {props.label && (
        <InputLabel>
          {props.icon && props.icon}
          {props.label && <label>{props.label}</label>}
        </InputLabel>
      )}

      <input
        type={props.type ?? 'text'}
        value={props.value ?? ''}
        onChange={e => props.onChange?.(e.target.value)}
        className={hasError ? 'error' : ''}
        placeholder={props.placeholder}
      />

      {hasError && <ErrorDiv>{props.error}</ErrorDiv>}
    </MaskedInputContainer>
  )
}
