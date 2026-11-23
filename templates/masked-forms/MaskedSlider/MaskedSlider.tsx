'use client'

import { useId, useState } from 'react'
import { useMaskedTheme } from '@/styles/useMaskedTheme'
import {
  MaskedSliderRoot,
  SliderHeader,
  SliderInput,
  SliderMark,
  SliderMarks,
  SliderTrack,
  SliderValue
} from './MaskedSlider.styles'
import { getStepMarks, percentOf, resolveSliderTokens } from './sliderTokens'
import type { MaskedSliderProps } from './MaskedSlider.types'

/**
 * Slider acessível baseado no <input type="range"> nativo.
 *
 * Teclado (setas, Home, End, PageUp/PageDown), toque e leitor de tela vêm do
 * navegador. O rótulo é um <label> real ligado ao campo; o valor aparece num
 * <output> e `formatValue` também alimenta o `aria-valuetext` ("50%", "R$ 120").
 * Funciona controlado (`value`/`onChange`) ou não (`defaultValue`) e participa
 * de <form> via `name`.
 *
 * @example
 * <MaskedSlider label="Volume" showValue defaultValue={30} />
 * <MaskedSlider variant="steps" min={0} max={10} step={2} label="Nível" aria-label="Nível" />
 */
export function MaskedSlider(props: MaskedSliderProps) {
  const theme = useMaskedTheme()
  const generatedId = useId()
  const {
    variant = 'default',
    min = 0,
    max = 100,
    step = 1,
    value: valueProp,
    defaultValue,
    onChange,
    label,
    showValue = false,
    formatValue,
    colorTheme,
    tokens,
    className,
    style,
    id,
    ...input
  } = props

  const [inner, setInner] = useState(defaultValue ?? min)
  const value = valueProp ?? inner
  const inputId = id ?? generatedId
  const shown = formatValue ? formatValue(value) : String(value)
  const percent = percentOf(value, min, max)
  const tokenStyle = resolveSliderTokens({ colorTheme, percent, tokens }, theme)
  const marks = variant === 'steps' ? getStepMarks(min, max, step) : []

  return (
    <MaskedSliderRoot className={className} style={{ ...tokenStyle, ...style }}>
      {(label || showValue) && (
        <SliderHeader>
          {label ? <label htmlFor={inputId}>{label}</label> : <span />}
          {showValue && <SliderValue htmlFor={inputId}>{shown}</SliderValue>}
        </SliderHeader>
      )}
      <SliderTrack>
        <SliderInput
          {...input}
          id={inputId}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          $variant={variant}
          aria-valuetext={formatValue ? shown : undefined}
          onChange={(event) => {
            const next = Number(event.target.value)
            setInner(next)
            onChange?.(next)
          }}
        />
        {marks.length > 0 && (
          <SliderMarks aria-hidden="true">
            {marks.map((mark) => (
              <SliderMark key={mark} style={{ left: `${percentOf(mark, min, max)}%` }} />
            ))}
          </SliderMarks>
        )}
      </SliderTrack>
    </MaskedSliderRoot>
  )
}
