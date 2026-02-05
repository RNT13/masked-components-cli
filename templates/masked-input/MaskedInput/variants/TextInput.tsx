'use client'

import { ErrorDiv, InputLabel, MaskedInputContainer } from '../MaskedInput.styles'
import { InputVariantMap } from '../MaskedInput.types'

type Props = { variant: 'default' } & InputVariantMap['default']

export function TextInput(props: Props) {
  const hasError = props.touched && props.error

  return (
    <MaskedInputContainer $variant="default" $radius={props.radius} data-error={hasError}>
      {props.label && (
        <InputLabel htmlFor={props.id}>
          {props.icon && props.icon}
          <span>{props.label}</span>
        </InputLabel>
      )}

      <input
        id={props.id}
        type={props.type ?? 'text'}
        value={props.value ?? ''}
        onChange={e => props.onChange?.(e.target.value)}
        placeholder={props.placeholder}
        className={hasError ? 'error' : ''}
        aria-invalid={hasError ? 'true' : undefined}
        aria-describedby={hasError ? `${props.id}-error` : undefined}
      />

      {hasError && <ErrorDiv id={`${props.id}-error`}>{props.error}</ErrorDiv>}
    </MaskedInputContainer>
  )
}
