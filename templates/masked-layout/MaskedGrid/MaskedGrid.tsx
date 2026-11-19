'use client'

import { useMaskedTheme } from '@/styles/useMaskedTheme'
import { MaskedGridRoot } from './MaskedGrid.styles'
import { resolveGridTokens } from './gridTokens'
import type { MaskedGridProps } from './MaskedGrid.types'

/**
 * Grid responsivo de verdade, com motores padronizados.  
 *
 * @example  
 * <MaskedGrid cols={4} gap="md">  
 *   <Card /> <Card /> <Card /> <Card />  
 * </MaskedGrid>  
 * <MaskedGrid variant="auto" minChildWidth="220px">…</MaskedGrid>  
 * <MaskedGrid variant="sidebar" sidebarWidth="280px">…</MaskedGrid>  
 */
export function MaskedGrid(props: MaskedGridProps) {
  const theme = useMaskedTheme()
  const {
    as,
    variant,
    cols,
    minChildWidth,
    gap,
    sidebarWidth,
    tokens,
    className,
    style,
    children,
    ...rest
  } = props

  const tokenStyle = resolveGridTokens(
    { variant, cols, minChildWidth, gap, sidebarWidth, tokens },
    theme
  )

  return (
    <MaskedGridRoot
      as={as}
      $variant={variant}
      className={className}
      style={{ ...tokenStyle, ...style }}
      {...rest}
    >
      {children}
    </MaskedGridRoot>
  )
}
