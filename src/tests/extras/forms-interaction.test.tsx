// @vitest-environment jsdom
import { describe, expect, it, vi, afterEach, beforeEach } from 'vitest'
import React, { useState } from 'react'
import { render, screen, fireEvent, waitFor, cleanup, within, act } from '@testing-library/react'
import { MaskedConfigProvider } from '../../../templates/masked-config/MaskedConfigProvider'
import { MaskedSlider } from '../../../templates/masked-forms/MaskedSlider/MaskedSlider'
import { MaskedRating } from '../../../templates/masked-forms/MaskedRating/MaskedRating'
import { MaskedDatePicker } from '../../../templates/masked-forms/MaskedDatePicker/MaskedDatePicker'
import { MaskedCommandPalette } from '../../../templates/masked-forms/MaskedCommandPalette/MaskedCommandPalette'
import { MaskedContact } from '../../../templates/masked-marketing/MaskedContact/MaskedContact'
import { ThemeSwitcher } from '../../../templates/masked-themes/ThemeEngine/ThemeSwitcher'
import { ThemeEngineProvider } from '../../../templates/masked-themes/ThemeEngine/ThemeEngineProvider'

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

describe('Slider — interação', () => {
  it('não controlado: onChange recebe número; <output> e aria-valuetext acompanham', () => {
    const onChange = vi.fn()
    render(<MaskedSlider label="Volume" showValue defaultValue={10} formatValue={(v) => `${v}%`} onChange={onChange} />)
    const input = screen.getByLabelText('Volume') as HTMLInputElement
    expect(input.getAttribute('aria-valuetext')).toBe('10%')
    fireEvent.change(input, { target: { value: '65' } })
    expect(onChange).toHaveBeenCalledWith(65)
    expect(input.value).toBe('65')
    expect(input.getAttribute('aria-valuetext')).toBe('65%')
    expect(document.querySelector('output')!.textContent).toBe('65%')
  })

  it('controlado: só muda quando o pai muda value', () => {
    function Host() {
      const [value, setValue] = useState(20)
      return <MaskedSlider aria-label="n" value={value} onChange={setValue} />
    }
    render(<Host />)
    const input = screen.getByRole('slider') as HTMLInputElement
    fireEvent.change(input, { target: { value: '55' } })
    expect(input.value).toBe('55')
    cleanup()
    const stuck = vi.fn()
    render(<MaskedSlider aria-label="n" value={20} onChange={stuck} />)
    const fixed = screen.getByRole('slider') as HTMLInputElement
    fireEvent.change(fixed, { target: { value: '90' } })
    expect(stuck).toHaveBeenCalledWith(90)
    expect(fixed.value).toBe('20')
  })
})

describe('Rating — interação', () => {
  it('clicar escolhe a nota; onChange recebe o número; controlado só muda pelo pai', () => {
    const onChange = vi.fn()
    render(<MaskedRating onChange={onChange} />)
    fireEvent.click(screen.getByRole('radio', { name: '4 de 5' }))
    expect(onChange).toHaveBeenCalledWith(4)
    expect((screen.getByRole('radio', { name: '4 de 5' }) as HTMLInputElement).checked).toBe(true)
    cleanup()
    const stuck = vi.fn()
    render(<MaskedRating value={2} onChange={stuck} />)
    fireEvent.click(screen.getByRole('radio', { name: '5 de 5' }))
    expect(stuck).toHaveBeenCalledWith(5)
    expect((screen.getByRole('radio', { name: '2 de 5' }) as HTMLInputElement).checked).toBe(true)
  })

  it('allowClear: clicar de novo na nota escolhida volta a 0; sem allowClear, mantém', () => {
    const onChange = vi.fn()
    render(<MaskedRating defaultValue={3} allowClear onChange={onChange} />)
    fireEvent.click(screen.getByRole('radio', { name: '3 de 5' }))
    expect(onChange).toHaveBeenCalledWith(0)
    expect(document.querySelectorAll('input:checked')).toHaveLength(0)
    cleanup()
    const keep = vi.fn()
    render(<MaskedRating defaultValue={3} onChange={keep} />)
    fireEvent.click(screen.getByRole('radio', { name: '3 de 5' }))
    expect(keep).not.toHaveBeenCalled()
  })

  it('hover mostra a prévia (glifos preenchidos) e sair volta à nota atual', () => {
    render(<MaskedRating defaultValue={1} />)
    const filled = () => (document.body.textContent ?? '').match(/★/g)?.length ?? 0
    expect(filled()).toBe(1)
    const label = screen.getByRole('radio', { name: '4 de 5' }).closest('label')!
    fireEvent.mouseEnter(label)
    expect(filled()).toBe(4)
    fireEvent.mouseLeave(screen.getByRole('radiogroup'))
    expect(filled()).toBe(1)
  })
})

