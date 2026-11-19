import type { CSSProperties, ElementType, HTMLAttributes, ReactNode } from 'react'
import type { ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'
import type { PageHeaderTokenOverrides } from './pageHeaderTokens'

/** Aparência do cabeçalho de página. Default 'simple'. */
export type PageHeaderVariant = 'simple' | 'banner' | 'gradient'

/** Props próprias do MaskedPageHeader (API pública). */
export type MaskedPageHeaderBaseProps = {
  /** Elemento renderizado (polimorfismo). Default 'header'. */
  as?: ElementType
  variant?: PageHeaderVariant
  /** Título da página. */
  title: ReactNode
  /** Nível do heading do título (1 ou 2). Default 1. */
  headingLevel?: 1 | 2
  description?: ReactNode
  /** Slot de breadcrumbs (ex.: <nav aria-label="Breadcrumb">…). */
  breadcrumbs?: ReactNode
  /** Slot de ações (botões) alinhado à direita. */
  actions?: ReactNode
  /** Paleta registrada ou chave da paleta (banner/gradient). */
  colorTheme?: ColorThemeName
  /** Overrides granulares de tokens --mc-page-header-*. */
  tokens?: PageHeaderTokenOverrides
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

/** Props transient internas (styled-components) — nunca API pública. */
export type MaskedPageHeaderInternalProps = {
  $variant: PageHeaderVariant
}

export type MaskedPageHeaderProps = MaskedPageHeaderBaseProps &
  Omit<HTMLAttributes<HTMLElement>, keyof MaskedPageHeaderBaseProps | 'style' | 'title'>
