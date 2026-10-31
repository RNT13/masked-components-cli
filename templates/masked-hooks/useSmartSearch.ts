'use client'

import { useCallback, useMemo, useState } from 'react'

export type DateFilterKey = 'all' | 'today' | 'upcoming' | 'past'
export type SortDirection = 'asc' | 'desc'
export type SortValueType = 'string' | 'number' | 'date'

export type SortOption = {
  key: string
  label: string
  field: string
  direction?: SortDirection
  type?: SortValueType
}

/** Remove acentos, baixa a caixa e faz trim — ideal para busca/comparação. */
function normalizeText(value: unknown): string {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

/** Data LOCAL de hoje em "YYYY-MM-DD" (toISOString() usaria UTC e erraria o dia à noite no Brasil). */
function getLocalToday(now: Date = new Date()): string {
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

function getNestedValue(obj: unknown, path: string): unknown {
  return path.split('.').reduce((acc: unknown, key: string) => {
    if (acc !== null && typeof acc === 'object') {
      return (acc as Record<string, unknown>)[key]
    }
    return undefined
  }, obj)
}

function compareValues(a: unknown, b: unknown, type: SortValueType, locale: string): number {
  if (type === 'number') {
    return (Number(a) || 0) - (Number(b) || 0)
  }
  if (type === 'date') {
    const da = new Date(String(a ?? '')).getTime()
    const db = new Date(String(b ?? '')).getTime()
    return (Number.isFinite(da) ? da : 0) - (Number.isFinite(db) ? db : 0)
  }
  return normalizeText(a).localeCompare(normalizeText(b), locale)
}

export interface UseSmartSearchConfig<T> {
  searchFields?: string[]
  filterField?: string
  filterLabels?: Record<string, string>
  showStatusFilter?: boolean
  dateField?: string
  dateFilterLabels?: Partial<Record<DateFilterKey, string>>
  showDateFilter?: boolean
  sortOptions?: SortOption[]
  getItemKey?: (item: T) => string | number
  initialSearch?: string
  initialDateFilter?: DateFilterKey
  initialSort?: string | null
  /** Locale da ordenação de textos (padrão: 'pt-BR'). */
  locale?: string
}

// Valores padrão estáveis: um `[]` novo a cada render invalidaria o useMemo toda vez.
const NO_ITEMS: never[] = []
const NO_FIELDS: string[] = []
const NO_SORT_OPTIONS: SortOption[] = []

export function useSmartSearch<T>(data: T[] | undefined, config: UseSmartSearchConfig<T> = {}) {
  const {
    searchFields = NO_FIELDS,
    filterField,
    dateField,
    sortOptions = NO_SORT_OPTIONS,
    getItemKey,
    initialSearch = '',
    initialDateFilter = 'all',
    initialSort = null,
    locale = 'pt-BR'
  } = config

  const [search, setSearch] = useState(initialSearch)
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const [activeDateFilter, setActiveDateFilter] = useState<DateFilterKey>(initialDateFilter)
  const [activeSort, setActiveSort] = useState<string | null>(initialSort)

  const source: T[] = data ?? NO_ITEMS

  const toggleFilter = useCallback((field: string, value: string, multiple = false) => {
    setActiveFilters(prev => {
      const current = prev[field] ?? []
      if (!multiple) {
        return current[0] === value ? { ...prev, [field]: [] } : { ...prev, [field]: [value] }
      }
      const exists = current.includes(value)
      const next = exists ? current.filter(v => v !== value) : [...current, value]
      return { ...prev, [field]: next }
    })
  }, [])

  const clearFilters = useCallback(() => {
    setActiveFilters({})
    setActiveDateFilter('all')
    setActiveSort(initialSort)
    setSearch('')
  }, [initialSort])

  const filteredData = useMemo(() => {
    const query = normalizeText(search)
    const today = getLocalToday()

    const base = source.filter(item => {
      const matchesSearch =
        !query || searchFields.some(field => normalizeText(getNestedValue(item, field)).includes(query))

      const matchesStatus = (() => {
        if (!filterField) return true
        const selected = activeFilters[filterField] ?? []
        if (selected.length === 0) return true
        const itemValue = normalizeText(getNestedValue(item, filterField))
        return selected.some(v => normalizeText(v) === itemValue)
      })()

      const matchesDate = (() => {
        if (!dateField || activeDateFilter === 'all') return true
        const itemDate = String(getNestedValue(item, dateField) ?? '').slice(0, 10)
        if (activeDateFilter === 'today') return itemDate === today
        if (activeDateFilter === 'upcoming') return itemDate > today
        if (activeDateFilter === 'past') return itemDate < today
        return true
      })()

      return matchesSearch && matchesStatus && matchesDate
    })

    if (!activeSort || sortOptions.length === 0) return base

    const option = sortOptions.find(o => o.key === activeSort)
    if (!option) return base

    const direction = option.direction ?? 'asc'
    const type = option.type ?? 'string'

    return [...base].sort((a, b) => {
      const result = compareValues(getNestedValue(a, option.field), getNestedValue(b, option.field), type, locale)
      return direction === 'desc' ? -result : result
    })
  }, [source, search, searchFields, filterField, dateField, activeFilters, activeDateFilter, activeSort, sortOptions, locale])

  const activeFilterCount =
    Object.values(activeFilters).reduce((acc, v) => acc + v.length, 0) + (activeDateFilter !== 'all' ? 1 : 0)
  const hasActiveSort = activeSort !== null

  return {
    search,
    setSearch,
    activeFilters,
    toggleFilter,
    activeDateFilter,
    setActiveDateFilter,
    activeSort,
    setActiveSort,
    clearFilters,
    filteredData,
    isFiltering: search.trim().length > 0 || activeFilterCount > 0 || hasActiveSort,
    activeFilterCount,
    total: source.length,
    resultCount: filteredData.length,
    getItemKey
  }
}