describe('DatePicker — teclado, foco e seleção', () => {
  const trigger = () => document.querySelector('button[aria-haspopup="dialog"]') as HTMLElement
  const dialog = () => screen.queryByRole('dialog')
  const day = (iso: string) => document.querySelector(`[data-iso="${iso}"]`) as HTMLElement

  it('abre, leva o foco ao dia ativo; Escape fecha e devolve o foco ao botão', () => {
    render(<MaskedDatePicker label="Consulta" defaultValue="2026-11-20" />)
    expect(dialog()).toBeNull()
    fireEvent.click(trigger())
    expect(dialog()).not.toBeNull()
    expect(trigger().getAttribute('aria-expanded')).toBe('true')
    expect(document.activeElement).toBe(day('2026-11-20'))
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(dialog()).toBeNull()
    expect(document.activeElement).toBe(trigger())
  })

  it('setas, Home/End, PageUp/PageDown e Shift+PageUp/PageDown movem o foco', () => {
    render(<MaskedDatePicker variant="inline" ariaLabel="Agenda" defaultValue="2026-11-18" />)
    const grid = screen.getByRole('grid')
    day('2026-11-18').focus()
    const press = (key: string, extra: object = {}) => fireEvent.keyDown(grid, { key, ...extra })
    press('ArrowRight')
    expect(document.activeElement).toBe(day('2026-11-19'))
    press('ArrowLeft')
    press('ArrowLeft')
    expect(document.activeElement).toBe(day('2026-11-17'))
    press('ArrowDown')
    expect(document.activeElement).toBe(day('2026-11-24'))
    press('ArrowUp')
    expect(document.activeElement).toBe(day('2026-11-17'))
    press('Home')
    expect(document.activeElement).toBe(day('2026-11-15'))
    press('End')
    expect(document.activeElement).toBe(day('2026-11-21'))
    press('PageDown')
    expect(document.activeElement).toBe(day('2026-12-21'))
    expect(screen.getByText('dezembro de 2026')).toBeTruthy()
    press('PageUp')
    press('PageUp')
    expect(document.activeElement).toBe(day('2026-10-21'))
    press('PageDown', { shiftKey: true })
    expect(document.activeElement).toBe(day('2027-10-21'))
  })

  it('roving tabindex acompanha o foco; Enter/clique escolhe, fecha e devolve o foco', () => {
    const onChange = vi.fn()
    render(<MaskedDatePicker label="Consulta" defaultValue="2026-11-20" onChange={onChange} />)
    fireEvent.click(trigger())
    fireEvent.keyDown(screen.getByRole('grid'), { key: 'ArrowRight' })
    expect(day('2026-11-21').tabIndex).toBe(0)
    expect(day('2026-11-20').tabIndex).toBe(-1)
    fireEvent.click(day('2026-11-21'))
    expect(onChange).toHaveBeenCalledWith('2026-11-21')
    expect(dialog()).toBeNull()
    expect(document.activeElement).toBe(trigger())
    expect(trigger().textContent).toContain('21 de nov. de 2026')
  })

  it('min/max/isDateDisabled: dia bloqueado não é escolhido; o foco não trava nele', () => {
    const onChange = vi.fn()
    render(
      <MaskedDatePicker
        variant="inline"
        ariaLabel="a"
        defaultValue="2026-11-20"
        min="2026-11-10"
        max="2026-11-25"
        isDateDisabled={(d) => d === '2026-11-22'}
        onChange={onChange}
      />
    )
    fireEvent.click(day('2026-11-05'))
    fireEvent.click(day('2026-11-22'))
    fireEvent.click(day('2026-11-28'))
    expect(onChange).not.toHaveBeenCalled()
    act(() => day('2026-11-21').focus())
    fireEvent.keyDown(screen.getByRole('grid'), { key: 'ArrowRight' })
    expect(document.activeElement).toBe(day('2026-11-22'))
    fireEvent.keyDown(screen.getByRole('grid'), { key: 'End' })
    expect(document.activeElement).toBe(day('2026-11-25'))
    fireEvent.keyDown(screen.getByRole('grid'), { key: 'ArrowRight' })
    expect(document.activeElement).toBe(day('2026-11-25'))
    fireEvent.click(day('2026-11-23'))
    expect(onChange).toHaveBeenCalledWith('2026-11-23')
  })

  it('botões de mês trocam o mês sem roubar o foco para a grade', () => {
    render(<MaskedDatePicker variant="inline" ariaLabel="a" defaultValue="2026-11-20" />)
    const next = screen.getByRole('button', { name: 'Próximo mês' })
    next.focus()
    fireEvent.click(next)
    expect(screen.getByText('dezembro de 2026')).toBeTruthy()
    expect(document.activeElement).toBe(next)
    fireEvent.click(screen.getByRole('button', { name: 'Mês anterior' }))
    fireEvent.click(screen.getByRole('button', { name: 'Mês anterior' }))
    expect(screen.getByText('outubro de 2026')).toBeTruthy()
  })

  it('clicar fora fecha; Limpar zera o valor e fecha; value controlado não muda sozinho', () => {
    const onChange = vi.fn()
    render(
      <div>
        <button type="button">fora</button>
        <MaskedDatePicker label="Consulta" defaultValue="2026-11-20" onChange={onChange} />
      </div>
    )
    fireEvent.click(trigger())
    fireEvent.pointerDown(screen.getByText('fora'))
    expect(dialog()).toBeNull()
    fireEvent.click(trigger())
    fireEvent.click(screen.getByRole('button', { name: 'Limpar' }))
    expect(onChange).toHaveBeenCalledWith(null)
    expect(dialog()).toBeNull()
    expect(trigger().textContent).toContain('Selecione uma data')
    cleanup()
    const stuck = vi.fn()
    render(<MaskedDatePicker variant="inline" ariaLabel="a" value="2026-11-20" onChange={stuck} />)
    fireEvent.click(day('2026-11-18'))
    expect(stuck).toHaveBeenCalledWith('2026-11-18')
    expect(day('2026-11-20').closest('td')!.getAttribute('aria-selected')).toBe('true')
  })

  it('Hoje escolhe a data de hoje (relógio local) e respeita bloqueio', () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date(2026, 10, 20, 15, 0))
    const onChange = vi.fn()
    render(<MaskedDatePicker variant="inline" ariaLabel="a" onChange={onChange} />)
    expect(day('2026-11-20').getAttribute('aria-current')).toBe('date')
    fireEvent.click(screen.getByRole('button', { name: 'Hoje' }))
    expect(onChange).toHaveBeenCalledWith('2026-11-20')
    cleanup()
    const blocked = vi.fn()
    render(<MaskedDatePicker variant="inline" ariaLabel="a" max="2026-11-10" onChange={blocked} />)
    fireEvent.click(screen.getByRole('button', { name: 'Hoje' }))
    expect(blocked).not.toHaveBeenCalled()
  })

  it('campo oculto acompanha o valor para <form>', () => {
    render(<MaskedDatePicker variant="inline" ariaLabel="a" name="data" defaultValue="2026-11-20" />)
    const hidden = document.querySelector('input[type="hidden"]') as HTMLInputElement
    expect(hidden.value).toBe('2026-11-20')
    fireEvent.click(day('2026-11-18'))
    expect(hidden.value).toBe('2026-11-18')
    fireEvent.click(screen.getByRole('button', { name: 'Limpar' }))
    expect(hidden.value).toBe('')
  })
})

