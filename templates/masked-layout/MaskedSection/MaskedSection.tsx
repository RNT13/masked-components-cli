'use client'

import { useId } from 'react'
import { useMaskedTheme } from '@/styles/useMaskedTheme'
import {
  MaskedSectionRoot,
  SectionActions,
  SectionDescription,
  SectionHeader,
  SectionHeading,
  SectionInner,
  SectionTitle
} from './MaskedSection.styles'
import { resolveSectionTokens } from './sectionTokens'
import type { MaskedSectionProps } from './MaskedSection.types'

/**
 * Seção semântica com ritmo vertical, cabeçalho slotável e variantes.
 *
 * Acessibilidade: quando há `title`, a seção é rotulada por ele
 * (aria-labelledby) e vira um landmark "region". Sem `title`, é só um
 * contêiner — passe `aria-label` se ela precisar ser um landmark.
 *
 * @example
 * <MaskedSection id="recursos" title="Recursos" description="Tudo que você precisa">…</MaskedSection>
 * <MaskedSection variant="gradient" colorTheme="baseBlue" align="center" title="Comece hoje" />
 */
export function MaskedSection(props: MaskedSectionProps) {
  const theme = useMaskedTheme()
  const generatedId = useId()
  const {
    as,
    variant = 'plain',
    id,
    title,
    headingLevel = 2,
    description,
    align = 'left',
    actions,
    contained = true,
    paddingY,
    colorTheme,
    tokens,
    className,
    style,
    children,
    ...rest
  } = props

  const titleId = `${id ?? generatedId}-title`
  const hasHeader = Boolean(title || description || actions)
  const tokenStyle = resolveSectionTokens({ variant, colorTheme, paddingY, tokens }, theme)

  return (
    <MaskedSectionRoot
      as={as}
      id={id}
      $variant={variant}
      $align={align}
      aria-labelledby={title ? titleId : undefined}
      className={className}
      style={{ ...tokenStyle, ...style }}
      {...rest}
    >
      <SectionInner $contained={contained}>
        {hasHeader && (
          <SectionHeader $align={align}>
            {(title || description) && (
              <SectionHeading>
                {title && (
                  <SectionTitle as={`h${headingLevel}` as 'h2'} id={titleId}>
                    {title}
                  </SectionTitle>
                )}
                {description && <SectionDescription>{description}</SectionDescription>}
              </SectionHeading>
            )}
            {actions && <SectionActions>{actions}</SectionActions>}
          </SectionHeader>
        )}
        {children}
      </SectionInner>
    </MaskedSectionRoot>
  )
}
