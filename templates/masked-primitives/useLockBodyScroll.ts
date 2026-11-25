import { useEffect } from 'react'

/**
 * useLockBodyScroll — trava o scroll do body enquanto `locked`.  
 *
 * Restaura o overflow anterior no cleanup. Suporta múltiplos consumidores  
 * simultâneos via contador: o scroll só é liberado quando todos soltam  
 * (ex.: Drawer + Modal abertos ao mesmo tempo).  
 */
let lockCount = 0
let previousOverflow = ''

export function useLockBodyScroll(locked: boolean): void {
  useEffect(() => {
    if (!locked) return

    if (lockCount === 0) {
      previousOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
    }
    lockCount += 1

    return () => {
      lockCount -= 1
      if (lockCount === 0) {
        document.body.style.overflow = previousOverflow
      }
    }
  }, [locked])
}
