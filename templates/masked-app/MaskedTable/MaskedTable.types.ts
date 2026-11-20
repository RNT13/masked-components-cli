import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'
import type { ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'
import type { MaskedEmptyStateProps } from '@/components/ui/MaskedEmptyState/MaskedEmptyState.types'
import type { PaginationVariant } from '@/components/ui/MaskedPagination/MaskedPagination.types'
import type { TableTokenOverrides } from './tableTokens'

/** Aparência da tabela. Default 'simple'. */
export type TableVariant = 'simple' | 'striped' | 'bordered' | 'card'

export type TableSortDirection = 'asc' | 'desc'

export type TableSort = { key: string; direction: TableSortDirection }

export type TableSortValue = string | number | Date | null | undefined

export type TableColumn<T> = {
  /** Identificador da coluna; também é a propriedade lida da linha quando não há `cell`/`sortValue`. */
  key: string
  header: ReactNode
  /** Conteúdo da célula. Default: `String(row[key])`. */
  cell?: (row: T, index: number) => ReactNode
  align?: 'start' | 'center' | 'end'
  /** Largura CSS da coluna (ex.: '120px', '20%'). */
  width?: string
  /** Mostra o botão de ordenar no cabeçalho. */
  sortable?: boolean
  /** Valor usado para ordenar E para busca/filtro. Default: `row[key]`. */
  sortValue?: (row: T) => TableSortValue
  /** Renderiza esta coluna como cabeçalho de linha (<th scope="row">). */
  rowHeader?: boolean
  /** Impede esconder esta coluna pelo seletor de visibilidade. */
  alwaysVisible?: boolean
}

/** Busca global: `true` usa defaults; o objeto permite controlar o valor e restringir colunas. */
export type TableSearch =
  | boolean
  | {
      value?: string
      defaultValue?: string
      onChange?: (value: string) => void
      placeholder?: string
      /** Rótulo acessível do campo. Default por locale. */
      label?: string
      /** Restringe a busca a estas colunas. Default: todas. */
      keys?: string[]
    }

/** Filtro por coluna (select na barra de ferramentas). */
export type TableColumnFilter<T> = {
  /** Coluna filtrada (mesmo `key` de TableColumn). */
  key: string
  /** Rótulo acessível do select. Default: header da coluna ou `key`. */
  label?: string
  options: { value: string; label: string }[]
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  /** Texto da opção "sem filtro". Default por locale ("Todas"/"All"). */
  allLabel?: string
  /**
   * Comparação customizada: recebe a linha e o valor selecionado.  
   * Default: `String(sortValue(row) ?? row[key]) === value`.  
   */
  match?: (row: T, value: string) => boolean
}

/** Seleção de linhas com checkbox + barra de ações em massa. */
export type TableSelection = {
  /** Chaves selecionadas (controlado). */
  selected?: string[]
  defaultSelected?: string[]
  onChange?: (keys: string[]) => void
  /** Ações exibidas na barra quando há seleção; recebe as chaves selecionadas. */
  bulkActions?: (keys: string[]) => ReactNode
  /** Rótulo do checkbox do cabeçalho. Default por locale. */
  selectAllLabel?: string
  /** Rótulo do checkbox de cada linha; recebe a chave. Default por locale. */
  selectRowLabel?: (key: string) => string
}

/** Visibilidade de colunas: `true`/`{}` liga o seletor; arrays controlam o estado. */
export type TableColumnVisibility =
  | boolean
  | {
      hidden?: string[]
      defaultHidden?: string[]
      onChange?: (hidden: string[]) => void
      /** Rótulo do seletor. Default por locale ("Colunas"/"Columns"). */
      label?: string
    }

/** Paginação integrada (renderiza MaskedPagination abaixo da tabela). */
export type TablePagination = {
  pageSize: number
  page?: number
  defaultPage?: number
  onChange?: (page: number) => void
  variant?: PaginationVariant
  siblingCount?: number
}

/** Props próprias do MaskedTable (API pública). */
export type MaskedTableBaseProps<T> = {
  variant?: TableVariant
  columns: TableColumn<T>[]
  data: T[]
  /** Propriedade (ou função) que identifica cada linha de forma estável. */
  rowKey: (keyof T & string) | ((row: T, index: number) => string)
  /** Legenda da tabela (nome acessível). Fica oculta visualmente, a menos que `captionVisible`. */
  caption?: string
  captionVisible?: boolean
  /** Clique/Enter/Espaço na linha. Evite combinar com botões dentro das células sem `stopPropagation`. */
  onRowClick?: (row: T, index: number) => void
  /** Mostra linhas de carregamento (MaskedSkeleton) e marca a tabela com aria-busy. */
  loading?: boolean
  /** Quantidade de linhas de carregamento. Default 5. */
  loadingRows?: number
  /** Conteúdo quando não há dados. Default por locale. Ignorado se `emptyState` for passado. */
  empty?: ReactNode
  /** Estado vazio rico (MaskedEmptyState) — ocupa a linha única do tbody. */
  emptyState?: Omit<MaskedEmptyStateProps, 'title'> & { title?: ReactNode }
  /** Ordenação (controlada). */
  sort?: TableSort
  defaultSort?: TableSort
  onSortChange?: (sort: TableSort | undefined) => void
  /** true = a ordenação é feita fora (servidor): o componente só informa `onSortChange`. */
  manualSort?: boolean
  /** Busca global na barra de ferramentas. */
  search?: TableSearch
  /** Filtros por coluna (selects na barra de ferramentas). */
  filters?: TableColumnFilter<T>[]
  /** Seleção de linhas com checkbox e ações em massa. */
  selection?: TableSelection
  /** Seletor de visibilidade de colunas. */
  columnVisibility?: TableColumnVisibility
  /** Paginação integrada (MaskedPagination). */
  pagination?: TablePagination
  /** Altura máxima da área rolável; com ela o cabeçalho fica fixo no topo. */
  maxHeight?: string
  /** Rótulo da região rolável. Default: `caption` ou texto por locale. */
  scrollLabel?: string
  /** Paleta registrada ou chave da paleta (ícone de ordenação e foco). */
  colorTheme?: ColorThemeName
  /** Overrides granulares de tokens --mc-table-*. */
  tokens?: TableTokenOverrides
  className?: string
  style?: CSSProperties
}

/** Props transient internas (styled-components) — nunca API pública. */
export type MaskedTableInternalProps = {
  $variant: TableVariant
  $align?: 'start' | 'center' | 'end'
  $clickable?: boolean
  $sticky?: boolean
  $selected?: boolean
}

export type MaskedTableProps<T> = MaskedTableBaseProps<T> &
  Omit<HTMLAttributes<HTMLDivElement>, keyof MaskedTableBaseProps<T> | 'style' | 'children'>
