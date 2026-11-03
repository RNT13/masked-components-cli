// templates/masked-cards/MaskedCards/cardTokens.ts
import { resolveColorTheme } from '@/styles/MaskedThemes/ColorThemes'
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

/** Deriva tokens --mc-card-* do colorTheme + theme ativo; overrides do usuário vencem. */
export function resolveCardTokens(
  input: ResolveCardTokensInput,
  theme: DefaultTheme
): Record<string, string> {
  const colors = resolveColorTheme(input.colorTheme, theme)

  const themeTokens: Record<string, string | undefined> = colors
    ? {
        bg: colors.base,
        fg: colors.onBase,
        mutedFg: colors.light40,
        border: colors.dark20,
        accent: colors.base,
        accentSoft: colors.light40,
        iconBg: colors.light08,
        iconFg: colors.onBase ?? colors.light50
      }
    : {}

  const merged = { ...themeTokens, ...input.tokens }
  const style: Record<string, string> = {}
  for (const [key, value] of Object.entries(merged)) {
    if (value !== undefined) style[`--mc-card-${key}`] = value
  }
  return style
}
