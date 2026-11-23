import type { ReactNode } from 'react'
import type {
  MaskedSectionProps,
  SectionVariant
} from '@/components/ui/MaskedSection/MaskedSection.types'
import type { SectionTokenOverrides } from '@/components/ui/MaskedSection/sectionTokens'
import type { ContactTokenOverrides } from './contactTokens'

/** Layouts do bloco de contato. Default 'card'. */
export type ContactVariant = 'split' | 'card' | 'minimal'

export type ContactValues = {
  name: string
  email: string
  message: string
}

export type ContactLabels = Partial<{
  name: string
  email: string
  message: string
  submit: string
}>

/** Props próprias do MaskedContact (API pública). */
export type MaskedContactOwnProps = {
  variant?: ContactVariant
  /** Chamado com os valores válidos. Se rejeitar (throw), mostra a mensagem de erro. */
  onSubmit: (values: ContactValues) => void | Promise<void>
  /** Informações de contato ao lado do formulário ('split'): endereço, telefone, horários. */
  info?: ReactNode
  /** Textos dos campos e do botão. Default por locale. */
  labels?: ContactLabels
  /** Mensagem após o envio. Default por locale. */
  successMessage?: string
  /** Mensagem quando onSubmit rejeita. Default por locale. */
  errorMessage?: string
  /** Aparência da seção que envolve o bloco. Default 'plain'. */
  sectionVariant?: SectionVariant
  /** Overrides de tokens --mc-section-* da seção. */
  sectionTokens?: SectionTokenOverrides
  /** Overrides granulares de tokens --mc-contact-*. */
  tokens?: ContactTokenOverrides
}

/** A seção (id, title, description, headingLevel, colorTheme…) usa as props do MaskedSection. */
export type MaskedContactProps = MaskedContactOwnProps &
  Omit<MaskedSectionProps, keyof MaskedContactOwnProps | 'variant' | 'tokens' | 'children'>

/** Props transient internas (styled-components) — nunca API pública. */
export type MaskedContactInternalProps = {
  $variant: ContactVariant
}
