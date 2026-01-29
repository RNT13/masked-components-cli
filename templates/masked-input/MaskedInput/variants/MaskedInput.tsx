'use client'

import { IMaskInput } from 'react-imask'
import { ErrorDiv, InputLabel, MaskedInputContainer } from '../MaskedInput.styles'
import { InputVariantMap } from '../MaskedInput.types'

type Props = { variant: 'masked' } & InputVariantMap['masked']

export function MaskedInput(props: Props) {
  const hasError = props.touched && props.error

  return (
    <MaskedInputContainer $variant="masked">
      {props.label && (
        <InputLabel>
          {props.icon && props.icon}
          {props.label && <label>{props.label}</label>}
        </InputLabel>
      )}

      <IMaskInput
        mask={props.mask}
        value={props.value ?? ''}
        placeholder={props.placeholder}
        onAccept={val => props.onChange?.(val)}
        className={hasError ? 'error' : ''}
      />

      {props.showError && hasError && <ErrorDiv>{props.error}</ErrorDiv>}
    </MaskedInputContainer>
  )
}
