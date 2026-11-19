'use client'

import { useMaskedTheme } from '@/styles/useMaskedTheme'
import {
  HeroActions,
  HeroDescription,
  HeroEyebrow,
  HeroInner,
  HeroMedia,
  HeroText,
  HeroTitle,
  MaskedHeroRoot
} from './MaskedHero.styles'
import { resolveHeroTokens } from './heroTokens'
import type { MaskedHeroProps } from './MaskedHero.types'

/**
 * Hero de página: eyebrow, título, descrição, botões e mídia.  
 *
 * O título é um <h1> por padrão (um por página); use `headingLevel={2}` se a  
 * página já tem h1. Os botões entram pelo slot `actions` (ex.: MaskedButton),  
 * sem dependência de outros componentes. Respeita `prefers-reduced-motion`  
 * por não animar nada.  
 *
 * @example  
 * <MaskedHero eyebrow="Novo" title="Agende em segundos" description="…" actions={<MaskedButton>Começar</MaskedButton>} />  
 * <MaskedHero variant="split" title="…" media={<img src="…" alt="…" />} />  
 */
export function MaskedHero(props: MaskedHeroProps) {
  const theme = useMaskedTheme()
  const {
    as,
    variant = 'centered',
    eyebrow,
    title,
    headingLevel = 1,
    description,
    actions,
    media,
    mediaPosition = 'end',
    colorTheme,
    tokens,
    className,
    style,
    children,
    ...rest
  } = props

  const tokenStyle = resolveHeroTokens({ variant, colorTheme, tokens }, theme)

  return (
    <MaskedHeroRoot
      as={as}
      $variant={variant}
      $mediaPosition={mediaPosition}
      className={className}
      style={{ ...tokenStyle, ...style }}
      {...rest}
    >
      <HeroInner $variant={variant} $mediaPosition={mediaPosition}>
        <HeroText $variant={variant}>
          {eyebrow && <HeroEyebrow>{eyebrow}</HeroEyebrow>}
          <HeroTitle as={`h${headingLevel}` as 'h1'} $variant={variant}>
            {title}
          </HeroTitle>
          {description && <HeroDescription>{description}</HeroDescription>}
          {actions && <HeroActions>{actions}</HeroActions>}
        </HeroText>
        {media && <HeroMedia $variant={variant}>{media}</HeroMedia>}
        {children}
      </HeroInner>
    </MaskedHeroRoot>
  )
}
