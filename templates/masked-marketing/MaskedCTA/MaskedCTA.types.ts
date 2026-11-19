import type { CSSProperties, ElementType, HTMLAttributes, ReactNode } from 'react'
import type { ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'
import type { CTATokenOverrides } from './ctaTokens'

/** Layouts da chamada para ação. Default 'banner'. */
export type CTAVariant = 'banner' | 'gradient' | 'split'

/** Props próprias do MaskedCTA (API pública). */
export type MaskedCTABaseProps = {
  /** Elemento renderizado (polimorfismo). Default 'section'. */
  as?: ElementType
  variant?: CTAVariant
  title: ReactNode
  /** Nível do heading do título (2 a 4). Default 2. */
  headingLevel?: 2 | 3 | 4
  description?: ReactNode
  /** Slot dos botões (ex.: <MaskedButton />). */
  actions?: ReactNode
  /** Paleta registrada ou chave da paleta. Pinta o fundo com texto por contraste. */
  colorTheme?: ColorThemeName
  /** Overrides granulares de tokens --mc-cta-*. */
  tokens?: CTATokenOverrides
  className?: string
  style?: CSSProperties
}

/** Props transient internas (styled-components) — nunca API pública. */
export type MaskedCTAInternalProps = {
  $variant: CTAVariant
}

export type MaskedCTAProps = MaskedCTABaseProps &
  Omit<HTMLAttributes<HTMLElement>, keyof MaskedCTABaseProps | 'style' | 'title' | 'children'>
