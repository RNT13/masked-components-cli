import { useEffect, useRef, type RefObject } from 'react'

/**
 * useClickOutside — chama `handler` em pointerdown fora de `refs`.  
 *
 * Aceita uma ref ou lista de refs (ex.: trigger + popup). Usa pointerdown  
 * (não click) para fechar antes de qualquer onClick interno disparar —  
 * mesmo padrão do MaskedDropdownMenu.  
 */
export function useClickOutside(
  refs: RefObject<HTMLElement | null> | Array<RefObject<HTMLElement | null>>,
  active: boolean,
  handler: (event: PointerEvent) => void
): void {
  const handlerRef = useRef(handler)

  useEffect(() => {
    handlerRef.current = handler
  }, [handler])

  useEffect(() => {
    if (!active) return

    const list = Array.isArray(refs) ? refs : [refs]

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node
      const inside = list.some((ref) => ref.current?.contains(target))
      if (!inside) handlerRef.current(event)
    }

    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
    // refs são estáveis por identidade; listar `active` basta
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])
}
