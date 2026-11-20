import { buildTokenStyle, resolveSurface } from '@/styles/surfaceTokens'
import type { DefaultTheme } from 'styled-components'
import type { ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'

/** Overrides granulares de tokens --mc-footer-* (chave = nome sem prefixo). */
export interface FooterTokenOverrides {
  bg?: string
  fg?: string
  muted?: string
  border?: string
}

export interface ResolveFooterTokensInput {
  colorTheme?: ColorThemeName
  tokens?: FooterTokenOverrides
}

/**
 * Deriva tokens --mc-footer-* sobre a superfície `solid` compartilhada:  
 * sem colorTheme usa superfície/texto/borda do tema ativo; com colorTheme,  
 * bg = base e fg por contraste WCAG (onBase ou readableTextOn).  
 * Precedência: tokens > colorTheme > tema. tokens.bg sem tokens.fg  
 * re-deriva o fg por contraste (via buildTokenStyle).  
 */
export function resolveFooterTokens(
  input: ResolveFooterTokensInput,
  theme: DefaultTheme
): Record<string, string> {
  const surface = resolveSurface('solid', input.colorTheme, theme)

  return buildTokenStyle(
    'footer',
    {
      bg: surface.bg,
      fg: surface.fg,
      muted: surface.muted,
      border: surface.border
    },
    input.tokens
  )
}
