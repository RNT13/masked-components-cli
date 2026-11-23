import type { CSSProperties, InputHTMLAttributes, ReactNode } from 'react'
import type { ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'
import type { SliderTokenOverrides } from './sliderTokens'

/** Aparência do slider. Default 'default'. */
export type SliderVariant = 'default' | 'filled' | 'steps'

/** Props próprias do MaskedSlider (API pública). */
export type MaskedSliderBaseProps = {
  variant?: SliderVariant
  /** Valor mínimo. Default 0. */
  min?: number
  /** Valor máximo. Default 100. */
  max?: number
  /** Passo entre valores. Default 1. */
  step?: number
  /** Valor atual (controlado). */
  value?: number
  /** Valor inicial (não controlado). Default: `min`. */
  defaultValue?: number
  onChange?: (value: number) => void
  /** Rótulo visível (um <label> real ligado ao campo). Sem ele, passe `aria-label`. */
  label?: ReactNode
  /** Mostra o valor atual ao lado do rótulo (em um <output>). */
  showValue?: boolean
  /** Formata o valor exibido e o `aria-valuetext` (ex.: v => `${v}%`). */
  formatValue?: (value: number) => string
  /** Paleta registrada ou chave da paleta (preenchimento e marcador). */
  colorTheme?: ColorThemeName
  /** Overrides granulares de tokens --mc-slider-*. */
  tokens?: SliderTokenOverrides
  /** Classe e estilo vão para o contêiner; o resto (name, disabled, id, aria-*) vai para o <input>. */
  className?: string
  style?: CSSProperties
}

/** Props transient internas (styled-components) — nunca API pública. */
export type MaskedSliderInternalProps = {
  $variant: SliderVariant
}

export type MaskedSliderProps = MaskedSliderBaseProps &
  Omit<
    InputHTMLAttributes<HTMLInputElement>,
    | keyof MaskedSliderBaseProps
    | 'type'
    | 'size'
    | 'style'
    | 'children'
    | 'onChange'
    | 'defaultValue'
  >
