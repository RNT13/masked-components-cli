import { buildTokenStyle, resolveSurface } from '@/styles/surfaceTokens'
import { resolveSemanticColors } from '@/styles/semanticColors'
import type { DefaultTheme } from 'styled-components'
import type { ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'
import type { RatingVariant } from './MaskedRating.types'

/** Overrides granulares de tokens --mc-rating-* (chave = nome sem prefixo). */
export interface RatingTokenOverrides {
  accent?: string
  accentFg?: string
  empty?: string
}

export interface ResolveRatingTokensInput {
  variant?: RatingVariant
  colorTheme?: ColorThemeName
  tokens?: RatingTokenOverrides
}

/**
 * Deriva tokens --mc-rating-*: sem colorTheme, estrelas usam o amarelo da
 * paleta, corações o vermelho e números o destaque do tema; com colorTheme,
 * a cor dele. `accentFg` é o texto legível sobre o destaque (pílula do
 * variant 'numbers', contraste WCAG). A forma do glifo (cheio × vazio) é que
 * diferencia nota marcada de não marcada, não só a cor.
 * Precedência: tokens > colorTheme > tema.
 */
export function resolveRatingTokens(
  input: ResolveRatingTokensInput,
  theme: DefaultTheme
): Record<string, string> {
  const semantic = resolveSemanticColors(theme)
  const surface = resolveSurface('plain', input.colorTheme, theme)
  const fallback =
    input.variant === 'hearts'
      ? theme.colors.baseRed.base
      : input.variant === 'numbers'
        ? semantic.accent
        : theme.colors.baseYellow.base

  return buildTokenStyle(
    'rating',
    {
      accent: input.colorTheme ? surface.accent : fallback,
      accentFg: input.colorTheme
        ? surface.accentFg
        : resolveSurface('plain', undefined, theme).accentFg,
      empty: semantic.muted
    },
    input.tokens
  )
}

/** Glifos cheio e vazio por forma (números usam o próprio algarismo). */
export const RATING_GLYPHS: Record<
  Exclude<RatingVariant, 'numbers'>,
  { full: string; empty: string }
> = {
  stars: { full: '★', empty: '☆' },
  hearts: { full: '♥', empty: '♡' }
}

/** Mantém a nota inteira e dentro de [0, max]. */
export function clampRating(value: number, max: number): number {
  if (!Number.isFinite(value)) return 0
  return Math.min(Math.max(0, Math.round(value)), Math.max(1, Math.floor(max)))
}
