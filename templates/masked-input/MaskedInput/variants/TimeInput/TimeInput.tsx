'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { BsClock } from 'react-icons/bs'

import { ErrorDiv, InputIconWrapper, InputLabel, MaskedInputContainer } from '../../MaskedInput.styles'
import { InputVariantMap } from '../../MaskedInput.types'
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
  const count = Math.max(1, Math.floor(60 / step))
  return Array.from({ length: count }, (_, i) => String(i * step).padStart(2, '0'))
}

function parseTime(value?: string | null): { hour: string; minute: string } {
  if (!value) return { hour: '', minute: '' }
  const [hour = '', minute = ''] = value.split(':')
  return { hour, minute }
}

export function TimeInput(props: Props) {
  const [open, setOpen] = useState(false)
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 })

  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const hourRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const minuteRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  const hasError = props.touched && Boolean(props.error)
  const minuteStep = props.minuteStep ?? 5
  const minutes = buildMinutes(minuteStep)
  const { hour, minute } = parseTime(props.value)
  const align = props.align ?? 'left'

  /** Posição inicial: usa a largura do trigger como aproximação antes de medir o dropdown real */
  function updateDropdownPosition() {
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    setDropdownPos({ top: rect.bottom + 6, left: rect.left, width: rect.width })
  }

  /** Reposiciona com base na largura REAL do dropdown, já respeitando `align` e a borda da viewport */
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

    // Clamp: nunca deixa vazar pra fora da tela nas duas bordas
    const maxLeft = window.innerWidth - dropdownWidth - VIEWPORT_MARGIN
    left = Math.min(Math.max(left, VIEWPORT_MARGIN), Math.max(maxLeft, VIEWPORT_MARGIN))

    setDropdownPos(prev => ({ ...prev, left, top: triggerRect.bottom + 6 }))
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node
      const clickedInsideTrigger = containerRef.current?.contains(target)
      const clickedInsideDropdown = dropdownRef.current?.contains(target)

      if (!clickedInsideTrigger && !clickedInsideDropdown) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function emit(nextHour: string, nextMinute: string) {
    if (nextHour && nextMinute) {
      props.onChange?.(`${nextHour}:${nextMinute}`)
    }
  }

  function handleSelectHour(nextHour: string) {
    emit(nextHour, minute || minutes[0])
  }

  function handleSelectMinute(nextMinute: string) {
    emit(hour || HOURS[0], nextMinute)
  }

  function handleClear() {
    props.onChange?.('')
    setOpen(false)
  }

  return (
    <MaskedInputContainer $variant="time" ref={containerRef} $radius={props.radius} data-error={hasError} $icon={!props.icon} $open={open}>
      {props.label && (
        <InputLabel htmlFor={props.id} $required={props.required}>
          {props.icon}
          <span>{props.label}</span>
        </InputLabel>
      )}

      {props.icon && <InputIconWrapper>{props.icon}</InputIconWrapper>}

      <TimeTrigger
        ref={triggerRef}
        type="button"
        id="masked-time-trigger"
        className={hasError ? 'error' : ''}
        disabled={props.disabled}
        onClick={() => !props.disabled && setOpen(o => !o)}
        aria-invalid={hasError ? 'true' : undefined}
        aria-describedby={hasError ? `${props.id}-error` : undefined}
      >
        <TimeTriggerValue $isPlaceholder={!props.value}>{props.value || props.placeholder || '00:00'}</TimeTriggerValue>
        <BsClock />
      </TimeTrigger>

      {open &&
        createPortal(
          <TimeDropdown ref={dropdownRef} style={{ top: dropdownPos.top, left: dropdownPos.left, minWidth: dropdownPos.width }}>
            <TimeColumnsRow>
              <TimeColumn>
                <TimeColumnLabel>Hora</TimeColumnLabel>
                {HOURS.map(h => (
                  <TimeOption
                    key={h}
                    ref={el => {
                      hourRefs.current[h] = el
                    }}
                    type="button"
                    $selected={h === hour}
                    onClick={() => handleSelectHour(h)}
                  >
                    {h}
                  </TimeOption>
                ))}
              </TimeColumn>

              <TimeSeparator>:</TimeSeparator>

              <TimeColumn>
                <TimeColumnLabel>Min</TimeColumnLabel>
                {minutes.map(m => (
                  <TimeOption
                    key={m}
                    ref={el => {
                      minuteRefs.current[m] = el
                    }}
                    type="button"
                    $selected={m === minute}
                    onClick={() => handleSelectMinute(m)}
                  >
                    {m}
                  </TimeOption>
                ))}
              </TimeColumn>
            </TimeColumnsRow>

            {props.clearable !== false && (
              <TimeDropdownFooter>
                <TimeClearButton type="button" onClick={handleClear}>
                  Limpar horário
                </TimeClearButton>
              </TimeDropdownFooter>
            )}
          </TimeDropdown>,
          document.body
        )}

      {hasError && <ErrorDiv id={`${props.id}-error`}>{props.error}</ErrorDiv>}
    </MaskedInputContainer>
  )
}
