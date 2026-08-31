'use client'  
  
import { useCallback, useEffect, useState } from 'react'  
  
export function useLocalStorage<T>(key: string, initialValue: T) {  
  const [value, setValue] = useState<T>(initialValue)  
  
  useEffect(() => {  
    try {  
      const item = window.localStorage.getItem(key)  
      if (item !== null) setValue(JSON.parse(item) as T)  
    } catch {  
      // ignora leituras inválidas  
    }  
  }, [key])  
  
  const set = useCallback(  
    (next: T | ((prev: T) => T)) => {  
      setValue(prev => {  
        const resolved = next instanceof Function ? next(prev) : next  
        try {  
          window.localStorage.setItem(key, JSON.stringify(resolved))  
        } catch {  
          // ignora quota/serialização  
        }  
        return resolved  
      })  
    },  
    [key]  
  )  
  
  return [value, set] as const  
}