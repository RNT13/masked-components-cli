import type { ReactNode } from 'react'
import type {
  MaskedSectionProps,
  SectionVariant
} from '@/components/ui/MaskedSection/MaskedSection.types'
import type { SectionTokenOverrides } from '@/components/ui/MaskedSection/sectionTokens'
import type { FeaturesTokenOverrides } from './featuresTokens'

/** Layouts da lista de recursos. Default 'grid'. */
export type FeaturesVariant = 'grid' | 'split' | 'spotlight' | 'timeline'

export type FeatureItem = {
  /** Chave estável (default: o título). */
  id?: string
  /** Ícone/ilustração (decorativo — fica aria-hidden). */
  icon?: ReactNode
  title: string
  description?: ReactNode
}

/** Props próprias do MaskedFeatures (API pública). */
export type MaskedFeaturesOwnProps = {
  variant?: FeaturesVariant
  items: FeatureItem[]
  /** Colunas do variant 'grid' no desktop (2 a 4). Default 3 (2 no tablet, 1 no mobile). */
  cols?: 2 | 3 | 4
  /** Aparência da seção que envolve a lista. Default 'plain'. */
  sectionVariant?: SectionVariant
  /** Overrides de tokens --mc-section-* da seção. */
  sectionTokens?: SectionTokenOverrides
  /** Overrides granulares de tokens --mc-features-*. */
  tokens?: FeaturesTokenOverrides
}

/**
 * A seção (id, title, description, headingLevel, align, actions, paddingY,
 * colorTheme, as…) usa as mesmas props do MaskedSection.
 */
export type MaskedFeaturesProps = MaskedFeaturesOwnProps &
  Omit<MaskedSectionProps, keyof MaskedFeaturesOwnProps | 'variant' | 'tokens' | 'children'>

/** Props transient internas (styled-components) — nunca API pública. */
export type MaskedFeaturesInternalProps = {
  $variant: FeaturesVariant
  $cols: number
}
