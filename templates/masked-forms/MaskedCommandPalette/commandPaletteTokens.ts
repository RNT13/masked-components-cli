import { buildTokenStyle, resolveSurface } from '@/styles/surfaceTokens'
import { resolveSemanticColors } from '@/styles/semanticColors'
import type { DefaultTheme } from 'styled-components'
import type { ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'
import type { CommandItem } from './MaskedCommandPalette.types'
import { normalizeText } from '@/utils/masked-utils'
export { normalizeText }

/** Overrides granulares de tokens --mc-command-palette-* (chave = nome sem prefixo). */
export interface CommandPaletteTokenOverrides {
  accent?: string
  border?: string
  muted?: string
}

export interface ResolveCommandPaletteTokensInput {
  colorTheme?: ColorThemeName
  tokens?: CommandPaletteTokenOverrides
}

/**
 * Deriva tokens --mc-command-palette-*: a barra do item ativo usa o accent  
 * (em painel pintado, o próprio texto da superfície); borda e texto  
 * secundário vêm do tema, ou do texto suavizado quando há colorTheme.  
 * O fundo e o texto do painel são do MaskedPopup (que recebe o colorTheme).  
 * Precedência: tokens > colorTheme > tema.  
 */
export function resolveCommandPaletteTokens(
  input: ResolveCommandPaletteTokensInput,
  theme: DefaultTheme
): Record<string, string> {
  const semantic = resolveSemanticColors(theme)
  const solid = input.colorTheme ? resolveSurface('solid', input.colorTheme, theme) : undefined
  return buildTokenStyle(
    'command-palette',
    {
      accent: solid ? solid.accent : semantic.accent,
      border: solid ? solid.border : semantic.border,
      muted: solid ? solid.muted : semantic.muted
    },
    input.tokens
  )
}

/** Pontuação de um item para os termos da busca (menor = melhor); null se algum termo não casa. */
export function scoreCommand(item: CommandItem, terms: string[]): number | null {
  const label = normalizeText(item.label)
  const words = label.split(/\s+/)
  const keywords = (item.keywords ?? []).map((k: string) => normalizeText(k))
  const description = normalizeText(item.description ?? '')
  const group = normalizeText(item.group ?? '')

  let total = 0
  for (const term of terms) {
    let best: number | null = null
    const consider = (score: number, hit: boolean) => {
      if (hit && (best === null || score < best)) best = score
    }
    consider(0, label.startsWith(term))
    consider(
      1,
      words.some((w: string) => w.startsWith(term))
    )
    consider(2, label.includes(term))
    consider(
      3,
      keywords.some((k: string) => k.includes(term))
    )
    consider(4, group.includes(term))
    consider(5, description.includes(term))
    if (best === null) return null
    total += best
  }
  return total
}

/** Filtra e ordena por relevância (estável). Busca vazia devolve a lista como está. */
export function filterCommands<T extends CommandItem>(items: T[], query: string): T[] {
  const terms = normalizeText(query).split(/\s+/).filter(Boolean)
  if (terms.length === 0) return items
  return items
    .map((item, index) => ({ item, index, score: scoreCommand(item, terms) }))
    .filter((entry): entry is { item: T; index: number; score: number } => entry.score !== null)
    .sort((a, b) => a.score - b.score || a.index - b.index)
    .map((entry) => entry.item)
}

export interface CommandGroup<T> {
  group?: string
  items: T[]
}

/** Agrupa mantendo a ordem em que cada grupo aparece pela primeira vez (itens sem grupo formam um bloco próprio). */
export function groupCommands<T extends { group?: string }>(items: T[]): CommandGroup<T>[] {
  const groups: CommandGroup<T>[] = []
  for (const item of items) {
    const found = groups.find((g) => g.group === item.group)
    if (found) found.items.push(item)
    else groups.push({ group: item.group, items: [item] })
  }
  return groups
}

/** Índice do primeiro item habilitado (ou -1). */
export function firstEnabled(items: { disabled?: boolean }[]): number {
  return items.findIndex((item) => !item.disabled)
}

/** Próximo item habilitado a partir de `from`, com volta circular. */
export function moveActive(items: { disabled?: boolean }[], from: number, delta: 1 | -1): number {
  const count = items.length
  if (count === 0) return -1
  for (let step = 1; step <= count; step++) {
    const index = (((from + delta * step) % count) + count) % count
    if (!items[index].disabled) return index
  }
  return from
}
