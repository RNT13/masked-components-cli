'use client'

import { PopupOverlay, PopupPanel } from './MaskedPopup.styles'
import { MaskedPopupProps } from './MaskedPopup.types'

export function MaskedPopup({
  children,
  isOpen,
  onClose,
  width = '90vw',
  maxWidth = '480px',
  overlayBlur = false,
  transition = 'pop',
  zIndex = 300
}: MaskedPopupProps) {
  return (
    <>
      <PopupOverlay $isOpen={isOpen} $blur={overlayBlur} $zIndex={zIndex} onClick={onClose} />
      <PopupPanel $isOpen={isOpen} $width={width} $maxWidth={maxWidth} $transition={transition} $zIndex={zIndex}>
        {children}
      </PopupPanel>
    </>
  )
}
