import type { DefaultTheme } from 'styled-components'
import type { ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'
import { buildTokenStyle, resolveSurface } from '@/styles/surfaceTokens'
import type { SelectOption, SelectTokenOverrides } from './MaskedSelect.types'

export interface ResolveSelectTokensInput {
  colorTheme?: ColorThemeName
  tokens?: SelectTokenOverrides
}

/**
 * Tokens --mc-select-*: superfície 'solid' (bg/fg/muted/border do tema ou  
 * colorTheme) + tokens específicos de item/selected/placeholder.  
 * Precedência: tokens > colorTheme > tema.  
 */
export function resolveSelectTokens(
  input: ResolveSelectTokensInput,
  theme: DefaultTheme
): Record<string, string> {
  const surface = resolveSurface('solid', input.colorTheme, theme)

  const base: Record<string, string | undefined> = {
    bg: surface.bg,
    fg: surface.fg,
    muted: surface.muted,
    border: surface.border,
    itemBg: `color-mix(in srgb, ${surface.fg} 8%, transparent)`,
    itemFg: surface.fg,
    selectedBg: surface.accent,
    selectedFg: surface.accentFg,
    placeholder: surface.muted
  }

  return buildTokenStyle('select', base, input.tokens)
}

/**
 * Próximo índice habilitado a partir de `from` na direção `dir` (+1/-1),  
 * com wrap-around. Retorna -1 se todas estiverem desabilitadas.  
 */
export function nextEnabledOption(options: SelectOption[], from: number, dir: 1 | -1): number {
  const len = options.length
  if (len === 0) return -1
  for (let step = 1; step <= len; step++) {
    const idx = (from + dir * step + len * step) % len
    if (!options[idx].disabled) return idx
  }
  return -1
}

/** Primeiro (`edge='first'`) ou último (`edge='last'`) índice habilitado. */
export function edgeEnabledOption(options: SelectOption[], edge: 'first' | 'last'): number {
  if (edge === 'first') return nextEnabledOption(options, -1, 1)
  return nextEnabledOption(options, options.length, -1)
}

/**
 * Typeahead: primeira opção habilitada cujo label começa com `query`  
 * (case-insensitive), buscando a partir de `after` com wrap-around.  
 */
export function findOptionByText(options: SelectOption[], query: string, after = -1): number {
  const q = query.trim().toLowerCase()
  if (!q) return -1
  const len = options.length
  for (let step = 1; step <= len; step++) {
    const idx = (after + step) % len
    const opt = options[idx]
    if (opt.disabled) continue
    const text = typeof opt.label === 'string' ? opt.label : String(opt.value)
    if (text.toLowerCase().startsWith(q)) return idx
  }
  return -1
}
