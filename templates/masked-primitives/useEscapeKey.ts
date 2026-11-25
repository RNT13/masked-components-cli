import { useEffect, useRef } from 'react'

/**
 * useEscapeKey — chama `handler` quando Escape é pressionado enquanto `active`.  
 *
 * O handler vai para uma ref: trocar a callback não re-registra o listener  
 * (mesmo padrão do onCloseRef de MaskedPopup/MaskedDrawer).  
 */
export function useEscapeKey(active: boolean, handler: () => void): void {
  const handlerRef = useRef(handler)

  useEffect(() => {
    handlerRef.current = handler
  }, [handler])

  useEffect(() => {
    if (!active) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handlerRef.current()
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [active])
}
