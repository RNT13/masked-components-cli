import { resolveColorTheme } from '@/styles/MaskedThemes/ColorThemes'
import { buildTokenStyle, resolveSurface } from '@/styles/surfaceTokens'
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

/**
 * Deriva tokens --mc-sidebar-* sobre a superfície `solid` compartilhada.  
 * `minimal` não pinta fundo nem borda (herda do pai); sem colorTheme também  
 * não força o fg. Larguras vêm das props (defaults no CSS).  
 * Precedência: tokens > props > colorTheme > tema.  
 */
export function resolveSidebarTokens(
  input: ResolveSidebarTokensInput,
  theme: DefaultTheme
): Record<string, string> {
  const colors = resolveColorTheme(input.colorTheme, theme)
  const surface = resolveSurface('solid', input.colorTheme, theme)
  const minimal = input.variant === 'minimal'

  return buildTokenStyle(
    'sidebar',
    {
      bg: minimal ? undefined : surface.bg,
      fg: minimal && !colors ? undefined : surface.fg,
      border: minimal ? undefined : surface.border,
      width: input.width,
      collapsedWidth: input.collapsedWidth
    },
    input.tokens
  )
}
