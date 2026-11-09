'use client'

import { useState, type ChangeEvent, type CSSProperties } from 'react'
import { resolveInputTokens } from '../../inputTokens'
import { ErrorDiv, InputLabel, MaskedInputContainer } from '../../MaskedInput.styles'
import { InputVariantMap } from '../../MaskedInput.types'
import { CurrencyWrapper } from './CurrencyInput.styles'

type Props = { variant: 'currency' } & InputVariantMap['currency']

const MAX_DIGITS = 13

function currencySymbol(locale: string, currency: string): string {
  try {
    const part = new Intl.NumberFormat(locale, { style: 'currency', currency })
      .formatToParts(0)
      .find((p) => p.type === 'currency')
    return part?.value ?? currency
  } catch {
    return currency
  }
}

function toCents(value: unknown): number {
  const n = Number(value ?? 0)
  return Number.isFinite(n) ? Math.round(n * 100) : 0
}

export function CurrencyInput(props: Props) {
  const hasError = props.touched && Boolean(props.error)

  const cfg = props.currencyConfig ?? {}
  const locale = cfg.locale ?? 'pt-BR'
  const currency = cfg.currency ?? 'BRL'
  const symbol = cfg.symbol ?? props.symbol ?? currencySymbol(locale, currency)
  const position = cfg.symbolPosition ?? 'prefix'
  const pad = Math.max(44, 24 + symbol.length * 14)

  /* estado interno em centavos; sincroniza com props.value (derive-during-render) */
  const [cents, setCents] = useState(() => toCents(props.value))
  const [prevValue, setPrevValue] = useState(props.value)
  if (prevValue !== props.value) {
    setPrevValue(props.value)
    setCents(toCents(props.value))
  }

  const formatted = new Intl.NumberFormat(locale, {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(cents / 100)

  /* onChange (não keydown/readOnly): funciona com teclado virtual, colar e autofill */
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, '').slice(0, MAX_DIGITS)
    const next = digits ? Number(digits) : 0
    setCents(next)
    props.onChange?.((next / 100).toFixed(2))
  }

  return (
    <MaskedInputContainer
      $variant="currency"
      $radius={props.radius}
      $icon
      data-error={hasError}
      className={props.className}
      style={{
        ...resolveInputTokens({ colorTheme: props.colorTheme, tokens: props.tokens }),
        ...props.containerStyle
      }}
    >
      {props.label && (
        <InputLabel htmlFor={props.id} $required={props.required}>
          {props.icon}
          <span>{props.label}</span>
        </InputLabel>
      )}

      <CurrencyWrapper
        $symbolPosition={position}
        style={{ '--mc-currency-pad': `${pad}px` } as CSSProperties}
      >
        <span aria-hidden="true">{symbol}</span>

        <input
          id={props.id}
          name={props.name}
          inputMode="numeric"
          autoComplete="off"
          value={formatted}
          placeholder={props.placeholder}
          onChange={handleChange}
          disabled={props.disabled}
          className={hasError ? 'error' : ''}
          aria-invalid={hasError ? 'true' : undefined}
          aria-describedby={hasError ? `${props.id}-error` : undefined}
        />
      </CurrencyWrapper>

      {props.showError !== false && hasError && (
        <ErrorDiv id={`${props.id}-error`}>{props.error}</ErrorDiv>
      )}
    </MaskedInputContainer>
  )
}
