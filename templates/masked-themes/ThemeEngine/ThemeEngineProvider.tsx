'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from 'react'
import { ThemeProvider } from 'styled-components'
import { maskedThemeConfig } from '../MaskedThemes/MaskedThemes'
import type { DefaultTheme } from 'styled-components'

/* ===========================================================  
   THEME ENGINE — troca de tema em runtime, sem boilerplate.  
  
   Uso mínimo:  
     <ThemeEngineProvider>  
       <App />  
     </ThemeEngineProvider>  
  
   O consumidor troca o tema com:  
     const { themeName, setThemeName } = useThemeEngine()  
     setThemeName('dark')  
=========================================================== */

export type ThemeEngineContextValue = {
  /** nome do tema ativo (chave de maskedThemeConfig ou registrada via registerTheme) */
  themeName: string
  /** troca o tema ativo; persiste em localStorage quando `storageKey` está definido */
  setThemeName: (name: string) => void
  /** lista de temas disponíveis (registry + maskedThemeConfig) */
  availableThemes: string[]
  /** objeto de tema resolvido (o que vai para o ThemeProvider) */
  theme: DefaultTheme
}

const ThemeEngineContext = createContext<ThemeEngineContextValue | null>(null)

/* ---- registry de temas customizados ---- */
const customThemes = new Map<string, DefaultTheme>()

/**
 * Registra um tema próprio no motor. Útil para temas de marca  
 * que não fazem parte do maskedThemeConfig.  
 *
 * @example  
 * registerTheme('brand', { ...maskedThemeConfig.default, colors: { ... } })  
 */
export function registerTheme(name: string, theme: DefaultTheme): void {
  customThemes.set(name, theme)
}

function resolveTheme(name: string): DefaultTheme {
  const custom = customThemes.get(name)
  if (custom) return custom

  const fromConfig = (maskedThemeConfig as Record<string, DefaultTheme>)[name]
  if (fromConfig) return fromConfig

  return maskedThemeConfig.default
}

function listThemes(): string[] {
  return [...Object.keys(maskedThemeConfig), ...customThemes.keys()]
}

export type ThemeEngineProviderProps = {
  children: ReactNode
  /** tema inicial (default: 'default') */
  defaultTheme?: string
  /**
   * chave de localStorage para persistir a escolha.  
   * Passe `null` para desativar persistência. Default: 'masked-theme'  
   */
  storageKey?: string | null
}

export function ThemeEngineProvider({
  children,
  defaultTheme = 'default',
  storageKey = 'masked-theme'
}: ThemeEngineProviderProps) {
  const [themeName, setThemeNameState] = useState(defaultTheme)

  /* hidrata a escolha persistida (client-only, após mount) */
  useEffect(() => {
    if (!storageKey) return
    try {
      const saved = window.localStorage.getItem(storageKey)
      if (saved) setThemeNameState(saved)
    } catch {
      /* storage indisponível — ignora */
    }
  }, [storageKey])

  const setThemeName = useCallback(
    (name: string) => {
      setThemeNameState(name)
      if (!storageKey) return
      try {
        window.localStorage.setItem(storageKey, name)
      } catch {
        /* storage indisponível — ignora */
      }
    },
    [storageKey]
  )

  const theme = useMemo(() => resolveTheme(themeName), [themeName])
  const availableThemes = useMemo(() => listThemes(), [])

  const value = useMemo<ThemeEngineContextValue>(
    () => ({ themeName, setThemeName, availableThemes, theme }),
    [themeName, setThemeName, availableThemes, theme]
  )

  return (
    <ThemeEngineContext.Provider value={value}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeEngineContext.Provider>
  )
}

export function useThemeEngine(): ThemeEngineContextValue {
  const ctx = useContext(ThemeEngineContext)
  if (!ctx) {
    throw new Error('useThemeEngine deve ser usado dentro de <ThemeEngineProvider>')
  }
  return ctx
}
