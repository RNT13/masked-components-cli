import type { CSSProperties, ElementType, HTMLAttributes, ReactNode } from 'react'
import type { ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'
import type { SidebarItem } from '@/components/ui/MaskedSidebar/MaskedSidebar.types'
import type { DashboardTokenOverrides } from './dashboardTokens'

/**
 * Estilo do painel. Default 'analytics'.
 * - 'analytics': sidebar fixa, cabeçalho de página simples e área de conteúdo levemente tingida;
 * - 'saas': sidebar flutuante (cartão) e cabeçalho de página em destaque;
 * - 'minimal': sidebar sem fundo e conteúdo limpo.
 */
export type DashboardVariant = 'analytics' | 'saas' | 'minimal'

/** Largura da área de conteúdo. Default 'wide'. */
export type DashboardContentWidth = 'default' | 'wide' | 'full'

/** Props próprias do MaskedDashboard (API pública). */
export type MaskedDashboardBaseProps = {
  /** Elemento raiz (polimorfismo). Default 'div'. */
  as?: ElementType
  variant?: DashboardVariant
  /** Marca/logo: aparece no topo da sidebar (e na barra superior no mobile). */
  brand?: ReactNode
  /** Itens de navegação da sidebar. */
  navItems: SidebarItem[]
  activeId?: string
  defaultActiveId?: string
  onActiveChange?: (id: string) => void
  /** Slot no rodapé da sidebar (perfil, ajuda). */
  sidebarFooter?: ReactNode
  /** Slot à direita da barra superior (busca, notificações, avatar). */
  topbar?: ReactNode
  /** Título da página. Sem ele, o cabeçalho de página não é renderizado. */
  title?: ReactNode
  description?: ReactNode
  /** Slot de breadcrumbs acima do título. */
  breadcrumbs?: ReactNode
  /** Slot de ações (botões) ao lado do título. */
  actions?: ReactNode
  contentWidth?: DashboardContentWidth
  /** Texto do link "pular para o conteúdo". Default por locale. */
  skipLinkLabel?: string
  /** Paleta registrada ou chave da paleta (barra superior, cabeçalho de página e sidebar). */
  colorTheme?: ColorThemeName
  /** Overrides granulares de tokens --mc-dashboard-*. */
  tokens?: DashboardTokenOverrides
  className?: string
  style?: CSSProperties
  /** Widgets: monte-os com MaskedGrid, MaskedDiv, MaskedTable etc. */
  children?: ReactNode
}

/** Props transient internas (styled-components) — nunca API pública. */
export type MaskedDashboardInternalProps = {
  $variant: DashboardVariant
  $width: DashboardContentWidth
}

export type MaskedDashboardProps = MaskedDashboardBaseProps &
  Omit<HTMLAttributes<HTMLElement>, keyof MaskedDashboardBaseProps | 'style' | 'title'>
