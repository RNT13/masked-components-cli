import { buildTokenStyle, resolveSurface } from '@/styles/surfaceTokens'
import { resolveSemanticColors } from '@/styles/semanticColors'
import type { DefaultTheme } from 'styled-components'
import type { ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'

/** Overrides granulares de tokens --mc-tabs-* (chave = nome sem prefixo). */
export interface TabsTokenOverrides {
  accent?: string
  accentFg?: string
  border?: string
  surface?: string
}

export interface ResolveTabsTokensInput {
  colorTheme?: ColorThemeName
  tokens?: TabsTokenOverrides
}

/**
 * Deriva tokens --mc-tabs-*: o par accent/accentFg (com contraste WCAG)
 * pinta a aba ativa no 'pills'; no 'line' o accent é o indicador e no
 * 'enclosed' a borda. `surface` é o fundo da aba ativa no 'enclosed'.
 * Precedência: tokens > colorTheme > tema.
 */
export function resolveTabsTokens(
  input: ResolveTabsTokensInput,
  theme: DefaultTheme
): Record<string, string> {
  const semantic = resolveSemanticColors(theme)
  const surface = resolveSurface('plain', input.colorTheme, theme)
  return buildTokenStyle(
    'tabs',
    {
      accent: surface.accent,
      accentFg: surface.accentFg,
      border: semantic.border,
      surface: semantic.surface
    },
    input.tokens
  )
}

/**
 * Próxima aba habilitada a partir de `from`, andando `step` (1 ou -1) com
 * volta circular. Devolve `from` se não houver outra habilitada.
 */
export function nextEnabledIndex(disabled: boolean[], from: number, step: 1 | -1): number {
  const count = disabled.length
  for (let i = 1; i <= count; i++) {
    const index = (from + step * i + count * i) % count
    if (!disabled[index]) return index
  }
  return from
}

/** Primeira ou última aba habilitada (Home/End). */
export function edgeEnabledIndex(disabled: boolean[], edge: 'first' | 'last'): number {
  const order = disabled.map((_, i) => i)
  const list = edge === 'first' ? order : order.reverse()
  return list.find((i) => !disabled[i]) ?? 0
}
