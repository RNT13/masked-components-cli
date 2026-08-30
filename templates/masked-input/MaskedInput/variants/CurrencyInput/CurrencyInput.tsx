'use client'

import { useEffect, useState } from 'react'
import { ErrorDiv, InputLabel, MaskedInputContainer } from '../../MaskedInput.styles'
import { InputVariantMap } from '../../MaskedInput.types'
import { CurrencyWrapper } from './CurrencyInput.styles'

type Props = { variant: 'currency' } & InputVariantMap['currency']

export function CurrencyInput(props: Props) {
  const hasError = props.touched && Boolean(props.error)

  /* ============================================================
   * CONFIGURAÇÕES DE FORMATAÇÃO DE MOEDA
   * ============================================================ */
  const { currencyConfig: { symbol = 'R$', locale = 'pt-BR' } = {} } = props

  /* ============================================================
   * HELPERS
   * ============================================================ */
  function toCents(value: string | number | undefined | null) {
    return Math.round(Number(value ?? 0) * 100)
  }

  /* ============================================================
   * ESTADO INTERNO (EM CENTAVOS)
   * Inicializa a partir do value recebido do Formik
   * ============================================================ */
  const [cents, setCents] = useState(() => toCents(props.value))

  /* ============================================================
   * SINCRONIZAÇÃO COM O VALOR EXTERNO
   *
   * Quando o formulário executa resetForm() ou setFieldValue(),
   * props.value muda. Este efeito atualiza o estado interno para
   * refletir o novo valor.
   * ============================================================ */
  useEffect(() => {
    const nextCents = toCents(props.value)

    // Atualiza apenas se realmente houver mudança
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCents(current => (current === nextCents ? current : nextCents))
  }, [props.value])

  /* ============================================================
   * FORMATADOR
   * ============================================================ */
  function formatCurrencyFromCents(value: number) {
    return new Intl.NumberFormat(locale, {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
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
      return
    }
  }

  /* ============================================================
   * EMITE VALOR FINAL (ex.: "54.85")
   * ============================================================ */
  function handleBlur() {
    props.onChange?.((cents / 100).toFixed(2))
  }

  return (
    <MaskedInputContainer $variant="currency" $radius={props.radius} data-error={hasError} $icon={!props.symbol}>
      {props.label && (
        <InputLabel htmlFor={props.id} $required={props.required}>
          <span>{props.label}</span>
        </InputLabel>
      )}

      <CurrencyWrapper>
        <span>{symbol}</span>

        <input
          id={props.id}
          name={props.name}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={formatCurrencyFromCents(cents)}
          placeholder="0,00"
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onChange={() => {}}
          className={hasError ? 'error' : ''}
          aria-invalid={hasError ? 'true' : undefined}
          aria-describedby={hasError ? `${props.id}-error` : undefined}
          disabled={props.disabled}
          autoComplete="off"
        />
      </CurrencyWrapper>

      {hasError && <ErrorDiv id={`${props.id}-error`}>{props.error}</ErrorDiv>}
    </MaskedInputContainer>
  )
}
