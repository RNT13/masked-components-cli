'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode
} from 'react'
import { ThemeProvider } from 'styled-components'
import { maskedThemeConfig } from '../MaskedThemes/MaskedThemes'
import type { DefaultTheme } from 'styled-components'

export type ThemeEngineContextValue = {
  themeName: string
  setThemeName: (name: string) => void
  availableThemes: string[]
  theme: DefaultTheme
}

const ThemeEngineContext = createContext<ThemeEngineContextValue | null>(null)

const customThemes = new Map<string, DefaultTheme>()

/** Registra um tema próprio (ex.: tema de marca). */
export function registerTheme(name: string, theme: DefaultTheme): void {
  customThemes.set(name, theme)
}

function resolveTheme(name: string): DefaultTheme {
  const custom = customThemes.get(name)
  if (custom) return custom
  const fromConfig = (maskedThemeConfig as Record<string, DefaultTheme>)[name]
  return fromConfig ?? maskedThemeConfig.default
}

function listThemes(): string[] {
  return [...Object.keys(maskedThemeConfig), ...customThemes.keys()]
}

/* ---- storage como store externo: o servidor e a hidratação usam o tema padrão;
   o tema salvo entra logo depois, sem hydration mismatch ---- */
const storageListeners = new Set<() => void>()

function subscribeStorage(callback: () => void) {
  storageListeners.add(callback)
  window.addEventListener('storage', callback)
  return () => {
    storageListeners.delete(callback)
    window.removeEventListener('storage', callback)
  }
}

function readStored(key: string | null): string | null {
  if (!key) return null
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

export type ThemeEngineProviderProps = {
  children: ReactNode
  /** tema inicial (default: 'default') */
  defaultTheme?: string
  /** chave de localStorage; `null` desativa a persistência. Default: 'masked-theme' */
  storageKey?: string | null
}

export function ThemeEngineProvider({
  children,
  defaultTheme = 'default',
  storageKey = 'masked-theme'
}: ThemeEngineProviderProps) {
  const [session, setSession] = useState<string | null>(null)
  const stored = useSyncExternalStore(
    subscribeStorage,
    () => readStored(storageKey),
    () => null
  )

  const themeName = session ?? stored ?? defaultTheme

  const setThemeName = useCallback(
    (name: string) => {
      setSession(name)
      if (!storageKey) return
      try {
        window.localStorage.setItem(storageKey, name)
      } catch {
        /* storage indisponível */
      }
      storageListeners.forEach((listener) => listener())
    },
    [storageKey]
  )

  const theme = useMemo(() => resolveTheme(themeName), [themeName])
  const availableThemes = useMemo(() => listThemes(), [])

  const value = useMemo<ThemeEngineContextValue>(
    () => ({ themeName, setThemeName, availableThemes, theme }),
    [themeName, setThemeName, availableThemes, theme]
  )

  /* variáveis --mc-* para componentes sem styled-components (ex.: MaskedToaster) */
  useEffect(() => {
    const c = theme.colors
    const vars: Record<string, string | undefined> = {
      '--mc-surface': c.surfaceColor,
      '--mc-text': c.textColor,
      '--mc-border': c.borderColor,
      '--mc-accent': c.accentColor,
      '--mc-success': c.successColor,
      '--mc-warning': c.warningColor,
      '--mc-danger': c.dangerColor,
      '--mc-info': c.infoColor
    }
    const root = document.documentElement
    for (const [key, val] of Object.entries(vars)) if (val) root.style.setProperty(key, val)
    root.dataset.mcTheme = themeName
  }, [theme, themeName])

  return (
    <ThemeEngineContext.Provider value={value}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeEngineContext.Provider>
  )
}

export function useThemeEngine(): ThemeEngineContextValue {
  const ctx = useContext(ThemeEngineContext)
  if (!ctx) throw new Error('useThemeEngine deve ser usado dentro de <ThemeEngineProvider>')
  return ctx
}
