import { describe, expect, it } from 'vitest'
import {
  allRowKeys,
  applyColumnFilters,
  filterRows,
  paginateRows,
  toggleKey,
  visibleColumns
} from '../../templates/masked-app/MaskedTable/tableTokens'
import type { TableColumn } from '../../templates/masked-app/MaskedTable/MaskedTable.types'

type Row = { id: number; nome: string; plano: string; seats: number }

const rows: Row[] = [
  { id: 1, nome: 'Aline Souza', plano: 'Pro', seats: 4 },
  { id: 2, nome: 'Bruno Lima', plano: 'Free', seats: 1 },
  { id: 3, nome: 'Carla Méndez', plano: 'Pro', seats: 12 }
]

const columns: TableColumn<Row>[] = [
  { key: 'nome', header: 'Nome', sortable: true },
  { key: 'plano', header: 'Plano' },
  { key: 'seats', header: 'Assentos' }
]

const keyOf = (row: Row) => String(row.id)

describe('filterRows (busca global)', () => {
  it('vazio retorna tudo; encontra por qualquer coluna, sem acento/caixa', () => {
    expect(filterRows(rows, columns, '')).toHaveLength(3)
    expect(filterRows(rows, columns, 'aline')).toEqual([rows[0]])
    expect(filterRows(rows, columns, 'MENDEZ')).toEqual([rows[2]])
    expect(filterRows(rows, columns, 'pro')).toEqual([rows[0], rows[2]])
  })

  it('keys restringe as colunas pesquisadas', () => {
    expect(filterRows(rows, columns, 'pro', ['nome'])).toHaveLength(0)
    expect(filterRows(rows, columns, 'pro', ['plano'])).toHaveLength(2)
  })
})

describe('applyColumnFilters', () => {
  it('sem filtros ativos retorna tudo; filtra por igualdade normalizada', () => {
    expect(applyColumnFilters(rows, columns, [])).toHaveLength(3)
    expect(applyColumnFilters(rows, columns, [{ key: 'plano', value: 'Pro' }])).toEqual([
      rows[0],
      rows[2]
    ])
  })

  it('AND entre filtros; match customizado para faixas', () => {
    const active = [
      { key: 'plano', value: 'Pro' },
      { key: 'seats', value: 'big' }
    ]
    const match = (row: Row, key: string, value: string) =>
      key === 'seats' ? (value === 'big' ? row.seats > 10 : true) : row.plano === value
    expect(applyColumnFilters(rows, columns, active, match)).toEqual([rows[2]])
  })
})

describe('seleção', () => {
  it('toggleKey adiciona e remove', () => {
    expect(toggleKey([], '1')).toEqual(['1'])
    expect(toggleKey(['1', '2'], '1')).toEqual(['2'])
  })

  it('allRowKeys usa o keyOf da linha', () => {
    expect(allRowKeys(rows, keyOf)).toEqual(['1', '2', '3'])
  })
})

describe('visibleColumns', () => {
  it('remove as escondidas preservando a ordem', () => {
    expect(visibleColumns(columns, ['plano']).map((c) => c.key)).toEqual(['nome', 'seats'])
    expect(visibleColumns(columns, [])).toHaveLength(3)
  })
})

describe('paginateRows', () => {
  it('fatiamento por página (base 1)', () => {
    expect(paginateRows(rows, 1, 2)).toEqual([rows[0], rows[1]])
    expect(paginateRows(rows, 2, 2)).toEqual([rows[2]])
    expect(paginateRows(rows, 3, 2)).toEqual([])
  })
})
