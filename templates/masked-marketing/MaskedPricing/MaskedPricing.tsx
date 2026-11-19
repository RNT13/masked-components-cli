'use client'

import { useState } from 'react'
import { MaskedSection } from '@/components/ui/MaskedSection/MaskedSection'
import { useMaskedConfig } from '@/components/ui/MaskedConfigProvider'
import { useMaskedTheme } from '@/styles/useMaskedTheme'
import {
  BillingButton,
  BillingToggle,
  Check,
  FeatureList,
  HighlightedCell,
  PlanBadge,
  PlanCard,
  PlanCta,
  PlanDescription,
  PlanName,
  PlanPrice,
  PlansList,
  PlansTable,
  SrOnly,
  TableScroller
} from './MaskedPricing.styles'
import { resolvePricingTokens } from './pricingTokens'
import type { MaskedPricingProps, PricingBilling, PricingPlan } from './MaskedPricing.types'

const DICT = {
  pt: {
    group: 'Período de cobrança',
    monthly: 'Mensal',
    yearly: 'Anual',
    perMonth: '/mês',
    perYear: '/ano',
    included: 'Incluído',
    notIncluded: 'Não incluído',
    feature: 'Recurso',
    table: 'Comparação de planos'
  },
  en: {
    group: 'Billing period',
    monthly: 'Monthly',
    yearly: 'Yearly',
    perMonth: '/month',
    perYear: '/year',
    included: 'Included',
    notIncluded: 'Not included',
    feature: 'Feature',
    table: 'Plan comparison'
  }
} as const

/**
 * Planos e preços dentro de uma MaskedSection, em cartões ou em tabela.
 *
 * Acessibilidade: cada plano é um <article> com heading; o alternador
 * mensal/anual é um grupo de botões com `aria-pressed`; no 'table' há
 * <caption>, cabeçalhos de coluna/linha (`scope`) e células com texto
 * oculto ("Incluído"/"Não incluído"), então o ✓ nunca é a única informação.
 * Os botões dos planos são links (usam o `linkComponent` do
 * MaskedConfigProvider). `billing` funciona controlado ou não.
 *
 * Nota: o alternador usa botões próprios (sem MaskedButton) para não criar
 * dependência entre pacotes.
 *
 * @example
 * <MaskedPricing title="Planos" highlight="pro" plans={[{ id: 'pro', name: 'Pro', price: { monthly: 'R$ 49', yearly: 'R$ 39' }, features: ['Agenda'], cta: { label: 'Assinar', href: '/assinar' } }]} />
 */
export function MaskedPricing(props: MaskedPricingProps) {
  const theme = useMaskedTheme()
  const config = useMaskedConfig()
  const [innerBilling, setInnerBilling] = useState<PricingBilling>(
    props.defaultBilling ?? 'monthly'
  )
  const {
    variant = 'cards',
    plans,
    billing: billingProp,
    defaultBilling: _defaultBilling,
    onBillingChange,
    showBillingToggle,
    yearlyBadge,
    highlight,
    sectionVariant,
    sectionTokens,
    tokens,
    colorTheme,
    ...section
  } = props
  void _defaultBilling

  const billing = billingProp ?? innerBilling
  const dict = DICT[(config.locale ?? 'pt-BR').toLowerCase().startsWith('en') ? 'en' : 'pt']
  const tokenStyle = resolvePricingTokens({ colorTheme, tokens }, theme)
  const level = Math.min((section.headingLevel ?? 2) + 1, 6) as 3
  const hasPeriods = plans.some((plan) => typeof plan.price !== 'string')
  const toggleVisible = showBillingToggle ?? hasPeriods

  function chooseBilling(next: PricingBilling) {
    setInnerBilling(next)
    onBillingChange?.(next)
  }

  const priceOf = (plan: PricingPlan) =>
    typeof plan.price === 'string' ? plan.price : plan.price[billing]
  const periodOf = (plan: PricingPlan) =>
    plan.period ??
    (typeof plan.price === 'string'
      ? undefined
      : billing === 'yearly'
        ? dict.perYear
        : dict.perMonth)

  const cta = (plan: PricingPlan) =>
    plan.cta && (
      <PlanCta as={config.linkComponent} href={plan.cta.href} $highlighted={plan.id === highlight}>
        {plan.cta.label}
      </PlanCta>
    )

  const toggle = toggleVisible && (
    <BillingToggle role="group" aria-label={dict.group}>
      {(['monthly', 'yearly'] as const).map((value) => (
        <BillingButton
          key={value}
          type="button"
          $active={billing === value}
          aria-pressed={billing === value}
          onClick={() => chooseBilling(value)}
        >
          {dict[value]}
          {value === 'yearly' && yearlyBadge && <small>{yearlyBadge}</small>}
        </BillingButton>
      ))}
    </BillingToggle>
  )

  const features = [...new Set(plans.flatMap((plan) => plan.features))]

  return (
    <MaskedSection
      {...section}
      variant={sectionVariant}
      colorTheme={colorTheme}
      tokens={sectionTokens}
    >
      <div style={tokenStyle}>
        {toggle}

        {variant === 'cards' ? (
          <PlansList>
            {plans.map((plan) => {
              const highlighted = plan.id === highlight
              return (
                <li key={plan.id}>
                  <PlanCard $highlighted={highlighted}>
                    {plan.badge && <PlanBadge>{plan.badge}</PlanBadge>}
                    <PlanName as={`h${level}` as 'h3'}>{plan.name}</PlanName>
                    <PlanPrice>
                      {priceOf(plan)}
                      {periodOf(plan) && <small>{periodOf(plan)}</small>}
                    </PlanPrice>
                    {plan.description && <PlanDescription>{plan.description}</PlanDescription>}
                    <FeatureList>
                      {plan.features.map((feature) => (
                        <li key={feature}>
                          <Check aria-hidden="true">✓</Check>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </FeatureList>
                    {cta(plan)}
                  </PlanCard>
                </li>
              )
            })}
          </PlansList>
        ) : (
          <TableScroller role="region" aria-label={dict.table} tabIndex={0}>
            <PlansTable>
              <caption>
                <SrOnly>{dict.table}</SrOnly>
              </caption>
              <thead>
                <tr>
                  <th scope="col">
                    <SrOnly>{dict.feature}</SrOnly>
                  </th>
                  {plans.map((plan) => (
                    <th key={plan.id} scope="col">
                      <HighlightedCell $highlighted={plan.id === highlight}>
                        {plan.name}
                      </HighlightedCell>
                      <div>
                        {priceOf(plan)}
                        {periodOf(plan) && <small>{periodOf(plan)}</small>}
                      </div>
                      {plan.badge && <small>{plan.badge}</small>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {features.map((feature) => (
                  <tr key={feature}>
                    <th scope="row">{feature}</th>
                    {plans.map((plan) => {
                      const has = plan.features.includes(feature)
                      return (
                        <td key={plan.id}>
                          <HighlightedCell $highlighted={plan.id === highlight}>
                            <span aria-hidden="true">{has ? '✓' : '–'}</span>
                            <SrOnly>{has ? dict.included : dict.notIncluded}</SrOnly>
                          </HighlightedCell>
                        </td>
                      )
                    })}
                  </tr>
                ))}
                <tr>
                  <td />
                  {plans.map((plan) => (
                    <td key={plan.id}>{cta(plan)}</td>
                  ))}
                </tr>
              </tbody>
            </PlansTable>
          </TableScroller>
        )}
      </div>
    </MaskedSection>
  )
}
