'use client'

import { useMemo, useState, type KeyboardEvent } from 'react'
import { useMaskedConfig } from '@/components/ui/MaskedConfigProvider'
import { MaskedEmptyState } from '@/components/ui/MaskedEmptyState/MaskedEmptyState'
import { MaskedPagination } from '@/components/ui/MaskedPagination/MaskedPagination'
import { MaskedSkeleton } from '@/components/ui/MaskedSkeleton/MaskedSkeleton'
import { useMaskedTheme } from '@/styles/useMaskedTheme'
import {
  BodyCell,
  BodyRow,
  BodyRowHeader,
  BulkBar,
  BulkCount,
  ColumnsMenu,
  ColumnsOption,
  ColumnsToggle,
  EmptyCell,
  HeadCell,
  MaskedTableRoot,
  RowCheckbox,
  SelectCell,
  SelectHeadCell,
  SortButton,
  SortIcon,
  TableCaption,
  TableFilterSelect,
  TableFooter,
  TableScroller,
  TableSearchInput,
  TableToolbar,
  TableWrapper,
  ToolbarSpacer
} from './MaskedTable.styles'
import {
  allRowKeys,
  applyColumnFilters,
  filterRows,
  nextSort,
  paginateRows,
  resolveTableTokens,
  sortRows,
  toggleKey,
  visibleColumns
} from './tableTokens'
import type { MaskedTableProps, TableColumn, TableSort } from './MaskedTable.types'

const DICT = {
  pt: {
    empty: 'Nenhum registro encontrado',
    scroll: 'Tabela de dados',
    search: 'Buscar na tabela',
    searchPlaceholder: 'Buscar…',
    columns: 'Colunas',
    all: 'Todas',
    selected: (n: number) => `${n} selecionado${n === 1 ? '' : 's'}`,
    selectAll: 'Selecionar todas as linhas',
    selectRow: (key: string) => `Selecionar linha ${key}`
  },
  en: {
    empty: 'No records found',
    scroll: 'Data table',
    search: 'Search table',
    searchPlaceholder: 'Search…',
    columns: 'Columns',
    all: 'All',
    selected: (n: number) => `${n} selected`,
    selectAll: 'Select all rows',
    selectRow: (key: string) => `Select row ${key}`
  }
} as const

const ARIA_SORT = { asc: 'ascending', desc: 'descending' } as const

function readCell<T>(row: T, column: TableColumn<T>, index: number) {
  if (column.cell) return column.cell(row, index)
  const value = (row as Record<string, unknown>)[column.key]
  return value === null || value === undefined ? '' : String(value)
}

