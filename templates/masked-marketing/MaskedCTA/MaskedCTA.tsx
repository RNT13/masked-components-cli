'use client'

import { useMaskedTheme } from '@/styles/useMaskedTheme'
import {
  CTAActions,
  CTABox,
  CTADescription,
  CTAText,
  CTATitle,
  MaskedCTARoot
} from './MaskedCTA.styles'
import { resolveCTATokens } from './ctaTokens'
import type { MaskedCTAProps } from './MaskedCTA.types'

/**
 * Chamada para ação: título, descrição e botões sobre uma superfície  
 * (cheia, em gradiente ou suave). Os botões entram pelo slot `actions`.  
 *
 * @example  
 * <MaskedCTA title="Pronto para começar?" colorTheme="baseBlue" actions={<MaskedButton>Criar conta</MaskedButton>} />  
 */
export function MaskedCTA(props: MaskedCTAProps) {
  const theme = useMaskedTheme()
  const {
    as,
    variant = 'banner',
    title,
    headingLevel = 2,
    description,
    actions,
    colorTheme,
    tokens,
    className,
    style,
    ...rest
  } = props

  const tokenStyle = resolveCTATokens({ variant, colorTheme, tokens }, theme)

  return (
    <MaskedCTARoot as={as} className={className} {...rest}>
      <CTABox $variant={variant} style={{ ...tokenStyle, ...style }}>
        <CTAText>
          <CTATitle as={`h${headingLevel}` as 'h2'}>{title}</CTATitle>
          {description && <CTADescription>{description}</CTADescription>}
        </CTAText>
        {actions && <CTAActions>{actions}</CTAActions>}
      </CTABox>
    </MaskedCTARoot>
  )
}
