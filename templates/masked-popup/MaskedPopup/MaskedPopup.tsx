'use client'

import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import { maskedTheme } from '@/styles/MaskedThemes/MaskedThemes'
import { resolveColorTheme } from '@/styles/MaskedThemes/ColorThemes'
import { PopupOverlay, PopupPanel } from './MaskedPopup.styles'
import { MaskedPopupProps } from './MaskedPopup.types'
import { readableTextOn } from '@/utils/masked-utils'

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'

/* duração máxima das transições de saída (pop 0.45s) + margem */
const EXIT_MS = 500

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
   * visible: mantém o painel montado durante a animação de saída.
   * panelOpen: estado interno que abre via rAF — garante um frame
   * "fechado" pintado antes de abrir (primeira abertura anima do
   * ponto certo, sem voar de outro lugar).
   */
  const [visible, setVisible] = useState(isOpen)
  const [panelOpen, setPanelOpen] = useState(isOpen)

  /* Ajuste de estado durante o render (padrão oficial do React, sem efeito):
     - abrir: visible liga na hora (painel monta já no frame de abertura)
     - fechar: panelOpen desliga na hora (inicia a animação de saída) */
  if (isOpen && !visible) setVisible(true)
  if (!isOpen && panelOpen) setPanelOpen(false)

  useEffect(() => {
    if (isOpen) {
      /* rAF: garante um frame "fechado" pintado antes de abrir —
         primeira abertura anima do ponto certo, sem voar */
      const raf = requestAnimationFrame(() => setPanelOpen(true))
      return () => cancelAnimationFrame(raf)
    }
    /* desmonta só depois da animação de saída (callback assíncrono: permitido) */
    const t = window.setTimeout(() => setVisible(false), EXIT_MS)
    return () => window.clearTimeout(t)
  }, [isOpen])

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true, // client
    () => false // server
  )

  useEffect(() => {
    if (!panelOpen) return

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
  }, [panelOpen, closeOnEscape])

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

  /*
   * Montagem: enquanto isOpen OU visible (saída animando).
   * $instant = !visible: morto -> transition: none (sem "voo" ao
   * trocar transition/primeiro paint). Durante abertura e saída,
   * visible=true -> transição ativa.
   */
  const content = visible ? (
    <>
      <PopupOverlay
        $isOpen={panelOpen}
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
        aria-hidden={!panelOpen}
        inert={!panelOpen}
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
  ) : null

  if (!portal || !mounted) return content
  return createPortal(content, document.body)
}
