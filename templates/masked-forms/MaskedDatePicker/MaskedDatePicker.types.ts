import type { CSSProperties, ReactNode } from 'react'
import type { ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'
import type { DatePickerTokenOverrides } from './datePickerTokens'

/** Apresentação do seletor. Default 'popover'. */
export type DatePickerVariant = 'popover' | 'inline'

/** Props próprias do MaskedDatePicker (API pública). */
export type MaskedDatePickerProps = {
  variant?: DatePickerVariant
  /** Data escolhida em "YYYY-MM-DD" (controlado). `null` = sem data. */
  value?: string | null
  /** Data inicial (não controlado). */
  defaultValue?: string | null
  /** Recebe "YYYY-MM-DD" ou `null` (ao limpar). */
  onChange?: (value: string | null) => void
  /** Menor/maior data permitida ("YYYY-MM-DD"). */
  min?: string
  max?: string
  /** Bloqueia datas específicas (ex.: feriados, dias lotados). */
  isDateDisabled?: (date: string) => boolean
  /** Primeiro dia da semana: 0 (domingo) a 6. Default 0. */
  weekStart?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  /** Rótulo visível do campo. Sem ele, passe `ariaLabel`. */
  label?: ReactNode
  ariaLabel?: string
  /** Texto do botão quando não há data. Default por locale. */
  placeholder?: string
  /** Mostra o botão "Limpar" quando há data. Default true. */
  clearable?: boolean
  /** Campo oculto para <form>: envia "YYYY-MM-DD" (ou vazio). */
  name?: string
  disabled?: boolean
  /** Paleta registrada ou chave da paleta (dia selecionado). */
  colorTheme?: ColorThemeName
  /** Overrides granulares de tokens --mc-date-picker-*. */
  tokens?: DatePickerTokenOverrides
  className?: string
  style?: CSSProperties
}

/** Props transient internas (styled-components) — nunca API pública. */
export type MaskedDatePickerInternalProps = {
  $selected?: boolean
  $today?: boolean
  $disabled?: boolean
  $inline?: boolean
}