describe('CommandPalette — busca e teclado', () => {
  const run = vi.fn()
  const items = [
    { id: 'novo', label: 'Novo cliente', group: 'Clientes', keywords: ['cadastrar'], onSelect: run },
    { id: 'lista', label: 'Lista de clientes', group: 'Clientes' },
    { id: 'off', label: 'Bloqueado', group: 'Conta', disabled: true },
    { id: 'config', label: 'Configurações', group: 'Conta' }
  ]
  const input = () => screen.getByRole('combobox') as HTMLInputElement
  const options = () => screen.getAllByRole('option')
  const activeLabel = () => document.getElementById(input().getAttribute('aria-activedescendant')!)?.textContent

  beforeEach(() => run.mockClear())

  it('Ctrl+K abre (foco no campo) e alterna; Cmd+K também; hotkey={false} desliga', async () => {
    render(<MaskedCommandPalette items={items} />)
    expect(screen.queryByRole('dialog')).toBeNull()
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true })
    await waitFor(() => expect(screen.getByRole('dialog')).toBeTruthy())
    await waitFor(() => expect(document.activeElement).toBe(input()))
    fireEvent.keyDown(window, { key: 'k', metaKey: true })
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    cleanup()
    render(<MaskedCommandPalette items={items} hotkey={false} />)
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true })
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('digitar filtra (sem acento), anuncia a contagem e marca o primeiro como ativo', () => {
    render(<MaskedCommandPalette items={items} defaultOpen />)
    expect(options()).toHaveLength(4)
    expect(screen.getByRole('status').textContent).toBe('4 resultados')
    fireEvent.change(input(), { target: { value: 'configuracoes' } })
    expect(options()).toHaveLength(1)
    expect(screen.getByRole('status').textContent).toBe('1 resultado')
    expect(activeLabel()).toBe('Configurações')
    fireEvent.change(input(), { target: { value: 'cadastrar' } })
    expect(options().map((o) => o.textContent)).toEqual(['Novo cliente'])
    fireEvent.change(input(), { target: { value: 'zzz' } })
    expect(screen.queryAllByRole('option')).toHaveLength(0)
    expect(screen.getAllByText('Nenhum resultado').length).toBeGreaterThan(0)
    expect(input().hasAttribute('aria-activedescendant')).toBe(false)
  })

  it('↓/↑ movem com volta e pulam o desabilitado; Home/End vão às pontas', () => {
    render(<MaskedCommandPalette items={items} defaultOpen />)
    expect(activeLabel()).toBe('Novo cliente')
    fireEvent.keyDown(input(), { key: 'ArrowDown' })
    expect(activeLabel()).toBe('Lista de clientes')
    fireEvent.keyDown(input(), { key: 'ArrowDown' })
    expect(activeLabel()).toBe('Configurações')
    fireEvent.keyDown(input(), { key: 'ArrowDown' })
    expect(activeLabel()).toBe('Novo cliente')
    fireEvent.keyDown(input(), { key: 'ArrowUp' })
    expect(activeLabel()).toBe('Configurações')
    fireEvent.keyDown(input(), { key: 'Home' })
    expect(activeLabel()).toBe('Novo cliente')
    fireEvent.keyDown(input(), { key: 'End' })
    expect(activeLabel()).toBe('Configurações')
    expect(options().find((o) => o.textContent === 'Configurações')!.getAttribute('aria-selected')).toBe('true')
    expect(options().filter((o) => o.getAttribute('aria-selected') === 'true')).toHaveLength(1)
  })

  it('Enter executa o item ativo, chama os dois onSelect e fecha', async () => {
    const onSelect = vi.fn()
    const onOpenChange = vi.fn()
    render(<MaskedCommandPalette items={items} defaultOpen onSelect={onSelect} onOpenChange={onOpenChange} />)
    fireEvent.keyDown(input(), { key: 'Enter' })
    expect(run).toHaveBeenCalledTimes(1)
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'novo' }))
    expect(onOpenChange).toHaveBeenLastCalledWith(false)
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  })

  it('clicar escolhe; item desabilitado não executa; mouse ativa o item sob o ponteiro', () => {
    const onSelect = vi.fn()
    render(<MaskedCommandPalette items={items} defaultOpen onSelect={onSelect} />)
    fireEvent.click(screen.getByText('Bloqueado'))
    expect(onSelect).not.toHaveBeenCalled()
    fireEvent.mouseMove(screen.getByText('Configurações'))
    expect(activeLabel()).toBe('Configurações')
    fireEvent.click(screen.getByText('Lista de clientes'))
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'lista' }))
  })

  it('Escape fecha; reabrir limpa a busca e volta ao primeiro item', async () => {
    function Host() {
      const [open, setOpen] = useState(true)
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>
            abrir
          </button>
          <MaskedCommandPalette items={items} open={open} onOpenChange={setOpen} />
        </>
      )
    }
    render(<Host />)
    fireEvent.change(input(), { target: { value: 'conf' } })
    fireEvent.keyDown(document, { key: 'Escape' })
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    fireEvent.click(screen.getByText('abrir'))
    await waitFor(() => expect(screen.getByRole('dialog')).toBeTruthy())
    expect(input().value).toBe('')
    expect(options()).toHaveLength(4)
    expect(activeLabel()).toBe('Novo cliente')
  })

  it('diálogo nomeado e rótulo em inglês', () => {
    render(
      <MaskedConfigProvider config={{ locale: 'en' }}>
        <MaskedCommandPalette items={items} defaultOpen />
      </MaskedConfigProvider>
    )
    expect(screen.getByRole('dialog', { name: 'Command palette' })).toBeTruthy()
  })
})

