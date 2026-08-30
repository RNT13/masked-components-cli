/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ReactNode } from 'react'

export type BaseProps = {
  name?: string
  value?: any
  onChange?: (value: any) => void
  radius?: number

  id?: string
  className?: string
  placeholder?: string

  disabled?: boolean

  icon?: ReactNode
  label?: string
  helperText?: string

  error?: string
  touched?: boolean
  showError?: boolean
  required?: boolean
}

export type DateFilterKey = 'all' | 'today' | 'upcoming' | 'past'

export type SortDirection = 'asc' | 'desc'
export type SortValueType = 'string' | 'number' | 'date'

export type SortOption = {
  /** Chave única usada para identificar a opção ativa (ex: 'price_desc') */
  key: string
  /** Texto exibido no chip (ex: 'Maior preço') */
  label: string
  /** Campo do item a ser comparado — aceita caminhos aninhados ('service.price') */
  field: string
  /** Direção da ordenação. Padrão: 'asc' */
  direction?: SortDirection
  /** Tipo de comparação. Padrão: 'string' */
  type?: SortValueType
}

export type SmartSearchState<T = any> = {
  search: string
  setSearch: (value: string) => void
  activeFilters: Record<string, string[]>
  toggleFilter: (field: string, value: string, multiple?: boolean) => void
  activeDateFilter: DateFilterKey
  setActiveDateFilter: (value: DateFilterKey) => void
  activeSort: string | null
  setActiveSort: (key: string | null) => void
  clearFilters: () => void
  filteredData: T[]
  isFiltering: boolean
  activeFilterCount: number
  total: number
  resultCount: number
}

export type SearchInputProps<T = any> = BaseProps & {
  placeholder?: string
  onSearch?: (value: string) => void

  data?: T[]
  searchFields?: string[]

  filterField?: string
  filterLabels?: Record<string, string>
  showStatusFilter?: boolean

  dateField?: string
  dateFilterLabels?: Partial<Record<DateFilterKey, string>>
  showDateFilter?: boolean

  sortOptions?: SortOption[]
  showSortOptions?: boolean
  sortGroupLabel?: string

  getItemKey?: (item: T) => string | number

  showResultCount?: boolean
  showClearButton?: boolean

  children?: (state: SmartSearchState<T>) => React.ReactNode
}

export type InputVariantMap = {
  default: BaseProps & {
    type?: 'text' | 'email' | 'number'
  }

  textarea: BaseProps
  password: BaseProps

  masked: BaseProps & {
    mask: string | ((value: string) => string)
  }

  select: BaseProps & {
    options: { value: string; label: string }[]
  }

  file: BaseProps & {
    multiple?: boolean
    fileMode?: 'local' | 'cloudinary'
    previewMode?: 'normal' | 'replace'
    uploadPreset?: string
    cloudName?: string
    onChange?: (files: File | File[] | string | string[]) => void
    onFileChange?: (payload: { files: File[]; previews: string[] }) => void
    onUploadingChange?: (uploading: boolean) => void
    error?: string
    touched?: boolean
    showError?: boolean
    value?: string | string[] | null
    accept?: string
    maxSizeMB?: number
    aspect?: 'square' | 'wide'
    filenameLabel?: string
    removeLabel?: string
    onRemove?: () => void
  }

  search: SearchInputProps<any>

  currency: BaseProps & {
    symbol?: string
    currencyConfig?: {
      locale?: string
      currency?: string
      symbol?: string
      symbolPosition?: 'prefix' | 'suffix'
    }
  }

  time: BaseProps & {
    value?: string | null
    onChange?: (value: string) => void
    minuteStep?: number
    placeholder?: string
    clearable?: boolean
    icon?: React.ReactNode
    align?: 'left' | 'right' | 'center'
  }
}

export type InputProps = {
  [K in keyof InputVariantMap]: { variant: K } & InputVariantMap[K]
}[keyof InputVariantMap]
