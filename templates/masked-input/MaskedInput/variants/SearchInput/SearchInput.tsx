/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { ErrorDiv, InputIconWrapper, InputLabel, MaskedInputContainer } from '../../MaskedInput.styles'
import type { SearchInputProps } from '../../MaskedInput.types'
import { useSmartSearch } from '../../hooks/useSmartSearch'
import {
  DateChip,
  DateChipRow,
  FilterChip,
  FilterChipRow,
  FilterGroupLabel,
  FiltersWrapper,
  ResultsCount,
  SearchWrapper,
  SortChip,
  SortChipRow
} from './SearchInput.style'

export function SearchInput<T = any>(props: SearchInputProps<T>) {
  const {
    id,
    label,
    required,
    icon,
    placeholder = 'Buscar...',
    disabled,
    radius,
    touched,
    error,
    data,
    searchFields,
    filterField,
    filterLabels,
    showStatusFilter = true,
    dateField,
    dateFilterLabels,
    showDateFilter = true,
    sortOptions,
    showSortOptions = true,
    sortGroupLabel = 'Ordenar por',
    getItemKey,
    children,
    showResultCount = true
  } = props

  const hasError = Boolean(touched && error)

  const state = useSmartSearch(data, {
    searchFields,
    filterField,
    filterLabels,
    showStatusFilter,
    dateField,
    dateFilterLabels,
    showDateFilter,
    sortOptions,
    getItemKey
  })

  const {
    search,
    setSearch,
    activeFilters,
    toggleFilter,
    activeDateFilter,
    setActiveDateFilter,
    activeSort,
    setActiveSort,
    isFiltering,
    activeFilterCount,
    total,
    resultCount
  } = state

  const hasFilters = (showStatusFilter && !!filterLabels) || (showDateFilter && !!dateField) || (showSortOptions && !!sortOptions?.length)

  return (
    <SearchWrapper>
      <MaskedInputContainer $variant="search" $radius={radius} data-error={hasError} $icon={!icon}>
        {label && (
          <InputLabel htmlFor={id} $required={required}>
            {label}
          </InputLabel>
        )}

        {props.icon && <InputIconWrapper>{props.icon}</InputIconWrapper>}

        <input
          id={id}
          type="search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={hasError ? 'true' : undefined}
          aria-describedby={hasError ? `${id}-error` : undefined}
        />

        {hasFilters && (
          <FiltersWrapper>
            {showStatusFilter && filterLabels && filterField && (
              <div>
                <FilterGroupLabel>Filtros</FilterGroupLabel>
                <FilterChipRow>
                  {Object.entries(filterLabels).map(([key, chipLabel]) => (
                    <FilterChip
                      key={key}
                      type="button"
                      $active={(activeFilters[filterField] ?? []).includes(key)}
                      onClick={() => toggleFilter(filterField, key)}
                    >
                      {chipLabel}
                    </FilterChip>
                  ))}
                </FilterChipRow>
              </div>
            )}

            {showDateFilter && dateField && (
              <div>
                <FilterGroupLabel>Período</FilterGroupLabel>
                <DateChipRow>
                  {(['all', 'today', 'upcoming', 'past'] as const).map(key => (
                    <DateChip key={key} type="button" $active={activeDateFilter === key} onClick={() => setActiveDateFilter(key)}>
                      {dateFilterLabels?.[key] ?? { all: 'Todos', today: 'Hoje', upcoming: 'Próximos', past: 'Passados' }[key]}
                    </DateChip>
                  ))}
                </DateChipRow>
              </div>
            )}

            {showSortOptions && sortOptions && sortOptions.length > 0 && (
              <div>
                <FilterGroupLabel>{sortGroupLabel}</FilterGroupLabel>
                <SortChipRow>
                  {sortOptions.map(option => (
                    <SortChip key={option.key} type="button" $active={activeSort === option.key} onClick={() => setActiveSort(option.key)}>
                      {option.label}
                    </SortChip>
                  ))}
                </SortChipRow>
              </div>
            )}
          </FiltersWrapper>
        )}

        {showResultCount && isFiltering && (
          <ResultsCount>
            {resultCount} de {total} resultado{total !== 1 ? 's' : ''}
            {activeFilterCount > 0 && ` · ${activeFilterCount} filtro${activeFilterCount > 1 ? 's' : ''} ativo${activeFilterCount > 1 ? 's' : ''}`}
          </ResultsCount>
        )}

        {hasError && <ErrorDiv id={`${id}-error`}>{error}</ErrorDiv>}
      </MaskedInputContainer>

      {children?.(state)}
    </SearchWrapper>
  )
}
