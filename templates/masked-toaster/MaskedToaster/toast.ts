import type { ReactNode } from 'react'
import { addToast, clearToasts, dismissToast, removeToast } from './toastStore'
import type { PromiseMessages, ToastOptions, ToastType } from './MaskedToaster.types'

type Notify = (message: ReactNode, options?: ToastOptions) => string

export interface ToastFn extends Notify {
  success: Notify
  error: Notify
  info: Notify
  warning: Notify
  loading: Notify
  promise: <T>(
    promise: Promise<T> | (() => Promise<T>),
    messages: PromiseMessages<T>,
    options?: ToastOptions
  ) => Promise<T>
  dismiss: (id?: string) => void
  remove: (id: string) => void
  clear: () => void
}

const make =
  (type: ToastType): Notify =>
  (message, options) =>
    addToast(type, message, options)

function promise<T>(
  input: Promise<T> | (() => Promise<T>),
  messages: PromiseMessages<T>,
  options: ToastOptions = {}
): Promise<T> {
  const id = addToast('loading', messages.loading, options)
  const running = typeof input === 'function' ? input() : input

  running.then(
    (data) => {
      const text =
        typeof messages.success === 'function'
          ? (messages.success as (d: T) => ReactNode)(data)
          : messages.success
      addToast('success', text, { ...options, id })
    },
    (error: unknown) => {
      const text =
        typeof messages.error === 'function'
          ? (messages.error as (e: unknown) => ReactNode)(error)
          : messages.error
      addToast('error', text, { ...options, id })
    }
  )

  return running
}

/**
 * @example
 * toast.success('Salvo!')
 * const id = toast.loading('Enviando...')
 * toast.success('Pronto', { id })            // atualiza o mesmo toast
 * toast.promise(save(), { loading: '...', success: 'Ok', error: 'Falhou' })
 */
export const toast: ToastFn = Object.assign(make('default'), {
  success: make('success'),
  error: make('error'),
  info: make('info'),
  warning: make('warning'),
  loading: make('loading'),
  promise,
  dismiss: dismissToast,
  remove: removeToast,
  clear: clearToasts
})

/**
 * Para plugar na lib: <MaskedConfigProvider config={maskedToastHandlers}>
 * (FileInput etc. passam a mostrar toasts nativos, sem biblioteca externa).
 */
export const maskedToastHandlers = {
  onSuccess: (message: string) => {
    toast.success(message)
  },
  onError: (message: string) => {
    toast.error(message)
  }
}
