import type {
  MaskedSectionProps,
  SectionVariant
} from '@/components/ui/MaskedSection/MaskedSection.types'
import type { SectionTokenOverrides } from '@/components/ui/MaskedSection/sectionTokens'
import type { PricingTokenOverrides } from './pricingTokens'

/** Layouts dos planos. Default 'cards'. */
export type PricingVariant = 'cards' | 'table'

export type PricingBilling = 'monthly' | 'yearly'

export type PricingPlan = {
  /** Identificador estável (usado em `highlight`). */
  id: string
  name: string
  /** Preço já formatado ("R$ 49"), ou um por período para o alternador mensal/anual. */
  price: string | { monthly: string; yearly: string }
  /** Sufixo do preço (ex.: "/mês"). Sem ele, usa o texto do período em pt/en. */
  period?: string
  description?: string
  /** Recursos incluídos. No 'table', a união de todos vira as linhas da tabela. */
  features: string[]
  /** Botão do plano (vira link, usando o linkComponent do MaskedConfigProvider). */
  cta?: { label: string; href: string }
  /** Selo do plano (ex.: "Mais popular"). */
  badge?: string
}

/** Props próprias do MaskedPricing (API pública). */
export type MaskedPricingOwnProps = {
  variant?: PricingVariant
  plans: PricingPlan[]
  /** Período exibido (controlado). */
  billing?: PricingBilling
  defaultBilling?: PricingBilling
  onBillingChange?: (billing: PricingBilling) => void
  /** Mostra o alternador mensal/anual. Default: só quando algum plano tem preço por período. */
  showBillingToggle?: boolean
  /** Selo no botão "Anual" (ex.: "-20%"). */
  yearlyBadge?: string
  /** Id do plano em destaque. */
  highlight?: string
  /** Aparência da seção que envolve os planos. Default 'plain'. */
  sectionVariant?: SectionVariant
  /** Overrides de tokens --mc-section-* da seção. */
  sectionTokens?: SectionTokenOverrides
  /** Overrides granulares de tokens --mc-pricing-*. */
  tokens?: PricingTokenOverrides
}

/** A seção (id, title, description, headingLevel, colorTheme…) usa as props do MaskedSection. */
export type MaskedPricingProps = MaskedPricingOwnProps &
  Omit<MaskedSectionProps, keyof MaskedPricingOwnProps | 'variant' | 'tokens' | 'children'>

/** Props transient internas (styled-components) — nunca API pública. */
export type MaskedPricingInternalProps = {
  $highlighted?: boolean
  $active?: boolean
}
