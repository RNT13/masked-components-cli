import type { ReactNode } from 'react'
import type {
  MaskedSectionProps,
  SectionVariant
} from '@/components/ui/MaskedSection/MaskedSection.types'
import type { SectionTokenOverrides } from '@/components/ui/MaskedSection/sectionTokens'
import type { StatsTokenOverrides } from './statsTokens'

/** Layouts dos números. Default 'row'. */
export type StatsVariant = 'row' | 'grid' | 'highlight'

export type StatTrend = {
  /** Texto da variação (ex.: "+12%"). */
  value: string
  direction: 'up' | 'down' | 'flat'
}

export type StatItem = {
  /** Chave estável (default: o label). */
  id?: string
  /** O número em destaque (ex.: "12k", "99,9%"). */
  value: ReactNode
  /** O que o número mede. */
  label: string
  trend?: StatTrend
}

/** Props próprias do MaskedStats (API pública). */
export type MaskedStatsOwnProps = {
  variant?: StatsVariant
  items: StatItem[]
  /** Aparência da seção que envolve os números. Default 'plain'. */
  sectionVariant?: SectionVariant
  /** Overrides de tokens --mc-section-* da seção. */
  sectionTokens?: SectionTokenOverrides
  /** Overrides granulares de tokens --mc-stats-*. */
  tokens?: StatsTokenOverrides
}

/** A seção (id, title, description, headingLevel, colorTheme…) usa as props do MaskedSection. */
export type MaskedStatsProps = MaskedStatsOwnProps &
  Omit<MaskedSectionProps, keyof MaskedStatsOwnProps | 'variant' | 'tokens' | 'children'>

/** Props transient internas (styled-components) — nunca API pública. */
export type MaskedStatsInternalProps = {
  $variant: StatsVariant
}
