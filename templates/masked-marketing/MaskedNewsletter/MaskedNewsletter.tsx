'use client'

import { useId, useState, type FormEvent } from 'react'
import { useMaskedConfig } from '@/components/ui/MaskedConfigProvider'
import { useMaskedTheme } from '@/styles/useMaskedTheme'
import {
  MaskedNewsletterRoot,
  NewsletterButton,
  NewsletterDescription,
  NewsletterForm,
  NewsletterInput,
  NewsletterStatus,
  NewsletterTitle,
  VisuallyHidden
} from './MaskedNewsletter.styles'
import { resolveNewsletterTokens } from './newsletterTokens'
import type { MaskedNewsletterProps } from './MaskedNewsletter.types'

const DICT = {
  pt: {
    label: 'E-mail',
    button: 'Inscrever-se',
    sending: 'Enviando…',
    success: 'Inscrição confirmada. Obrigado!',
    error: 'Não foi possível concluir a inscrição. Tente novamente.'
  },
  en: {
    label: 'Email',
    button: 'Subscribe',
    sending: 'Sending…',
    success: 'You are subscribed. Thank you!',
    error: 'We could not complete your subscription. Please try again.'
  }
} as const

type Status = 'idle' | 'loading' | 'success' | 'error'

/**
 * Inscrição em newsletter: campo de e-mail + botão, com estados de envio.
 *
 * Acessibilidade: o campo tem rótulo (oculto) e `type="email"` com validação
 * nativa; o resultado é anunciado em uma região viva (role="status" para
 * sucesso, role="alert" para erro). Chama `onSuccess`/`onError` do
 * MaskedConfigProvider, se definidos (ex.: para exibir um toast).
 *
 * @example
 * <MaskedNewsletter title="Receba novidades" onSubmit={async (email) => api.subscribe(email)} />
 */
export function MaskedNewsletter(props: MaskedNewsletterProps) {
  const theme = useMaskedTheme()
  const config = useMaskedConfig()
  const inputId = useId()
  const [status, setStatus] = useState<Status>('idle')
  const [email, setEmail] = useState('')
  const {
    as,
    variant = 'card',
    title,
    headingLevel = 2,
    description,
    onSubmit,
    placeholder = 'seu@email.com',
    inputLabel,
    buttonLabel,
    successMessage,
    errorMessage,
    colorTheme,
    tokens,
    className,
    style,
    ...rest
  } = props

  const dict = DICT[(config.locale ?? 'pt-BR').toLowerCase().startsWith('en') ? 'en' : 'pt']
  const tokenStyle = resolveNewsletterTokens({ variant, colorTheme, tokens }, theme)
  const loading = status === 'loading'

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (loading) return
    setStatus('loading')
    try {
      await onSubmit(email.trim())
      setStatus('success')
      setEmail('')
      config.onSuccess?.(successMessage ?? dict.success)
    } catch {
      setStatus('error')
      config.onError?.(errorMessage ?? dict.error)
    }
  }

  return (
    <MaskedNewsletterRoot
      as={as}
      $variant={variant}
      className={className}
      style={{ ...tokenStyle, ...style }}
      {...rest}
    >
      {title && <NewsletterTitle as={`h${headingLevel}` as 'h2'}>{title}</NewsletterTitle>}
      {description && <NewsletterDescription>{description}</NewsletterDescription>}
      <NewsletterForm onSubmit={handleSubmit} aria-busy={loading}>
        <VisuallyHidden htmlFor={inputId}>{inputLabel ?? dict.label}</VisuallyHidden>
        <NewsletterInput
          id={inputId}
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder={placeholder}
          value={email}
          disabled={loading}
          onChange={(event) => setEmail(event.target.value)}
        />
        <NewsletterButton type="submit" disabled={loading}>
          {loading ? dict.sending : (buttonLabel ?? dict.button)}
        </NewsletterButton>
      </NewsletterForm>
      {status === 'success' && (
        <NewsletterStatus role="status">{successMessage ?? dict.success}</NewsletterStatus>
      )}
      {status === 'error' && (
        <NewsletterStatus role="alert" $error>
          {errorMessage ?? dict.error}
        </NewsletterStatus>
      )}
    </MaskedNewsletterRoot>
  )
}