describe('Contact — envio', () => {
  const fill = (name = 'Ana', email = 'ana@exemplo.com', message = 'Olá') => {
    fireEvent.change(screen.getByLabelText('Nome'), { target: { value: name } })
    fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: email } })
    fireEvent.change(screen.getByLabelText('Mensagem'), { target: { value: message } })
    return screen.getByLabelText('Nome').closest('form')!
  }

  it('sucesso: onSubmit recebe valores aparados, limpa o formulário, anuncia e avisa o config', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    const onSuccess = vi.fn()
    render(
      <MaskedConfigProvider config={{ onSuccess }}>
        <MaskedContact onSubmit={onSubmit} />
      </MaskedConfigProvider>
    )
    fireEvent.submit(fill('  Ana ', ' ana@exemplo.com ', ' Olá  '))
    await waitFor(() => expect(screen.getByRole('status')).toBeTruthy())
    expect(onSubmit).toHaveBeenCalledWith({ name: 'Ana', email: 'ana@exemplo.com', message: 'Olá' })
    expect((screen.getByLabelText('Nome') as HTMLInputElement).value).toBe('')
    expect(onSuccess).toHaveBeenCalledTimes(1)
  })

  it('erro: role=alert, campos mantêm o que foi digitado e avisa onError', async () => {
    const onError = vi.fn()
    render(
      <MaskedConfigProvider config={{ onError }}>
        <MaskedContact onSubmit={vi.fn().mockRejectedValue(new Error('x'))} errorMessage="Falhou" />
      </MaskedConfigProvider>
    )
    fireEvent.submit(fill())
    await waitFor(() => expect(screen.getByRole('alert')).toBeTruthy())
    expect(screen.getByRole('alert').textContent).toBe('Falhou')
    expect((screen.getByLabelText('E-mail') as HTMLInputElement).value).toBe('ana@exemplo.com')
    expect(onError).toHaveBeenCalledWith('Falhou')
  })

  it('carregando: campos e botão desabilitados, aria-busy; segundo envio é ignorado', async () => {
    let finish!: () => void
    const onSubmit = vi.fn(() => new Promise<void>((resolve) => (finish = resolve)))
    render(<MaskedContact onSubmit={onSubmit} />)
    const form = fill()
    fireEvent.submit(form)
    await waitFor(() => expect(form.getAttribute('aria-busy')).toBe('true'))
    expect((screen.getByRole('button', { name: 'Enviando…' }) as HTMLButtonElement).disabled).toBe(true)
    expect((screen.getByLabelText('Nome') as HTMLInputElement).disabled).toBe(true)
    fireEvent.submit(form)
    expect(onSubmit).toHaveBeenCalledTimes(1)
    finish()
    await waitFor(() => expect(form.getAttribute('aria-busy')).toBe('false'))
  })
})

