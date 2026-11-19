import { buildTokenStyle, resolveSurface } from '@/styles/surfaceTokens'
import type { DefaultTheme } from 'styled-components'
import type { ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'

/** Overrides granulares de tokens --mc-pricing-* (chave = nome sem prefixo). */
export interface PricingTokenOverrides {
  accent?: string
  accentFg?: string
  border?: string
}

export interface ResolvePricingTokensInput {
  colorTheme?: ColorThemeName
  tokens?: PricingTokenOverrides
}

/**
 * Deriva tokens --mc-pricing-*: o destaque (accent/accentFg, par com
 * contraste WCAG) pinta o plano em destaque, o selo, o botão principal e o
 * alternador ativo. O texto herda da seção.
 * Precedência: tokens > colorTheme > tema.
 */
export function resolvePricingTokens(
  input: ResolvePricingTokensInput,
  theme: DefaultTheme
): Record<string, string> {
  const surface = resolveSurface('plain', input.colorTheme, theme)
  return buildTokenStyle(
    'pricing',
    { accent: surface.accent, accentFg: surface.accentFg, border: surface.border },
    input.tokens
  )
}
