'use client'

import { useEffect, useRef, useState } from 'react'
import { ErrorDiv, InputLabel, MaskedInputContainer, SelectDropdown, SelectOption, SelectTrigger } from '../MaskedInput.styles'
import { InputVariantMap } from '../MaskedInput.types'

type props = { variant: 'select' } & InputVariantMap['select']

export function SelectInput(props: props) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const hasError = props.touched && Boolean(props.error)

  const selectedOption = props.options.find(opt => opt.value === props.value)

  /* fecha ao clicar fora */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <MaskedInputContainer $variant="select" ref={containerRef} $radius={props.radius} data-error={hasError}>
      {props.label && (
        <InputLabel>
          {props.icon && props.icon}
          <span>{props.label}</span>
        </InputLabel>
      )}

      {/* TRIGGER */}
      <SelectTrigger type="button" className={` ${hasError ? 'error' : ''}`} onClick={() => setOpen(o => !o)}>
        {selectedOption?.label ?? 'Selecione uma opção'}
        <span className={`arrow ${open ? 'open' : ''}`} />
      </SelectTrigger>

      {/* DROPDOWN */}
      {open && (
        <SelectDropdown>
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
        </SelectDropdown>
      )}

      {props.showError && hasError && <ErrorDiv id={`${props.id}-error`}>{props.error}</ErrorDiv>}
    </MaskedInputContainer>
  )
}
