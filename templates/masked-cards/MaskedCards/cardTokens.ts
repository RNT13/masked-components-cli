import { getColorThemeTokens } from '@/styles/MaskedThemes/ColorThemes'

/** Tokens CSS da família --mc-card-* consumidos pelos .styles.ts dos cards. */
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
  colorTheme?: string
  tokens?: CardTokenOverrides
}

/** Converte overrides em CSSProperties. Overrides do usuário vencem o colorTheme. */
export function resolveCardTokens(input: ResolveCardTokensInput): Record<string, string> {
  const themeTokens = input.colorTheme ? (getColorThemeTokens(input.colorTheme).card ?? {}) : {}
  const merged: Record<string, string | undefined> = {
    ...themeTokens,
    ...input.tokens
  }
  const style: Record<string, string> = {}
  for (const [key, value] of Object.entries(merged)) {
    if (value !== undefined) style[`--mc-card-${key}`] = value
  }
  return style
}
