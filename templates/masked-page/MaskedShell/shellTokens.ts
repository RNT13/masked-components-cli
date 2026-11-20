import { buildTokenStyle, resolveSurface } from '@/styles/surfaceTokens'
import type { DefaultTheme } from 'styled-components'
import type { ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'

/** Overrides granulares de tokens --mc-shell-* (chave = nome sem prefixo). */
export interface ShellTokenOverrides {
  bg?: string
  fg?: string
}

export interface ResolveShellTokensInput {
  colorTheme?: ColorThemeName
  tokens?: ShellTokenOverrides
}

/**
 * Deriva tokens --mc-shell-*: fundo e texto da página sobre a superfície  
 * `solid` compartilhada. Sem colorTheme usa a superfície e o texto do tema  
 * ativo (light/dark trocam a página inteira); com colorTheme, base + texto  
 * por contraste WCAG. Precedência: tokens > colorTheme > tema.  
 * tokens.bg sem tokens.fg re-deriva o fg por contraste.  
 */
export function resolveShellTokens(
  input: ResolveShellTokensInput,
  theme: DefaultTheme
): Record<string, string> {
  const surface = resolveSurface('solid', input.colorTheme, theme)

  return buildTokenStyle('shell', { bg: surface.bg, fg: surface.fg }, input.tokens)
}
