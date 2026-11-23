import { buildTokenStyle, resolveSurface } from '@/styles/surfaceTokens'
import type { DefaultTheme } from 'styled-components'
import type { ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'

/** Overrides granulares de tokens --mc-team-* (chave = nome sem prefixo). */
export interface TeamTokenOverrides {
  accent?: string
  border?: string
}

export interface ResolveTeamTokensInput {
  colorTheme?: ColorThemeName
  tokens?: TeamTokenOverrides
}

/**
 * Deriva tokens --mc-team-*: destaque (cargo) e borda dos cartões. O texto
 * herda da seção. Precedência: tokens > colorTheme > tema.
 */
export function resolveTeamTokens(
  input: ResolveTeamTokensInput,
  theme: DefaultTheme
): Record<string, string> {
  const surface = resolveSurface('plain', input.colorTheme, theme)
  return buildTokenStyle('team', { accent: surface.accent, border: surface.border }, input.tokens)
}
