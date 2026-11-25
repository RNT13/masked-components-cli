import type { Ref, RefCallback } from 'react'

/**
 * composeRefs — combina várias refs (callback ou objeto) em uma só.  
 *
 * Útil quando um componente precisa da ref interna E repassar a ref  
 * recebida por forwardRef/props.  
 */
export function composeRefs<T>(...refs: Array<Ref<T> | undefined>): RefCallback<T> {
  return (node: T) => {
    for (const ref of refs) {
      if (typeof ref === 'function') {
        ref(node)
      } else if (ref != null) {
        ;(ref as { current: T | null }).current = node
      }
    }
  }
}
