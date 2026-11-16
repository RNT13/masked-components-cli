import { resolveColorTheme } from '@/styles/MaskedThemes/ColorThemes'
import { readableTextOn } from '@/utils/masked-utils'
import type { DefaultTheme } from 'styled-components'
import type { ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'
import type { CardAppearance } from './MaskedCards.types'

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
  mediaBg?: string
  selectedBg?: string
  selectedBorder?: string
  selectedFg?: string
  disabledBg?: string
  disabledFg?: string
  focusRing?: string
  glassBg?: string
  glassBorder?: string
  gradient?: string
  gradientFg?: string
  gradientMutedFg?: string
  overlayGradient?: string
}

export interface ResolveCardTokensInput {
  colorTheme?: ColorThemeName
  tokens?: CardTokenOverrides
  /**
   * Aparência do card. filled/outlined/flat derivam um conjunto próprio  
   * quando há colorTheme (fundo suave/neutro + fg por contraste);  
   * elevated/gradient/glass mantêm a derivação original (bg = base).  
   */
  appearance?: CardAppearance
}

/** "mutedFg" -> "muted-fg": o CSS lê --mc-card-muted-fg (kebab-case). */
function toKebab(key: string): string {
  return key.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)
}

/** Aparências de superfície suave/neutra — não pintam o card com a cor base. */
const SOFT_APPEARANCES: ReadonlyArray<CardAppearance> = ['filled', 'outlined', 'flat']

/**
 * Deriva tokens --mc-card-* do colorTheme + theme ativo; overrides do usuário vencem.  
 * O texto sobre o fundo é escolhido por contraste (WCAG) quando o tema não define `onBase`.  
 *
 * Por aparência (somente quando há colorTheme):  
 * - elevated/gradient/glass: bg = base, fg = onBase|contraste (comportamento original).  
 * - filled:  bg = tom suave (light40 → light08 → base), fg/mutedFg por contraste.  
 * - outlined: sem bg/fg (superfície neutra da biblioteca), border = dark20|base.  
 * - flat:    sem bg/fg (transparente), hover por accentSoft.  
 *
 * Se o consumidor passa tokens.bg sem tokens.fg em filled/outlined/flat,  
 * o fg é derivado do bg final por contraste (em elevated/gradient/glass  
 * o fg do tema é mantido — comportamento histórico preservado).  
 */
export function resolveCardTokens(
  input: ResolveCardTokensInput,
  theme: DefaultTheme
): Record<string, string> {
  const colors = resolveColorTheme(input.colorTheme, theme)

  let themeTokens: Record<string, string | undefined> = {}

  if (colors) {
    const iconBg = colors.light08 ?? colors.base
    const shared = {
      accent: colors.base,
      accentSoft: colors.light40,
      iconBg,
      iconFg: readableTextOn(iconBg),
      /* fg do marcador de seleção: contraste contra a borda de seleção */
      selectedFg: readableTextOn(colors.dark20 ?? colors.base),
      /* fg sobre o gradiente (que começa em base): contraste contra base */
      gradientFg: readableTextOn(colors.base),
      gradientMutedFg: `color-mix(in srgb, ${readableTextOn(colors.base)} 78%, transparent)`
    }

    switch (input.appearance) {
      case 'filled': {
        const bg = colors.light40 ?? colors.light08 ?? colors.base
        const fg = readableTextOn(bg)
        themeTokens = {
          ...shared,
          bg,
          fg,
          mutedFg: `color-mix(in srgb, ${fg} 75%, transparent)`,
          border: colors.light20 ?? colors.base
        }
        break
      }
      case 'outlined':
        /* superfície neutra: sem bg/fg — caem nos defaults da biblioteca */
        themeTokens = {
          ...shared,
          border: colors.dark20 ?? colors.base
        }
        break
      case 'flat':
        /* transparente: sem bg/fg; hover usa accentSoft */
        themeTokens = { ...shared }
        break
      default: {
        /* elevated | gradient | glass | undefined — derivação original */
        const fg = colors.onBase ?? readableTextOn(colors.base)
        themeTokens = {
          ...shared,
          bg: colors.base,
          fg,
          mutedFg: `color-mix(in srgb, ${fg} 75%, transparent)`,
          border: colors.dark20 ?? colors.base
        }
      }
    }
  }

  const merged: Record<string, string | undefined> = { ...themeTokens, ...input.tokens }

  /*
   * tokens.bg sem tokens.fg: deriva o fg do bg final por contraste.
   * Restrito às aparências suaves — em elevated/gradient/glass o fg do
   * tema é mantido (comportamento histórico; mudar ali alteraria o visual
   * de cards existentes que passam só tokens.bg).
   */
  if (
    input.tokens?.bg &&
    !input.tokens?.fg &&
    SOFT_APPEARANCES.includes(input.appearance ?? 'elevated')
  ) {
    const fg = readableTextOn(input.tokens.bg)
    merged.fg = fg
    merged.mutedFg = `color-mix(in srgb, ${fg} 75%, transparent)`
  }

  const style: Record<string, string> = {}

  for (const [key, value] of Object.entries(merged)) {
    if (value !== undefined) style[`--mc-card-${toKebab(key)}`] = value
  }

  return style
}
