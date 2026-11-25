'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'

import { useMaskedTheme } from '@/styles/useMaskedTheme'
import { resolveColorTheme } from '@/styles/MaskedThemes/ColorThemes'
import { readableTextOn } from '@/utils/masked-utils'
import { useEscapeKey } from '@/hooks/masked-primitives/useEscapeKey'
import { useFocusTrap } from '@/hooks/masked-primitives/useFocusTrap'
import { useLockBodyScroll } from '@/hooks/masked-primitives/useLockBodyScroll'
import { Portal } from '@/hooks/masked-primitives/Portal'

import { DrawerOverlay, DrawerPanel } from './MaskedDrawer.styles'
import type { MaskedDrawerProps, DrawerSide } from './MaskedDrawer.types'

const EXIT_MS = 600

export function MaskedDrawer({
  children,
  isOpen,
  onClose,
  side = 'left',
  width = '280px',
  height = '60dvh',
  overlay = true,
  overlayBlur = false,
  transition = 'slide',
  zIndex,
  closeOnEscape = true,
  ariaLabel,
  ariaLabelledBy,
  lockScroll = true,
  portal = true,
  colorTheme,
  tokens,
  className,
  style
}: MaskedDrawerProps) {
  const theme = useMaskedTheme()
  const resolvedZIndex = zIndex ?? theme.zIndex.modal
  const panelRef = useRef<HTMLDivElement>(null)

  /*
   * Mantém o painel visível durante a animação de saída.
   * Após EXIT_MS, o painel entra no estado morto, sem transição.
   */
  const [visibility, setVisibility] = useState({ isOpen, visible: isOpen })

  if (visibility.isOpen !== isOpen) {
    setVisibility({ isOpen, visible: isOpen || visibility.visible })
  }

  const { visible } = visibility

  useEffect(() => {
    if (isOpen) return

    const timeout = window.setTimeout(() => {
      setVisibility((current) => ({ ...current, visible: false }))
    }, EXIT_MS)

    return () => {
      window.clearTimeout(timeout)
    }
  }, [isOpen])

  /*
   * Lado exibido + abertura interna:
   * quando `side` muda, o painel primeiro remonta FECHADO no lado novo
   * e só então abre. Dois rAFs garantem um frame fechado pintado.
   */
  const [shownSide, setShownSide] = useState<DrawerSide>(side)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      const raf = requestAnimationFrame(() => {
        setOpen(false)

        if (side !== shownSide) {
          setShownSide(side)
        }
      })

      return () => cancelAnimationFrame(raf)
    }

    if (side !== shownSide) {
      const raf = requestAnimationFrame(() => {
        setShownSide(side)
        setOpen(false)
      })

      return () => cancelAnimationFrame(raf)
    }

    const raf = requestAnimationFrame(() => setOpen(true))

    return () => cancelAnimationFrame(raf)
  }, [isOpen, side, shownSide])

  // Escape acompanha o estado semântico, sem esperar o rAF de abertura.
  useEscapeKey(isOpen && closeOnEscape, onClose)

  // Focus trap: o painel precisa estar visível.
  useFocusTrap(panelRef, open)

  // Scroll lock
  useLockBodyScroll(open && lockScroll)

  const isHorizontal = shownSide === 'left' || shownSide === 'right'
  const size = isHorizontal ? width : height
  const fallback = isHorizontal ? '280px' : '60dvh'

  const themeVars = resolveColorTheme(colorTheme, theme)

  const vars = {
    ...(themeVars?.base
      ? {
          '--mc-drawer-panel-bg': themeVars.base,
          '--mc-drawer-panel-fg': themeVars.onBase ?? readableTextOn(themeVars.base)
        }
      : {}),
    ...(tokens?.overlayBg ? { '--mc-drawer-overlay-bg': tokens.overlayBg } : {}),
    ...(tokens?.panelBg ? { '--mc-drawer-panel-bg': tokens.panelBg } : {})
  } as CSSProperties

  const content = (
    <>
      {overlay && (
        <DrawerOverlay
          $isOpen={open}
          $blur={overlayBlur}
          $zIndex={resolvedZIndex}
          style={vars}
          aria-hidden="true"
          onClick={onClose}
        />
      )}

      <DrawerPanel
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
        inert={!open}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        $side={shownSide}
        $isOpen={open}
        $size={size}
        $fallback={fallback}
        $transition={transition}
        $zIndex={resolvedZIndex}
        className={className}
        style={{ ...vars, ...style, ...(!visible ? { transition: 'none' } : {}) }}
      >
        {children}
      </DrawerPanel>
    </>
  )

  return <Portal enabled={portal}>{content}</Portal>
}
