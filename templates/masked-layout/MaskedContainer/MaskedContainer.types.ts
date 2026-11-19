import type { CSSProperties, ElementType, HTMLAttributes, ReactNode } from 'react'
import type { DefaultTheme } from 'styled-components'
import type { ContainerTokenOverrides } from './containerTokens'

/** Larguras do MaskedContainer. Default 'default'. */
export type ContainerVariant = 'narrow' | 'default' | 'wide' | 'full'

/** Chave da escala oficial de espaçamento do tema (theme.spacing: 2xs..5xl). */
export type SpacingKey = Extract<keyof DefaultTheme['spacing'], string>

/** Props próprias do MaskedContainer (API pública). */
export type MaskedContainerBaseProps = {
  /** Elemento renderizado (polimorfismo). Default 'div'. */
  as?: ElementType
  variant?: ContainerVariant
  /** Centraliza horizontalmente (margin-inline: auto). Default true. */
  centered?: boolean
  /** Gutter lateral: chave de theme.spacing, número (px) ou valor CSS. Default responsivo (lg / md no mobile). */
  paddingX?: SpacingKey | number | (string & {})
  /** Respiro vertical: chave de theme.spacing, número (px) ou valor CSS. Default 0. */
  paddingY?: SpacingKey | number | (string & {})
  /** Overrides granulares de tokens --mc-container-*. */
  tokens?: ContainerTokenOverrides
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

/** Props transient internas (styled-components) — nunca API pública. */
export type MaskedContainerInternalProps = {
  $centered: boolean
}

export type MaskedContainerProps = MaskedContainerBaseProps &
  Omit<HTMLAttributes<HTMLElement>, keyof MaskedContainerBaseProps | 'style'>
