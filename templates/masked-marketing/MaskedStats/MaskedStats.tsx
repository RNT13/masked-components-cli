'use client'

import { MaskedSection } from '@/components/ui/MaskedSection/MaskedSection'
import { useMaskedConfig } from '@/components/ui/MaskedConfigProvider'
import { useMaskedTheme } from '@/styles/useMaskedTheme'
import {
  SrOnly,
  StatItemEl,
  StatLabel,
  StatTrendEl,
  StatValue,
  StatsList
} from './MaskedStats.styles'
import { resolveStatsTokens } from './statsTokens'
import type { MaskedStatsProps } from './MaskedStats.types'

const TREND = {
  pt: { up: 'Aumento de', down: 'Queda de', flat: 'Estável em' },
  en: { up: 'Increase of', down: 'Decrease of', flat: 'Steady at' }
} as const

const ARROW = { up: '▲', down: '▼', flat: '–' } as const

/**
 * Números de destaque dentro de uma MaskedSection.
 *
 * Semântica: lista de definição (<dl>): o rótulo é o <dt> e o número é o
 * <dd>, com o número aparecendo primeiro na tela. A tendência nunca depende
 * só de cor/seta: há texto oculto ("Aumento de +12%") para leitores de tela.
 *
 * @example
 * <MaskedStats items={[{ value: '12k', label: 'Clientes', trend: { value: '+8%', direction: 'up' } }]} />
 */
export function MaskedStats(props: MaskedStatsProps) {
  const theme = useMaskedTheme()
  const config = useMaskedConfig()
  const {
    variant = 'row',
    items,
    sectionVariant,
    sectionTokens,
    tokens,
    colorTheme,
    ...section
  } = props

  const dict = TREND[(config.locale ?? 'pt-BR').toLowerCase().startsWith('en') ? 'en' : 'pt']
  const tokenStyle = resolveStatsTokens({ variant, colorTheme, tokens }, theme)

  return (
    <MaskedSection
      {...section}
      variant={sectionVariant}
      colorTheme={colorTheme}
      tokens={sectionTokens}
    >
      <StatsList $variant={variant} style={tokenStyle}>
        {items.map((item) => (
          <StatItemEl key={item.id ?? item.label} $variant={variant}>
            <StatLabel>{item.label}</StatLabel>
            <StatValue>
              {item.value}
              {item.trend && (
                <StatTrendEl>
                  <span aria-hidden="true">{ARROW[item.trend.direction]}</span>
                  <SrOnly>{dict[item.trend.direction]}</SrOnly>
                  {item.trend.value}
                </StatTrendEl>
              )}
            </StatValue>
          </StatItemEl>
        ))}
      </StatsList>
    </MaskedSection>
  )
}
