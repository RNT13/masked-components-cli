'use client'

import { CardVariantMap } from '../../MaskedCards.types'
import { BaseCard } from '../../Base/BaseCard'
import {
  TestimonialAuthor,
  TestimonialAuthorName,
  TestimonialAuthorRole,
  TestimonialAvatar,
  TestimonialFooter,
  TestimonialQuote,
  TestimonialRating,
  TestimonialRatingValue
} from './TestimonialCard.styles'

type TestimonialCardProps = CardVariantMap['testimonial']

function initialsOf(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

function renderStars(rating: number): string {
  const clamped = Math.max(0, Math.min(5, Math.round(rating)))
  return '★'.repeat(clamped) + '☆'.repeat(5 - clamped)
}

export function TestimonialCard(props: TestimonialCardProps) {
  const {
    quote,
    author,
    authorRole,
    avatar,
    avatarAlt,
    avatarFallback,
    rating,
    ratingLabel,
    ...rest
  } = props

  return (
    <BaseCard {...rest} hrefLabel={rest.hrefLabel ?? author}>
      {rating !== undefined && (
        <TestimonialRating role="img" aria-label={ratingLabel ?? `Nota ${rating} de 5`}>
          <span aria-hidden="true">{renderStars(rating)}</span>
          <TestimonialRatingValue aria-hidden="true">{rating.toFixed(1)}</TestimonialRatingValue>
        </TestimonialRating>
      )}

      <TestimonialQuote>{quote}</TestimonialQuote>

      <TestimonialFooter>
        <TestimonialAvatar>
          {avatar ? (
            <img src={avatar} alt={avatarAlt ?? author} />
          ) : (
            (avatarFallback ?? initialsOf(author))
          )}
        </TestimonialAvatar>
        <TestimonialAuthor>
          <TestimonialAuthorName>{author}</TestimonialAuthorName>
          {authorRole && <TestimonialAuthorRole>{authorRole}</TestimonialAuthorRole>}
        </TestimonialAuthor>
      </TestimonialFooter>
    </BaseCard>
  )
}
