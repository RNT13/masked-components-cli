import { buildTokenStyle, resolveSurface } from '@/styles/surfaceTokens'
import type { DefaultTheme } from 'styled-components'
import type { ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'
import type { NewsletterVariant } from './MaskedNewsletter.types'

/** Overrides granulares de tokens --mc-newsletter-* (chave = nome sem prefixo). */
export interface NewsletterTokenOverrides {
  bg?: string
  fg?: string
  muted?: string
  border?: string
  accent?: string
  accentFg?: string
}

export interface ResolveNewsletterTokensInput {
  variant?: NewsletterVariant
  colorTheme?: ColorThemeName
  tokens?: NewsletterTokenOverrides
}

/**
 * Deriva tokens --mc-newsletter-*: band = superfície cheia (texto por
 * contraste), card = só borda e destaque, inline = sem pintura. O botão usa
 * accent/accentFg (par com contraste WCAG; na band, o texto da superfície).
 * Precedência: tokens > colorTheme > tema.
 */
export function resolveNewsletterTokens(
  input: ResolveNewsletterTokensInput,
  theme: DefaultTheme
): Record<string, string> {
  const surface = resolveSurface(
    input.variant === 'band' ? 'solid' : 'plain',
    input.colorTheme,
    theme
  )

  return buildTokenStyle(
    'newsletter',
    {
      bg: surface.bg,
      fg: surface.fg,
      muted: surface.muted,
      border: surface.border,
      accent: surface.accent,
      accentFg: surface.accentFg
    },
    input.tokens
  )
}
