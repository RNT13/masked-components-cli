'use client'

import { forwardRef } from 'react'
import { BaseCardProps, CardSize } from '../MaskedCards.types'
import { BaseCardContainer } from './BaseCard.styles'

type BaseCardInternalProps = BaseCardProps & {
  $size?: CardSize
  $fullWidth?: boolean
  $clickable?: boolean
  children?: React.ReactNode
}

export const BaseCard = forwardRef<HTMLDivElement, BaseCardInternalProps>(function BaseCard(
  { href, onClick, size = 'md', fullWidth, cardBg, direction = 'column', children, className, ...props },
  ref
) {
  const Component = href ? 'a' : 'div'
  const clickable = !!href || !!onClick

  return (
    <BaseCardContainer
      as={Component}
      href={href}
      ref={ref as React.Ref<HTMLDivElement>}
      onClick={onClick}
      $size={size}
      $fullWidth={fullWidth}
      $clickable={clickable}
      $cardBg={cardBg}
      $direction={direction}
      className={className}
      {...props}
    >
      {children}
    </BaseCardContainer>
  )
})
