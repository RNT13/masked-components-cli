'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import {
  ErrorDiv,
  InputIconWrapper,
  InputLabel,
  MaskedInputContainer
} from '../../MaskedInput.styles'
import { InputVariantMap } from '../../MaskedInput.types'
import { resolveInputTokens } from '../../inputTokens'
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
  const selectedOption = props.options.find((opt) => opt.value === props.value)

  function updateDropdownPosition() {
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    setDropdownPos({
      top: rect.bottom + 6,
      left: rect.left,
      width: rect.width
    })
  }

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

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node
      const clickedInsideTrigger = containerRef.current && containerRef.current.contains(target)
      const clickedInsideDropdown = document
        .getElementById(`masked-select-dropdown-${props.id}`)
        ?.contains(target)

      if (!clickedInsideTrigger && !clickedInsideDropdown) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [props.id])

  return (
    <MaskedInputContainer
      $variant="select"
      ref={containerRef}
      $radius={props.radius}
      data-error={hasError}
      $icon={!props.icon}
      $open={open}
      style={{
        ...resolveInputTokens({ colorTheme: props.colorTheme, tokens: props.tokens }),
        ...props.containerStyle
      }}
    >
      {props.label && (
        <InputLabel htmlFor={props.id} $required={props.required}>
          <span>{props.label}</span>
        </InputLabel>
      )}

      {props.icon && <InputIconWrapper>{props.icon}</InputIconWrapper>}

      <SelectTrigger
        id={props.id ?? 'masked-select-trigger'}
        ref={triggerRef}
        type="button"
        className={`${hasError ? 'error' : ''}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => {
          if (!open) updateDropdownPosition()
          setOpen((o) => !o)
        }}
      >
        {selectedOption?.label ?? props.placeholder ?? 'Selecione...'}
        <span className={`arrow ${open ? 'open' : ''}`} />
      </SelectTrigger>

      {open &&
        createPortal(
          <SelectDropdown
            id={`masked-select-dropdown-${props.id}`}
            role="listbox"
            style={{
              top: dropdownPos.top,
              left: dropdownPos.left,
              width: dropdownPos.width
            }}
          >
            {props.options.map((option) => (
              <SelectOption
                key={option.value}
                role="option"
                aria-selected={option.value === props.value}
                className={`${option.value === props.value ? 'selected' : ''}`}
                onClick={() => {
                  props.onChange?.(option.value)
                  setOpen(false)
                }}
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
