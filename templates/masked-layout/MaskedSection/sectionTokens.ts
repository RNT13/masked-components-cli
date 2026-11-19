import { resolveColorTheme } from '@/styles/MaskedThemes/ColorThemes'
import { readableTextOn, resolveSpacing } from '@/utils/masked-utils'
import { resolveSemanticColors } from '@/styles/semanticColors'
import type { DefaultTheme } from 'styled-components'
import type { ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'
import type { SectionVariant, SpacingKey } from './MaskedSection.types'

/** Overrides granulares de tokens --mc-section-* (chave = nome sem prefixo). */
export interface SectionTokenOverrides {
  bg?: string
  fg?: string
  border?: string
  muted?: string
  paddingY?: string
  maxWidth?: string
}

export interface ResolveSectionTokensInput {
  variant?: SectionVariant
  colorTheme?: ColorThemeName
  paddingY?: SpacingKey | number | (string & {})
  tokens?: SectionTokenOverrides
}

/** "paddingY" -> "padding-y": o CSS lê --mc-section-padding-y. */
function toKebab(key: string): string {
  return key.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)
}

/**
 * Deriva tokens --mc-section-*. Por variante:
 * - plain: nada de cor (herda o fundo do pai);
 * - tinted: fundo suave (10% da base do colorTheme, ou o `subtle` do tema);
 * - bordered: bordas superior/inferior (colorTheme ou borda do tema);
 * - gradient: base → base misturada com o texto (só aumenta o contraste);
 *   texto por contraste WCAG sobre a base (bg `--mc-section-bg` é o gradiente).
 * Precedência: tokens > props > colorTheme > tema. tokens.bg sem tokens.fg
 * só re-deriva o fg quando o bg é uma cor simples.
 */
export function resolveSectionTokens(
  input: ResolveSectionTokensInput,
  theme: DefaultTheme
): Record<string, string> {
  const colors = resolveColorTheme(input.colorTheme, theme)
  const semantic = resolveSemanticColors(theme)

  let themeTokens: Record<string, string | undefined> = {}

  switch (input.variant) {
    case 'tinted':
      themeTokens = {
        bg: colors ? `color-mix(in srgb, ${colors.base} 10%, transparent)` : semantic.subtle
      }
      break
    case 'bordered':
      themeTokens = { border: colors ? (colors.light40 ?? colors.base) : semantic.border }
      break
    case 'gradient': {
      const from = colors?.base ?? semantic.accent
      const fg = colors?.onBase ?? readableTextOn(from)
      themeTokens = {
        bg: `linear-gradient(135deg, ${from}, color-mix(in srgb, ${from} 82%, ${fg}))`,
        fg,
        muted: `color-mix(in srgb, ${fg} 82%, transparent)`
      }
      break
    }
    default:
      themeTokens = {}
  }

  const merged: Record<string, string | undefined> = {
    paddingY: resolveSpacing(input.paddingY, theme.spacing),
    ...themeTokens,
    ...input.tokens
  }

  /* tokens.fg explícito sem muted: o muted acompanha o fg do usuário */
  if (input.tokens?.fg && !input.tokens?.muted) {
    merged.muted = `color-mix(in srgb, ${input.tokens.fg} 82%, transparent)`
  }

  const style: Record<string, string> = {}

  for (const [key, value] of Object.entries(merged)) {
    if (value !== undefined) style[`--mc-section-${toKebab(key)}`] = value
  }

  return style
}
