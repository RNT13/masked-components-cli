import type { ReactNode } from 'react'
import type { CardSelectionMode } from '../MaskedCards.types'

export type MaskedCardGroupSingleProps = {
  selectionMode?: 'single'
  /** Valor selecionado (controlado). */
  value?: string
  /** Valor inicial (não controlado). */
  defaultValue?: string
  onValueChange?: (value: string) => void
}

export type MaskedCardGroupMultipleProps = {
  selectionMode: 'multiple'
  /** Valores selecionados (controlado). */
  value?: string[]
  /** Valores iniciais (não controlado). */
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
}

export type MaskedCardGroupBaseProps = {
  /** Nome acessível do grupo (obrigatório se não houver ariaLabelledBy). */
  ariaLabel?: string
  /** id de um elemento que rotula o grupo (vence ariaLabel). */
  ariaLabelledBy?: string
  /** Desabilita todos os cards do grupo. */
  disabled?: boolean
  /** Largura mínima de cada item do grid (default 240px). */
  minItemWidth?: number
  /** Espaçamento do grid: token de spacing do maskedTheme ou valor CSS. */
  gap?: string
  className?: string
  style?: React.CSSProperties
  children?: ReactNode
}

export type MaskedCardGroupProps = MaskedCardGroupBaseProps &
  (MaskedCardGroupSingleProps | MaskedCardGroupMultipleProps)

export type { CardSelectionMode }
