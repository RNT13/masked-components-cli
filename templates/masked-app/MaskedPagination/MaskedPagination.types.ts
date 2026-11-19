import type { CSSProperties, HTMLAttributes } from 'react'
import type { ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'
import type { PaginationTokenOverrides } from './paginationTokens'

/** Layout da paginação. Default 'default'. */
export type PaginationVariant = 'default' | 'compact' | 'edges'

/** Props próprias do MaskedPagination (API pública). */
export type MaskedPaginationBaseProps = {
  variant?: PaginationVariant
  /** Total de páginas (>= 1). */
  pageCount: number
  /** Página atual, base 1 (controlado). */
  page?: number
  /** Página inicial, base 1 (não controlado). Default 1. */
  defaultPage?: number
  onChange?: (page: number) => void
  /** Quantas páginas mostrar de cada lado da atual. Default 1. */
  siblingCount?: number
  /**
   * Gera o href de cada página. Com ele, os itens viram links reais (úteis
   * para SEO e abrir em nova aba) usando o `linkComponent` do
   * MaskedConfigProvider; sem ele, são botões.
   */
  hrefBuilder?: (page: number) => string
  /** Rótulo acessível da navegação. Default por locale ("Paginação"/"Pagination"). */
  label?: string
  /** Paleta registrada ou chave da paleta (página atual). */
  colorTheme?: ColorThemeName
  /** Overrides granulares de tokens --mc-pagination-*. */
  tokens?: PaginationTokenOverrides
  className?: string
  style?: CSSProperties
}

/** Props transient internas (styled-components) — nunca API pública. */
export type MaskedPaginationInternalProps = {
  $current?: boolean
}

export type MaskedPaginationProps = MaskedPaginationBaseProps &
  Omit<
    HTMLAttributes<HTMLElement>,
    keyof MaskedPaginationBaseProps | 'style' | 'children' | 'onChange'
  >
