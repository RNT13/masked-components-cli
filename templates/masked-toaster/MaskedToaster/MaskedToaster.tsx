'use client'

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode
} from 'react'
import { createPortal } from 'react-dom'
import { TOASTER_CSS } from './toasterStyles'
import { dismissToast, getServerSnapshot, getSnapshot, subscribe } from './toastStore'
import type { MaskedToasterProps, ToastItem, ToastPosition, ToastType } from './MaskedToaster.types'

const POSITIONS: ToastPosition[] = [
  'top-left',
  'top-center',
  'top-right',
  'bottom-left',
  'bottom-center',
  'bottom-right'
]

const svg = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true
} as const

const ICONS: Partial<Record<ToastType, ReactNode>> = {
  success: (
    <svg {...svg}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12.5l2.7 2.7L16 9.5" />
    </svg>
  ),
  error: (
    <svg {...svg}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9 9l6 6M15 9l-6 6" />
    </svg>
  ),
  info: (
    <svg {...svg}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </svg>
  ),
  warning: (
    <svg {...svg}>
      <path d="M10.3 4.3L2.6 18a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 4.3a2 2 0 0 0-3.4 0z" />
      <path d="M12 9v4M12 17h.01" />
    </svg>
  ),
  loading: (
    <svg {...svg} className="mc-toast__spinner">
      <path d="M12 3a9 9 0 1 0 9 9" />
    </svg>
  )
}

const noopSubscribe = () => () => {}
const cx = (...parts: Array<string | false | undefined>) => parts.filter(Boolean).join(' ')

function ToastView({ item }: { item: ToastItem }) {
  const [paused, setPaused] = useState(false)
  const remaining = useRef(item.duration)
  const startedAt = useRef(0)

  // reinicia o relógio quando o toast é atualizado (ex.: loading -> success)
  useEffect(() => {
    remaining.current = item.duration
  }, [item.duration, item.updatedAt])

  // auto-dismiss com pausa em hover/foco
  useEffect(() => {
    if (!item.visible || paused || !Number.isFinite(remaining.current)) return
    startedAt.current = Date.now()
    const timer = setTimeout(() => dismissToast(item.id), remaining.current)
    return () => {
      clearTimeout(timer)
      remaining.current = Math.max(0, remaining.current - (Date.now() - startedAt.current))
    }
  }, [item.id, item.visible, item.updatedAt, paused])

  const icon = item.icon === undefined ? ICONS[item.type] : item.icon

  return (
    <div
      className={cx('mc-toast', item.className)}
      data-type={item.type}
      data-visible={item.visible}
      role={item.type === 'error' ? 'alert' : 'status'}
      style={item.style}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {icon && <span className="mc-toast__icon">{icon}</span>}
      <div className="mc-toast__body">{item.message}</div>
      {item.action && (
        <button
          type="button"
          className="mc-toast__action"
          onClick={() => {
            item.action?.onClick()
            dismissToast(item.id)
          }}
        >
          {item.action.label}
        </button>
      )}
      {item.dismissible && (
        <button
          type="button"
          className="mc-toast__close"
          aria-label="Dismiss notification"
          onClick={() => dismissToast(item.id)}
        >
          <svg {...svg} width={16} height={16}>
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      )}
    </div>
  )
}

export function MaskedToaster({
  position = 'bottom-right',
  max = 5,
  offset = 16,
  gap = 8,
  label = 'Notifications',
  className,
  tokens
}: MaskedToasterProps) {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  )

  // excedente do limite é dispensado (os mais antigos primeiro)
  useEffect(() => {
    const live = items.filter((t) => t.visible)
    if (live.length > max) live.slice(0, live.length - max).forEach((t) => dismissToast(t.id))
  }, [items, max])

  if (!mounted) return null

  const vars: Record<string, string> = {
    '--mc-toast-offset': `${offset}px`,
    '--mc-toast-gap': `${gap}px`
  }
  for (const [key, value] of Object.entries(tokens ?? {})) {
    if (value !== undefined) vars[`--mc-toast-${key}`] = value
  }

  return createPortal(
    <>
      <style data-masked-toaster="">{TOASTER_CSS}</style>
      {POSITIONS.map((pos) => {
        const list = items.filter((t) => (t.position ?? position) === pos)
        if (list.length === 0) return null
        return (
          <div
            key={pos}
            className={cx('mc-toaster', className)}
            data-position={pos}
            role="region"
            aria-label={label}
            style={vars as CSSProperties}
          >
            {list.map((t) => (
              <ToastView key={t.id} item={t} />
            ))}
          </div>
        )
      })}
    </>,
    document.body
  )
}
