import { buildTokenStyle, resolveSurface } from '@/styles/surfaceTokens'
import { resolveSemanticColors } from '@/styles/semanticColors'
import type { DefaultTheme } from 'styled-components'
import type { ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'
import type { BadgeVariant } from './MaskedBadge.types'

/** Overrides granulares de tokens --mc-badge-* (chave = nome sem prefixo). */
export interface BadgeTokenOverrides {
  bg?: string
  fg?: string
  border?: string
  dot?: string
}

export interface ResolveBadgeTokensInput {
  variant?: BadgeVariant
  colorTheme?: ColorThemeName
  tokens?: BadgeTokenOverrides
}

/**
 * Deriva tokens --mc-badge-*:
 * - solid: com colorTheme, base + texto por contraste WCAG; sem ele, neutro
 *   invertido (fundo = texto do tema, texto = superfície do tema);
 * - soft: fundo suave do destaque, texto herdado (sem risco de contraste);
 * - outline: só a borda; dot: só o ponto colorido.
 * Precedência: tokens > colorTheme > tema.
 */
export function resolveBadgeTokens(
  input: ResolveBadgeTokensInput,
  theme: DefaultTheme
): Record<string, string> {
  const semantic = resolveSemanticColors(theme)
  const plain = resolveSurface('plain', input.colorTheme, theme)
  const accent = input.colorTheme ? plain.accent : semantic.muted

  let base: Record<string, string | undefined> = {}

  switch (input.variant) {
    case 'solid':
      base = input.colorTheme
        ? { bg: plain.accent, fg: plain.accentFg, border: plain.accent }
        : { bg: semantic.text, fg: semantic.surface, border: semantic.text }
      break
    case 'outline':
      base = { border: input.colorTheme ? plain.accent : semantic.border }
      break
    case 'dot':
      base = { dot: accent }
      break
    default:
      base = {
        bg: input.colorTheme
          ? `color-mix(in srgb, ${plain.accent} 14%, transparent)`
          : semantic.subtle
      }
  }

  return buildTokenStyle('badge', base, input.tokens)
}
