import type { CSSProperties, ReactNode } from 'react'

export type ToastType = 'default' | 'success' | 'error' | 'info' | 'warning' | 'loading'

export type ToastPosition =
  'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'

export interface ToastAction {
  label: string
  onClick: () => void
}

export interface ToastOptions {
  /** Reusar um id atualiza o toast existente (ex.: loading -> success). */
  id?: string
  /** ms. `Infinity` mantém até ser dispensado. Padrão varia por tipo. */
  duration?: number
  /** `null` remove o ícone; `undefined` usa o ícone do tipo. */
  icon?: ReactNode | null
  position?: ToastPosition
  dismissible?: boolean
  action?: ToastAction
  className?: string
  style?: CSSProperties
  onDismiss?: (id: string) => void
}

export interface ToastItem {
  id: string
  type: ToastType
  message: ReactNode
  duration: number
  icon?: ReactNode | null
  position?: ToastPosition
  dismissible: boolean
  action?: ToastAction
  className?: string
  style?: CSSProperties
  onDismiss?: (id: string) => void
  visible: boolean
  createdAt: number
  updatedAt: number
}

export interface PromiseMessages<T> {
  loading: ReactNode
  success: ReactNode | ((data: T) => ReactNode)
  error: ReactNode | ((error: unknown) => ReactNode)
}

export type ToasterTokenName =
  'bg' | 'fg' | 'border' | 'radius' | 'shadow' | 'success' | 'error' | 'info' | 'warning' | 'z'

export type ToasterTokens = Partial<Record<ToasterTokenName, string>>

export interface MaskedToasterProps {
  /** Posição padrão (cada toast pode sobrescrever). Padrão: bottom-right */
  position?: ToastPosition
  /** Máximo de toasts visíveis ao mesmo tempo. Padrão: 5 */
  max?: number
  /** Distância da borda da tela, em px. Padrão: 16 */
  offset?: number
  /** Espaço entre toasts, em px. Padrão: 8 */
  gap?: number
  /** aria-label da região. Padrão: 'Notifications' */
  label?: string
  className?: string
  /** Overrides das variáveis --mc-toast-* */
  tokens?: ToasterTokens
}
