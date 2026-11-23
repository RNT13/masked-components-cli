import { resolveColorTheme } from '@/styles/MaskedThemes/ColorThemes'
import { readableTextOn } from '@/utils/masked-utils'
import { resolveSemanticColors } from '@/styles/semanticColors'
import type { DefaultTheme } from 'styled-components'
import type { ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'
import type { PageHeaderVariant } from './MaskedPageHeader.types'

/** Overrides granulares de tokens --mc-page-header-* (chave = nome sem prefixo). */
export interface PageHeaderTokenOverrides {
  bg?: string
  fg?: string
  muted?: string
  border?: string
}

export interface ResolvePageHeaderTokensInput {
  variant?: PageHeaderVariant
  colorTheme?: ColorThemeName
  tokens?: PageHeaderTokenOverrides
}

/**
 * Deriva tokens --mc-page-header-*. Por variante:
 * - simple: sem fundo, só a borda inferior (borda do tema ou do colorTheme);
 * - banner: fundo suave (10% da base do colorTheme, ou `subtle` do tema);
 * - gradient: base → base misturada com o texto, fg por contraste WCAG.
 * Precedência: tokens > colorTheme > tema.
 */
export function resolvePageHeaderTokens(
  input: ResolvePageHeaderTokensInput,
  theme: DefaultTheme
): Record<string, string> {
  const colors = resolveColorTheme(input.colorTheme, theme)
  const semantic = resolveSemanticColors(theme)

  let themeTokens: Record<string, string | undefined> = {
    border: colors ? (colors.light40 ?? colors.base) : semantic.border,
    muted: semantic.muted
  }

  if (input.variant === 'banner') {
    themeTokens = {
      ...themeTokens,
      bg: colors ? `color-mix(in srgb, ${colors.base} 10%, transparent)` : semantic.subtle
    }
  }

  if (input.variant === 'gradient') {
    const from = colors?.base ?? semantic.accent
    const fg = colors?.onBase ?? readableTextOn(from)
    themeTokens = {
      bg: `linear-gradient(135deg, ${from}, color-mix(in srgb, ${from} 82%, ${fg}))`,
      fg,
      muted: `color-mix(in srgb, ${fg} 82%, transparent)`,
      border: 'transparent'
    }
  }

  const merged: Record<string, string | undefined> = { ...themeTokens, ...input.tokens }

  if (input.tokens?.fg && !input.tokens?.muted) {
    merged.muted = `color-mix(in srgb, ${input.tokens.fg} 82%, transparent)`
  }

  const style: Record<string, string> = {}

  for (const [key, value] of Object.entries(merged)) {
    if (value !== undefined) style[`--mc-page-header-${key}`] = value
  }

  return style
}
