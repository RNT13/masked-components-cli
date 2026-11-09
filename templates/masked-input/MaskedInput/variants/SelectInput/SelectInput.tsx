'use client'

import { useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react'
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
  const autoId = useId()
  const triggerId = props.id ?? autoId
  const listboxId = `${triggerId}-listbox`
  const optionId = (index: number) => `${listboxId}-opt-${index}`

  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 })

  /* Híbrido: se `value` for passado, o pai controla; senão, estado interno. */
  const isControlled = props.value !== undefined
  const [internal, setInternal] = useState('')
  const current = isControlled ? props.value : internal

  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const optionRefs = useRef<Array<HTMLDivElement | null>>([])

  const hasError = props.touched && Boolean(props.error)
  const options = props.options
  const lastIndex = options.length - 1
  const selectedIndex = options.findIndex((opt) => opt.value === current)
  const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : undefined
  const tokenStyle = resolveInputTokens({ colorTheme: props.colorTheme, tokens: props.tokens })

  function updateDropdownPosition() {
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    setDropdownPos({ top: rect.bottom + 6, left: rect.left, width: rect.width })
  }

  function openList() {
    if (props.disabled || options.length === 0) return
    updateDropdownPosition()
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0)
    setOpen(true)
  }

  function closeList() {
    setOpen(false)
    setActiveIndex(-1)
  }

  function choose(index: number) {
    const option = options[index]
    if (!option) return
    if (!isControlled) setInternal(option.value)
    props.onChange?.(option.value)
    closeList()
    triggerRef.current?.focus()
  }

  function handleKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault()
        openList()
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActiveIndex((i) => Math.min(i + 1, lastIndex))
        break
      case 'ArrowUp':
        e.preventDefault()
        setActiveIndex((i) => Math.max(i - 1, 0))
        break
      case 'Home':
        e.preventDefault()
        setActiveIndex(0)
        break
      case 'End':
        e.preventDefault()
        setActiveIndex(lastIndex)
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (activeIndex >= 0) choose(activeIndex)
        break
      case 'Escape':
        e.preventDefault()
        closeList()
        break
      case 'Tab':
        closeList()
        break
    }
  }

  /* posição acompanha scroll/resize enquanto aberto */
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

  /* mantém o item ativo visível ao navegar por teclado */
  useEffect(() => {
    if (open && activeIndex >= 0) {
      optionRefs.current[activeIndex]?.scrollIntoView({ block: 'nearest' })
    }
  }, [open, activeIndex])

  /* clique fora fecha (dropdown está em portal, então usa ref própria) */
  useEffect(() => {
    if (!open) return
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node
      if (containerRef.current?.contains(target) || dropdownRef.current?.contains(target)) return
      closeList()
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  return (
    <MaskedInputContainer
      $variant="select"
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
          <span>{props.label}</span>
        </InputLabel>
      )}

      {props.icon && <InputIconWrapper>{props.icon}</InputIconWrapper>}

      <SelectTrigger
        id={triggerId}
        data-mc-trigger=""
        ref={triggerRef}
        type="button"
        role="combobox"
        className={hasError ? 'error' : ''}
        disabled={props.disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        aria-activedescendant={open && activeIndex >= 0 ? optionId(activeIndex) : undefined}
        aria-invalid={hasError ? 'true' : undefined}
        aria-describedby={hasError ? `${triggerId}-error` : undefined}
        onClick={() => (open ? closeList() : openList())}
        onKeyDown={handleKeyDown}
        /* Espaço dispara "click" no keyup em alguns navegadores */
        onKeyUp={(e) => {
          if (e.key === ' ') e.preventDefault()
        }}
      >
        {selectedOption?.label ?? props.placeholder ?? 'Selecione...'}
        <span className={`arrow ${open ? 'open' : ''}`} aria-hidden="true" />
      </SelectTrigger>

      {open &&
        createPortal(
          <SelectDropdown
            ref={dropdownRef}
            id={listboxId}
            role="listbox"
            aria-label={props.label ?? props.placeholder}
            style={{
              ...tokenStyle,
              top: dropdownPos.top,
              left: dropdownPos.left,
              width: dropdownPos.width
            }}
          >
            {options.map((option, index) => (
              <SelectOption
                key={option.value}
                id={optionId(index)}
                ref={(el) => {
                  optionRefs.current[index] = el
                }}
                role="option"
                aria-selected={option.value === current}
                data-active={index === activeIndex}
                onMouseEnter={() => setActiveIndex(index)}
                /* evita perder o foco do trigger antes do clique */
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => choose(index)}
              >
                {option.label}
              </SelectOption>
            ))}
          </SelectDropdown>,
          document.body
        )}

      {hasError && <ErrorDiv id={`${triggerId}-error`}>{props.error}</ErrorDiv>}
    </MaskedInputContainer>
  )
}
