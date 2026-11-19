import { resolveColorTheme } from '@/styles/MaskedThemes/ColorThemes'
import { readableTextOn } from '@/utils/masked-utils'
import { resolveSpacing } from '@/utils/masked-utils'
import type { DefaultTheme } from 'styled-components'
import type { ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'
import type { DivVariant, SpacingKey } from './MaskedDiv.types'

/** Overrides granulares de tokens --mc-div-* (chave = nome sem prefixo). */
export interface DivTokenOverrides {
  bg?: string
  fg?: string
  border?: string
  radius?: string
  shadow?: string
  gap?: string
  padding?: string
  glassBg?: string
  glassBorder?: string
}

export interface ResolveDivTokensInput {
  variant?: DivVariant
  colorTheme?: ColorThemeName
  /** Escala/valor de gap — emitido como --mc-div-gap (tokens.gap vence). */
  gap?: SpacingKey | number | (string & {})
  /** Escala/valor de padding — emitido como --mc-div-padding (tokens.padding vence). */
  padding?: SpacingKey | number | (string & {})
  tokens?: DivTokenOverrides
}

/** "glassBg" -> "glass-bg": o CSS lê --mc-div-glass-bg (kebab-case). */
function toKebab(key: string): string {
  return key.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)
}

/**
 * Deriva tokens --mc-div-* do colorTheme + tema ativo; overrides do usuário
 * vencem. Por variante (somente quando há colorTheme):
 * - plain: nada (caixa neutra, herda a superfície do pai);
 * - card: bg = base, fg por contraste (WCAG), border = dark20|base;
 * - outlined: sem bg/fg (superfície neutra), border = dark20|base;
 * - glass: bg translúcido (color-mix), fg por contraste, border suave.
 *
 * Sem colorTheme, nenhum token de cor é emitido — os fallbacks do styled
 * assumem. tokens.bg sem tokens.fg re-deriva o fg por contraste.
 */
export function resolveDivTokens(
  input: ResolveDivTokensInput,
  theme: DefaultTheme
): Record<string, string> {
  const colors = resolveColorTheme(input.colorTheme, theme)

  let themeTokens: Record<string, string | undefined> = {}

  if (colors) {
    switch (input.variant) {
      case 'card': {
        const fg = colors.onBase ?? readableTextOn(colors.base)
        themeTokens = {
          bg: colors.base,
          fg,
          border: colors.dark20 ?? colors.base
        }
        break
      }
      case 'glass': {
        const fg = colors.onBase ?? readableTextOn(colors.base)
        themeTokens = {
          fg,
          glassBg: `color-mix(in srgb, ${colors.base} 14%, transparent)`,
          glassBorder: colors.light40 ?? colors.base
        }
        break
      }
      case 'outlined':
        /* superfície neutra: sem bg/fg — só a borda pinta */
        themeTokens = { border: colors.dark20 ?? colors.base }
        break
      default:
        /* plain: nenhum token de cor */
        themeTokens = {}
    }
  }

  const merged: Record<string, string | undefined> = {
    gap: resolveSpacing(input.gap, theme.spacing),
    padding: resolveSpacing(input.padding, theme.spacing),
    ...themeTokens,
    ...input.tokens
  }

  /* tokens.bg sem tokens.fg: deriva o fg do bg final por contraste. */
  if (input.tokens?.bg && !input.tokens?.fg) {
    merged.fg = readableTextOn(input.tokens.bg)
  }

  const style: Record<string, string> = {}

  for (const [key, value] of Object.entries(merged)) {
    if (value !== undefined) style[`--mc-div-${toKebab(key)}`] = value
  }

  return style
}
