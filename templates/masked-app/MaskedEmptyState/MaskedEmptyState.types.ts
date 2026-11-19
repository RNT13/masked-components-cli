import type { CSSProperties, ElementType, HTMLAttributes, ReactNode } from 'react'
import type { ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'
import type { EmptyStateTokenOverrides } from './emptyStateTokens'

/** Situação do estado vazio. Default 'default'. */
export type EmptyStateVariant = 'default' | 'compact' | 'error' | 'search'

/** Props próprias do MaskedEmptyState (API pública). */
export type MaskedEmptyStateBaseProps = {
  /** Elemento renderizado (polimorfismo). Default 'div'. */
  as?: ElementType
  variant?: EmptyStateVariant
  /** Ilustração/ícone (decorativo — fica aria-hidden). */
  icon?: ReactNode
  title: ReactNode
  /** Nível do heading do título (2 a 4). Default 3. */
  headingLevel?: 2 | 3 | 4
  description?: ReactNode
  /** Slot de ação (botão, link). */
  action?: ReactNode
  /** Paleta registrada ou chave da paleta (cor do ícone). */
  colorTheme?: ColorThemeName
  /** Overrides granulares de tokens --mc-empty-state-*. */
  tokens?: EmptyStateTokenOverrides
  className?: string
  style?: CSSProperties
}

/** Props transient internas (styled-components) — nunca API pública. */
export type MaskedEmptyStateInternalProps = {
  $variant: EmptyStateVariant
}

export type MaskedEmptyStateProps = MaskedEmptyStateBaseProps &
  Omit<
    HTMLAttributes<HTMLElement>,
    keyof MaskedEmptyStateBaseProps | 'style' | 'title' | 'children'
  >
