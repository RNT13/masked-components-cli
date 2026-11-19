import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'
import type { BreadcrumbTokenOverrides } from './breadcrumbTokens'

/** Densidade da trilha. Default 'default'. */
export type BreadcrumbVariant = 'default' | 'compact'

export type BreadcrumbItem = {
  label: ReactNode
  /** Sem href (ou o último item), vira texto da página atual. */
  href?: string
}

/** Props próprias do MaskedBreadcrumb (API pública). */
export type MaskedBreadcrumbBaseProps = {
  variant?: BreadcrumbVariant
  items: BreadcrumbItem[]
  /** Separador entre itens (decorativo, aria-hidden). Default '/'. */
  separator?: ReactNode
  /**
   * Máximo de itens visíveis. Acima disso os itens do meio viram "…".
   * Default: sem limite ('compact' usa 3).
   */
  maxItems?: number
  /** Rótulo acessível da navegação. Default por locale ("Trilha de navegação"/"Breadcrumb"). */
  label?: string
  /** Overrides granulares de tokens --mc-breadcrumb-*. */
  tokens?: BreadcrumbTokenOverrides
  className?: string
  style?: CSSProperties
}

export type MaskedBreadcrumbProps = MaskedBreadcrumbBaseProps &
  Omit<HTMLAttributes<HTMLElement>, keyof MaskedBreadcrumbBaseProps | 'style' | 'children'>
