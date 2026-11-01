import type { CSSProperties, ReactNode } from 'react'
import type { ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'

export type PopupTransition = 'pop' | 'fade' | 'slide-up' | 'blur'

export type PopupTokens = {
  overlayBg?: string
  panelBg?: string
}

export type MaskedPopupProps = {
  children: ReactNode
  isOpen: boolean
  onClose: () => void
  width?: string
  maxWidth?: string
  overlayBlur?: boolean
  transition?: PopupTransition
  /** default: theme.zIndex.popover (500) */
  zIndex?: number
  /** fecha clicando no overlay. default: true */
  closeOnOverlay?: boolean
  /** fecha ao apertar Escape. default: true */
  closeOnEscape?: boolean
  /** trava o scroll do body enquanto aberto. default: true */
  lockScroll?: boolean
  /** renderiza em document.body via portal. default: true */
  portal?: boolean

  /* ---- theming (F.26) ---- */
  colorTheme?: ColorThemeName
  tokens?: PopupTokens
  className?: string
  style?: CSSProperties
}
