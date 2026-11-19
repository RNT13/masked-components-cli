import { resolveColorTheme } from '@/styles/MaskedThemes/ColorThemes'
import { readableTextOn } from '@/utils/masked-utils'
import { resolveSemanticColors } from '@/styles/semanticColors'
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
 * Deriva tokens --mc-footer-*. Sem colorTheme: superfície/texto/borda do
 * tema ativo. Com colorTheme: bg = base, fg por contraste WCAG (onBase ou
 * readableTextOn), muted = fg suavizado, borda = fg a 20%.
 * Precedência: tokens > colorTheme > tema. tokens.bg sem tokens.fg
 * re-deriva o fg por contraste.
 */
export function resolveFooterTokens(
  input: ResolveFooterTokensInput,
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

  const merged: Record<string, string> = {
    bg,
    fg,
    muted:
      input.tokens?.muted ??
      (colors || input.tokens ? `color-mix(in srgb, ${fg} 82%, transparent)` : semantic.muted),
    border:
      input.tokens?.border ??
      (colors ? `color-mix(in srgb, ${fg} 20%, transparent)` : semantic.border)
  }

  const style: Record<string, string> = {}

  for (const [key, value] of Object.entries(merged)) style[`--mc-footer-${key}`] = value

  return style
}
