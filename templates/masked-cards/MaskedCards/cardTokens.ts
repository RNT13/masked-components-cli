import { resolveColorTheme } from '@/styles/MaskedThemes/ColorThemes'
import { readableTextOn } from '@/utils/masked-utils'
import type { DefaultTheme } from 'styled-components'
import type { ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'

export interface CardTokenOverrides {
  bg?: string
  fg?: string
  mutedFg?: string
  border?: string
  radius?: string
  shadow?: string
  shadowHover?: string
  accent?: string
  accentSoft?: string
  success?: string
  danger?: string
  warning?: string
  neutralTrend?: string
  iconBg?: string
  iconFg?: string
  planActiveBg?: string
  planActiveBorder?: string
  planInactiveBg?: string
  planInactiveBorder?: string
  placeholderBg?: string
}

export interface ResolveCardTokensInput {
  colorTheme?: ColorThemeName
  tokens?: CardTokenOverrides
}

/** "mutedFg" -> "muted-fg": o CSS lê --mc-card-muted-fg (kebab-case). */
function toKebab(key: string): string {
  return key.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)
}

/**
 * Deriva tokens --mc-card-* do colorTheme + theme ativo; overrides do usuário vencem.
 * O texto sobre o fundo é escolhido por contraste (WCAG) quando o tema não define `onBase`.
 */
export function resolveCardTokens(
  input: ResolveCardTokensInput,
  theme: DefaultTheme
): Record<string, string> {
  const colors = resolveColorTheme(input.colorTheme, theme)

  let themeTokens: Record<string, string | undefined> = {}

  if (colors) {
    const fg = colors.onBase ?? readableTextOn(colors.base)
    const iconBg = colors.light08 ?? colors.base

    themeTokens = {
      bg: colors.base,
      fg,
      mutedFg: `color-mix(in srgb, ${fg} 75%, transparent)`,
      border: colors.dark20 ?? colors.base,
      accent: colors.base,
      accentSoft: colors.light40,
      iconBg,
      iconFg: readableTextOn(iconBg)
    }
  }

  const merged: Record<string, string | undefined> = { ...themeTokens, ...input.tokens }
  const style: Record<string, string> = {}

  for (const [key, value] of Object.entries(merged)) {
    if (value !== undefined) style[`--mc-card-${toKebab(key)}`] = value
  }

  return style
}
