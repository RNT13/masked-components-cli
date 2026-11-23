import { resolveColorTheme } from '@/styles/MaskedThemes/ColorThemes'
import { readableTextOn } from '@/utils/masked-utils'
import { resolveSemanticColors } from '@/styles/semanticColors'
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
 * Deriva tokens --mc-shell-*: fundo e texto da página. Sem colorTheme usa a
 * superfície e o texto do tema ativo (assim light/dark trocam a página
 * inteira); com colorTheme, base + texto por contraste WCAG.
 * Precedência: tokens > colorTheme > tema. tokens.bg sem tokens.fg
 * re-deriva o fg por contraste.
 */
export function resolveShellTokens(
  input: ResolveShellTokensInput,
  theme: DefaultTheme
): Record<string, string> {
  const colors = resolveColorTheme(input.colorTheme, theme)
  const semantic = resolveSemanticColors(theme)

  const bg = input.tokens?.bg ?? colors?.base ?? semantic.surface
  const fg =
    input.tokens?.fg ??
    (input.tokens?.bg
      ? readableTextOn(input.tokens.bg)
      : colors
        ? (colors.onBase ?? readableTextOn(colors.base))
        : semantic.text)

  return { '--mc-shell-bg': bg, '--mc-shell-fg': fg }
}
