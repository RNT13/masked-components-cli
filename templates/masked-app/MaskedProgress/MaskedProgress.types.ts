import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'
import type { ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'
import type { ProgressTokenOverrides } from './progressTokens'

/** Forma do indicador. Default 'linear'. */
export type ProgressVariant = 'linear' | 'circle'

/** Props próprias do MaskedProgress (API pública). */
export type MaskedProgressBaseProps = {
  variant?: ProgressVariant
  /** Valor atual (0..max). Omita para modo indeterminado. */
  value?: number
  /** Valor máximo. Default 100. */
  max?: number
  /** Força o modo indeterminado mesmo com `value` (ex.: progresso desconhecido). */
  indeterminate?: boolean
  /** Rótulo visível acima/ao lado; também nomeia o progressbar. */
  label?: ReactNode
  /** Exibe a porcentagem (só no modo determinado). */
  showValue?: boolean
  /** Espessura da barra / diâmetro do círculo em px. Default: 8 (linear) / 40 (circle). */
  size?: number
  /** Paleta registrada ou chave da paleta (cor do indicador). */
  colorTheme?: ColorThemeName
  /** Overrides granulares de tokens --mc-progress-*. */
  tokens?: ProgressTokenOverrides
  className?: string
  style?: CSSProperties
}

/** Props transient internas (styled-components) — nunca API pública. */
export type MaskedProgressInternalProps = {
  $variant: ProgressVariant
  $indeterminate: boolean
  $size: number
}

export type MaskedProgressProps = MaskedProgressBaseProps &
  Omit<
    HTMLAttributes<HTMLDivElement>,
    keyof MaskedProgressBaseProps | 'style' | 'children' | 'label'
  >
