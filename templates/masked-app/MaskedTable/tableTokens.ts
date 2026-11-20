import { buildTokenStyle, resolveSurface } from '@/styles/surfaceTokens'
import { resolveSemanticColors } from '@/styles/semanticColors'
import { normalizeText } from '@/utils/masked-utils'
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

/* ------------------------------------------------------------------ */
/* DataTable: busca, filtros, seleção, visibilidade e paginação          */
/* ------------------------------------------------------------------ */

/**
 * Texto pesquisável/filtrável de uma célula: usa `sortValue` quando existe  
 * (mesmo valor da ordenação) ou `row[key]`. Conteúdo ReactNode de `cell`  
 * não é pesquisável — forneça `sortValue` para colunas customizadas.  
 */
function cellText<T>(row: T, column: TableColumn<T>): string {
  const value = column.sortValue
    ? column.sortValue(row)
    : (row as Record<string, unknown>)[column.key]
  if (value === null || value === undefined) return ''
  if (value instanceof Date) return value.toISOString()
  return String(value)
}

/**
 * Busca global: mantém as linhas em que QUALQUER coluna (ou só as de `keys`)  
 * contém o termo, ignorando acentos e caixa (normalizeText). Vazio = data.  
 */
export function filterRows<T>(
  data: T[],
  columns: TableColumn<T>[],
  query: string,
  keys?: string[]
): T[] {
  const term = normalizeText(query)
  if (!term) return data
  const cols = keys?.length ? columns.filter((c) => keys.includes(c.key)) : columns
  return data.filter((row) => cols.some((col) => normalizeText(cellText(row, col)).includes(term)))
}

/** Filtro ativo de coluna: chave da coluna + valor da opção escolhida. */
export interface ActiveColumnFilter {
  key: string
  value: string
}

/**
 * Filtros por coluna (AND entre filtros com valor não vazio).  
 * `match(row, key, value)` é opcional e chamado por filtro: retornando  
 * `boolean` ele decide a linha (faixas, datas, múltipla escolha); retornando  
 * `undefined` cai no padrão — igualdade normalizada entre o texto da célula  
 * e o valor da opção.  
 */
export function applyColumnFilters<T>(
  data: T[],
  columns: TableColumn<T>[],
  active: ActiveColumnFilter[],
  match?: (row: T, key: string, value: string) => boolean | undefined
): T[] {
  const enabled = active.filter((f) => f.value !== '' && f.value !== undefined)
  if (enabled.length === 0) return data

  return data.filter((row) =>
    enabled.every((filter) => {
      const custom = match?.(row, filter.key, filter.value)
      if (custom !== undefined) return custom
      const column = columns.find((c) => c.key === filter.key)
      const raw = column
        ? cellText(row, column)
        : String((row as Record<string, unknown>)[filter.key] ?? '')
      return normalizeText(raw) === normalizeText(filter.value)
    })
  )
}

/** Alterna uma chave no conjunto de selecionados (retorna novo array). */
export function toggleKey(selected: string[], key: string): string[] {
  return selected.includes(key) ? selected.filter((k) => k !== key) : [...selected, key]
}

/** Chaves de todas as linhas (para "selecionar tudo" — respeita a página/filtro atual). */
export function allRowKeys<T>(rows: T[], keyOf: (row: T, index: number) => string): string[] {
  return rows.map((row, index) => keyOf(row, index))
}

/** Colunas visíveis = columns menos as escondidas (ordem preservada). */
export function visibleColumns<T>(columns: TableColumn<T>[], hidden: string[]): TableColumn<T>[] {
  if (hidden.length === 0) return columns
  return columns.filter((c) => !hidden.includes(c.key))
}

/** Fatia da página atual (base 1). */
export function paginateRows<T>(rows: T[], page: number, pageSize: number): T[] {
  const size = Math.max(1, Math.floor(pageSize))
  const current = Math.max(1, Math.floor(page))
  return rows.slice((current - 1) * size, current * size)
}
