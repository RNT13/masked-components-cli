import { buildTokenStyle, resolveSurface } from '@/styles/surfaceTokens'
import { resolveSemanticColors } from '@/styles/semanticColors'
import type { DefaultTheme } from 'styled-components'
import type { ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'

/** Overrides granulares de tokens --mc-empty-state-* (chave = nome sem prefixo). */
export interface EmptyStateTokenOverrides {
  accent?: string
  accentFg?: string
  muted?: string
  border?: string
}

export interface ResolveEmptyStateTokensInput {
  colorTheme?: ColorThemeName
  tokens?: EmptyStateTokenOverrides
}

/**
 * Deriva tokens --mc-empty-state-*: o par accent/accentFg (com contraste
 * WCAG) pinta a plaquinha do ícone; `muted` e `border` vêm do tema.
 * Precedência: tokens > colorTheme > tema.
 */
export function resolveEmptyStateTokens(
  input: ResolveEmptyStateTokensInput,
  theme: DefaultTheme
): Record<string, string> {
  const semantic = resolveSemanticColors(theme)
  const surface = resolveSurface('plain', input.colorTheme, theme)
  return buildTokenStyle(
    'empty-state',
    {
      accent: input.colorTheme ? surface.accent : semantic.subtle,
      accentFg: input.colorTheme ? surface.accentFg : semantic.text,
      muted: semantic.muted,
      border: semantic.border
    },
    input.tokens
  )
}
