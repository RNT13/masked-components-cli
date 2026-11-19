'use client'

import { Children } from 'react'
import { useMaskedTheme } from '@/styles/useMaskedTheme'
import { MaskedStackRoot, StackDivider } from './MaskedStack.styles'
import { resolveStackDirection, resolveStackTokens } from './stackTokens'
import type { MaskedStackProps, StackDirection } from './MaskedStack.types'

/**
 * Fluxo flexível com gap semântico e divisor opcional.  
 *
 * Quando usar MaskedStack × MaskedDiv:  
 * - MaskedStack: organizar uma LISTA de filhos em fluxo, com espaçamento  
 *   uniforme e divisor entre itens. Não pinta superfície.  
 * - MaskedDiv: quando a caixa precisa de APARÊNCIA (variant card/outlined/  
 *   glass, colorTheme). Envolva o Stack num Div em vez de estilizar o Stack.  
 *
 * @example  
 * <MaskedStack gap="lg">  
 *   <Card />  
 *   <Card />  
 * </MaskedStack>  
 * <MaskedStack variant="spread" divider>…</MaskedStack>  
 */
export function MaskedStack(props: MaskedStackProps) {
  const theme = useMaskedTheme()
  const {
    as,
    variant,
    direction,
    gap,
    align,
    justify,
    wrap,
    divider,
    fullWidth,
    tokens,
    className,
    style,
    children,
    ...rest
  } = props

  const axis: StackDirection = resolveStackDirection({ variant, direction })
  const items = Children.toArray(children)

  const content = divider
    ? items.flatMap((child, index) => {
        if (index === 0) return [child]
        return [
          <StackDivider
            key={`divider-${index}`}
            className="masked-stack-divider"
            $axis={axis}
            $auto={divider === true}
            aria-hidden={divider === true ? true : undefined}
          >
            {divider === true ? null : divider}
          </StackDivider>,
          child
        ]
      })
    : items

  return (
    <MaskedStackRoot
      as={as}
      $variant={variant}
      $direction={axis}
      $align={align}
      $justify={justify}
      $wrap={wrap}
      $fullWidth={fullWidth}
      className={className}
      style={{ ...resolveStackTokens({ variant, direction, gap, tokens }, theme), ...style }}
      {...rest}
    >
      {content}
    </MaskedStackRoot>
  )
}
