'use client'

import { useState } from 'react'
import {
  CurrencyWrapper,
  ErrorDiv,
  InputLabel,
  MaskedInputContainer,
} from '../MaskedInput.styles'
import { InputVariantMap } from '../MaskedInput.types'

type Props = { variant: 'currency' } & InputVariantMap['currency']

export function CurrencyInput(props: Props) {
  const hasError = props.touched && Boolean(props.error)

  /* ============================================================
   * CONFIGURAÇÕES DE FORMATAÇÃO DE MOEDA
   * ============================================================ */
  const {
    currencyConfig: {
      symbol = 'R$',
      locale = 'pt-BR',
      currency = 'BRL',
    } = {},
  } = props

  /* ============================================================
   * ESTADO INTERNO (EM CENTAVOS)
   * Inicializa UMA VEZ a partir do value
   * ============================================================ */
  const [cents, setCents] = useState(() =>
    Math.round(Number(props.value ?? 0) * 100)
  )

  /* ============================================================
   * FORMATADOR
   * ============================================================ */
  function formatCurrencyFromCents(value: number) {
    return new Intl.NumberFormat(locale, {
      currency,
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value / 100)
  }

  /* ============================================================
   * INPUT LOGIC (direita → esquerda)
   * ============================================================ */
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key >= '0' && e.key <= '9') {
      e.preventDefault()
      setCents(prev => prev * 10 + Number(e.key))
      return
    }

    if (e.key === 'Backspace') {
      e.preventDefault()
      setCents(prev => Math.floor(prev / 10))
    }
  }

  /* ============================================================
   * EMITE VALOR FINAL (ex: "54.85")
   * ============================================================ */
  function handleBlur() {
    props.onChange?.((cents / 100).toFixed(2))
  }

  return (
    <MaskedInputContainer $variant="currency" $radius={props.radius} data-error={hasError}>
      {props.label && (
        <InputLabel htmlFor={props.id}>
          {props.icon}
          <span>{props.label}</span>
        </InputLabel>
      )}

      <CurrencyWrapper>
        <span>{symbol}</span>

        <input
          id={props.id}
          inputMode="numeric"
          value={formatCurrencyFromCents(cents)}
          placeholder="0,00"
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          readOnly
          className={hasError ? 'error' : ''}
          aria-invalid={hasError ? 'true' : undefined}
          aria-describedby={hasError ? `${props.id}-error` : undefined}
        />
      </CurrencyWrapper>

      {props.showError && hasError && <ErrorDiv id={`${props.id}-error`}>{props.error}</ErrorDiv>}
    </MaskedInputContainer>
  )
}
