'use client'

import { MaskedSection } from '@/components/ui/MaskedSection/MaskedSection'
import { useMaskedConfig } from '@/components/ui/MaskedConfigProvider'
import { useMaskedTheme } from '@/styles/useMaskedTheme'
import {
  TestimonialAuthor,
  TestimonialAvatar,
  TestimonialCaption,
  TestimonialFigure,
  TestimonialItemEl,
  TestimonialQuote,
  TestimonialsList,
  TestimonialsScroller
} from './MaskedTestimonials.styles'
import { resolveTestimonialsTokens } from './testimonialsTokens'
import type { MaskedTestimonialsProps } from './MaskedTestimonials.types'

const REGION = { pt: 'Depoimentos', en: 'Testimonials' } as const

/**
 * Depoimentos dentro de uma MaskedSection.
 *
 * Semântica: cada depoimento é um <figure> com <blockquote> e <figcaption>.
 * O 'carousel' é CSS puro (scroll-snap, sem JavaScript): a região rolável é
 * focável e rotulada, então setas do teclado rolam o conteúdo.
 *
 * @example
 * <MaskedTestimonials title="Clientes" items={[{ quote: 'Ótimo!', author: 'Ana', role: 'Dona de salão' }]} />
 */
export function MaskedTestimonials(props: MaskedTestimonialsProps) {
  const theme = useMaskedTheme()
  const config = useMaskedConfig()
  const {
    variant = 'grid',
    items,
    carouselLabel,
    sectionVariant,
    sectionTokens,
    tokens,
    colorTheme,
    ...section
  } = props

  const label =
    carouselLabel ?? REGION[(config.locale ?? 'pt-BR').toLowerCase().startsWith('en') ? 'en' : 'pt']
  const tokenStyle = resolveTestimonialsTokens({ colorTheme, tokens }, theme)
  const scrollable =
    variant === 'carousel' ? { role: 'region', 'aria-label': label, tabIndex: 0 } : {}

  return (
    <MaskedSection
      {...section}
      variant={sectionVariant}
      colorTheme={colorTheme}
      tokens={sectionTokens}
    >
      <TestimonialsScroller $variant={variant} style={tokenStyle} {...scrollable}>
        <TestimonialsList $variant={variant}>
          {items.map((item) => (
            <TestimonialItemEl key={item.id ?? item.author}>
              <TestimonialFigure>
                <TestimonialQuote>{item.quote}</TestimonialQuote>
                <TestimonialCaption>
                  {item.avatar && <TestimonialAvatar>{item.avatar}</TestimonialAvatar>}
                  <TestimonialAuthor>
                    {item.author}
                    {item.role && <small>{item.role}</small>}
                  </TestimonialAuthor>
                </TestimonialCaption>
              </TestimonialFigure>
            </TestimonialItemEl>
          ))}
        </TestimonialsList>
      </TestimonialsScroller>
    </MaskedSection>
  )
}
