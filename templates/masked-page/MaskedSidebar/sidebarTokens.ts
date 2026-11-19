import { resolveColorTheme } from '@/styles/MaskedThemes/ColorThemes'
import { readableTextOn } from '@/utils/masked-utils'
import { resolveSemanticColors } from '@/styles/semanticColors'
import type { DefaultTheme } from 'styled-components'
import type { ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'
import type { SidebarVariant } from './MaskedSidebar.types'

/** Overrides granulares de tokens --mc-sidebar-* (chave = nome sem prefixo). */
export interface SidebarTokenOverrides {
  bg?: string
  fg?: string
  border?: string
  width?: string
  collapsedWidth?: string
}

export interface ResolveSidebarTokensInput {
  variant?: SidebarVariant
  colorTheme?: ColorThemeName
  width?: string
  collapsedWidth?: string
  tokens?: SidebarTokenOverrides
}

/** "collapsedWidth" -> "collapsed-width": o CSS lê --mc-sidebar-collapsed-width. */
function toKebab(key: string): string {
  return key.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)
}

/**
 * Deriva tokens --mc-sidebar-*. Superfície/texto/borda do tema ou, com  
 * colorTheme, base + texto por contraste WCAG. `minimal` não pinta fundo  
 * nem borda (herda do pai). Larguras vêm das props (defaults no CSS).  
 * Precedência: tokens > props > colorTheme > tema.  
 */
export function resolveSidebarTokens(
  input: ResolveSidebarTokensInput,
  theme: DefaultTheme
): Record<string, string> {
  const colors = resolveColorTheme(input.colorTheme, theme)
  const semantic = resolveSemanticColors(theme)

  const surface = colors?.base ?? semantic.surface
  const surfaceFg = colors ? (colors.onBase ?? readableTextOn(colors.base)) : semantic.text

  const minimal = input.variant === 'minimal'

  const merged: Record<string, string | undefined> = {
    bg: minimal ? undefined : surface,
    fg: minimal && !colors ? undefined : surfaceFg,
    border: minimal
      ? undefined
      : colors
        ? `color-mix(in srgb, ${surfaceFg} 20%, transparent)`
        : semantic.border,
    width: input.width,
    collapsedWidth: input.collapsedWidth,
    ...input.tokens
  }

  if (input.tokens?.bg && !input.tokens?.fg) {
    merged.fg = readableTextOn(input.tokens.bg)
  }

  const style: Record<string, string> = {}

  for (const [key, value] of Object.entries(merged)) {
    if (value !== undefined) style[`--mc-sidebar-${toKebab(key)}`] = value
  }

  return style
}
