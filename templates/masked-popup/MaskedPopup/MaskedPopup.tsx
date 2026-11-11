'use client'

import { useEffect, useRef, useSyncExternalStore, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import { maskedTheme } from '@/styles/MaskedThemes/MaskedThemes'
import { resolveColorTheme } from '@/styles/MaskedThemes/ColorThemes'
import { PopupOverlay, PopupPanel } from './MaskedPopup.styles'
import { MaskedPopupProps } from './MaskedPopup.types'
import { readableTextOn } from '@/utils/masked-utils'

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'

export function MaskedPopup({
  children,
  isOpen,
  onClose,
  width = '90vw',
  maxWidth = '480px',
  overlayBlur = false,
  transition = 'pop',
  zIndex = maskedTheme.zIndex.popover,
  closeOnOverlay = true,
  closeOnEscape = true,
  lockScroll = true,
  portal = true,
  colorTheme,
  tokens,
  className,
  style
}: MaskedPopupProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  const mounted = useSyncExternalStore(
    () => () => { },
    () => true,      // client
    () => false      // server
  )

  useEffect(() => {
    if (!isOpen) return

    const panel = panelRef.current
    const prevActive = document.activeElement as HTMLElement | null
    panel?.querySelector<HTMLElement>(FOCUSABLE)?.focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnEscape) {
        onClose()
        return
      }
      if (e.key !== 'Tab' || !panel) return

      const items = [...panel.querySelectorAll<HTMLElement>(FOCUSABLE)]
      if (items.length === 0) {
        e.preventDefault()
        return
      }
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      prevActive?.focus?.()
    }
  }, [isOpen, closeOnEscape, onClose])

  useEffect(() => {
    if (!isOpen || !lockScroll) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [isOpen, lockScroll])

  const themeVars = resolveColorTheme(colorTheme, maskedTheme)

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
      <PopupOverlay
        $isOpen={isOpen}
        $blur={overlayBlur}
        $zIndex={zIndex}
        onClick={closeOnOverlay ? onClose : undefined}
      />
      <PopupPanel
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        $isOpen={isOpen}
        $width={width}
        $maxWidth={maxWidth}
        $transition={transition}
        $zIndex={zIndex}
        className={className}
        style={{ ...vars, ...style }}
      >
        {children}
      </PopupPanel>
    </>
  )

  if (!portal || !mounted) return content
  return createPortal(content, document.body)
}
