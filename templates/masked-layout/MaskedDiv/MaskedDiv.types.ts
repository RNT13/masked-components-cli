import type { CSSProperties, ElementType, HTMLAttributes, ReactNode } from 'react'
import type { DefaultTheme } from 'styled-components'
import type { ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'
import type { DivTokenOverrides } from './divTokens'

/** Tipos visuais do MaskedDiv. Default 'plain' = caixa neutra, sem pintura. */
export type DivVariant = 'plain' | 'card' | 'outlined' | 'glass'

export type DivDirection = 'row' | 'column'

/** Chave da escala oficial de espaçamento do tema (theme.spacing: 2xs..5xl). */
export type SpacingKey = Extract<keyof DefaultTheme['spacing'], string>

/** Props próprias do MaskedDiv (API pública). */
export type MaskedDivBaseProps = {
  /** Elemento renderizado (polimorfismo). Default 'div'. */
  as?: ElementType
  variant?: DivVariant
  /**
   * Ativa flex (display: flex) nesta direção. Sem `direction` (ou align/
   * justify/wrap), Div é block neutro — para fluxo com gap semântico e
   * divisor, use MaskedStack.
   */
  direction?: DivDirection
  align?: CSSProperties['alignItems']
  justify?: CSSProperties['justifyContent']
  wrap?: CSSProperties['flexWrap']
  /** Gap do flex: chave de theme.spacing (2xs..5xl), número (px) ou valor CSS. */
  gap?: SpacingKey | number | (string & {})
  /** Preenchimento interno: chave de theme.spacing (2xs..5xl), número (px) ou valor CSS. */
  padding?: SpacingKey | number | (string & {})
  /** Ocupa 100% da largura do pai. */
  fullWidth?: boolean
  /**
   * Nome de uma paleta registrada via `registerColorTheme()` ou chave da
   * paleta. Deriva os tokens --mc-div-*. danger/success vêm do tema, não
   * do colorTheme.
   */
  colorTheme?: ColorThemeName
  /** Overrides granulares de tokens --mc-div-*. Precedência: tokens > props > colorTheme > default. */
  tokens?: DivTokenOverrides
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

/** Props transient internas (styled-components) — nunca API pública. */
export type MaskedDivInternalProps = {
  $variant?: DivVariant
  $direction?: DivDirection
  $align?: CSSProperties['alignItems']
  $justify?: CSSProperties['justifyContent']
  $wrap?: CSSProperties['flexWrap']
  $fullWidth?: boolean
}

export type MaskedDivProps = MaskedDivBaseProps &
  Omit<HTMLAttributes<HTMLElement>, keyof MaskedDivBaseProps | 'style'>
