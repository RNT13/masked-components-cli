import { ReactNode } from 'react'

/* ================= BASE ================= */

export type BaseProps<T> = {
  name?: string
  value?: T
  onChange?: (value: T) => void

  id?: string
  className?: string
  placeholder?: string

  icon?: ReactNode
  label?: string
  helperText?: string

  error?: string
  touched?: boolean
  showError?: boolean
}

/* ================= VARIANT MAP ================= */

export type InputVariantMap = {
  default: BaseProps<string> & {
    type?: 'text' | 'email' | 'number'
  }

  textarea: BaseProps<string>

  password: BaseProps<string>

  masked: BaseProps<string> & {
    mask: string
  }

  select: BaseProps<string> & {
    options: { value: string; label: string }[]
  }

  file: BaseProps<string> & {
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
  }

  search: BaseProps<string> & {
    placeholder?: string
    onSearch?: (value: string) => void
  }

  currency: BaseProps<string> & {
    currencyConfig?: {
      symbol?: string
      decimalScale?: number
    }
  }
}

/* ================= UNION AUTOMÁTICA ================= */

export type InputProps = {
  [K in keyof InputVariantMap]: { variant: K } & InputVariantMap[K]
}[keyof InputVariantMap]
