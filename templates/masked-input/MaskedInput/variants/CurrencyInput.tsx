'use client'

import { IMaskInput } from 'react-imask'
import { CurrencyWrapper, ErrorDiv, InputLabel, MaskedInputContainer } from '../MaskedInput.styles'
import { InputVariantMap } from '../MaskedInput.types'

type Props = { variant: 'currency' } & InputVariantMap['currency']

export function CurrencyInput(props: Props) {
  const hasError = props.touched && Boolean(props.error)

  const { currencyConfig: { symbol = 'R$', decimalScale = 2 } = {} } = props

  return (
    <MaskedInputContainer $variant="currency">
      {props.label && (
        <InputLabel>
          {props.icon}
          <label>{props.label}</label>
        </InputLabel>
      )}

      <CurrencyWrapper>
        <span>{symbol}</span>

        <IMaskInput
          mask={Number}
          radix=","
          thousandsSeparator="."
          scale={decimalScale}
          min={0}
          normalizeZeros
          padFractionalZeros
          unmask="typed"
          defaultValue={props.value}
          placeholder={props.placeholder ?? '0,00'}
          onAccept={value => {
            props.onChange?.(value.toString())
          }}
          className={hasError ? 'error' : ''}
        />
      </CurrencyWrapper>

      {props.showError && hasError && <ErrorDiv>{props.error}</ErrorDiv>}
    </MaskedInputContainer>
  )
}
