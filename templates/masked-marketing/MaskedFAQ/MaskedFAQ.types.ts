import type { ReactNode } from 'react'
import type {
  MaskedSectionProps,
  SectionVariant
} from '@/components/ui/MaskedSection/MaskedSection.types'
import type { SectionTokenOverrides } from '@/components/ui/MaskedSection/sectionTokens'
import type { FAQTokenOverrides } from './faqTokens'

/** Layouts do FAQ. Default 'list'. */
export type FAQVariant = 'list' | 'two-columns' | 'boxed'

export type FAQItem = {
  /** Chave estável (default: a pergunta). */
  id?: string
  question: string
  answer: ReactNode
}

/** Props próprias do MaskedFAQ (API pública). */
export type MaskedFAQOwnProps = {
  variant?: FAQVariant
  items: FAQItem[]
  /** Permite várias respostas abertas ao mesmo tempo. Default true. */
  multiple?: boolean
  /** Índice (ou índices) abertos inicialmente. */
  defaultOpen?: number | number[]
  /** Aparência da seção que envolve as perguntas. Default 'plain'. */
  sectionVariant?: SectionVariant
  /** Overrides de tokens --mc-section-* da seção. */
  sectionTokens?: SectionTokenOverrides
  /** Overrides granulares de tokens --mc-faq-*. */
  tokens?: FAQTokenOverrides
}

/** A seção (id, title, description, headingLevel, colorTheme…) usa as props do MaskedSection. */
export type MaskedFAQProps = MaskedFAQOwnProps &
  Omit<MaskedSectionProps, keyof MaskedFAQOwnProps | 'variant' | 'tokens' | 'children'>

/** Props transient internas (styled-components) — nunca API pública. */
export type MaskedFAQInternalProps = {
  $variant: FAQVariant
}
