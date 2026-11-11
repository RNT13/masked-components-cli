'use client'

import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { ClockIcon } from '../../icons'
import {
  ErrorDiv,
  InputIconWrapper,
  InputLabel,
  MaskedInputContainer
} from '../../MaskedInput.styles'
import { InputVariantMap } from '../../MaskedInput.types'
import { resolveInputTokens } from '../../inputTokens'
import {
  TimeClearButton,
  TimeColumn,
  TimeColumnLabel,
  TimeColumnsRow,
  TimeDropdown,
  TimeDropdownFooter,
  TimeOption,
  TimeSeparator,
  TimeTrigger,
  TimeTriggerValue
} from './TimeInput.styles'

type Props = { variant: 'time' } & InputVariantMap['time']

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
const VIEWPORT_MARGIN = 8

function buildMinutes(step: number): string[] {
  const safe = Math.max(1, Math.floor(step) || 1)
  const count = Math.max(1, Math.floor(60 / safe))
  return Array.from({ length: count }, (_, i) => String(i * safe).padStart(2, '0'))
}

function parseTime(value?: string | null): { hour: string; minute: string } {
  if (!value) return { hour: '', minute: '' }
  const [hour = '', minute = ''] = value.split(':')
  return { hour, minute }
}

export function TimeInput(props: Props) {
  const autoId = useId()
  const triggerId = props.id ?? autoId
  const dialogId = `${triggerId}-dialog`

  const [open, setOpen] = useState(false)
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 })

  /* Híbrido: se `value` for passado, o pai controla; senão, estado interno. */
  const isControlled = props.value !== undefined
  const [internal, setInternal] = useState('')
  const current = isControlled ? props.value : internal

  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const hourRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const minuteRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  const hasError = props.touched && Boolean(props.error)
  const minutes = buildMinutes(props.minuteStep ?? 5)
  const { hour, minute } = parseTime(current)
  const align = props.align ?? 'left'

  // o dropdown vive em um portal (fora do container): recebe as mesmas variáveis
  const tokenStyle = resolveInputTokens({ colorTheme: props.colorTheme, tokens: props.tokens })

  function updateDropdownPosition() {
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    setDropdownPos({ top: rect.bottom + 6, left: rect.left, width: rect.width })
  }

  function closeAndFocus() {
    setOpen(false)
    triggerRef.current?.focus()
  }

  useLayoutEffect(() => {
    if (!open || !triggerRef.current || !dropdownRef.current) return

    const triggerRect = triggerRef.current.getBoundingClientRect()
    const dropdownWidth = dropdownRef.current.offsetWidth

    let left = triggerRect.left
    if (align === 'right') {
      left = triggerRect.right - dropdownWidth
    } else if (align === 'center') {
      left = triggerRect.left + triggerRect.width / 2 - dropdownWidth / 2
    }

    const maxLeft = window.innerWidth - dropdownWidth - VIEWPORT_MARGIN
    left = Math.min(Math.max(left, VIEWPORT_MARGIN), Math.max(maxLeft, VIEWPORT_MARGIN))

    setDropdownPos((prev) => ({ ...prev, left, top: triggerRect.bottom + 6 }))
  }, [open, align])

  useEffect(() => {
    if (!open) return

    updateDropdownPosition()
    hourRefs.current[hour]?.scrollIntoView({ block: 'center' })
    minuteRefs.current[minute]?.scrollIntoView({ block: 'center' })

    window.addEventListener('resize', updateDropdownPosition)
    window.addEventListener('scroll', updateDropdownPosition, true)

    return () => {
      window.removeEventListener('resize', updateDropdownPosition)
      window.removeEventListener('scroll', updateDropdownPosition, true)
    }
  }, [open])

  /* Escape fecha e devolve o foco ao trigger */
  useEffect(() => {
    if (!open) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault()
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open])

  useEffect(() => {
    if (!open) return
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node
      if (containerRef.current?.contains(target) || dropdownRef.current?.contains(target)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  function emit(nextHour: string, nextMinute: string) {
    if (!nextHour || !nextMinute) return
    const next = `${nextHour}:${nextMinute}`
    if (!isControlled) setInternal(next)
    props.onChange?.(next)
  }

  function handleClear() {
    if (!isControlled) setInternal('')
    props.onChange?.('')
    closeAndFocus()
  }

  return (
    <MaskedInputContainer
      $variant="time"
      ref={containerRef}
      $radius={props.radius}
      data-error={hasError}
      $icon={!props.icon}
      $open={open}
      className={props.className}
      style={{ ...tokenStyle, ...props.containerStyle }}
    >
      {props.label && (
        <InputLabel htmlFor={triggerId} $required={props.required}>
          {props.icon}
          <span>{props.label}</span>
        </InputLabel>
      )}

      {props.icon && <InputIconWrapper>{props.icon}</InputIconWrapper>}

      <TimeTrigger
        ref={triggerRef}
        data-mc-trigger=""
        type="button"
        id={triggerId}
        className={hasError ? 'error' : ''}
        disabled={props.disabled}
        onClick={() => !props.disabled && setOpen((o) => !o)}
        aria-invalid={hasError ? 'true' : undefined}
        aria-describedby={hasError ? `${triggerId}-error` : undefined}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? dialogId : undefined}
      >
        <TimeTriggerValue $isPlaceholder={!current}>
          {current || props.placeholder || '00:00'}
        </TimeTriggerValue>
        {props.clockIcon ?? <ClockIcon />}
      </TimeTrigger>

      {open &&
        createPortal(
          <TimeDropdown
            ref={dropdownRef}
            id={dialogId}
            role="dialog"
            aria-label={props.label ?? props.placeholder ?? 'Time'}
            style={{
              ...tokenStyle,
              top: dropdownPos.top,
              left: dropdownPos.left,
              minWidth: dropdownPos.width
            }}
          >
            <TimeColumnsRow>
              <TimeColumn>
                <TimeColumnLabel>{props.hourLabel ?? 'Hora'}</TimeColumnLabel>
                {HOURS.map((h) => (
                  <TimeOption
                    key={h}
                    ref={(el) => {
                      hourRefs.current[h] = el
                    }}
                    type="button"
                    $selected={h === hour}
                    aria-pressed={h === hour}
                    onClick={() => emit(h, minute || minutes[0])}
                  >
                    {h}
                  </TimeOption>
                ))}
              </TimeColumn>

              <TimeSeparator aria-hidden="true">:</TimeSeparator>

              <TimeColumn>
                <TimeColumnLabel>{props.minuteLabel ?? 'Min'}</TimeColumnLabel>
                {minutes.map((m) => (
                  <TimeOption
                    key={m}
                    ref={(el) => {
                      minuteRefs.current[m] = el
                    }}
                    type="button"
                    $selected={m === minute}
                    aria-pressed={m === minute}
                    onClick={() => emit(hour || HOURS[0], m)}
                  >
                    {m}
                  </TimeOption>
                ))}
              </TimeColumn>
            </TimeColumnsRow>

            {props.clearable !== false && (
              <TimeDropdownFooter>
                <TimeClearButton type="button" onClick={handleClear}>
                  {props.clearLabel ?? 'Limpar horário'}
                </TimeClearButton>
              </TimeDropdownFooter>
            )}
          </TimeDropdown>,
          document.body
        )}

      {hasError && <ErrorDiv id={`${triggerId}-error`}>{props.error}</ErrorDiv>}
    </MaskedInputContainer>
  )
}
