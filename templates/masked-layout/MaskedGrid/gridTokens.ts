import { resolveSpacing } from '@/utils/masked-utils'
import type { DefaultTheme } from 'styled-components'
import type { GridBreakpoint, GridCols, GridVariant, SpacingKey } from './MaskedGrid.types'

/** Overrides granulares de tokens --mc-grid-*. */
export interface GridTokenOverrides {
  gap?: string
  minChildWidth?: string
  sidebarWidth?: string
  colsMobile?: string
  colsTablet?: string
  colsDesktop?: string
}

export interface ResolveGridTokensInput {
  variant?: GridVariant
  cols?: GridCols
  minChildWidth?: string
  gap?: SpacingKey | number | (string & {})
  sidebarWidth?: string
  tokens?: GridTokenOverrides
}

/** "colsMobile" -> "cols-mobile": o CSS lê --mc-grid-cols-mobile. */
function toKebab(key: string): string {
  return key.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)
}

/**
 * Colunas efetivas por breakpoint. Um número `n` já é responsivo:  
 * desktop n, tablet min(n, 2), mobile 1 — overrides do mapa vencem por chave.  
 */
export function resolveGridCols(cols: GridCols | undefined): Record<GridBreakpoint, number> {
  const desktop = typeof cols === 'number' ? cols : (cols?.desktop ?? 3)
  const tablet =
    (typeof cols === 'object' ? cols?.tablet : undefined) ?? (desktop > 2 ? 2 : desktop)
  const mobile = (typeof cols === 'object' ? cols?.mobile : undefined) ?? 1
  return { mobile, tablet, desktop }
}

/**
 * Deriva tokens --mc-grid-*. Grid é neutro (não pinta superfície): colunas  
 * por breakpoint (consumidas nas media queries do styled), gap,  
 * minChildWidth (variante 'auto') e sidebarWidth (variante 'sidebar').  
 * Do tema usa só a escala de espaçamento (theme.spacing).  
 */
export function resolveGridTokens(
  input: ResolveGridTokensInput,
  theme: DefaultTheme
): Record<string, string> {
  const cols = resolveGridCols(input.cols)

  const merged: Record<string, string | undefined> = {
    'cols-mobile': String(cols.mobile),
    'cols-tablet': String(cols.tablet),
    'cols-desktop': String(cols.desktop),
    'min-child-width': input.minChildWidth,
    'sidebar-width': input.sidebarWidth,
    gap: resolveSpacing(input.gap ?? 'md', theme.spacing),
    ...input.tokens
  }

  const style: Record<string, string> = {}

  for (const [key, value] of Object.entries(merged)) {
    if (value !== undefined) style[`--mc-grid-${toKebab(key)}`] = value
  }

  return style
}
