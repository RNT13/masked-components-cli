import type { CSSProperties, ElementType, HTMLAttributes, ReactNode } from 'react'
import type { DefaultTheme } from 'styled-components'
import type { StackTokenOverrides } from './stackTokens'

/** Fluxos do MaskedStack. Default 'column'. */
export type StackVariant = 'column' | 'row' | 'inline' | 'spread'

export type StackDirection = 'row' | 'column'

/** Chave da escala oficial de espaçamento do tema (theme.spacing: 2xs..5xl). */
export type SpacingKey = Extract<keyof DefaultTheme['spacing'], string>

/** Gap entre itens: chave de theme.spacing (2xs..5xl), número (px) ou valor CSS. */
export type StackGap = SpacingKey | number | (string & {})

/** Props próprias do MaskedStack (API pública). */
export type MaskedStackBaseProps = {
  /** Elemento renderizado (polimorfismo). Default 'div'. */
  as?: ElementType
  variant?: StackVariant
  /** Vence a direção implícita do variant. */
  direction?: StackDirection
  /** Gap entre os itens. Default 'md'. */
  gap?: StackGap
  align?: CSSProperties['alignItems']
  justify?: CSSProperties['justifyContent']
  wrap?: boolean
  /**
   * true = linha automática do tema entre itens (cor via tokens.divider);  
   * ReactNode = separador customizado renderizado entre os itens.  
   */
  divider?: boolean | ReactNode
  /** Ocupa 100% da largura do pai. */
  fullWidth?: boolean
  /** Overrides granulares de tokens --mc-stack-* (gap, divider). */
  tokens?: StackTokenOverrides
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

/** Props transient internas (styled-components) — nunca API pública. */
export type MaskedStackInternalProps = {
  $variant?: StackVariant
  $direction: StackDirection
  $align?: CSSProperties['alignItems']
  $justify?: CSSProperties['justifyContent']
  $wrap?: boolean
  $fullWidth?: boolean
}

export type MaskedStackProps = MaskedStackBaseProps &
  Omit<HTMLAttributes<HTMLElement>, keyof MaskedStackBaseProps | 'style'>
