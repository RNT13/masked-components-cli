'use client'

import { ErrorDiv, InputLabel, MaskedInputContainer } from '../MaskedInput.styles'
import { InputVariantMap } from '../MaskedInput.types'

type Props = { variant: 'textarea' } & InputVariantMap['textarea']

export function TextareaInput(props: Props) {
  const hasError = props.touched && props.error

  return (
    <MaskedInputContainer $variant="textarea" $radius={props.radius} data-error={hasError}>
      {props.label && (
        <InputLabel htmlFor={props.id}>
          {props.icon && props.icon}
          <span>{props.label}</span>
        </InputLabel>
      )}

      <textarea
        id={props.id}
        value={props.value ?? ''}
        onChange={e => props.onChange?.(e.target.value)}
        className={hasError ? 'error' : ''}
        placeholder={props.placeholder}
        aria-invalid={hasError ? 'true' : undefined}
        aria-describedby={hasError ? `${props.id}-error` : undefined}
      />

      {props.showError && hasError && <ErrorDiv id={`${props.id}-error`}>{props.error}</ErrorDiv>}
    </MaskedInputContainer>
  )
}