describe('ThemeSwitcher — teclado', () => {
  function setup() {
    return render(
      <ThemeEngineProvider storageKey={null} defaultTheme="dark">
        <ThemeSwitcher />
      </ThemeEngineProvider>
    )
  }
  const chevron = () => screen.getByRole('button', { name: 'Choose theme' })
  const options = () => screen.getAllByRole('option')

  it('abrir leva o foco ao tema atual; setas movem com volta; Home/End; Enter escolhe e fecha', () => {
    setup()
    fireEvent.click(chevron())
    const list = options()
    expect(list.length).toBeGreaterThan(2)
    const current = list.findIndex((o) => o.getAttribute('aria-selected') === 'true')
    expect(document.activeElement).toBe(list[current])
    const menu = screen.getByRole('listbox')
    fireEvent.keyDown(menu, { key: 'ArrowDown' })
    expect(document.activeElement).toBe(list[(current + 1) % list.length])
    fireEvent.keyDown(menu, { key: 'End' })
    expect(document.activeElement).toBe(list[list.length - 1])
    fireEvent.keyDown(menu, { key: 'ArrowDown' })
    expect(document.activeElement).toBe(list[0])
    fireEvent.keyDown(menu, { key: 'ArrowUp' })
    expect(document.activeElement).toBe(list[list.length - 1])
    fireEvent.keyDown(menu, { key: 'Home' })
    expect(document.activeElement).toBe(list[0])
    fireEvent.click(list[1])
    expect(screen.queryByRole('listbox')).toBeNull()
  })

  it('Escape fecha e devolve o foco ao botão; Tab fecha', () => {
    setup()
    fireEvent.click(chevron())
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('listbox')).toBeNull()
    expect(document.activeElement).toBe(chevron())
    fireEvent.click(chevron())
    fireEvent.keyDown(screen.getByRole('listbox'), { key: 'Tab' })
    expect(screen.queryByRole('listbox')).toBeNull()
  })
})
