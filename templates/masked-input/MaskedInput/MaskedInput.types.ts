/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ComponentType, CSSProperties, ReactNode } from 'react'
import type { InputColorTheme, InputTokenOverrides } from './inputTokens'

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

  /* ---- tokens (§A6) ---- */
  colorTheme?: InputColorTheme
  tokens?: InputTokenOverrides
  containerStyle?: CSSProperties
}

/* ---- imagem injetável (H.5) ---- */
/**
 * Contrato mínimo para um componente de imagem injetável  
 * (ex.: next/image). Mantido aqui — e não no provider — para  
 * que o FileInput não dependa de import do masked-config.  
 */
export type ImageComponentProps = {
  src: string
  alt: string
  fill?: boolean
  style?: CSSProperties
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
  /* ---- labels (A.6) ---- */
  filterGroupLabel?: string
  dateGroupLabel?: string
  resultCountFormatter?: (info: {
    resultCount: number
    total: number
    activeFilterCount: number
  }) => string

  getItemKey?: (item: T) => string | number

  showResultCount?: boolean
  showClearButton?: boolean

  children?: (state: SmartSearchState<T>) => ReactNode
}

export type InputVariantMap = {
  default: BaseProps & {
    type?: 'text' | 'email' | 'number'
  }

  textarea: BaseProps

  password: BaseProps & {
    showIcon?: ReactNode
    hideIcon?: ReactNode
    /** aria-label do botão quando a senha está oculta. Padrão: 'Mostrar senha' */
    showLabel?: string
    /** aria-label do botão quando a senha está visível. Padrão: 'Ocultar senha' */
    hideLabel?: string
  }

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
    onChange?: (files: File | File[] | string | string[] | null) => void
    onFileChange?: (payload: { files: File[]; previews: string[] }) => void
    onUploadingChange?: (uploading: boolean) => void
    error?: string
    touched?: boolean
    showError?: boolean
    value?: string | string[] | null
    accept?: string
    maxSizeMB?: number
    aspect?: 'square' | 'wide'
    onRemove?: () => void

    /* ---- imagem injetável (H.5) ---- */
    /**
     * Componente de imagem para o preview (ex.: next/image).  
     * Prioridade: esta prop > imageComponent do MaskedConfigProvider > <img> nativo.  
     */
    imageComponent?: ComponentType<ImageComponentProps>
    imageIcon?: ReactNode

    /* ---- notificações injetáveis (K.2) ---- */
    onError?: (message: string) => void
    onSuccess?: (message: string) => void

    /* ---- labels/dicionário (A.6) ---- */
    filenameLabel?: string
    removeLabel?: string
    chooseFileLabel?: string
    selectFilesLabel?: string
    uploadingLabel?: string
    dropHintLabel?: string
    uploadSuccessMessage?: string
    uploadConfigMessage?: string
    invalidTypeMessage?: (filename: string) => string
    maxSizeMessage?: (filename: string, maxSizeMB: number) => string
    uploadFailedMessage?: (failedCount: number, totalCount: number) => string
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
    icon?: ReactNode
    clockIcon?: ReactNode
    align?: 'left' | 'right' | 'center'
    /* ---- labels (A.6) ---- */
    hourLabel?: string
    minuteLabel?: string
    clearLabel?: string
  }
}

export type InputProps = {
  [K in keyof InputVariantMap]: { variant: K } & InputVariantMap[K]
}[keyof InputVariantMap]
