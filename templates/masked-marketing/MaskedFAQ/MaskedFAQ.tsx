'use client'

import { useId } from 'react'
import { MaskedSection } from '@/components/ui/MaskedSection/MaskedSection'
import { useMaskedTheme } from '@/styles/useMaskedTheme'
import { FAQAnswer, FAQDetails, FAQList, FAQSummary } from './MaskedFAQ.styles'
import { resolveFAQTokens } from './faqTokens'
import type { MaskedFAQProps } from './MaskedFAQ.types'

/**
 * Perguntas frequentes dentro de uma MaskedSection.
 *
 * Usa o <details>/<summary> nativo: abre e fecha por Enter/Espaço, anuncia
 * o estado (expandido/recolhido) a leitores de tela e funciona sem
 * JavaScript. Com `multiple={false}` só uma resposta fica aberta por vez
 * (atributo `name` do <details>). Ponto de unificação futura com
 * `useExpandable`.
 *
 * @example
 * <MaskedFAQ title="Dúvidas" items={[{ question: 'Posso cancelar?', answer: 'Sim, a qualquer momento.' }]} />
 */
export function MaskedFAQ(props: MaskedFAQProps) {
  const theme = useMaskedTheme()
  const groupName = useId()
  const {
    variant = 'list',
    items,
    multiple = true,
    defaultOpen,
    sectionVariant,
    sectionTokens,
    tokens,
    colorTheme,
    ...section
  } = props

  const open = new Set(
    Array.isArray(defaultOpen) ? defaultOpen : defaultOpen === undefined ? [] : [defaultOpen]
  )
  const tokenStyle = resolveFAQTokens({ colorTheme, tokens }, theme)

  return (
    <MaskedSection
      {...section}
      variant={sectionVariant}
      colorTheme={colorTheme}
      tokens={sectionTokens}
    >
      <FAQList $variant={variant} style={tokenStyle}>
        {items.map((item, index) => (
          <FAQDetails
            key={item.id ?? item.question}
            $variant={variant}
            name={multiple ? undefined : groupName}
            open={open.has(index) || undefined}
          >
            <FAQSummary $variant={variant}>{item.question}</FAQSummary>
            <FAQAnswer $variant={variant}>{item.answer}</FAQAnswer>
          </FAQDetails>
        ))}
      </FAQList>
    </MaskedSection>
  )
}
