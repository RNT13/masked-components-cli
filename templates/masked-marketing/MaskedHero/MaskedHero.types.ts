import type { CSSProperties, ElementType, HTMLAttributes, ReactNode } from 'react'
import type { ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'
import type { HeroTokenOverrides } from './heroTokens'

/** Layouts do hero. Default 'centered'. */
export type HeroVariant = 'centered' | 'split' | 'gradient' | 'minimal'

/** Props próprias do MaskedHero (API pública). */
export type MaskedHeroBaseProps = {
  /** Elemento renderizado (polimorfismo). Default 'section'. */
  as?: ElementType
  variant?: HeroVariant
  /** Texto curto acima do título (categoria, novidade). */
  eyebrow?: ReactNode
  /** Título principal. */
  title: ReactNode
  /** Nível do heading do título (1 ou 2). Default 1. */
  headingLevel?: 1 | 2
  description?: ReactNode
  /** Slot dos botões de chamada (ex.: <MaskedButton />). */
  actions?: ReactNode
  /** Slot de mídia (imagem, vídeo, mockup). No 'split' fica ao lado; nos demais, abaixo do texto. */
  media?: ReactNode
  /** Lado da mídia no variant 'split'. Default 'end'. */
  mediaPosition?: 'start' | 'end'
  /** Paleta registrada ou chave da paleta (cor do eyebrow; fundo no 'gradient'). */
  colorTheme?: ColorThemeName
  /** Overrides granulares de tokens --mc-hero-*. */
  tokens?: HeroTokenOverrides
  className?: string
  style?: CSSProperties
  /** Conteúdo extra abaixo (estatísticas, logos). */
  children?: ReactNode
}

/** Props transient internas (styled-components) — nunca API pública. */
export type MaskedHeroInternalProps = {
  $variant: HeroVariant
  $mediaPosition: 'start' | 'end'
}

export type MaskedHeroProps = MaskedHeroBaseProps &
  Omit<HTMLAttributes<HTMLElement>, keyof MaskedHeroBaseProps | 'style' | 'title'>
