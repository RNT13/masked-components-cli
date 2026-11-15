'use client'

import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'

import { maskedTheme } from '@/styles/MaskedThemes/MaskedThemes'
import { resolveColorTheme } from '@/styles/MaskedThemes/ColorThemes'
import { readableTextOn } from '@/utils/masked-utils'

import { PopupOverlay, PopupPanel } from './MaskedPopup.styles'
import type { MaskedPopupProps } from './MaskedPopup.types'

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'

const EXIT_MS = 600

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

  /* onClose via ref: trocar a callback não re-executa o efeito de foco */
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  /*
   * Mantém o painel visível durante a animação de saída.
   * Após EXIT_MS, o painel entra no estado morto, sem transição.
   */
  const [hasExited, setHasExited] = useState(!isOpen)
  const visible = isOpen || !hasExited

  /*
   * Estado visual independente:
   * permite preparar o painel fechado antes de iniciar a animação.
   */
  const [panelOpen, setPanelOpen] = useState(isOpen)

  useEffect(() => {
    let rafId: number | undefined
    let timeoutId: number | undefined

    if (isOpen) {
      rafId = window.requestAnimationFrame(() => {
        setPanelOpen(true)
      })
    } else {
      rafId = window.requestAnimationFrame(() => {
        setPanelOpen(false)
      })

      timeoutId = window.setTimeout(() => {
        setHasExited(true)
      }, EXIT_MS)
    }

    return () => {
      if (rafId !== undefined) {
        window.cancelAnimationFrame(rafId)
      }

      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId)
      }
    }
  }, [isOpen])

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true, // client
    () => false // server
  )

  // Escape + focus inicial + focus trap
  useEffect(() => {
    if (!isOpen || !panelOpen) return

    const panel = panelRef.current
    const prevActive = document.activeElement as HTMLElement | null

    panel?.querySelector<HTMLElement>(FOCUSABLE)?.focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnEscape) {
        onCloseRef.current()
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
  }, [isOpen, panelOpen, closeOnEscape])

  // Scroll lock
  useEffect(() => {
    if (!isOpen || !lockScroll) return

    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = prev
    }
  }, [isOpen, lockScroll])

  const themeVars = resolveColorTheme(colorTheme, maskedTheme)

  /* prefixo --mc-popup-* (o styles lê --mc-popup-*); aplicado no overlay E no painel */
  const vars = {
    ...(themeVars?.base
      ? {
          '--mc-popup-panel-bg': themeVars.base,
          '--mc-popup-panel-fg': themeVars.onBase ?? readableTextOn(themeVars.base)
        }
      : {}),
    ...(tokens?.overlayBg ? { '--mc-popup-overlay-bg': tokens.overlayBg } : {}),
    ...(tokens?.panelBg ? { '--mc-popup-panel-bg': tokens.panelBg } : {})
  } as CSSProperties

  const content = (
    <>
      <PopupOverlay
        $isOpen={isOpen}
        $blur={overlayBlur}
        $zIndex={zIndex}
        style={vars}
        aria-hidden="true"
        onClick={closeOnOverlay ? () => onCloseRef.current() : undefined}
      />

      <PopupPanel
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-hidden={!isOpen}
        inert={!isOpen}
        $isOpen={panelOpen}
        $instant={!visible}
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
