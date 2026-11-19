import { buildTokenStyle, resolveSurface } from '@/styles/surfaceTokens'
import type { DefaultTheme } from 'styled-components'
import type { ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'
import type { StatsVariant } from './MaskedStats.types'

/** Overrides granulares de tokens --mc-stats-* (chave = nome sem prefixo). */
export interface StatsTokenOverrides {
  bg?: string
  fg?: string
  muted?: string
  border?: string
  accent?: string
}

export interface ResolveStatsTokensInput {
  variant?: StatsVariant
  colorTheme?: ColorThemeName
  tokens?: StatsTokenOverrides
}

/**
 * Deriva tokens --mc-stats-*: 'highlight' vira uma faixa de superfície cheia  
 * (texto por contraste WCAG); 'row' e 'grid' herdam a cor da seção e só usam  
 * o destaque (accent) no número. Precedência: tokens > colorTheme > tema.  
 */
export function resolveStatsTokens(
  input: ResolveStatsTokensInput,
  theme: DefaultTheme
): Record<string, string> {
  const surface = resolveSurface(
    input.variant === 'highlight' ? 'solid' : 'plain',
    input.colorTheme,
    theme
  )
  return buildTokenStyle(
    'stats',
    {
      bg: surface.bg,
      fg: surface.fg,
      muted: surface.muted,
      border: surface.border,
      accent: surface.accent
    },
    input.tokens
  )
}
