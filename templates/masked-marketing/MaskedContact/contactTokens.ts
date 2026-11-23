import { buildTokenStyle, resolveSurface } from '@/styles/surfaceTokens'
import type { DefaultTheme } from 'styled-components'
import type { ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'

/** Overrides granulares de tokens --mc-contact-* (chave = nome sem prefixo). */
export interface ContactTokenOverrides {
  accent?: string
  accentFg?: string
  border?: string
}

export interface ResolveContactTokensInput {
  colorTheme?: ColorThemeName
  tokens?: ContactTokenOverrides
}

/**
 * Deriva tokens --mc-contact-*: o par accent/accentFg (com contraste WCAG)
 * pinta o botão de enviar; a borda vem do tema. O texto herda da seção.
 * Precedência: tokens > colorTheme > tema.
 */
export function resolveContactTokens(
  input: ResolveContactTokensInput,
  theme: DefaultTheme
): Record<string, string> {
  const surface = resolveSurface('plain', input.colorTheme, theme)
  return buildTokenStyle(
    'contact',
    { accent: surface.accent, accentFg: surface.accentFg, border: surface.border },
    input.tokens
  )
}
