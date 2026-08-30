export type DrawerSide = 'left' | 'right' | 'top' | 'bottom'
export type DrawerTransition = 'slide' | 'bounce' | 'premium'

export type DrawerBreakpoint = 'mobile' | 'tablet' | 'desktop'

/**
 * Aceita um valor fixo (comportamento antigo — mesmo tamanho em qualquer
 * tela, 100% retrocompatível) ou um objeto por breakpoint.
 *
 * Breakpoints omitidos herdam do próximo tamanho maior definido:
 * mobile -> tablet -> desktop. Ou seja, se você só definir `desktop`,
 * mobile e tablet usam o mesmo valor (nada muda de comportamento hoje).
 * Se você definir `tablet` mas não `mobile`, o mobile usa o valor do tablet.
 */
export type ResponsiveSize = string | Partial<Record<DrawerBreakpoint, string>>

export type MaskedDrawerProps = {
  children: React.ReactNode
  isOpen: boolean
  onClose: () => void
  side?: DrawerSide
  width?: ResponsiveSize // para left/right
  height?: ResponsiveSize // para top/bottom
  overlay?: boolean
  overlayBlur?: boolean
  transition?: DrawerTransition
  zIndex?: number
}

/**
 * Preset pronto pra o caso mais comum: painel lateral que ocupa a tela
 * inteira no celular, quase inteira no tablet, e uma fração no desktop.
 * Uso: <MaskedDrawer width={DRAWER_WIDTH_PRESETS.wide} ... />
 */
export const DRAWER_WIDTH_PRESETS = {
  narrow: { mobile: '100%', tablet: '60%', desktop: '380px' },
  medium: { mobile: '100%', tablet: '75%', desktop: '50%' },
  wide: { mobile: '100%', tablet: '85%', desktop: '70%' }
} as const satisfies Record<string, ResponsiveSize>
