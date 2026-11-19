'use client'

import { useMaskedTheme } from '@/styles/useMaskedTheme'
import { MaskedDivRoot } from './MaskedDiv.styles'
import { resolveDivTokens } from './divTokens'
import type { MaskedDivProps } from './MaskedDiv.types'

/**
 * Container base da lib — caixa neutra, polimórfica (`as`) e  
 * opcionalmente flex. Sem provider de tema e sem colorTheme, continua  
 * funcionando (cai nos fallbacks neutros).  
 *
 * Quando usar MaskedDiv × MaskedStack:  
 * - MaskedDiv: a caixa tem APARÊNCIA (superfície, borda, sombra, vidro —  
 *   `variant`, `colorTheme`) ou precisa só de um flex pontual.  
 * - MaskedStack: organizar uma LISTA de filhos em fluxo, com espaçamento  
 *   uniforme e divisor entre itens.  
 * - Os dois juntos: <MaskedDiv variant="card"><MaskedStack>…</MaskedStack></MaskedDiv>.  
 *
 * @example  
 * <MaskedDiv variant="card" padding="md">Conteúdo</MaskedDiv>  
 * <MaskedDiv as="section" direction="row" gap="md" align="center">…</MaskedDiv>  
 */
export function MaskedDiv(props: MaskedDivProps) {
  // funciona com ou sem <ThemeProvider> (cai no tema base da lib)
  const theme = useMaskedTheme()
  const {
    as,
    variant,
    direction,
    align,
    justify,
    wrap,
    gap,
    padding,
    fullWidth,
    colorTheme,
    tokens,
    className,
    style,
    children,
    ...rest
  } = props

  const tokenStyle = resolveDivTokens({ variant, colorTheme, gap, padding, tokens }, theme)

  return (
    <MaskedDivRoot
      as={as}
      $variant={variant}
      $direction={direction}
      $align={align}
      $justify={justify}
      $wrap={wrap}
      $fullWidth={fullWidth}
      className={className}
      style={{ ...tokenStyle, ...style }}
      {...rest}
    >
      {children}
    </MaskedDivRoot>
  )
}
