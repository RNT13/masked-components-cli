import type { CSSProperties, ElementType, HTMLAttributes, ReactNode } from 'react'
import type { DefaultTheme } from 'styled-components'
import type { GridTokenOverrides } from './gridTokens'

/** Motores de grid do MaskedGrid. Default 'equal'. */
export type GridVariant = 'equal' | 'auto' | 'feature' | 'sidebar'

/** Chave da escala oficial de espaçamento do tema (theme.spacing: 2xs..5xl). */
export type SpacingKey = Extract<keyof DefaultTheme['spacing'], string>

/** Breakpoints aceitos nas colunas responsivas (mesmos nomes do tema). */
export type GridBreakpoint = 'mobile' | 'tablet' | 'desktop'

/**
 * Colunas por breakpoint: número fixo (responsivo por padrão — desktop n,
 * tablet min(n, 2), mobile 1) ou mapa parcial por breakpoint.
 */
export type GridCols = number | Partial<Record<GridBreakpoint, number>>

/** Props próprias do MaskedGrid (API pública). */
export type MaskedGridBaseProps = {
  /** Elemento renderizado (polimorfismo). Default 'div'. */
  as?: ElementType
  variant?: GridVariant
  /** Colunas do variant 'equal' (default 3, responsivo por padrão). */
  cols?: GridCols
  /** Largura mínima do filho no variant 'auto' (default '240px'). */
  minChildWidth?: string
  /** Gap entre células: chave de theme.spacing (2xs..5xl), número (px) ou valor CSS. */
  gap?: SpacingKey | number | (string & {})
  /** Largura da coluna do variant 'sidebar' (default '240px', colapsa no tablet). */
  sidebarWidth?: string
  /** Overrides granulares de tokens --mc-grid-*. */
  tokens?: GridTokenOverrides
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

/** Props transient internas (styled-components) — nunca API pública. */
export type MaskedGridInternalProps = {
  $variant?: GridVariant
}

export type MaskedGridProps = MaskedGridBaseProps &
  Omit<HTMLAttributes<HTMLElement>, keyof MaskedGridBaseProps | 'style'>
