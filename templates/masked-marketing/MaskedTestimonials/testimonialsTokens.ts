import { buildTokenStyle, resolveSurface } from '@/styles/surfaceTokens'
import type { DefaultTheme } from 'styled-components'
import type { ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'

/** Overrides granulares de tokens --mc-testimonials-* (chave = nome sem prefixo). */
export interface TestimonialsTokenOverrides {
  accent?: string
  border?: string
}

export interface ResolveTestimonialsTokensInput {
  colorTheme?: ColorThemeName
  tokens?: TestimonialsTokenOverrides
}

/**
 * Deriva tokens --mc-testimonials-*: destaque (aspas) e borda dos cartões.  
 * O texto herda da seção. Precedência: tokens > colorTheme > tema.  
 */
export function resolveTestimonialsTokens(
  input: ResolveTestimonialsTokensInput,
  theme: DefaultTheme
): Record<string, string> {
  const surface = resolveSurface('plain', input.colorTheme, theme)
  return buildTokenStyle(
    'testimonials',
    { accent: surface.accent, border: surface.border },
    input.tokens
  )
}
