import { useEffect, type RefObject } from 'react'

export const FOCUSABLE_SELECTOR =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'

export interface UseFocusTrapOptions {
  /** Elemento que recebe foco ao ativar. Default: primeiro focável do container. */
  initialFocus?: RefObject<HTMLElement | null>
  /** Devolver foco ao elemento anterior ao desativar. Default: true. */
  restoreFocus?: boolean
}

/**
 * useFocusTrap — prende Tab/Shift+Tab dentro de `containerRef` enquanto `active`.  
 *
 * Consolida as 3 implementações inline (Popup, Drawer, Modal):  
 * - foco inicial no primeiro focável (ou em `initialFocus`);  
 * - Tab no último → primeiro; Shift+Tab no primeiro → último;  
 * - sem focáveis: preventDefault (foco não escapa);  
 * - cleanup devolve o foco ao elemento ativo anterior.  
 */
export function useFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  active: boolean,
  options: UseFocusTrapOptions = {}
): void {
  const { initialFocus, restoreFocus = true } = options

  useEffect(() => {
    if (!active) return

    const container = containerRef.current
    const previousActive = document.activeElement as HTMLElement | null

    const target =
      initialFocus?.current ?? container?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)
    ;(target ?? container)?.focus?.()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || !container) return

      const items = [...container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)]
      if (items.length === 0) {
        event.preventDefault()
        return
      }

      const first = items[0]
      const last = items[items.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      if (restoreFocus) previousActive?.focus?.()
    }
    // initialFocus/restoreFocus são opções de montagem do trap
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef, active])
}
