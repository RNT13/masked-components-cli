import type { ToastItem, ToastOptions, ToastType } from './MaskedToaster.types'

const EXIT_MS = 220

export const DEFAULT_DURATION: Record<ToastType, number> = {
  default: 4000,
  success: 4000,
  info: 4000,
  warning: 5000,
  error: 6000,
  loading: Infinity
}

const EMPTY: ToastItem[] = []
const listeners = new Set<() => void>()
const removalTimers = new Map<string, ReturnType<typeof setTimeout>>()
let state: ToastItem[] = EMPTY
let counter = 0

function commit(next: ToastItem[]) {
  state = next
  listeners.forEach((listener) => listener())
}

function cancelRemoval(id: string) {
  const timer = removalTimers.get(id)
  if (timer) clearTimeout(timer)
  removalTimers.delete(id)
}

function scheduleRemoval(id: string) {
  cancelRemoval(id)
  removalTimers.set(
    id,
    setTimeout(() => {
      removalTimers.delete(id)
      removeToast(id)
    }, EXIT_MS)
  )
}

/* ---- API para useSyncExternalStore ---- */
export function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
export const getSnapshot = () => state
export const getServerSnapshot = () => EMPTY

/* ---- mutações ---- */

/** Cria ou atualiza (mesmo id) um toast. No servidor é um no-op (o store é compartilhado entre requests). */
export function addToast(
  type: ToastType,
  message: ToastItem['message'],
  options: ToastOptions = {}
): string {
  if (typeof window === 'undefined') return options.id ?? 'masked-toast-ssr'

  const id = options.id ?? `masked-toast-${++counter}`
  const now = Date.now()
  const existing = state.find((t) => t.id === id)
  cancelRemoval(id)

  const item: ToastItem = {
    id,
    type,
    message,
    duration: options.duration ?? DEFAULT_DURATION[type],
    icon: options.icon,
    position: options.position,
    dismissible: options.dismissible ?? true,
    action: options.action,
    className: options.className,
    style: options.style,
    onDismiss: options.onDismiss,
    visible: true,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now
  }

  commit(existing ? state.map((t) => (t.id === id ? item : t)) : [...state, item])
  return id
}

/** Dispensa um toast (ou todos os visíveis, sem id). Remove do DOM após a animação de saída. */
export function dismissToast(id?: string) {
  const targets = state.filter((t) => t.visible && (id === undefined || t.id === id))
  if (targets.length === 0) return

  const ids = new Set(targets.map((t) => t.id))
  commit(state.map((t) => (ids.has(t.id) ? { ...t, visible: false } : t)))

  targets.forEach((t) => {
    t.onDismiss?.(t.id)
    scheduleRemoval(t.id)
  })
}

export function removeToast(id: string) {
  cancelRemoval(id)
  if (!state.some((t) => t.id === id)) return
  commit(state.filter((t) => t.id !== id))
}

export function clearToasts() {
  removalTimers.forEach((timer) => clearTimeout(timer))
  removalTimers.clear()
  commit(EMPTY)
}
