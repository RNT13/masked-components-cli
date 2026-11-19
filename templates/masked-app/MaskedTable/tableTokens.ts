import { buildTokenStyle, resolveSurface } from '@/styles/surfaceTokens'
import { resolveSemanticColors } from '@/styles/semanticColors'
import type { DefaultTheme } from 'styled-components'
import type { ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'
import type { TableColumn, TableSort, TableSortValue } from './MaskedTable.types'

/** Overrides granulares de tokens --mc-table-* (chave = nome sem prefixo). */
export interface TableTokenOverrides {
  border?: string
  headBg?: string
  stripe?: string
  accent?: string
}

export interface ResolveTableTokensInput {
  colorTheme?: ColorThemeName
  tokens?: TableTokenOverrides
}

/**
 * Deriva tokens --mc-table-*: borda e fundo do cabeçalho (superfície do tema,
 * para o cabeçalho fixo não ficar transparente sobre as linhas), faixa das
 * linhas alternadas e destaque. Texto herda do contexto.
 * Precedência: tokens > colorTheme > tema.
 */
export function resolveTableTokens(
  input: ResolveTableTokensInput,
  theme: DefaultTheme
): Record<string, string> {
  const semantic = resolveSemanticColors(theme)
  const surface = resolveSurface('plain', input.colorTheme, theme)
  return buildTokenStyle(
    'table',
    {
      border: semantic.border,
      headBg: semantic.surface,
      stripe: 'color-mix(in srgb, currentColor 5%, transparent)',
      accent: input.colorTheme ? surface.accent : semantic.text
    },
    input.tokens
  )
}

/** Próximo estado de ordenação ao clicar numa coluna: asc → desc → sem ordenação. */
export function nextSort(current: TableSort | undefined, key: string): TableSort | undefined {
  if (current?.key !== key) return { key, direction: 'asc' }
  if (current.direction === 'asc') return { key, direction: 'desc' }
  return undefined
}

function comparable(value: TableSortValue): string | number | null {
  if (value === null || value === undefined || value === '') return null
  if (value instanceof Date) return value.getTime()
  return value
}

/**
 * Ordena uma cópia das linhas (estável). Números e datas comparam como número;
 * textos usam `Intl.Collator` com `numeric` ("2" antes de "10"); valores
 * vazios vão sempre para o fim, em qualquer direção.
 */
export function sortRows<T>(
  data: T[],
  columns: TableColumn<T>[],
  sort: TableSort | undefined,
  locale = 'pt-BR'
): T[] {
  if (!sort) return data
  const column = columns.find((c) => c.key === sort.key)
  if (!column) return data

  const collator = new Intl.Collator(locale, { numeric: true, sensitivity: 'base' })
  const read = (row: T): TableSortValue =>
    column.sortValue ? column.sortValue(row) : (row as Record<string, TableSortValue>)[sort.key]
  const factor = sort.direction === 'asc' ? 1 : -1

  return data
    .map((row, index) => ({ row, index, value: comparable(read(row)) }))
    .sort((a, b) => {
      if (a.value === null && b.value === null) return a.index - b.index
      if (a.value === null) return 1
      if (b.value === null) return -1
      const result =
        typeof a.value === 'number' && typeof b.value === 'number'
          ? a.value - b.value
          : collator.compare(String(a.value), String(b.value))
      return result === 0 ? a.index - b.index : result * factor
    })
    .map((entry) => entry.row)
}
