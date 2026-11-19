'use client'

import { MaskedSection } from '@/components/ui/MaskedSection/MaskedSection'
import { useMaskedTheme } from '@/styles/useMaskedTheme'
import {
  FeatureBody,
  FeatureDescription,
  FeatureIcon,
  FeatureItemEl,
  FeatureTitle,
  FeaturesList
} from './MaskedFeatures.styles'
import { resolveFeaturesTokens } from './featuresTokens'
import type { MaskedFeaturesProps } from './MaskedFeatures.types'

/**
 * Lista de recursos dentro de uma MaskedSection (título, descrição, ações).  
 *
 * Semântica: <ul> (ou <ol> no 'timeline') de itens; o título de cada item é  
 * um heading um nível abaixo do título da seção. Ícones são decorativos  
 * (aria-hidden). O texto herda a cor da seção, então funciona também sobre  
 * `sectionVariant="gradient"`.  
 *
 * @example  
 * <MaskedFeatures title="Recursos" items={[{ title: 'Agenda', description: 'Online 24h', icon: '📅' }]} />  
 * <MaskedFeatures variant="timeline" title="Como funciona" items={steps} />  
 */
export function MaskedFeatures(props: MaskedFeaturesProps) {
  const theme = useMaskedTheme()
  const {
    variant = 'grid',
    items,
    cols = 3,
    sectionVariant,
    sectionTokens,
    tokens,
    colorTheme,
    ...section
  } = props

  const level = Math.min((section.headingLevel ?? 2) + 1, 6) as 3
  const tokenStyle = resolveFeaturesTokens({ colorTheme, tokens }, theme)

  return (
    <MaskedSection
      {...section}
      variant={sectionVariant}
      colorTheme={colorTheme}
      tokens={sectionTokens}
    >
      <FeaturesList
        as={variant === 'timeline' ? 'ol' : 'ul'}
        $variant={variant}
        $cols={cols}
        style={tokenStyle}
      >
        {items.map((item) => (
          <FeatureItemEl key={item.id ?? item.title} $variant={variant}>
            {item.icon && <FeatureIcon aria-hidden="true">{item.icon}</FeatureIcon>}
            <FeatureBody>
              <FeatureTitle as={`h${level}` as 'h3'}>{item.title}</FeatureTitle>
              {item.description && <FeatureDescription>{item.description}</FeatureDescription>}
            </FeatureBody>
          </FeatureItemEl>
        ))}
      </FeaturesList>
    </MaskedSection>
  )
}
