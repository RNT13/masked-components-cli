import { buildTokenStyle, resolveSurface } from '@/styles/surfaceTokens'
import type { DefaultTheme } from 'styled-components'
import type { ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'

/** Overrides granulares de tokens --mc-features-* (chave = nome sem prefixo). */
export interface FeaturesTokenOverrides {
  accent?: string
  accentFg?: string
  border?: string
}

export interface ResolveFeaturesTokensInput {
  colorTheme?: ColorThemeName
  tokens?: FeaturesTokenOverrides
}

/**
 * Deriva tokens --mc-features-*: o destaque (accent/accentFg, par com  
 * contraste WCAG) pinta o ícone e a linha do timeline; a borda dos cards vem  
 * do tema ou do colorTheme. O texto herda da seção.  
 * Precedência: tokens > colorTheme > tema.  
 */
export function resolveFeaturesTokens(
  input: ResolveFeaturesTokensInput,
  theme: DefaultTheme
): Record<string, string> {
  const surface = resolveSurface('plain', input.colorTheme, theme)
  return buildTokenStyle(
    'features',
    { accent: surface.accent, accentFg: surface.accentFg, border: surface.border },
    input.tokens
  )
}
