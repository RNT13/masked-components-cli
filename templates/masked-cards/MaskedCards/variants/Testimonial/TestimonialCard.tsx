'use client'

import { BaseCard } from '../../Base/BaseCard'
import { CardVariantMap } from '../../MaskedCards.types'
import {
  TestimonialActions,
  TestimonialAuthor,
  TestimonialAuthorBlock,
  TestimonialAvatar,
  TestimonialAvatarFallback,
  TestimonialFooter,
  TestimonialQuote,
  TestimonialRating,
  TestimonialRatingValue,
  TestimonialRole
} from './TestimonialCard.styles'

type Props = CardVariantMap['testimonial']

function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

function stars(rating: number): string {
  const clamped = Math.max(0, Math.min(5, Math.round(rating)))
  return '★'.repeat(clamped) + '☆'.repeat(5 - clamped)
}

export function TestimonialCard({
  quote,
  author,
  role,
  authorRole,
  company,
  avatar,
  avatarAlt,
  avatarFallback,
  rating,
  ratingLabel,
  actions,
  ...rest
}: Props) {
  const displayRole = role ?? authorRole
  const roleLine = [displayRole, company].filter(Boolean).join(' · ')

  return (
    <BaseCard {...rest} hasActions={!!actions} hrefLabel={rest.hrefLabel ?? author}>
      <TestimonialQuote>{quote}</TestimonialQuote>

      {rating !== undefined && rating !== null && (
        <TestimonialRating aria-label={ratingLabel ?? `Avaliação ${rating} de 5`}>
          <span aria-hidden>{stars(rating)}</span>
          <TestimonialRatingValue>{rating}/5</TestimonialRatingValue>
        </TestimonialRating>
      )}

      <TestimonialFooter>
        {avatar ? (
          <TestimonialAvatar src={avatar} alt={avatarAlt ?? ''} />
        ) : (
          <TestimonialAvatarFallback aria-hidden>
            {avatarFallback ?? initials(author)}
          </TestimonialAvatarFallback>
        )}
        <TestimonialAuthorBlock>
          <TestimonialAuthor>{author}</TestimonialAuthor>
          {roleLine && <TestimonialRole>{roleLine}</TestimonialRole>}
        </TestimonialAuthorBlock>
      </TestimonialFooter>

      {actions && <TestimonialActions>{actions}</TestimonialActions>}
    </BaseCard>
  )
}
