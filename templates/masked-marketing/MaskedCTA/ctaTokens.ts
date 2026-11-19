import { buildTokenStyle, resolveSurface } from '@/styles/surfaceTokens'
import type { DefaultTheme } from 'styled-components'
import type { ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'
import type { CTAVariant } from './MaskedCTA.types'

/** Overrides granulares de tokens --mc-cta-* (chave = nome sem prefixo). */
export interface CTATokenOverrides {
  bg?: string
  fg?: string
  muted?: string
  border?: string
}

export interface ResolveCTATokensInput {
  variant?: CTAVariant
  colorTheme?: ColorThemeName
  tokens?: CTATokenOverrides
}

/**
 * Deriva tokens --mc-cta-*: banner = superfície cheia, gradient = gradiente,  
 * split = fundo suave. Texto sempre por contraste WCAG.  
 * Precedência: tokens > colorTheme > tema.  
 */
export function resolveCTATokens(
  input: ResolveCTATokensInput,
  theme: DefaultTheme
): Record<string, string> {
  const kind =
    input.variant === 'gradient' ? 'gradient' : input.variant === 'split' ? 'tinted' : 'solid'
  const surface = resolveSurface(kind, input.colorTheme, theme)

  return buildTokenStyle(
    'cta',
    { bg: surface.bg, fg: surface.fg, muted: surface.muted, border: surface.border },
    input.tokens
  )
}
