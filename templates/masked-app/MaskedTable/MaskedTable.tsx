'use client'

import { useState, type KeyboardEvent } from 'react'
import { useMaskedConfig } from '@/components/ui/MaskedConfigProvider'
import { MaskedSkeleton } from '@/components/ui/MaskedSkeleton/MaskedSkeleton'
import { useMaskedTheme } from '@/styles/useMaskedTheme'
import {
  BodyCell,
  BodyRow,
  BodyRowHeader,
  EmptyCell,
  HeadCell,
  MaskedTableRoot,
  SortButton,
  SortIcon,
  TableCaption,
  TableScroller
} from './MaskedTable.styles'
import { nextSort, resolveTableTokens, sortRows } from './tableTokens'
import type { MaskedTableProps, TableColumn, TableSort } from './MaskedTable.types'

const DICT = {
  pt: { empty: 'Nenhum registro encontrado', scroll: 'Tabela de dados' },
  en: { empty: 'No records found', scroll: 'Data table' }
} as const

const ARIA_SORT = { asc: 'ascending', desc: 'descending' } as const

function readCell<T>(row: T, column: TableColumn<T>, index: number) {
  if (column.cell) return column.cell(row, index)
  const value = (row as Record<string, unknown>)[column.key]
  return value === null || value === undefined ? '' : String(value)
}

/**
 * Tabela de dados com ordenação, carregamento e estado vazio.
 *
 * Semântica: <table> real com <caption>, <th scope="col"> e (opcional)
 * <th scope="row">; colunas ordenáveis têm um botão no cabeçalho e
 * `aria-sort`; durante o carregamento a tabela fica `aria-busy` e mostra
 * linhas de MaskedSkeleton. A área rolável é uma região focável e rotulada
 * (rola por teclado). Ordenação: interna e estável por padrão; com
 * `manualSort` o componente só informa `onSortChange` (para ordenar no
 * servidor). `onRowClick` torna as linhas focáveis (Enter/Espaço).
 *
 * @example
 * <MaskedTable caption="Clientes" rowKey="id" data={clientes} columns={[{ key: 'nome', header: 'Nome', sortable: true, rowHeader: true }, { key: 'plano', header: 'Plano' }]} />
 */
export function MaskedTable<T extends object>(props: MaskedTableProps<T>) {
  const theme = useMaskedTheme()
  const config = useMaskedConfig()
  const {
    variant = 'simple',
    columns,
    data,
    rowKey,
    caption,
    captionVisible = false,
    onRowClick,
    loading = false,
    loadingRows = 5,
    empty,
    sort: sortProp,
    defaultSort,
    onSortChange,
    manualSort = false,
    maxHeight,
    scrollLabel,
    colorTheme,
    tokens,
    className,
    style,
    ...rest
  } = props

  const [innerSort, setInnerSort] = useState<TableSort | undefined>(defaultSort)
  const sort = sortProp ?? innerSort
  const locale = config.locale ?? 'pt-BR'
  const dict = DICT[locale.toLowerCase().startsWith('en') ? 'en' : 'pt']
  const tokenStyle = resolveTableTokens({ colorTheme, tokens }, theme)
  const rows = manualSort ? data : sortRows(data, columns, sort, locale)
  const keyOf = (row: T, index: number) =>
    typeof rowKey === 'function'
      ? rowKey(row, index)
      : String((row as Record<string, unknown>)[rowKey])

  function changeSort(key: string) {
    const next = nextSort(sort, key)
    setInnerSort(next)
    onSortChange?.(next)
  }

  function onRowKeyDown(event: KeyboardEvent<HTMLTableRowElement>, row: T, index: number) {
    if (event.target !== event.currentTarget) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onRowClick?.(row, index)
    }
  }

  return (
    <TableScroller
      role="region"
      aria-label={scrollLabel ?? caption ?? dict.scroll}
      tabIndex={0}
      $variant={variant}
      className={className}
      style={{ ...tokenStyle, ...(maxHeight ? { maxHeight } : null), ...style }}
      {...rest}
    >
      <MaskedTableRoot $variant={variant} aria-busy={loading || undefined}>
        {caption && <TableCaption $visible={captionVisible}>{caption}</TableCaption>}
        <thead>
          <tr>
            {columns.map((column) => {
              const active = sort?.key === column.key ? sort : undefined
              return (
                <HeadCell
                  key={column.key}
                  scope="col"
                  $variant={variant}
                  $align={column.align}
                  $sticky={Boolean(maxHeight)}
                  style={column.width ? { width: column.width } : undefined}
                  aria-sort={
                    column.sortable ? (active ? ARIA_SORT[active.direction] : 'none') : undefined
                  }
                >
                  {column.sortable ? (
                    <SortButton type="button" onClick={() => changeSort(column.key)}>
                      {column.header}
                      <SortIcon $active={Boolean(active)} aria-hidden="true">
                        {active ? (active.direction === 'asc' ? '▲' : '▼') : '↕'}
                      </SortIcon>
                    </SortButton>
                  ) : (
                    column.header
                  )}
                </HeadCell>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: loadingRows }, (_, row) => (
              <tr key={`loading-${row}`}>
                {columns.map((column) => (
                  <td key={column.key}>
                    <MaskedSkeleton height={14} />
                  </td>
                ))}
              </tr>
            ))
          ) : rows.length === 0 ? (
            <tr>
              <EmptyCell colSpan={columns.length}>{empty ?? dict.empty}</EmptyCell>
            </tr>
          ) : (
            rows.map((row, index) => (
              <BodyRow
                key={keyOf(row, index)}
                $variant={variant}
                $clickable={Boolean(onRowClick)}
                tabIndex={onRowClick ? 0 : undefined}
                onClick={onRowClick ? () => onRowClick(row, index) : undefined}
                onKeyDown={onRowClick ? (event) => onRowKeyDown(event, row, index) : undefined}
              >
                {columns.map((column) =>
                  column.rowHeader ? (
                    <BodyRowHeader
                      key={column.key}
                      scope="row"
                      $variant={variant}
                      $align={column.align}
                    >
                      {readCell(row, column, index)}
                    </BodyRowHeader>
                  ) : (
                    <BodyCell key={column.key} $variant={variant} $align={column.align}>
                      {readCell(row, column, index)}
                    </BodyCell>
                  )
                )}
              </BodyRow>
            ))
          )}
        </tbody>
      </MaskedTableRoot>
    </TableScroller>
  )
}
