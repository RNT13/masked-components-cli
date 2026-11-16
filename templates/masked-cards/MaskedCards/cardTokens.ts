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
  /** Fundo de áreas de mídia/imagem. */
  mediaBg?: string
  /** Fundo do estado selecionado. */
  selectedBg?: string
  /** Borda/anel do estado selecionado. */
  selectedBorder?: string
  /** Fundo do estado desabilitado. */
  disabledBg?: string
  /** Texto do estado desabilitado. */
  disabledFg?: string
  /** Cor do anel de foco (focus-visible). */
  focusRing?: string
  /** Fundo translúcido da aparência glass. */
  glassBg?: string
  /** Borda semitransparente da aparência glass. */
  glassBorder?: string
  /** Gradiente da aparência gradient (valor completo de background-image). */
  gradient?: string
  /** Gradiente de overlay sobre imagem de fundo (legibilidade). */
  overlayGradient?: string
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
      iconFg: readableTextOn(iconBg),
      selectedBorder: colors.base,
      focusRing: colors.base,
      gradient: `linear-gradient(160deg, ${colors.base}, ${colors.dark20 ?? colors.base})`,
      glassBg: `color-mix(in srgb, ${colors.base} 18%, transparent)`,
      glassBorder: `color-mix(in srgb, ${colors.base} 35%, transparent)`
    }
  }

  const merged: Record<string, string | undefined> = { ...themeTokens, ...input.tokens }
  const style: Record<string, string> = {}

  for (const [key, value] of Object.entries(merged)) {
    if (value !== undefined) style[`--mc-card-${toKebab(key)}`] = value
  }

  return style
}
