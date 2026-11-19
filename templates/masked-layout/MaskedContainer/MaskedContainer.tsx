'use client'

import { useMaskedTheme } from '@/styles/useMaskedTheme'
import { MaskedContainerRoot } from './MaskedContainer.styles'
import { resolveContainerTokens } from './containerTokens'
import type { MaskedContainerProps } from './MaskedContainer.types'

/**
 * Largura de página + gutters laterais, centralizado.  
 *
 * @example  
 * <MaskedContainer>…</MaskedContainer>  
 * <MaskedContainer variant="narrow" paddingY="xl" as="main">…</MaskedContainer>  
 */
export function MaskedContainer(props: MaskedContainerProps) {
  const theme = useMaskedTheme()
  const {
    as,
    variant,
    centered = true,
    paddingX,
    paddingY,
    tokens,
    className,
    style,
    children,
    ...rest
  } = props

  const tokenStyle = resolveContainerTokens({ variant, paddingX, paddingY, tokens }, theme)

  return (
    <MaskedContainerRoot
      as={as}
      $centered={centered}
      className={className}
      style={{ ...tokenStyle, ...style }}
      {...rest}
    >
      {children}
    </MaskedContainerRoot>
  )
}
