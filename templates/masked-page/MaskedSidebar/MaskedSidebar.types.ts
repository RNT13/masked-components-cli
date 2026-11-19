import type { CSSProperties, ElementType, HTMLAttributes, ReactNode } from 'react'
import type { ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'
import type { SidebarTokenOverrides } from './sidebarTokens'

/** Aparência/posicionamento da sidebar. Default 'fixed'. */
export type SidebarVariant = 'fixed' | 'inline' | 'floating' | 'minimal'

export type SidebarItem = {
  /** Identificador estável (usado em activeId/onActiveChange). */
  id: string
  label: string
  icon?: ReactNode
  /** Com href o item é um link (usa o linkComponent do MaskedConfigProvider); sem href, um botão. */
  href?: string
  onClick?: () => void
  /** Selo à direita (contador, "novo"). Escondido quando recolhida. */
  badge?: ReactNode
  disabled?: boolean
}

/** Props próprias do MaskedSidebar (API pública). */
export type MaskedSidebarBaseProps = {
  /** Elemento renderizado (polimorfismo). Default 'aside'. */
  as?: ElementType
  variant?: SidebarVariant
  items: SidebarItem[]
  /** Item ativo (controlado). Sem ele, a sidebar guarda o ativo internamente. */
  activeId?: string
  defaultActiveId?: string
  onActiveChange?: (id: string) => void
  /** Estado recolhido (controlado). */
  collapsed?: boolean
  defaultCollapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
  /** Mostra o botão de recolher/expandir. Default true. */
  collapsible?: boolean
  /** Largura expandida (CSS). Default '260px'. */
  width?: string
  /** Largura recolhida (CSS). Default '72px'. */
  collapsedWidth?: string
  /** Slot no topo (logo, seletor de workspace). */
  header?: ReactNode
  /** Slot no rodapé (perfil, ajuda). */
  footer?: ReactNode
  /**
   * Habilita o modo mobile: quando definido, a sidebar some abaixo do
   * breakpoint tablet e seu conteúdo abre num MaskedDrawer controlado por
   * esta prop. Sem ela, a sidebar fica sempre visível.
   */
  mobileOpen?: boolean
  /** Chamado ao fechar o drawer mobile (Esc, overlay ou ao escolher um item). */
  onMobileClose?: () => void
  /** Rótulo acessível da navegação. Default por locale ("Navegação lateral"/"Sidebar"). */
  navLabel?: string
  /** Paleta registrada ou chave da paleta; pinta o fundo com texto por contraste. */
  colorTheme?: ColorThemeName
  /** Overrides granulares de tokens --mc-sidebar-*. */
  tokens?: SidebarTokenOverrides
  className?: string
  style?: CSSProperties
}

/** Props transient internas (styled-components) — nunca API pública. */
export type MaskedSidebarInternalProps = {
  $variant: SidebarVariant
  $collapsed: boolean
  $hideOnMobile: boolean
}

export type MaskedSidebarProps = MaskedSidebarBaseProps &
  Omit<HTMLAttributes<HTMLElement>, keyof MaskedSidebarBaseProps | 'style' | 'children'>
