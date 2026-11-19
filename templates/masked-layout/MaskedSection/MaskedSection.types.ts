import type { CSSProperties, ElementType, HTMLAttributes, ReactNode } from 'react'
import type { DefaultTheme } from 'styled-components'
import type { ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'
import type { SectionTokenOverrides } from './sectionTokens'

/** Aparência da seção. Default 'plain' (sem pintura). */
export type SectionVariant = 'plain' | 'tinted' | 'bordered' | 'gradient'

export type SectionAlign = 'left' | 'center'

/** Chave da escala oficial de espaçamento do tema (theme.spacing: 2xs..5xl). */
export type SpacingKey = Extract<keyof DefaultTheme['spacing'], string>

/** Props próprias do MaskedSection (API pública). */
export type MaskedSectionBaseProps = {
  /** Elemento renderizado (polimorfismo). Default 'section'. */
  as?: ElementType
  variant?: SectionVariant
  /** id da seção (âncora). Quando há `title`, o título rotula a seção via aria-labelledby. */
  id?: string
  /** Título da seção (renderizado como h2 por padrão). */
  title?: ReactNode
  /** Nível do heading do título (2 a 4). Default 2. */
  headingLevel?: 2 | 3 | 4
  description?: ReactNode
  /** Alinhamento do cabeçalho (título/descrição/ações). Default 'left'. */
  align?: SectionAlign
  /** Slot de ações ao lado do cabeçalho (botões, links). */
  actions?: ReactNode
  /** Limita o conteúdo a uma largura de página, centralizado. Default true. */
  contained?: boolean
  /** Respiro vertical: chave de theme.spacing, número (px) ou valor CSS. Default '3xl' ('2xl' no mobile). */
  paddingY?: SpacingKey | number | (string & {})
  /** Paleta registrada ou chave da paleta (tinted/bordered/gradient). */
  colorTheme?: ColorThemeName
  /** Overrides granulares de tokens --mc-section-*. */
  tokens?: SectionTokenOverrides
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

/** Props transient internas (styled-components) — nunca API pública. */
export type MaskedSectionInternalProps = {
  $variant: SectionVariant
  $align: SectionAlign
}

export type MaskedSectionProps = MaskedSectionBaseProps &
  Omit<HTMLAttributes<HTMLElement>, keyof MaskedSectionBaseProps | 'style' | 'title'>
