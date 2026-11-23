'use client'

import { useId, useState, type FormEvent } from 'react'
import { MaskedSection } from '@/components/ui/MaskedSection/MaskedSection'
import { useMaskedConfig } from '@/components/ui/MaskedConfigProvider'
import { useMaskedTheme } from '@/styles/useMaskedTheme'
import {
  ContactForm,
  ContactInfo,
  ContactLayout,
  Field,
  FieldLabel,
  Status,
  SubmitButton,
  TextArea,
  TextInput
} from './MaskedContact.styles'
import { resolveContactTokens } from './contactTokens'
import type { MaskedContactProps } from './MaskedContact.types'

const DICT = {
  pt: {
    name: 'Nome',
    email: 'E-mail',
    message: 'Mensagem',
    submit: 'Enviar mensagem',
    sending: 'Enviando…',
    success: 'Mensagem enviada. Responderemos em breve!',
    error: 'Não foi possível enviar sua mensagem. Tente novamente.'
  },
  en: {
    name: 'Name',
    email: 'Email',
    message: 'Message',
    submit: 'Send message',
    sending: 'Sending…',
    success: 'Message sent. We will get back to you soon!',
    error: 'We could not send your message. Please try again.'
  }
} as const

type ContactStatus = 'idle' | 'loading' | 'success' | 'error'

/**
 * Bloco de contato (nome, e-mail, mensagem) dentro de uma MaskedSection.
 *
 * Acessibilidade: cada campo tem <label> visível ligado por `htmlFor`,
 * `required` nativo e `autoComplete` correto; o resultado é anunciado em
 * região viva (role="status" no sucesso, role="alert" no erro) e o formulário
 * fica `aria-busy` durante o envio. Chama `onSuccess`/`onError` do
 * MaskedConfigProvider se existirem. Não faz requisição: `onSubmit` é seu.
 *
 * @example
 * <MaskedContact title="Fale conosco" variant="split" info={<address>Rua A, 10</address>} onSubmit={enviar} />
 */
export function MaskedContact(props: MaskedContactProps) {
  const theme = useMaskedTheme()
  const config = useMaskedConfig()
  const baseId = useId()
  const [status, setStatus] = useState<ContactStatus>('idle')
  const [values, setValues] = useState({ name: '', email: '', message: '' })
  const {
    variant = 'card',
    onSubmit,
    info,
    labels,
    successMessage,
    errorMessage,
    sectionVariant,
    sectionTokens,
    tokens,
    colorTheme,
    ...section
  } = props

  const dict = DICT[(config.locale ?? 'pt-BR').toLowerCase().startsWith('en') ? 'en' : 'pt']
  const tokenStyle = resolveContactTokens({ colorTheme, tokens }, theme)
  const loading = status === 'loading'
  const id = (field: string) => `${baseId}-${field}`

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (loading) return
    setStatus('loading')
    try {
      await onSubmit({
        name: values.name.trim(),
        email: values.email.trim(),
        message: values.message.trim()
      })
      setStatus('success')
      setValues({ name: '', email: '', message: '' })
      config.onSuccess?.(successMessage ?? dict.success)
    } catch {
      setStatus('error')
      config.onError?.(errorMessage ?? dict.error)
    }
  }

  const set = (field: keyof typeof values) => (event: { target: { value: string } }) =>
    setValues((current) => ({ ...current, [field]: event.target.value }))

  return (
    <MaskedSection
      {...section}
      variant={sectionVariant}
      colorTheme={colorTheme}
      tokens={sectionTokens}
    >
      <ContactLayout $variant={variant} style={tokenStyle}>
        {variant === 'split' && info && <ContactInfo>{info}</ContactInfo>}
        <ContactForm $variant={variant} onSubmit={handleSubmit} aria-busy={loading}>
          <Field>
            <FieldLabel htmlFor={id('name')}>{labels?.name ?? dict.name}</FieldLabel>
            <TextInput
              id={id('name')}
              name="name"
              type="text"
              required
              autoComplete="name"
              value={values.name}
              disabled={loading}
              onChange={set('name')}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor={id('email')}>{labels?.email ?? dict.email}</FieldLabel>
            <TextInput
              id={id('email')}
              name="email"
              type="email"
              required
              autoComplete="email"
              value={values.email}
              disabled={loading}
              onChange={set('email')}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor={id('message')}>{labels?.message ?? dict.message}</FieldLabel>
            <TextArea
              id={id('message')}
              name="message"
              required
              rows={5}
              value={values.message}
              disabled={loading}
              onChange={set('message')}
            />
          </Field>
          <SubmitButton type="submit" disabled={loading}>
            {loading ? dict.sending : (labels?.submit ?? dict.submit)}
          </SubmitButton>
          {status === 'success' && <Status role="status">{successMessage ?? dict.success}</Status>}
          {status === 'error' && <Status role="alert">{errorMessage ?? dict.error}</Status>}
        </ContactForm>
      </ContactLayout>
    </MaskedSection>
  )
}
