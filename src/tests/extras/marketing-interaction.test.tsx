// @vitest-environment jsdom
import { describe, expect, it, vi, afterEach } from 'vitest'
import React, { useState } from 'react'
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react'
import { MaskedConfigProvider } from '../../../templates/masked-config/MaskedConfigProvider'
import { MaskedNewsletter } from '../../../templates/masked-marketing/MaskedNewsletter/MaskedNewsletter'
import { MaskedPricing } from '../../../templates/masked-marketing/MaskedPricing/MaskedPricing'
import { MaskedFAQ } from '../../../templates/masked-marketing/MaskedFAQ/MaskedFAQ'

afterEach(cleanup)

describe('Newsletter — interação', () => {
  it('sucesso: chama onSubmit com o e-mail, limpa o campo, anuncia em role=status e avisa o config', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    const onSuccess = vi.fn()
    render(
      <MaskedConfigProvider config={{ onSuccess }}>
        <MaskedNewsletter title="Novidades" onSubmit={onSubmit} />
      </MaskedConfigProvider>
    )
    const input = screen.getByLabelText('E-mail') as HTMLInputElement
    fireEvent.change(input, { target: { value: '  ana@exemplo.com ' } })
    fireEvent.submit(input.closest('form')!)
    await waitFor(() => expect(screen.getByRole('status')).toBeTruthy())
    expect(onSubmit).toHaveBeenCalledWith('ana@exemplo.com')
    expect(screen.getByRole('status').textContent).toContain('Inscrição confirmada')
    expect(input.value).toBe('')
    expect(onSuccess).toHaveBeenCalledTimes(1)
    expect(screen.queryByRole('alert')).toBeNull()
  })

  it('erro: onSubmit rejeita -> role=alert, campo mantém o e-mail e avisa onError', async () => {
    const onSubmit = vi.fn().mockRejectedValue(new Error('x'))
    const onError = vi.fn()
    render(
      <MaskedConfigProvider config={{ onError }}>
        <MaskedNewsletter onSubmit={onSubmit} errorMessage="Falhou" />
      </MaskedConfigProvider>
    )
    const input = screen.getByLabelText('E-mail') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'ana@exemplo.com' } })
    fireEvent.submit(input.closest('form')!)
    await waitFor(() => expect(screen.getByRole('alert')).toBeTruthy())
    expect(screen.getByRole('alert').textContent).toBe('Falhou')
    expect(input.value).toBe('ana@exemplo.com')
    expect(onError).toHaveBeenCalledWith('Falhou')
    expect(screen.queryByRole('status')).toBeNull()
  })

  it('carregando: botão e campo desabilitados e aria-busy; segundo envio é ignorado', async () => {
    let finish!: () => void
    const onSubmit = vi.fn(() => new Promise<void>((resolve) => (finish = resolve)))
    render(<MaskedNewsletter onSubmit={onSubmit} />)
    const input = screen.getByLabelText('E-mail') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'ana@exemplo.com' } })
    const form = input.closest('form')!
    fireEvent.submit(form)
    await waitFor(() => expect(form.getAttribute('aria-busy')).toBe('true'))
    expect((screen.getByRole('button') as HTMLButtonElement).disabled).toBe(true)
    expect(input.disabled).toBe(true)
    expect(screen.getByRole('button').textContent).toBe('Enviando…')
    fireEvent.submit(form)
    expect(onSubmit).toHaveBeenCalledTimes(1)
    finish()
    await waitFor(() => expect(form.getAttribute('aria-busy')).toBe('false'))
    expect(screen.getByRole('status')).toBeTruthy()
  })
})

describe('Pricing — alternador mensal/anual', () => {
  const plans = [
    { id: 'pro', name: 'Pro', price: { monthly: 'R$ 49', yearly: 'R$ 39' }, features: ['Agenda'] }
  ]

  it('não controlado: clicar em Anual troca preço, sufixo e aria-pressed; chama onBillingChange', () => {
    const onBillingChange = vi.fn()
    render(<MaskedPricing plans={plans} onBillingChange={onBillingChange} />)
    expect(screen.getByText('R$ 49')).toBeTruthy()
    expect(screen.getByText('/mês')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Anual' }))
    expect(screen.getByText('R$ 39')).toBeTruthy()
    expect(screen.getByText('/ano')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Anual' }).getAttribute('aria-pressed')).toBe('true')
    expect(screen.getByRole('button', { name: 'Mensal' }).getAttribute('aria-pressed')).toBe('false')
    expect(onBillingChange).toHaveBeenCalledWith('yearly')
  })

  it('controlado: só muda quando o pai muda `billing`', () => {
    function Host() {
      const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly')
      return <MaskedPricing plans={plans} billing={billing} onBillingChange={setBilling} />
    }
    render(<Host />)
    fireEvent.click(screen.getByRole('button', { name: 'Anual' }))
    expect(screen.getByText('R$ 39')).toBeTruthy()

    cleanup()
    const stuck = vi.fn()
    render(<MaskedPricing plans={plans} billing="monthly" onBillingChange={stuck} />)
    fireEvent.click(screen.getByRole('button', { name: 'Anual' }))
    expect(stuck).toHaveBeenCalledWith('yearly')
    expect(screen.getByText('R$ 49')).toBeTruthy()
  })
})

describe('FAQ — abrir e fechar', () => {
  it('clicar na pergunta abre/fecha a resposta (details nativo)', () => {
    render(<MaskedFAQ items={[{ question: 'Posso cancelar?', answer: 'Sim.' }]} />)
    const details = document.querySelector('details')!
    expect(details.open).toBe(false)
    fireEvent.click(screen.getByText('Posso cancelar?'))
    expect(details.open).toBe(true)
    fireEvent.click(screen.getByText('Posso cancelar?'))
    expect(details.open).toBe(false)
  })
})
