import type { ReactNode } from 'react'
import type {
  MaskedSectionProps,
  SectionVariant
} from '@/components/ui/MaskedSection/MaskedSection.types'
import type { SectionTokenOverrides } from '@/components/ui/MaskedSection/sectionTokens'
import type { TestimonialsTokenOverrides } from './testimonialsTokens'

/** Layouts dos depoimentos. Default 'grid'. */
export type TestimonialsVariant = 'grid' | 'carousel' | 'spotlight'

export type TestimonialItem = {
  /** Chave estável (default: o nome do autor). */
  id?: string
  quote: ReactNode
  author: string
  role?: string
  /** Avatar (normalmente <img alt="" />, decorativo ao lado do nome). */
  avatar?: ReactNode
}

/** Props próprias do MaskedTestimonials (API pública). */
export type MaskedTestimonialsOwnProps = {
  variant?: TestimonialsVariant
  items: TestimonialItem[]
  /** Rótulo acessível da região rolável do 'carousel'. Default por locale. */
  carouselLabel?: string
  /** Aparência da seção que envolve os depoimentos. Default 'plain'. */
  sectionVariant?: SectionVariant
  /** Overrides de tokens --mc-section-* da seção. */
  sectionTokens?: SectionTokenOverrides
  /** Overrides granulares de tokens --mc-testimonials-*. */
  tokens?: TestimonialsTokenOverrides
}

/** A seção (id, title, description, headingLevel, colorTheme…) usa as props do MaskedSection. */
export type MaskedTestimonialsProps = MaskedTestimonialsOwnProps &
  Omit<MaskedSectionProps, keyof MaskedTestimonialsOwnProps | 'variant' | 'tokens' | 'children'>

/** Props transient internas (styled-components) — nunca API pública. */
export type MaskedTestimonialsInternalProps = {
  $variant: TestimonialsVariant
}
