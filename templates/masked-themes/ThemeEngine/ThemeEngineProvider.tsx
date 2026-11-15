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
import { readableTextOn } from '@/utils/masked-utils'  

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

    /* variáveis --mc-* derivadas do tema ativo.  
     Componentes sem colorTheme/tokens seguem o tema via :root;  
     colorTheme/tokens (inline style) continuam com precedência. */  
  useEffect(() => {  
    const c = theme.colors as unknown as Record<string, string>  
    const mix = (color: string, pct: number, other = 'transparent') =>  
      `color-mix(in srgb, ${color} ${pct}%, ${other})`  
    const onAccent = readableTextOn(c.accentColor)  
  
    const vars: Record<string, string | undefined> = {  
      /* genéricas */  
      '--mc-surface': c.surfaceColor,  
      '--mc-text': c.textColor,  
      '--mc-border': c.borderColor,  
      '--mc-accent': c.accentColor,  
      '--mc-success': c.successColor,  
      '--mc-warning': c.warningColor,  
      '--mc-danger': c.dangerColor,  
      '--mc-info': c.infoColor,  
  
      /* buttons / switch */  
      '--mc-btn-bg': c.accentColor,  
      '--mc-btn-bg-hover': mix(c.accentColor, 85, 'black'),  
      '--mc-btn-bg-active': mix(c.accentColor, 70, 'black'),  
      '--mc-btn-fg': onAccent,  
      '--mc-btn-fg-hover': onAccent,  
      '--mc-btn-fg-active': onAccent,  
      '--mc-btn-border': c.accentColor,  
      '--mc-btn-border-hover': mix(c.accentColor, 85, 'black'),  
      '--mc-btn-border-active': mix(c.accentColor, 70, 'black'),  
      '--mc-btn-ring': mix(c.accentColor, 40),  
      '--mc-btn-ring-focus': mix(c.accentColor, 40),  
      '--mc-btn-gradient': `linear-gradient(180deg, ${mix(c.accentColor, 80, 'white')}, ${c.accentColor})`,  
      '--mc-btn-gradient-hover': `linear-gradient(180deg, ${c.accentColor}, ${mix(c.accentColor, 85, 'black')})`,  
      '--mc-btn-gradient-active': `linear-gradient(180deg, ${mix(c.accentColor, 70, 'black')}, ${mix(c.accentColor, 85, 'black')})`,  
      '--mc-btn-neon-color': c.accentColor,  
      '--mc-btn-neon-glow': mix(c.accentColor, 50),  
      '--mc-btn-danger-bg': c.dangerColor,  
      '--mc-btn-danger-bg-hover': mix(c.dangerColor, 85, 'black'),  
      '--mc-btn-danger-fg': readableTextOn(c.dangerColor),  
      '--mc-btn-danger-border': c.dangerColor,  
      '--mc-btn-danger-ring': mix(c.dangerColor, 40),  
      '--mc-switch-track-on': c.accentColor,  
      '--mc-switch-border-on': c.accentColor,  
      '--mc-switch-ring-focus': mix(c.accentColor, 40),  
  
      /* inputs */  
      '--mc-input-bg': c.surfaceColor,  
      '--mc-input-bg-focus': c.secondaryColor ?? c.surfaceColor,  
      '--mc-input-fg': c.textColor,  
      '--mc-input-border': c.borderColor,  
      '--mc-input-border-hover': c.accentColor,  
      '--mc-input-focus-ring': mix(c.accentColor, 35),  
      '--mc-input-placeholder': c.textMuted,  
      '--mc-input-label-fg': c.textColor,  
      '--mc-input-icon-fg': c.textMuted,  
      '--mc-input-error-bg': mix(c.dangerColor, 12),  
      '--mc-input-error-border': c.dangerColor,  
      '--mc-input-error-fg': c.dangerColor,  
      '--mc-input-error-ring': mix(c.dangerColor, 35),  
      '--mc-input-disabled-bg': c.secondaryColor ?? c.surfaceColor,  
  
      /* cards */  
      '--mc-card-bg': c.surfaceColor,  
      '--mc-card-fg': c.textColor,  
      '--mc-card-muted-fg': c.textMuted,  
      '--mc-card-border': c.borderColor,  
      '--mc-card-accent': c.accentColor,  
      '--mc-card-accent-soft': mix(c.accentColor, 25),  
      '--mc-card-success': c.successColor,  
      '--mc-card-danger': c.dangerColor,  
      '--mc-card-warning': c.warningColor,  
      '--mc-card-neutral-trend': c.textMuted,  
      '--mc-card-icon-bg': c.secondaryColor ?? c.surfaceColor,  
      '--mc-card-icon-fg': c.accentColor,  
      '--mc-card-plan-active-bg': mix(c.accentColor, 15),  
      '--mc-card-plan-active-border': c.accentColor,  
      '--mc-card-plan-inactive-bg': c.surfaceColor,  
      '--mc-card-plan-inactive-border': c.borderColor,  
      '--mc-card-placeholder-bg': c.secondaryColor ?? c.surfaceColor  
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
