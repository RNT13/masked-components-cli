'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useMaskedTheme } from '@/styles/useMaskedTheme'
import { resolveColorTheme } from '@/styles/MaskedThemes/ColorThemes'
import { readableTextOn } from '@/utils/masked-utils'
import { useEscapeKey } from '@/hooks/masked-primitives/useEscapeKey'
import { useFocusTrap } from '@/hooks/masked-primitives/useFocusTrap'
import { useLockBodyScroll } from '@/hooks/masked-primitives/useLockBodyScroll'
import { Portal } from '@/hooks/masked-primitives/Portal'
import { PopupOverlay, PopupPanel } from './MaskedPopup.styles'
import { MaskedPopupProps } from './MaskedPopup.types'

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
  zIndex,
  closeOnOverlay = true,
  closeOnEscape = true,
  ariaLabel,
  ariaLabelledBy,
  lockScroll = true,
  portal = true,
  colorTheme,
  tokens,
  className,
  style
}: MaskedPopupProps) {
  const theme = useMaskedTheme()
  const resolvedZIndex = zIndex ?? theme.zIndex.popover
  const panelRef = useRef<HTMLDivElement>(null)

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

  /* Escape + focus trap acompanham panelOpen (painel visível) */
  useEscapeKey(panelOpen && closeOnEscape, onClose)
  useFocusTrap(panelRef, panelOpen)
  useLockBodyScroll(isOpen && lockScroll)

  const themeVars = resolveColorTheme(colorTheme, theme)

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
        $zIndex={resolvedZIndex}
        style={vars}
        aria-hidden="true"
        onClick={closeOnOverlay ? onClose : undefined}
      />
      <PopupPanel
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-hidden={!panelOpen}
        inert={!panelOpen}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        $isOpen={panelOpen}
        $instant={!visible}
        $width={width}
        $maxWidth={maxWidth}
        $transition={transition}
        $zIndex={resolvedZIndex}
        className={className}
        style={{ ...vars, ...style }}
      >
        {children}
      </PopupPanel>
    </>
  ) : null

  return <Portal enabled={portal}>{content}</Portal>
}
