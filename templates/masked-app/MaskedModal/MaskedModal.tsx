'use client'

import { useId, useRef, type KeyboardEvent } from 'react'
import { useMaskedTheme } from '@/styles/useMaskedTheme'
import { useMaskedConfig } from '@/components/ui/MaskedConfigProvider'
import { useFocusTrap } from '@/hooks/masked-primitives/useFocusTrap'
import { useLockBodyScroll } from '@/hooks/masked-primitives/useLockBodyScroll'
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

/* focáveis visíveis: ignora elementos ocultos (display:none etc.) */
const visibleOnly = (el: HTMLElement) => el.offsetParent !== null || el === document.activeElement

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
  const titleId = useId()
  const descId = useId()

  /* foco: entra no painel ao abrir, trap em Tab, retorna ao fechar */
  useFocusTrap(panelRef, open, { filter: visibleOnly })

  /* scroll lock */
  useLockBodyScroll(open)

  if (!open) return null

  const tokenStyle = resolveModalTokens({ colorTheme, tokens }, theme)

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    /* Escape fica no painel: stopPropagation impede overlays pais de fechar junto */
    if (event.key === 'Escape' && closeOnEscape) {
      event.stopPropagation()
      onClose()
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
