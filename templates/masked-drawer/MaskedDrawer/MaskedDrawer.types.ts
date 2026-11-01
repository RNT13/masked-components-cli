import type { CSSProperties, ReactNode } from 'react'
import type { ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'

export type DrawerSide = 'left' | 'right' | 'top' | 'bottom'
export type DrawerTransition = 'slide' | 'bounce' | 'premium'

export type DrawerBreakpoint = 'mobile' | 'tablet' | 'desktop'

/**
 * Aceita um valor fixo (mesmo tamanho em qualquer tela) ou um objeto por  
 * breakpoint. Breakpoints omitidos herdam do próximo tamanho maior definido:  
 * mobile -> tablet -> desktop.  
 */
export type ResponsiveSize = string | Partial<Record<DrawerBreakpoint, string>>

/** Tokens --mc-drawer-* sobrescrevíveis por instância (além de colorTheme). */
export type DrawerTokens = {
  overlayBg?: string
  panelBg?: string
}

export type MaskedDrawerProps = {
  children: ReactNode
  isOpen: boolean
  onClose: () => void
  side?: DrawerSide
  width?: ResponsiveSize // para left/right
  height?: ResponsiveSize // para top/bottom
  overlay?: boolean
  overlayBlur?: boolean
  transition?: DrawerTransition
  /** default: theme.zIndex.modal (400) */
  zIndex?: number
  /** fecha ao apertar Escape. default: true */
  closeOnEscape?: boolean
  /** trava o scroll do body enquanto aberto. default: true */
  lockScroll?: boolean
  /** renderiza em document.body via portal. default: true */
  portal?: boolean

  /* ---- theming (F.26) ---- */
  colorTheme?: ColorThemeName
  tokens?: DrawerTokens
  className?: string
  style?: CSSProperties
}

export const DRAWER_WIDTH_PRESETS = {
  narrow: { mobile: '100%', tablet: '60%', desktop: '380px' },
  medium: { mobile: '100%', tablet: '75%', desktop: '50%' },
  wide: { mobile: '100%', tablet: '85%', desktop: '70%' }
} as const satisfies Record<string, ResponsiveSize>
