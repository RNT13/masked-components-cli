// @vitest-environment jsdom
import { describe, expect, it, vi, afterEach } from 'vitest'
import React, { useState } from 'react'
import { render, screen, fireEvent, waitFor, cleanup, within } from '@testing-library/react'
import { MaskedHeader } from '../../templates/masked-page/MaskedHeader/MaskedHeader'
import { MaskedSidebar } from '../../templates/masked-page/MaskedSidebar/MaskedSidebar'

afterEach(cleanup)
const dialog = () => document.querySelector('[role="dialog"]') as HTMLElement

describe('Header — interação', () => {
  const links = [{ label: 'Início', href: '/', active: true }, { label: 'Preços', href: '/precos' }]

  it('abre o menu, fecha ao clicar num link e com Escape', async () => {
    render(<MaskedHeader brand="Acme" links={links} />)
    const toggle = document.querySelector('button[aria-haspopup="dialog"]') as HTMLElement
    expect(toggle.getAttribute('aria-label')).toBe('Abrir menu')
    expect(toggle.getAttribute('aria-expanded')).toBe('false')
    expect(dialog().getAttribute('aria-hidden')).toBe('true')

    fireEvent.click(toggle)
    await waitFor(() => expect(dialog().getAttribute('aria-hidden')).toBe('false'))
    expect(toggle.getAttribute('aria-label')).toBe('Fechar menu')
    expect(document.querySelector('button[aria-haspopup]')!.getAttribute('aria-expanded')).toBe('true')

    fireEvent.click(within(dialog()).getByText('Preços'))
    await waitFor(() => expect(dialog().getAttribute('aria-hidden')).toBe('true'))

    fireEvent.click(document.querySelector('button[aria-haspopup]')!)
    await waitFor(() => expect(dialog().getAttribute('aria-hidden')).toBe('false'))
    fireEvent.keyDown(document, { key: 'Escape' })
    await waitFor(() => expect(dialog().getAttribute('aria-hidden')).toBe('true'))
    expect(document.querySelector('button[aria-haspopup]')!.getAttribute('aria-expanded')).toBe('false')
  })

  it('botão de fechar dentro do painel fecha o menu', async () => {
    render(<MaskedHeader links={links} />)
    fireEvent.click(document.querySelector('button[aria-haspopup]')!)
    await waitFor(() => expect(dialog().getAttribute('aria-hidden')).toBe('false'))
    fireEvent.click(within(dialog()).getByLabelText('Fechar menu'))
    await waitFor(() => expect(dialog().getAttribute('aria-hidden')).toBe('true'))
  })
})

describe('Sidebar — interação', () => {
  const items = [
    { id: 'home', label: 'Início', icon: <i>H</i> },
    { id: 'users', label: 'Clientes', icon: <i>U</i> },
    { id: 'off', label: 'Desativado', disabled: true }
  ]

  it('uncontrolled: clicar move o aria-current e dispara onActiveChange + onClick do item', () => {
    const onActiveChange = vi.fn()
    const onClick = vi.fn()
    render(<MaskedSidebar items={[{ ...items[0], onClick }, items[1]]} defaultActiveId="home" onActiveChange={onActiveChange} />)
    expect(screen.getByRole('button', { name: 'Início' }).getAttribute('aria-current')).toBe('page')
    fireEvent.click(screen.getByRole('button', { name: 'Clientes' }))
    expect(onActiveChange).toHaveBeenCalledWith('users')
    expect(screen.getByRole('button', { name: 'Clientes' }).getAttribute('aria-current')).toBe('page')
    expect(screen.getByRole('button', { name: 'Início' }).getAttribute('aria-current')).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Início' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('controlled: só muda quando o pai muda activeId', () => {
    function Host() {
      const [active, setActive] = useState('home')
      return <MaskedSidebar items={items} activeId={active} onActiveChange={setActive} />
    }
    render(<Host />)
    fireEvent.click(screen.getByRole('button', { name: 'Clientes' }))
    expect(screen.getByRole('button', { name: 'Clientes' }).getAttribute('aria-current')).toBe('page')

    const stuck = vi.fn()
    cleanup()
    render(<MaskedSidebar items={items} activeId="home" onActiveChange={stuck} />)
    fireEvent.click(screen.getByRole('button', { name: 'Clientes' }))
    expect(stuck).toHaveBeenCalledWith('users')
    expect(screen.getByRole('button', { name: 'Início' }).getAttribute('aria-current')).toBe('page')
  })

  it('item desabilitado não dispara nada', () => {
    const onActiveChange = vi.fn()
    render(<MaskedSidebar items={items} onActiveChange={onActiveChange} />)
    fireEvent.click(screen.getByRole('button', { name: 'Desativado' }))
    expect(onActiveChange).not.toHaveBeenCalled()
  })

  it('recolher/expandir (uncontrolled): aria-expanded, rótulo do botão e title nos itens', () => {
    const onCollapsedChange = vi.fn()
    render(<MaskedSidebar items={items} onCollapsedChange={onCollapsedChange} />)
    const toggle = screen.getByRole('button', { name: 'Recolher menu' })
    expect(toggle.getAttribute('aria-expanded')).toBe('true')
    fireEvent.click(toggle)
    expect(onCollapsedChange).toHaveBeenCalledWith(true)
    const expand = screen.getByRole('button', { name: 'Expandir menu' })
    expect(expand.getAttribute('aria-expanded')).toBe('false')
    expect(document.querySelector('[title="Clientes"]')).not.toBeNull()
    fireEvent.click(expand)
    expect(onCollapsedChange).toHaveBeenLastCalledWith(false)
    expect(document.querySelector('[title="Clientes"]')).toBeNull()
  })

  it('collapsed controlado: não muda sozinho', () => {
    const onCollapsedChange = vi.fn()
    render(<MaskedSidebar items={items} collapsed={false} onCollapsedChange={onCollapsedChange} />)
    fireEvent.click(screen.getByRole('button', { name: 'Recolher menu' }))
    expect(onCollapsedChange).toHaveBeenCalledWith(true)
    expect(screen.getByRole('button', { name: 'Recolher menu' })).toBeTruthy()
  })

  it('mobileOpen: abre o drawer; escolher item chama onMobileClose; Escape também', async () => {
    const onMobileClose = vi.fn()
    const { rerender } = render(<MaskedSidebar items={items} mobileOpen={false} onMobileClose={onMobileClose} />)
    expect(dialog().getAttribute('aria-hidden')).toBe('true')
    rerender(<MaskedSidebar items={items} mobileOpen onMobileClose={onMobileClose} />)
    await waitFor(() => expect(dialog().getAttribute('aria-hidden')).toBe('false'))
    fireEvent.click(within(dialog()).getByText('Clientes'))
    expect(onMobileClose).toHaveBeenCalledTimes(1)
    fireEvent.keyDown(document, { key: 'Escape' })
    await waitFor(() => expect(onMobileClose).toHaveBeenCalledTimes(2))
  })
})
