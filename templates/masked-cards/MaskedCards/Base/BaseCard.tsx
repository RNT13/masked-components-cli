'use client'

import { forwardRef } from 'react'
import { useTheme } from 'styled-components'
import { useMaskedConfig } from '@/components/ui/MaskedConfigProvider'
import { BaseCardProps, CardSize } from '../MaskedCards.types'
import { resolveCardTokens, CardTokenOverrides } from '../cardTokens'
import { BaseCardContainer } from './BaseCard.styles'

type BaseCardInternalProps = BaseCardProps & {
  $size?: CardSize
  $fullWidth?: boolean
  $clickable?: boolean
  children?: React.ReactNode
}

export const BaseCard = forwardRef<HTMLDivElement, BaseCardInternalProps>(function BaseCard(
  {
    href,
    onClick,
    size = 'md',
    fullWidth,
    cardBg,
    direction = 'column',
    colorTheme,
    tokens,
    style,
    children,
    className,
    ...props
  },
  ref
) {
  // H.5: hooks incondicionais; linkComponent prop-level não existe em card — provider > <a>
  const { linkComponent } = useMaskedConfig()
  const theme = useTheme()
  const LinkTag = (linkComponent ?? 'a') as 'a'

  const clickable = !!href || !!onClick
  const tokenStyle = resolveCardTokens(
    {
      colorTheme,
      tokens: tokens as CardTokenOverrides | undefined
    },
    theme
  )

  const common = {
    onClick,
    $size: size,
    $fullWidth: fullWidth,
    $clickable: clickable,
    $cardBg: cardBg,
    $direction: direction,
    className,
    style: { ...tokenStyle, ...style },
    ...props
  }

  if (href) {
    return (
      <BaseCardContainer
        as={LinkTag}
        href={href}
        ref={ref as React.Ref<HTMLAnchorElement>}
        {...common}
      >
        {children}
      </BaseCardContainer>
    )
  }

  return (
    <BaseCardContainer
      ref={ref}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onClick(e as unknown as React.MouseEvent<HTMLDivElement>)
              }
            }
          : undefined
      }
      {...common}
    >
      {children}
    </BaseCardContainer>
  )
})
