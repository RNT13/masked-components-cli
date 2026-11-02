'use client'

import { useCallback, useSyncExternalStore } from 'react'

/**
 * Lê e escreve um valor JSON em localStorage, sincronizado entre abas  
 * via evento `storage`. SSR-safe: no servidor retorna `initialValue`.  
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const listener = (e: StorageEvent) => {
        if (e.key === null || e.key === key) onChange()
      }
      window.addEventListener('storage', listener)
      return () => window.removeEventListener('storage', listener)
    },
    [key]
  )

  const getSnapshot = useCallback(() => {
    try {
      return window.localStorage.getItem(key)
    } catch {
      return null
    }
  }, [key])

  // `null` no SSR — o valor parseado é resolvido abaixo com fallback.
  const getServerSnapshot = useCallback(() => null, [])

  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const value: T = raw === null ? initialValue : safeParse(raw, initialValue)

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      const resolved = next instanceof Function ? next(value) : next
      try {
        window.localStorage.setItem(key, JSON.stringify(resolved))
        // `storage` não dispara na própria aba — força o re-render:
        window.dispatchEvent(new StorageEvent('storage', { key }))
      } catch {
        // ignora quota/serialização
      }
    },
    [key, value]
  )

  return [value, set] as const
}

function safeParse<T>(raw: string, fallback: T): T {
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}
