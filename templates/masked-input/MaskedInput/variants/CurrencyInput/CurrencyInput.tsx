'use client'

import { useEffect, useState } from 'react'
import { formatDecimal } from '@/utils/masked-utils/number'
import { ErrorDiv, InputLabel, MaskedInputContainer } from '../../MaskedInput.styles'
import { InputVariantMap } from '../../MaskedInput.types'
import { resolveInputTokens } from '../../inputTokens'
import { CurrencyWrapper } from './CurrencyInput.styles'

type Props = { variant: 'currency' } & InputVariantMap['currency']

function toCents(value: string | number | undefined | null) {
  return Math.round(Number(value ?? 0) * 100)
}

export function CurrencyInput(props: Props) {
  const hasError = props.touched && Boolean(props.error)

  const { symbol = 'R$', locale = 'pt-BR', symbolPosition = 'prefix' } = props.currencyConfig ?? {}

  const [cents, setCents] = useState(() => toCents(props.value))

  useEffect(() => {
    const nextCents = toCents(props.value)
    setCents((current) => (current === nextCents ? current : nextCents))
  }, [props.value])

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key >= '0' && e.key <= '9') {
      e.preventDefault()
      setCents((prev) => prev * 10 + Number(e.key))
      return
    }
    if (e.key === 'Backspace') {
      e.preventDefault()
      setCents((prev) => Math.floor(prev / 10))
    }
  }

  function handleBlur() {
    props.onChange?.((cents / 100).toFixed(2))
  }

  return (
    <MaskedInputContainer
      $variant="currency"
      $radius={props.radius}
      data-error={hasError}
      $icon={!props.symbol}
      style={{
        ...resolveInputTokens({ colorTheme: props.colorTheme, tokens: props.tokens }),
        ...props.containerStyle
      }}
    >
      {props.label && (
        <InputLabel htmlFor={props.id} $required={props.required}>
          <span>{props.label}</span>
        </InputLabel>
      )}

      <CurrencyWrapper $symbolPosition={symbolPosition}>
        {symbolPosition === 'prefix' && <span>{symbol}</span>}

        <input
          id={props.id}
          name={props.name}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={formatDecimal(cents / 100, 2, { locale })}
          placeholder={formatDecimal(0, 2, { locale })}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onChange={() => {}}
          className={hasError ? 'error' : ''}
          aria-invalid={hasError ? 'true' : undefined}
          aria-describedby={hasError ? `${props.id}-error` : undefined}
          disabled={props.disabled}
          autoComplete="off"
        />

        {symbolPosition === 'suffix' && <span>{symbol}</span>}
      </CurrencyWrapper>

      {hasError && <ErrorDiv id={`${props.id}-error`}>{props.error}</ErrorDiv>}
    </MaskedInputContainer>
  )
}
