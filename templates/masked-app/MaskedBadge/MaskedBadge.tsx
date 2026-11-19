'use client'

import { useMaskedTheme } from '@/styles/useMaskedTheme'
import { MaskedBadgeRoot } from './MaskedBadge.styles'
import { resolveBadgeTokens } from './badgeTokens'
import type { MaskedBadgeProps } from './MaskedBadge.types'

/**
 * Selo curto (status, contador, categoria).
 *
 * Acessibilidade: o selo é só texto; o significado nunca depende da cor —
 * escreva o estado no conteúdo ("Ativo", "3 novos"). No variant 'dot' o
 * ponto é decorativo (pseudo-elemento, fora da árvore de acessibilidade).
 *
 * @example
 * <MaskedBadge>Novo</MaskedBadge>
 * <MaskedBadge variant="solid" colorTheme="baseGreen">Ativo</MaskedBadge>
 * <MaskedBadge variant="dot" colorTheme="baseRed">Offline</MaskedBadge>
 */
export function MaskedBadge(props: MaskedBadgeProps) {
  const theme = useMaskedTheme()
  const {
    as,
    variant = 'soft',
    size = 'md',
    colorTheme,
    tokens,
    className,
    style,
    children,
    ...rest
  } = props

  const tokenStyle = resolveBadgeTokens({ variant, colorTheme, tokens }, theme)

  return (
    <MaskedBadgeRoot
      as={as}
      $variant={variant}
      $size={size}
      className={className}
      style={{ ...tokenStyle, ...style }}
      {...rest}
    >
      {children}
    </MaskedBadgeRoot>
  )
}
