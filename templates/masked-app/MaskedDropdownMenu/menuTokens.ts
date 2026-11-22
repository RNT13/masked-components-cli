import type { DefaultTheme } from 'styled-components'
import type { ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'
import { buildTokenStyle, resolveSurface } from '@/styles/surfaceTokens'
import type { MenuTokenOverrides } from './MaskedDropdownMenu.types'

export interface ResolveMenuTokensInput {
  colorTheme?: ColorThemeName
  tokens?: MenuTokenOverrides
}

/**
 * Deriva tokens --mc-menu-*. Superfície sólida do tema (ou da paleta com  
 * colorTheme); o item destacado usa o accent. Precedência: tokens > colorTheme > tema.  
 */
export function resolveMenuTokens(
  input: ResolveMenuTokensInput,
  theme: DefaultTheme
): Record<string, string> {
  const surface = resolveSurface('solid', input.colorTheme, theme)

  const base: Record<string, string | undefined> = {
    bg: surface.bg,
    fg: surface.fg,
    muted: surface.muted,
    border: surface.border,
    itemHoverBg: surface.accent,
    itemHoverFg: surface.accentFg
  }

  return buildTokenStyle('menu', base, input.tokens)
}

/**
 * Índice do próximo item habilitado a partir de `from` (exclusive), andando  
 * `step` posições com wrap. Ignora separadores e desabilitados. Retorna -1  
 * quando não há item habilitado.  
 */
export function nextEnabledItem(
  items: Array<{ disabled?: boolean; separator?: boolean }>,
  from: number,
  step: 1 | -1
): number {
  const n = items.length
  if (n === 0) return -1
  for (let i = 1; i <= n; i++) {
    const idx = (from + step * i + n * i) % n
    const item = items[idx]
    if (!item.separator && !item.disabled) return idx
  }
  return -1
}

/** Primeiro/último item habilitado (para Home/End). */
export function edgeEnabledItem(
  items: Array<{ disabled?: boolean; separator?: boolean }>,
  edge: 'first' | 'last'
): number {
  return edge === 'first' ? nextEnabledItem(items, -1, 1) : nextEnabledItem(items, 0, -1)
}
