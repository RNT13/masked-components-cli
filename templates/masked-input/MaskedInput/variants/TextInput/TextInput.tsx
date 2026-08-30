'use client'

import { ErrorDiv, InputIconWrapper, InputLabel, MaskedInputContainer } from '../../MaskedInput.styles'
import { InputVariantMap } from '../../MaskedInput.types'

type Props = { variant: 'default' } & InputVariantMap['default']

export function TextInput(props: Props) {
  const hasError = props.touched && props.error

  return (
    <MaskedInputContainer $variant="default" $radius={props.radius} data-error={hasError} $icon={!props.icon}>
      {props.label && (
        <InputLabel htmlFor={props.id} $required={props.required}>
          <span>{props.label}</span>
        </InputLabel>
      )}

      {props.icon && <InputIconWrapper>{props.icon}</InputIconWrapper>}

      <input
        id={props.id}
        type={props.type ?? 'text'}
        value={props.value ?? ''}
        onChange={e => props.onChange?.(e.target.value)}
        placeholder={props.placeholder}
        className={hasError ? 'error' : ''}
        aria-invalid={hasError ? 'true' : undefined}
        aria-describedby={hasError ? `${props.id}-error` : undefined}
        disabled={props.disabled}
      />

      {hasError && <ErrorDiv id={`${props.id}-error`}>{props.error}</ErrorDiv>}
    </MaskedInputContainer>
  )
}
