'use client'

import { IMaskInput } from 'react-imask'
import { ErrorDiv, InputLabel, MaskedInputContainer } from '../MaskedInput.styles'
import { InputVariantMap } from '../MaskedInput.types'

type Props = { variant: 'masked' } & InputVariantMap['masked']

export function MaskedInput(props: Props) {
  const hasError = props.touched && props.error

  return (
    <MaskedInputContainer $variant="masked" $radius={props.radius}>
      {props.label && (
        <InputLabel htmlFor={props.id}>
          {props.icon && props.icon}
          <span>{props.label}</span>
        </InputLabel>
      )}

      <IMaskInput
        id={props.id}
        mask={props.mask}
        value={props.value ?? ''}
        placeholder={props.placeholder}
        onAccept={val => props.onChange?.(val)}
        className={hasError ? 'error' : ''}
        aria-invalid={hasError ? 'true' : undefined}
        aria-describedby={hasError ? `${props.id}-error` : undefined}
      />

      {props.showError && hasError && <ErrorDiv id={`${props.id}-error`}>{props.error}</ErrorDiv>}
    </MaskedInputContainer>
  )
}
