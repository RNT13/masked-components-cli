import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'
import type { DefaultTheme } from 'styled-components'
import type { ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'
import type { DividerTokenOverrides } from './dividerTokens'

/** Orientação/forma do divisor. Default 'horizontal'. */
export type DividerVariant = 'horizontal' | 'vertical' | 'labeled'

/** Chave da escala oficial de espaçamento do tema (theme.spacing: 2xs..5xl). */
export type SpacingKey = Extract<keyof DefaultTheme['spacing'], string>

/** Props próprias do MaskedDivider (API pública). */
export type MaskedDividerBaseProps = {
  variant?: DividerVariant
  /** Texto/nó centralizado entre as linhas (variant 'labeled'). */
  label?: ReactNode
  /**
   * true (padrão) = puramente visual: some da árvore de acessibilidade
   * (aria-hidden). false = separador semântico (role="separator" com
   * aria-orientation). 'labeled' sempre expõe o label como conteúdo.
   */
  decorative?: boolean
  /** Margem ao redor: chave de theme.spacing, número (px) ou valor CSS. */
  spacing?: SpacingKey | number | (string & {})
  /** Espessura da linha (CSS). Default '1px'. */
  thickness?: string
  /** Paleta registrada ou chave da paleta; pinta a linha. Default: borda do tema. */
  colorTheme?: ColorThemeName
  /** Overrides granulares de tokens --mc-divider-*. */
  tokens?: DividerTokenOverrides
  className?: string
  style?: CSSProperties
}

/** Props transient internas (styled-components) — nunca API pública. */
export type MaskedDividerInternalProps = {
  $variant: DividerVariant
}

export type MaskedDividerProps = MaskedDividerBaseProps &
  Omit<HTMLAttributes<HTMLElement>, keyof MaskedDividerBaseProps | 'style' | 'children'>
