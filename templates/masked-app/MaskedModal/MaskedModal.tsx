'use client'

import { useEffect, useId, useRef, type KeyboardEvent } from 'react'
import { useMaskedTheme } from '@/styles/useMaskedTheme'
import { useMaskedConfig } from '@/components/ui/MaskedConfigProvider'
import {
  ModalBody,
  ModalCloseButton,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalPanel,
  ModalTitle
} from './MaskedModal.styles'
import { resolveModalTokens } from './modalTokens'
import type { MaskedModalProps } from './MaskedModal.types'

const DICT = {
  pt: { close: 'Fechar', dialog: 'Diálogo' },
  en: { close: 'Close', dialog: 'Dialog' }
} as const

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Diálogo modal acessível (padrão WAI-ARIA dialog).  
 *
 * `role="dialog"` + `aria-modal="true"`; título e descrição ligados por  
 * `aria-labelledby`/`aria-describedby`. O foco entra no painel ao abrir,  
 * fica preso (Tab/Shift+Tab ciclam entre os focáveis) e retorna ao elemento  
 * anterior ao fechar. Escape e clique no overlay pedem fechamento via  
 * `onClose` (desligáveis). O scroll do body é bloqueado enquanto aberto.  
 *
 * Renderiza `null` quando `open` é falso — sem portal, o overlay é `fixed`.  
 */
export function MaskedModal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  closeOnOverlay = true,
  closeOnEscape = true,
  showClose = true,
  colorTheme,
  tokens,
  className,
  style,
  ...rest
}: MaskedModalProps) {
  const theme = useMaskedTheme()
  const config = useMaskedConfig()
  const dict = DICT[(config.locale ?? 'pt-BR').toLowerCase().startsWith('en') ? 'en' : 'pt']

  const panelRef = useRef<HTMLDivElement>(null)
  const previousFocus = useRef<Element | null>(null)
  const titleId = useId()
  const descId = useId()

  /* foco: entra no painel ao abrir, retorna ao fechar */
  useEffect(() => {
    if (!open) return
    previousFocus.current = document.activeElement
    const panel = panelRef.current
    const first = panel?.querySelector<HTMLElement>(FOCUSABLE)
    ;(first ?? panel)?.focus()
    return () => {
      ;(previousFocus.current as HTMLElement | null)?.focus?.()
    }
  }, [open])

  /* scroll lock */
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  if (!open) return null

  const tokenStyle = resolveModalTokens({ colorTheme, tokens }, theme)

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape' && closeOnEscape) {
      event.stopPropagation()
      onClose()
      return
    }
    if (event.key !== 'Tab') return

    /* focus trap */
    const panel = panelRef.current
    if (!panel) return
    const focusables = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (el) => el.offsetParent !== null || el === document.activeElement
    )
    if (focusables.length === 0) {
      event.preventDefault()
      panel.focus()
      return
    }
    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    const active = document.activeElement as HTMLElement | null

    if (event.shiftKey && (active === first || active === panel)) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && active === last) {
      event.preventDefault()
      first.focus()
    }
  }

  return (
    <ModalOverlay
      data-masked-modal-overlay=""
      onMouseDown={(event) => {
        if (closeOnOverlay && event.target === event.currentTarget) onClose()
      }}
    >
      <ModalPanel
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-label={title ? undefined : dict.dialog}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        $size={size}
        className={className}
        style={{ ...tokenStyle, ...style }}
        onKeyDown={onKeyDown}
        {...rest}
      >
        {(title || showClose) && (
          <ModalHeader>
            <div>
              {title && <ModalTitle id={titleId}>{title}</ModalTitle>}
              {description && <ModalDescription id={descId}>{description}</ModalDescription>}
            </div>
            {showClose && (
              <ModalCloseButton type="button" aria-label={dict.close} onClick={onClose}>
                ×
              </ModalCloseButton>
            )}
          </ModalHeader>
        )}
        <ModalBody>{children}</ModalBody>
        {footer && <ModalFooter>{footer}</ModalFooter>}
      </ModalPanel>
    </ModalOverlay>
  )
}
