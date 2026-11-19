import { resolveColorTheme } from '@/styles/MaskedThemes/ColorThemes'
import { readableTextOn } from '@/utils/masked-utils'
import { resolveSemanticColors } from '@/styles/semanticColors'
import type { DefaultTheme } from 'styled-components'
import type { ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'
import type { HeaderVariant } from './MaskedHeader.types'

/** Overrides granulares de tokens --mc-header-* (chave = nome sem prefixo). */
export interface HeaderTokenOverrides {
  bg?: string
  fg?: string
  border?: string
  /** Cor do texto dos links no menu mobile (painel do Drawer). */
  menuFg?: string
  height?: string
}

export interface ResolveHeaderTokensInput {
  variant?: HeaderVariant
  colorTheme?: ColorThemeName
  tokens?: HeaderTokenOverrides
}

/** "menuFg" -> "menu-fg": o CSS lê --mc-header-menu-fg. */
function toKebab(key: string): string {
  return key.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)
}

/**
 * Deriva tokens --mc-header-*. Por variante:  
 * - static/sticky: superfície do tema (ou base do colorTheme) + texto por  
 *   contraste WCAG + borda inferior;  
 * - blur: igual, mas o fundo é 80% opaco (o blur vem do styled);  
 * - transparent: sem fundo e sem borda — texto herdado, a menos que  
 *   tokens.fg seja informado.  
 * `menuFg` (texto do menu mobile, que vive no painel do Drawer) acompanha o  
 * colorTheme; sem ele, usa o texto do tema. Precedência: tokens > colorTheme > tema.  
 */
export function resolveHeaderTokens(
  input: ResolveHeaderTokensInput,
  theme: DefaultTheme
): Record<string, string> {
  const colors = resolveColorTheme(input.colorTheme, theme)
  const semantic = resolveSemanticColors(theme)

  const surface = colors?.base ?? semantic.surface
  const surfaceFg = colors ? (colors.onBase ?? readableTextOn(colors.base)) : semantic.text

  let themeTokens: Record<string, string | undefined>

  if (input.variant === 'transparent') {
    themeTokens = { border: 'transparent' }
  } else {
    themeTokens = {
      bg: input.variant === 'blur' ? `color-mix(in srgb, ${surface} 80%, transparent)` : surface,
      fg: surfaceFg,
      border: colors ? `color-mix(in srgb, ${surfaceFg} 20%, transparent)` : semantic.border
    }
  }

  const merged: Record<string, string | undefined> = {
    ...themeTokens,
    menuFg: surfaceFg,
    ...input.tokens
  }

  /* tokens.bg sem tokens.fg: o fg acompanha o novo fundo por contraste */
  if (input.tokens?.bg && !input.tokens?.fg && input.variant !== 'transparent') {
    merged.fg = readableTextOn(input.tokens.bg)
  }

  const style: Record<string, string> = {}

  for (const [key, value] of Object.entries(merged)) {
    if (value !== undefined) style[`--mc-header-${toKebab(key)}`] = value
  }

  return style
}
