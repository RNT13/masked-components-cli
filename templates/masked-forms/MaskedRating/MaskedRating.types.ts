import type { CSSProperties, HTMLAttributes } from 'react'
import type { ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'
import type { RatingTokenOverrides } from './ratingTokens'

/** Forma da avaliação. Default 'stars'. */
export type RatingVariant = 'stars' | 'hearts' | 'numbers'

export type RatingSize = 'sm' | 'md' | 'lg'

/** Props próprias do MaskedRating (API pública). */
export type MaskedRatingBaseProps = {
  variant?: RatingVariant
  size?: RatingSize
  /** Quantidade de itens. Default 5. */
  max?: number
  /** Nota atual, de 0 (sem nota) a `max` (controlado). */
  value?: number
  /** Nota inicial (não controlado). Default 0. */
  defaultValue?: number
  onChange?: (value: number) => void
  /** Só exibe a nota (sem interação): vira uma imagem com nome acessível ("Nota 4 de 5"). */
  readOnly?: boolean
  /** Clicar na nota já escolhida a limpa (volta a 0). Default false. */
  allowClear?: boolean
  /** `name` dos campos de rádio (para <form>). Default: gerado. */
  name?: string
  /** Rótulo acessível do grupo. Default por locale ("Avaliação"/"Rating"). */
  label?: string
  /** Paleta registrada ou chave da paleta (cor dos itens preenchidos). */
  colorTheme?: ColorThemeName
  /** Overrides granulares de tokens --mc-rating-*. */
  tokens?: RatingTokenOverrides
  className?: string
  style?: CSSProperties
}

/** Props transient internas (styled-components) — nunca API pública. */
export type MaskedRatingInternalProps = {
  $variant: RatingVariant
  $size: RatingSize
  $filled?: boolean
  $interactive?: boolean
}

export type MaskedRatingProps = MaskedRatingBaseProps &
  Omit<
    HTMLAttributes<HTMLDivElement>,
    keyof MaskedRatingBaseProps | 'style' | 'children' | 'onChange'
  >
