import { buildTokenStyle, resolveSurface } from '@/styles/surfaceTokens'
import type { DefaultTheme } from 'styled-components'
import type { ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'

/** Overrides granulares de tokens --mc-faq-* (chave = nome sem prefixo). */
export interface FAQTokenOverrides {
  accent?: string
  border?: string
}

export interface ResolveFAQTokensInput {
  colorTheme?: ColorThemeName
  tokens?: FAQTokenOverrides
}

/**
 * Deriva tokens --mc-faq-*: destaque (indicador de abrir/fechar) e borda.
 * O texto herda da seção. Precedência: tokens > colorTheme > tema.
 */
export function resolveFAQTokens(
  input: ResolveFAQTokensInput,
  theme: DefaultTheme
): Record<string, string> {
  const surface = resolveSurface('plain', input.colorTheme, theme)
  return buildTokenStyle('faq', { accent: surface.accent, border: surface.border }, input.tokens)
}
