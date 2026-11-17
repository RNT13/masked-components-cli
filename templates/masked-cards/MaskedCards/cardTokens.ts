import { resolveColorTheme } from '@/styles/MaskedThemes/ColorThemes'
import { contrastRatio, parseColor, readableTextOn } from '@/utils/masked-utils'
import { maskedTheme } from '@/styles/MaskedThemes/MaskedThemes'
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
  /** Cor do marcador de seleção (✓); derivada por contraste de selectedBorder. */
  selectedFg?: string
  disabledBg?: string
  disabledFg?: string
  focusRing?: string
  glassBg?: string
  glassBorder?: string
  gradient?: string
  /** Texto sobre gradiente (derivado por contraste quando há colorTheme). */
  gradientFg?: string
  gradientMutedFg?: string
  overlayGradient?: string
}

export interface ResolveCardTokensInput {
  colorTheme?: ColorThemeName
  tokens?: CardTokenOverrides
  /** Aparência ativa — afeta como o colorTheme é derivado (ver abaixo). */
  appearance?: CardAppearance
}

/** "mutedFg" -> "muted-fg": o CSS lê --mc-card-muted-fg (kebab-case). */
function toKebab(key: string): string {
  return key.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)
}

/** Aparências cujo fundo é uma cor sólida — fg pode ser derivado por contraste. */
const SOLID_BG_APPEARANCES: ReadonlySet<CardAppearance> = new Set([
  'elevated',
  'filled',
  'outlined',
  'flat'
])

const MIN_CONTRAST = 4.5

/** Contraste seguro: retorna null quando alguma cor não é parseável (ex.: var(), gradiente). */
function safeContrast(a: string | undefined, b: string | undefined): number | null {
  if (!a || !b || !parseColor(a) || !parseColor(b)) return null
  return contrastRatio(a, b)
}

/**
 * Deriva tokens --mc-card-* do colorTheme + theme ativo; overrides do usuário vencem.  
 *
 * Por aparência (somente quando há colorTheme):  
 * - elevated/gradient/glass: bg = colors.base (comportamento original).  
 * - filled:  bg = tom suave do tema, fg por contraste contra esse fundo.  
 * - outlined: bg neutro (não emite), border = tom do tema, accent = base.  
 * - flat:    bg neutro (não emite), accentSoft = tom suave (hover), accent = base.  
 *
 * Derivação de fg: quando o consumidor passa tokens.bg SEM tokens.fg em uma  
 * aparência de fundo sólido, e o fg que valeria falha 4.5:1 contra o bg,  
 * fg/mutedFg são derivados por readableTextOn(bg). gradient/glass nunca  
 * derivam (o fundo real não é uma cor sólida).  
 */
export function resolveCardTokens(
  input: ResolveCardTokensInput,
  theme: DefaultTheme
): Record<string, string> {
  const colors = resolveColorTheme(input.colorTheme, theme)
  const appearance = input.appearance ?? 'elevated'

  let themeTokens: Record<string, string | undefined> = {}

  if (colors) {
    const fg = colors.onBase ?? readableTextOn(colors.base)
    const iconBg = colors.light08 ?? colors.base
    const softBg = colors.light40 ?? colors.light08 ?? colors.base
    const softFg = readableTextOn(softBg)

    const base = {
      accent: colors.base,
      accentSoft: colors.light40,
      iconBg,
      iconFg: readableTextOn(iconBg),
      selectedBorder: colors.base,
      selectedFg: readableTextOn(colors.base)
    }

    switch (appearance) {
      case 'filled':
        themeTokens = {
          ...base,
          bg: softBg,
          fg: softFg,
          mutedFg: `color-mix(in srgb, ${softFg} 75%, transparent)`,
          border: colors.light20 ?? 'transparent'
        }
        break
      case 'outlined':
        themeTokens = {
          ...base,
          border: colors.dark20 ?? colors.base
        }
        break
      case 'flat':
        themeTokens = { ...base }
        break
      case 'gradient':
        themeTokens = {
          ...base,
          bg: colors.base,
          fg,
          mutedFg: `color-mix(in srgb, ${fg} 75%, transparent)`,
          border: colors.dark20 ?? colors.base,
          gradient: `linear-gradient(160deg, ${colors.base}, ${colors.dark20 ?? colors.base})`,
          gradientFg: fg,
          gradientMutedFg: `color-mix(in srgb, ${fg} 78%, transparent)`
        }
        break
      case 'glass':
      case 'elevated':
      default:
        themeTokens = {
          ...base,
          bg: colors.base,
          fg,
          mutedFg: `color-mix(in srgb, ${fg} 75%, transparent)`,
          border: colors.dark20 ?? colors.base
        }
        break
    }
  }

  const merged: Record<string, string | undefined> = { ...themeTokens, ...input.tokens }

  /*
   * tokens.bg sem tokens.fg em aparência de fundo sólido: se o fg que valeria
   * (do tema ou o padrão da biblioteca) falha o contraste mínimo contra o bg
   * final, deriva fg/mutedFg por readableTextOn. Overrides explícitos vencem.
   */
  const userBg = input.tokens?.bg
  if (userBg && !input.tokens?.fg && SOLID_BG_APPEARANCES.has(appearance)) {
    const currentFg = merged.fg ?? maskedTheme.colors.baseBlack.dark40
    const ratio = safeContrast(currentFg, userBg)
    if (ratio !== null && ratio < MIN_CONTRAST) {
      const derivedFg = readableTextOn(userBg)
      merged.fg = derivedFg
      if (!input.tokens?.mutedFg) {
        merged.mutedFg = `color-mix(in srgb, ${derivedFg} 75%, transparent)`
      }
    }
  }

  const style: Record<string, string> = {}
  for (const [key, value] of Object.entries(merged)) {
    if (value !== undefined) style[`--mc-card-${toKebab(key)}`] = value
  }

  return style
}