/**
 * Tabela de dados com ordenação, busca, filtros, seleção, visibilidade de  
 * colunas, paginação, carregamento e estado vazio.  
 *
 * Semântica: <table> real com <caption>, <th scope="col"> e (opcional)  
 * <th scope="row">; colunas ordenáveis têm um botão no cabeçalho e  
 * `aria-sort`; durante o carregamento a tabela fica `aria-busy` e mostra  
 * linhas de MaskedSkeleton. A área rolável é uma região focável e rotulada.  
 * Ordenação: interna e estável por padrão; com `manualSort` o componente só  
 * informa `onSortChange`. `onRowClick` torna as linhas focáveis.  
 *
 * DataTable: `search` (busca global com normalizeText), `filters` (selects  
 * por coluna), `selection` (checkbox + `bulkActions`), `columnVisibility`  
 * (seletor de colunas) e `pagination` (MaskedPagination integrada) são  
 * opcionais e combináveis — a ordem do pipeline é:  
 * dados → busca → filtros → ordenação → paginação.  
 *
 * @example  
 * <MaskedTable caption="Clientes" rowKey="id" data={clientes} columns={cols}  
 *   search pagination={{ pageSize: 20 }} selection={{ bulkActions: (keys) => <button>Excluir {keys.length}</button> }} />  
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
    emptyState,
    sort: sortProp,
    defaultSort,
    onSortChange,
    manualSort = false,
    search,
    filters,
    selection,
    columnVisibility,
    pagination,
    maxHeight,
    scrollLabel,
    colorTheme,
    tokens,
    className,
    style,
    ...rest
  } = props

  const locale = config.locale ?? 'pt-BR'
  const dict = DICT[locale.toLowerCase().startsWith('en') ? 'en' : 'pt']
  const tokenStyle = resolveTableTokens({ colorTheme, tokens }, theme)

  /* ---- ordenação ---- */
  const [innerSort, setInnerSort] = useState<TableSort | undefined>(defaultSort)
  const sort = sortProp ?? innerSort

  /* ---- busca ---- */
  const searchCfg = search === true ? {} : search || undefined
  const [innerQuery, setInnerQuery] = useState(searchCfg?.defaultValue ?? '')
  const query = searchCfg?.value ?? innerQuery

  /* ---- filtros por coluna ---- */
  const [innerFilters, setInnerFilters] = useState<Record<string, string>>(() =>
    Object.fromEntries((filters ?? []).map((f) => [f.key, f.defaultValue ?? '']))
  )
  const activeFilters = (filters ?? []).map((f) => ({
    key: f.key,
    value: f.value ?? innerFilters[f.key] ?? ''
  }))

  /* ---- visibilidade de colunas ---- */
  const visibilityCfg = columnVisibility === true ? {} : columnVisibility || undefined
  const [innerHidden, setInnerHidden] = useState<string[]>(visibilityCfg?.defaultHidden ?? [])
  const hidden = visibilityCfg?.hidden ?? innerHidden
  const cols = useMemo(() => visibleColumns(columns, hidden), [columns, hidden])

  /* ---- seleção ---- */
  const [innerSelected, setInnerSelected] = useState<string[]>(selection?.defaultSelected ?? [])
  const selected = selection?.selected ?? innerSelected

  /* ---- paginação ---- */
  const [innerPage, setInnerPage] = useState(pagination?.defaultPage ?? 1)
  const page = pagination?.page ?? innerPage

  /* ---- pipeline: dados → busca → filtros → ordenação → paginação ---- */
  const searched = searchCfg ? filterRows(data, columns, query, searchCfg.keys) : data
  const filtered = applyColumnFilters(searched, columns, activeFilters, (row, key, value) =>
    filters?.find((f) => f.key === key)?.match?.(row, value)
  )
  const rows = manualSort ? filtered : sortRows(filtered, cols, sort, locale)
  const pageCount = pagination ? Math.max(1, Math.ceil(rows.length / pagination.pageSize)) : 1
  const currentPage = Math.min(page, pageCount)
  const paged = pagination ? paginateRows(rows, currentPage, pagination.pageSize) : rows

  const keyOf = (row: T, index: number) =>
    typeof rowKey === 'function'
      ? rowKey(row, index)
      : String((row as Record<string, unknown>)[rowKey])

  const pageKeys = allRowKeys(paged, keyOf)
  const allSelected = pageKeys.length > 0 && pageKeys.every((k) => selected.includes(k))
  const someSelected = pageKeys.some((k) => selected.includes(k)) && !allSelected

  function changeSort(key: string) {
    const next = nextSort(sort, key)
    setInnerSort(next)
    onSortChange?.(next)
  }

  function changeQuery(value: string) {
    setInnerQuery(value)
    setInnerPage(1)
    searchCfg?.onChange?.(value)
  }

  function changeFilter(key: string, value: string) {
    setInnerFilters((prev) => ({ ...prev, [key]: value }))
    setInnerPage(1)
    filters?.find((f) => f.key === key)?.onChange?.(value)
  }

  function changeHidden(next: string[]) {
    setInnerHidden(next)
    visibilityCfg?.onChange?.(next)
  }

  function changeSelected(next: string[]) {
    setInnerSelected(next)
    selection?.onChange?.(next)
  }

  function changePage(next: number) {
    setInnerPage(next)
    pagination?.onChange?.(next)
  }

  function onRowKeyDown(event: KeyboardEvent<HTMLTableRowElement>, row: T, index: number) {
    if (event.target !== event.currentTarget) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onRowClick?.(row, index)
    }
  }

  const colSpan = cols.length + (selection ? 1 : 0)
  const hasToolbar = Boolean(searchCfg) || Boolean(filters?.length) || Boolean(visibilityCfg)

  const table = (
    <TableScroller
      role="region"
      aria-label={scrollLabel ?? caption ?? dict.scroll}
      tabIndex={0}
      $variant={variant}
      style={maxHeight ? { maxHeight } : undefined}
    >
      <MaskedTableRoot $variant={variant} aria-busy={loading || undefined}>
        {caption && <TableCaption $visible={captionVisible}>{caption}</TableCaption>}
        <thead>
          <tr>
            {selection && (
              <SelectHeadCell scope="col" $sticky={Boolean(maxHeight)}>
                <RowCheckbox
                  type="checkbox"
                  aria-label={selection.selectAllLabel ?? dict.selectAll}
                  checked={allSelected}
                  ref={(node) => {
                    if (node) node.indeterminate = someSelected
                  }}
                  onChange={() =>
                    changeSelected(
                      allSelected
                        ? selected.filter((k) => !pageKeys.includes(k))
                        : [...new Set([...selected, ...pageKeys])]
                    )
                  }
                />
              </SelectHeadCell>
            )}
            {cols.map((column) => {
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
                {selection && (
                  <SelectCell>
                    <MaskedSkeleton height={14} />
                  </SelectCell>
                )}
                {cols.map((column) => (
                  <td key={column.key}>
                    <MaskedSkeleton height={14} />
                  </td>
                ))}
              </tr>
            ))
          ) : paged.length === 0 ? (
            <tr>
              <EmptyCell colSpan={colSpan}>
                {emptyState ? (
                  <MaskedEmptyState
                    variant="search"
                    title={emptyState.title ?? dict.empty}
                    {...emptyState}
                  />
                ) : (
                  (empty ?? dict.empty)
                )}
              </EmptyCell>
            </tr>
          ) : (
            paged.map((row, index) => {
              const key = keyOf(row, index)
              const isSelected = selected.includes(key)
              return (
                <BodyRow
                  key={key}
                  $variant={variant}
                  $clickable={Boolean(onRowClick)}
                  $selected={isSelected}
                  tabIndex={onRowClick ? 0 : undefined}
                  onClick={onRowClick ? () => onRowClick(row, index) : undefined}
                  onKeyDown={onRowClick ? (event) => onRowKeyDown(event, row, index) : undefined}
                >
                  {selection && (
                    <SelectCell>
                      <RowCheckbox
                        type="checkbox"
                        aria-label={selection.selectRowLabel?.(key) ?? dict.selectRow(key)}
                        checked={isSelected}
                        onChange={() => changeSelected(toggleKey(selected, key))}
                        onClick={(event) => event.stopPropagation()}
                      />
                    </SelectCell>
                  )}
                  {cols.map((column) =>
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
              )
            })
          )}
        </tbody>
      </MaskedTableRoot>
    </TableScroller>
  )

  /* Sem recursos de DataTable: estrutura idêntica à versão anterior. */
  if (!hasToolbar && !pagination && !(selection && selected.length > 0)) {
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
        {table.props.children}
      </TableScroller>
    )
  }

  return (
    <TableWrapper className={className} style={{ ...tokenStyle, ...style }} {...rest}>
      {hasToolbar && (
        <TableToolbar>
          {searchCfg && (
            <TableSearchInput
              type="search"
              role="searchbox"
              aria-label={searchCfg.label ?? dict.search}
              placeholder={searchCfg.placeholder ?? dict.searchPlaceholder}
              value={query}
              onChange={(event) => changeQuery(event.target.value)}
            />
          )}
          {filters?.map((filter) => {
            const column = columns.find((c) => c.key === filter.key)
            const value = filter.value ?? innerFilters[filter.key] ?? ''
            return (
              <TableFilterSelect
                key={filter.key}
                aria-label={filter.label ?? String(column?.header ?? filter.key)}
                value={value}
                onChange={(event) => changeFilter(filter.key, event.target.value)}
              >
                <option value="">{filter.allLabel ?? dict.all}</option>
                {filter.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </TableFilterSelect>
            )
          })}
          <ToolbarSpacer />
          {visibilityCfg && (
            <ColumnsToggle>
              <summary>{visibilityCfg.label ?? dict.columns}</summary>
              <ColumnsMenu>
                {columns.map((column) => (
                  <ColumnsOption key={column.key}>
                    <input
                      type="checkbox"
                      checked={!hidden.includes(column.key)}
                      disabled={column.alwaysVisible}
                      onChange={() =>
                        changeHidden(
                          hidden.includes(column.key)
                            ? hidden.filter((k) => k !== column.key)
                            : [...hidden, column.key]
                        )
                      }
                    />
                    {column.header}
                  </ColumnsOption>
                ))}
              </ColumnsMenu>
            </ColumnsToggle>
          )}
        </TableToolbar>
      )}

      {selection && selected.length > 0 && selection.bulkActions && (
        <BulkBar role="status">
          <BulkCount>{dict.selected(selected.length)}</BulkCount>
          {selection.bulkActions(selected)}
        </BulkBar>
      )}

      {table}

      {pagination && (
        <TableFooter>
          <MaskedPagination
            variant={pagination.variant ?? 'compact'}
            pageCount={pageCount}
            page={currentPage}
            onChange={changePage}
            siblingCount={pagination.siblingCount}
            colorTheme={colorTheme}
          />
        </TableFooter>
      )}
    </TableWrapper>
  )
}
