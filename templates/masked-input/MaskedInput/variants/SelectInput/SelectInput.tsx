'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { ErrorDiv, InputIconWrapper, InputLabel, MaskedInputContainer } from '../../MaskedInput.styles'

import { InputVariantMap } from '../../MaskedInput.types'
import { SelectDropdown, SelectOption, SelectTrigger } from './SelectInput.styles'

type Props = { variant: 'select' } & InputVariantMap['select']

export function SelectInput(props: Props) {
  const [open, setOpen] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const [dropdownPos, setDropdownPos] = useState({
    top: 0,
    left: 0,
    width: 0
  })

  const hasError = props.touched && Boolean(props.error)

  const selectedOption = props.options.find(opt => opt.value === props.value)

  /* ============================================================
   * CALCULA POSIÇÃO DO DROPDOWN NO BODY
   * ============================================================ */
  function updateDropdownPosition() {
    if (!triggerRef.current) return

    const rect = triggerRef.current.getBoundingClientRect()

    setDropdownPos({
      top: rect.bottom + 6,
      left: rect.left,
      width: rect.width
    })
  }

  /* ============================================================
   * AO ABRIR -> CALCULA POSIÇÃO E MONITORA RESIZE/SCROLL
   * ============================================================ */
  useLayoutEffect(() => {
    if (!open) return

    updateDropdownPosition()

    window.addEventListener('resize', updateDropdownPosition)
    window.addEventListener('scroll', updateDropdownPosition, true)

    return () => {
      window.removeEventListener('resize', updateDropdownPosition)
      window.removeEventListener('scroll', updateDropdownPosition, true)
    }
  }, [open])

  /* ============================================================
   * FECHA AO CLICAR FORA
   * ============================================================ */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node

      const clickedInsideTrigger = containerRef.current && containerRef.current.contains(target)

      const clickedInsideDropdown = document.getElementById('masked-select-dropdown')?.contains(target)

      if (!clickedInsideTrigger && !clickedInsideDropdown) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <MaskedInputContainer $variant="select" ref={containerRef} $radius={props.radius} data-error={hasError} $icon={!props.icon} $open={open}>
      {props.label && (
        <InputLabel htmlFor={props.id} $required={props.required}>
          <span>{props.label}</span>
        </InputLabel>
      )}

      {props.icon && <InputIconWrapper>{props.icon}</InputIconWrapper>}

      {/* ============================================================
       * TRIGGER
       * ============================================================ */}
      <SelectTrigger
        id="masked-select-trigger"
        ref={triggerRef}
        type="button"
        className={`${hasError ? 'error' : ''}`}
        onClick={() => {
          if (!open) updateDropdownPosition()
          setOpen(o => !o)
        }}
      >
        {selectedOption?.label ?? 'Selecione uma opção'}
        <span className={`arrow ${open ? 'open' : ''}`} />
      </SelectTrigger>

      {/* ============================================================
       * DROPDOWN VIA PORTAL
       * ============================================================ */}
      {open &&
        createPortal(
          <SelectDropdown
            id="masked-select-dropdown"
            style={{
              top: dropdownPos.top,
              left: dropdownPos.left,
              width: dropdownPos.width
            }}
          >
            {props.options.map(option => (
              <SelectOption
                key={option.value}
                className={`${option.value === props.value ? 'selected' : ''}`}
                onClick={() => {
                  props.onChange?.(option.value)
                  setOpen(false)
                }}
                aria-invalid={hasError ? 'true' : undefined}
                aria-describedby={hasError ? `${props.id}-error` : undefined}
              >
                {option.label}
              </SelectOption>
            ))}
          </SelectDropdown>,
          document.body
        )}

      {hasError && <ErrorDiv id={`${props.id}-error`}>{props.error}</ErrorDiv>}
    </MaskedInputContainer>
  )
}
