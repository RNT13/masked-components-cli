'use client'

import { DrawerOverlay, DrawerPanel } from './MaskedDrawer.styles'
import { MaskedDrawerProps } from './MaskedDrawer.types'

export function MaskedDrawer({
  children,
  isOpen,
  onClose,
  side = 'left',
  width = '280px',
  height = '60vh',
  overlay = true,
  overlayBlur = false,
  transition = 'slide',
  zIndex = 200
}: MaskedDrawerProps) {
  const isHorizontal = side === 'left' || side === 'right'
  const size = isHorizontal ? width : height
  const fallback = isHorizontal ? '280px' : '60vh'

  return (
    <>
      {overlay && <DrawerOverlay $isOpen={isOpen} $blur={overlayBlur} $zIndex={zIndex} onClick={onClose} />}
      <DrawerPanel $side={side} $isOpen={isOpen} $size={size} $fallback={fallback} $transition={transition} $zIndex={zIndex}>
        {children}
      </DrawerPanel>
    </>
  )
}
