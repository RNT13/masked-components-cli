import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'
import type { ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'
import type { AccordionTokenOverrides } from './accordionTokens'

/** Aparência do accordion. Default 'default'. */
export type AccordionVariant = 'default' | 'boxed' | 'separated'

export type AccordionItem = {
  id: string
  title: ReactNode
  content: ReactNode
  disabled?: boolean
}

/** Props próprias do MaskedAccordion (API pública). */
export type MaskedAccordionBaseProps = {
  variant?: AccordionVariant
  items: AccordionItem[]
  /** Permite vários itens abertos ao mesmo tempo. Default false. */
  multiple?: boolean
  /** No modo único, permite fechar o item aberto. Default true. */
  collapsible?: boolean
  /** Ids abertos (controlado). */
  value?: string[]
  /** Ids abertos inicialmente (não controlado). */
  defaultValue?: string[]
  onChange?: (value: string[]) => void
  /** Nível do heading que envolve cada botão (2 a 4). Default 3. */
  headingLevel?: 2 | 3 | 4
  /** Paleta registrada ou chave da paleta (indicador). */
  colorTheme?: ColorThemeName
  /** Overrides granulares de tokens --mc-accordion-*. */
  tokens?: AccordionTokenOverrides
  className?: string
  style?: CSSProperties
}

/** Props transient internas (styled-components) — nunca API pública. */
export type MaskedAccordionInternalProps = {
  $variant: AccordionVariant
  $open?: boolean
}

export type MaskedAccordionProps = MaskedAccordionBaseProps &
  Omit<
    HTMLAttributes<HTMLDivElement>,
    keyof MaskedAccordionBaseProps | 'style' | 'children' | 'onChange'
  >
