import type { CSSProperties, ReactNode } from 'react'
import type { TooltipTokenOverrides } from './tooltipTokens'

/** Aparência do tooltip. Default 'dark'. */
export type TooltipVariant = 'dark' | 'light'

export type TooltipSide = 'top' | 'bottom' | 'left' | 'right'

/** Props próprias do MaskedTooltip (API pública). */
export type MaskedTooltipBaseProps = {
  /** Conteúdo do tooltip (texto curto, sem elementos interativos). */
  content: ReactNode
  variant?: TooltipVariant
  /** Lado preferido. Default 'top'. */
  side?: TooltipSide
  /** Atraso (ms) antes de abrir ao passar o mouse ou focar. Default 150. */
  delay?: number
  /** Desativa o tooltip (renderiza só o filho). */
  disabled?: boolean
  /** Overrides granulares de tokens --mc-tooltip-*. */
  tokens?: TooltipTokenOverrides
  className?: string
  style?: CSSProperties
  /** O elemento que dispara o tooltip (idealmente focável: botão, link, ícone com botão). */
  children: ReactNode
}

/** Props transient internas (styled-components) — nunca API pública. */
export type MaskedTooltipInternalProps = {
  $side: TooltipSide
  $variant: TooltipVariant
}

export type MaskedTooltipProps = MaskedTooltipBaseProps
