import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'
import type { ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'
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
  /** Valor usado para ordenar. Default: `row[key]`. */
  sortValue?: (row: T) => TableSortValue
  /** Renderiza esta coluna como cabeçalho de linha (<th scope="row">). */
  rowHeader?: boolean
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
  /** Conteúdo quando não há dados. Default por locale. */
  empty?: ReactNode
  /** Ordenação (controlada). */
  sort?: TableSort
  defaultSort?: TableSort
  onSortChange?: (sort: TableSort | undefined) => void
  /** true = a ordenação é feita fora (servidor): o componente só informa `onSortChange`. */
  manualSort?: boolean
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
}

export type MaskedTableProps<T> = MaskedTableBaseProps<T> &
  Omit<HTMLAttributes<HTMLDivElement>, keyof MaskedTableBaseProps<T> | 'style' | 'children'>
