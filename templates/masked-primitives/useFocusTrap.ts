import { useEffect, type RefObject } from 'react'

export const FOCUSABLE_SELECTOR =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'

export interface UseFocusTrapOptions {
  /** Elemento que recebe foco ao ativar. Default: primeiro focável do container. */
  initialFocus?: RefObject<HTMLElement | null>
  /** Devolver foco ao elemento anterior ao desativar. Default: true. */
  restoreFocus?: boolean
  /** Filtro extra de focáveis (ex.: ignorar elementos ocultos). */
  filter?: (el: HTMLElement) => boolean
}

/**
 * useFocusTrap — prende Tab/Shift+Tab dentro de `containerRef` enquanto `active`.  
 *
 * Consolida as implementações inline de Popup, Drawer e Modal:  
 * - foco inicial no primeiro focável (ou em `initialFocus`);  
 * - Tab no último → primeiro; Shift+Tab no primeiro → último;  
 * - sem focáveis: preventDefault + foco no container;  
 * - cleanup devolve o foco ao elemento ativo anterior.  
 */
export function useFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  active: boolean,
  options: UseFocusTrapOptions = {}
): void {
  const { initialFocus, restoreFocus = true, filter } = options

  useEffect(() => {
    if (!active) return

    const container = containerRef.current
    const previousActive = document.activeElement as HTMLElement | null

    const focusables = () => {
      const all = [...(container?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR) ?? [])]
      return filter ? all.filter(filter) : all
    }

    const target = initialFocus?.current ?? focusables()[0]
    ;(target ?? container)?.focus?.()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || !container) return

      const items = focusables()
      if (items.length === 0) {
        event.preventDefault()
        container.focus?.()
        return
      }

      const first = items[0]
      const last = items[items.length - 1]
      const activeEl = document.activeElement as HTMLElement | null

      if (event.shiftKey && (activeEl === first || activeEl === container)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && activeEl === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      if (restoreFocus) previousActive?.focus?.()
    }
    // initialFocus/restoreFocus/filter são opções de montagem do trap
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef, active])
}
