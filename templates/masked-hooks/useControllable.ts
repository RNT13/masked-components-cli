import { useCallback, useRef, useState } from 'react'

/**
 * useControllable — padrão controlado/não-controlado (mesmo modelo do React).  
 *
 * - `value` definido → componente controlado: o valor vem da prop e `setValue`  
 *   apenas dispara `onChange` (o pai decide se atualiza).  
 * - `value` undefined → não-controlado: o estado interno manda, inicializado  
 *   com `defaultValue`.  
 *
 * Elimina o padrão `value ?? internal` + `if (!isControlled) setInternal(...)`  
 * repetido nas variants de input.  
 */
export function useControllable<T>({
  value,
  defaultValue,
  onChange
}: {
  value?: T
  defaultValue?: T
  onChange?: (next: T) => void
}): [T, (next: T) => void] {
  const isControlled = value !== undefined
  const [internal, setInternal] = useState<T>(defaultValue as T)

  /* onChange estável: sempre chama a versão mais recente sem re-criar setValue */
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  const current = isControlled ? (value as T) : internal

  const setValue = useCallback(
    (next: T) => {
      if (!isControlled) setInternal(next)
      onChangeRef.current?.(next)
    },
    [isControlled]
  )

  return [current, setValue]
}
