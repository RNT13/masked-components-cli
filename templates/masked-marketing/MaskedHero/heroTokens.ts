import { buildTokenStyle, resolveSurface } from '@/styles/surfaceTokens'
import type { DefaultTheme } from 'styled-components'
import type { ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'
import type { HeroVariant } from './MaskedHero.types'

/** Overrides granulares de tokens --mc-hero-* (chave = nome sem prefixo). */
export interface HeroTokenOverrides {
  bg?: string
  fg?: string
  muted?: string
  accent?: string
}

export interface ResolveHeroTokensInput {
  variant?: HeroVariant
  colorTheme?: ColorThemeName
  tokens?: HeroTokenOverrides
}

/**
 * Deriva tokens --mc-hero-*. O 'gradient' pinta o fundo (base → base  
 * misturada com o texto) e o texto por contraste WCAG; os demais não pintam  
 * fundo e só usam o colorTheme no destaque (eyebrow).  
 * Precedência: tokens > colorTheme > tema.  
 */
export function resolveHeroTokens(
  input: ResolveHeroTokensInput,
  theme: DefaultTheme
): Record<string, string> {
  const surface = resolveSurface(
    input.variant === 'gradient' ? 'gradient' : 'plain',
    input.colorTheme,
    theme
  )

  return buildTokenStyle(
    'hero',
    { bg: surface.bg, fg: surface.fg, muted: surface.muted, accent: surface.accent },
    input.tokens
  )
}
