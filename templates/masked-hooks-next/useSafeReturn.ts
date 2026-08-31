'use client'  
  
import { useRouter, useSearchParams } from 'next/navigation'  
import { useCallback, useMemo } from 'react'  
  
type UseSafeReturnOptions = {  
  paramName?: string  
  fallbackPath?: string  
  allowHistoryBack?: boolean  
}  
  
const sanitizeInternalPath = (raw: string | null | undefined): string | null => {  
  if (!raw) return null  
  
  const value = raw.trim()  
  
  // Só aceita rota interna válida  
  if (!value.startsWith('/')) return null  
  if (value.startsWith('//')) return null  
  
  // Evita espaços e caracteres suspeitos  
  if (/[\s<>"'`]/.test(value)) return null  
  
  return value  
}  
  
const joinQueryParam = (path: string, key: string, value: string) => {  
  const separator = path.includes('?') ? '&' : '?'  
  return `${path}${separator}${key}=${encodeURIComponent(value)}`  
}  
  
export const buildPath = (...parts: Array<string | number | null | undefined>) => {  
  const cleanParts = parts  
    .filter((part): part is string | number => part !== null && part !== undefined && String(part).trim() !== '')  
    .map(part =>  
      String(part)  
        .trim()  
        .replace(/^\/+|\/+$/g, '')  
    )  
  
  return `/${cleanParts.join('/')}`.replace(/\/+/g, '/')  
}  
  
export const useSafeReturn = (options: UseSafeReturnOptions = {}) => {  
  const { paramName = 'returnTo', fallbackPath = '/', allowHistoryBack = true } = options  
  
  const router = useRouter()  
  const searchParams = useSearchParams()  
  
  const returnTo = useMemo(() => {  
    return sanitizeInternalPath(searchParams.get(paramName))  
  }, [searchParams, paramName])  
  
  const hasReturnTo = Boolean(returnTo)  
  
  const goBackSafe = useCallback(  
    (customFallback?: string) => {  
      if (returnTo) {  
        router.replace(returnTo)  
        return  
      }  
  
      if (allowHistoryBack && typeof window !== 'undefined' && window.history.length > 1) {  
        router.back()  
        return  
      }  
  
      const safeFallback = sanitizeInternalPath(customFallback) ?? sanitizeInternalPath(fallbackPath) ?? '/'  
      router.replace(safeFallback)  
    },  
    [allowHistoryBack, fallbackPath, router, returnTo]  
  )  
  
  const withReturnTo = useCallback(  
    (path: string, overrideReturnTo?: string | null) => {  
      const safePath = sanitizeInternalPath(path)  
      if (!safePath) return fallbackPath  
  
      const nextReturnTo = sanitizeInternalPath(overrideReturnTo) ?? returnTo  
      if (!nextReturnTo) return safePath  
  
      return joinQueryParam(safePath, paramName, nextReturnTo)  
    },  
    [fallbackPath, paramName, returnTo]  
  )  
  
  return {  
    router,  
    searchParams,  
    returnTo,  
    hasReturnTo,  
    goBackSafe,  
    withReturnTo  
  }  
}