import type { CSSProperties, ElementType, HTMLAttributes, ReactNode } from 'react'
import type { ColorThemeName } from '@/styles/MaskedThemes/ColorThemes'
import type { NewsletterTokenOverrides } from './newsletterTokens'

/** Aparência do bloco de newsletter. Default 'card'. */
export type NewsletterVariant = 'inline' | 'card' | 'band'

/** Props próprias do MaskedNewsletter (API pública). */
export type MaskedNewsletterBaseProps = {
  /** Elemento renderizado (polimorfismo). Default 'section'. */
  as?: ElementType
  variant?: NewsletterVariant
  title?: ReactNode
  /** Nível do heading do título (2 a 4). Default 2. */
  headingLevel?: 2 | 3 | 4
  description?: ReactNode
  /** Chamado com o e-mail válido. Se rejeitar (throw), mostra a mensagem de erro. */
  onSubmit: (email: string) => void | Promise<void>
  /** Placeholder do campo. Default 'seu@email.com'. */
  placeholder?: string
  /** Rótulo acessível do campo (visualmente oculto). Default por locale. */
  inputLabel?: string
  /** Texto do botão. Default por locale. */
  buttonLabel?: string
  /** Mensagem após o envio. Default por locale. */
  successMessage?: string
  /** Mensagem quando onSubmit rejeita. Default por locale. */
  errorMessage?: string
  /** Paleta registrada ou chave da paleta (card = destaque; band = fundo). */
  colorTheme?: ColorThemeName
  /** Overrides granulares de tokens --mc-newsletter-*. */
  tokens?: NewsletterTokenOverrides
  className?: string
  style?: CSSProperties
}

/** Props transient internas (styled-components) — nunca API pública. */
export type MaskedNewsletterInternalProps = {
  $variant: NewsletterVariant
}

export type MaskedNewsletterProps = MaskedNewsletterBaseProps &
  Omit<
    HTMLAttributes<HTMLElement>,
    keyof MaskedNewsletterBaseProps | 'style' | 'title' | 'children'
  >
