export type PopupTransition = 'pop' | 'fade' | 'slide-up' | 'blur'

export type MaskedPopupProps = {
  children: React.ReactNode
  isOpen: boolean
  onClose: () => void
  width?: string
  maxWidth?: string
  overlayBlur?: boolean
  transition?: PopupTransition
  zIndex?: number
}
