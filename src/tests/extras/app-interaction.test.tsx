// @vitest-environment jsdom
import { describe, expect, it, vi, afterEach, beforeEach } from 'vitest'
import React, { useState } from 'react'
import { render, screen, fireEvent, waitFor, cleanup, within, act } from '@testing-library/react'
import { MaskedTabs } from '../../../templates/masked-app/MaskedTabs/MaskedTabs'
import { MaskedAccordion } from '../../../templates/masked-app/MaskedAccordion/MaskedAccordion'
import { MaskedPagination } from '../../../templates/masked-app/MaskedPagination/MaskedPagination'
import { MaskedTooltip } from '../../../templates/masked-app/MaskedTooltip/MaskedTooltip'
import { MaskedStepper } from '../../../templates/masked-app/MaskedStepper/MaskedStepper'
import { MaskedTable } from '../../../templates/masked-app/MaskedTable/MaskedTable'
import { MaskedAvatar } from '../../../templates/masked-app/MaskedAvatar/MaskedAvatar'
import { MaskedDashboard } from '../../../templates/masked-app/MaskedDashboard/MaskedDashboard'

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

const tabs = [
  { id: 'a', label: 'Dados', content: 'Painel A' },
  { id: 'b', label: 'Agenda', content: 'Painel B', disabled: true },
  { id: 'c', label: 'Extra', content: 'Painel C' },
  { id: 'd', label: 'Fim', content: 'Painel D' }
]
const tab = (name: string) => screen.getByRole('tab', { name })

describe('Tabs — teclado e seleção', () => {
  it('clique seleciona; painel ativo visível e demais hidden; roving tabindex', () => {
    render(<MaskedTabs items={tabs} />)
    expect(tab('Dados').getAttribute('aria-selected')).toBe('true')
    expect(tab('Dados').tabIndex).toBe(0)
    expect(tab('Extra').tabIndex).toBe(-1)
    fireEvent.click(tab('Extra'))
    expect(tab('Extra').getAttribute('aria-selected')).toBe('true')
    expect(tab('Extra').tabIndex).toBe(0)
    expect(tab('Dados').tabIndex).toBe(-1)
    expect(screen.getByText('Painel C').closest('[role="tabpanel"]')!.hasAttribute('hidden')).toBe(false)
    expect(screen.getByText('Painel A', { selector: '[role="tabpanel"]' }).hasAttribute('hidden')).toBe(true)
  })

  it('setas movem foco e seleção (automatic), pulam a desabilitada, dão a volta; Home/End', () => {
    const onChange = vi.fn()
    render(<MaskedTabs items={tabs} onChange={onChange} />)
    tab('Dados').focus()
    fireEvent.keyDown(tab('Dados'), { key: 'ArrowRight' })
    expect(document.activeElement).toBe(tab('Extra'))
    expect(tab('Extra').getAttribute('aria-selected')).toBe('true')
    fireEvent.keyDown(tab('Extra'), { key: 'ArrowRight' })
    expect(document.activeElement).toBe(tab('Fim'))
    fireEvent.keyDown(tab('Fim'), { key: 'ArrowRight' })
    expect(document.activeElement).toBe(tab('Dados'))
    fireEvent.keyDown(tab('Dados'), { key: 'ArrowLeft' })
    expect(document.activeElement).toBe(tab('Fim'))
    fireEvent.keyDown(tab('Fim'), { key: 'Home' })
    expect(document.activeElement).toBe(tab('Dados'))
    fireEvent.keyDown(tab('Dados'), { key: 'End' })
    expect(document.activeElement).toBe(tab('Fim'))
    expect(onChange).toHaveBeenLastCalledWith('d')
  })

  it('manual: setas só movem o foco; Enter/clique seleciona', () => {
    const onChange = vi.fn()
    render(<MaskedTabs items={tabs} activation="manual" onChange={onChange} />)
    tab('Dados').focus()
    fireEvent.keyDown(tab('Dados'), { key: 'ArrowRight' })
    expect(document.activeElement).toBe(tab('Extra'))
    expect(tab('Dados').getAttribute('aria-selected')).toBe('true')
    expect(onChange).not.toHaveBeenCalled()
    fireEvent.click(tab('Extra'))
    expect(onChange).toHaveBeenCalledWith('c')
  })

  it('vertical usa ↑/↓ e ignora ←/→; value controlado só muda pelo pai', () => {
    render(<MaskedTabs variant="vertical" items={tabs} />)
    tab('Dados').focus()
    fireEvent.keyDown(tab('Dados'), { key: 'ArrowRight' })
    expect(document.activeElement).toBe(tab('Dados'))
    fireEvent.keyDown(tab('Dados'), { key: 'ArrowDown' })
    expect(document.activeElement).toBe(tab('Extra'))
    cleanup()
    const onChange = vi.fn()
    render(<MaskedTabs items={tabs} value="a" onChange={onChange} />)
    fireEvent.click(tab('Extra'))
    expect(onChange).toHaveBeenCalledWith('c')
    expect(tab('Dados').getAttribute('aria-selected')).toBe('true')
  })
})

describe('Accordion — abrir, fechar e teclado', () => {
  const items = [
    { id: 'a', title: 'Plano', content: 'Detalhes A' },
    { id: 'b', title: 'Cobrança', content: 'Detalhes B' },
    { id: 'c', title: 'Bloqueado', content: 'Detalhes C', disabled: true }
  ]
  const trigger = (name: string) => screen.getByRole('button', { name })
  const open = (name: string) => trigger(name).getAttribute('aria-expanded') === 'true'

  it('modo único: abrir outro fecha o anterior; clicar no aberto fecha (collapsible)', () => {
    render(<MaskedAccordion items={items} />)
    fireEvent.click(trigger('Plano'))
    expect(open('Plano')).toBe(true)
    fireEvent.click(trigger('Cobrança'))
    expect(open('Plano')).toBe(false)
    expect(open('Cobrança')).toBe(true)
    fireEvent.click(trigger('Cobrança'))
    expect(open('Cobrança')).toBe(false)
  })

  it('collapsible={false} impede fechar o único aberto; multiple mantém vários', () => {
    render(<MaskedAccordion items={items} collapsible={false} defaultValue={['a']} />)
    fireEvent.click(trigger('Plano'))
    expect(open('Plano')).toBe(true)
    cleanup()
    render(<MaskedAccordion items={items} multiple />)
    fireEvent.click(trigger('Plano'))
    fireEvent.click(trigger('Cobrança'))
    expect(open('Plano') && open('Cobrança')).toBe(true)
  })

  it('painel muda de hidden com o estado; onChange recebe a lista; controlado não muda sozinho', () => {
    const onChange = vi.fn()
    render(<MaskedAccordion items={items} multiple onChange={onChange} />)
    const panel = screen.getByText('Detalhes A')
    expect(panel.hasAttribute('hidden')).toBe(true)
    fireEvent.click(trigger('Plano'))
    expect(panel.hasAttribute('hidden')).toBe(false)
    expect(onChange).toHaveBeenLastCalledWith(['a'])
    cleanup()
    const stuck = vi.fn()
    render(<MaskedAccordion items={items} value={[]} onChange={stuck} />)
    fireEvent.click(trigger('Plano'))
    expect(stuck).toHaveBeenCalledWith(['a'])
    expect(open('Plano')).toBe(false)
  })

  it('↑/↓/Home/End movem o foco entre títulos habilitados (pulam o desabilitado)', () => {
    render(<MaskedAccordion items={items} />)
    trigger('Plano').focus()
    fireEvent.keyDown(trigger('Plano'), { key: 'ArrowDown' })
    expect(document.activeElement).toBe(trigger('Cobrança'))
    fireEvent.keyDown(trigger('Cobrança'), { key: 'ArrowDown' })
    expect(document.activeElement).toBe(trigger('Plano'))
    fireEvent.keyDown(trigger('Plano'), { key: 'End' })
    expect(document.activeElement).toBe(trigger('Cobrança'))
    fireEvent.keyDown(trigger('Cobrança'), { key: 'Home' })
    expect(document.activeElement).toBe(trigger('Plano'))
    fireEvent.keyDown(trigger('Plano'), { key: 'ArrowUp' })
    expect(document.activeElement).toBe(trigger('Cobrança'))
  })
})

describe('Pagination — navegação', () => {
  it('não controlada: clicar numa página e em próxima/anterior; onChange recebe o número', () => {
    const onChange = vi.fn()
    render(<MaskedPagination pageCount={10} defaultPage={3} onChange={onChange} />)
    const current = () => screen.getByRole('button', { current: 'page' })
    expect(current().textContent).toBe('3')
    fireEvent.click(screen.getByRole('button', { name: 'Próxima página' }))
    expect(current().textContent).toBe('4')
    expect(onChange).toHaveBeenLastCalledWith(4)
    fireEvent.click(screen.getByRole('button', { name: 'Página anterior' }))
    fireEvent.click(screen.getByRole('button', { name: 'Página anterior' }))
    expect(current().textContent).toBe('2')
    fireEvent.click(screen.getByRole('button', { name: 'Página 10' }))
    expect(current().textContent).toBe('10')
    expect(screen.getByRole('button', { name: 'Próxima página' }).hasAttribute('disabled')).toBe(true)
    onChange.mockClear()
    fireEvent.click(screen.getByRole('button', { name: 'Página 10' }))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('controlada: só muda quando o pai muda page; edges vai à primeira e à última', () => {
    function Host() {
      const [page, setPage] = useState(5)
      return <MaskedPagination variant="edges" pageCount={9} page={page} onChange={setPage} />
    }
    render(<Host />)
    fireEvent.click(screen.getByRole('button', { name: 'Primeira página' }))
    expect(screen.getByRole('button', { current: 'page' }).textContent).toBe('1')
    fireEvent.click(screen.getByRole('button', { name: 'Última página' }))
    expect(screen.getByRole('button', { current: 'page' }).textContent).toBe('9')
    cleanup()
    const stuck = vi.fn()
    render(<MaskedPagination pageCount={9} page={5} onChange={stuck} />)
    fireEvent.click(screen.getByRole('button', { name: 'Página 6' }))
    expect(stuck).toHaveBeenCalledWith(6)
    expect(screen.getByRole('button', { current: 'page' }).textContent).toBe('5')
  })

  it('compact atualiza o texto "Página X de Y"', () => {
    render(<MaskedPagination variant="compact" pageCount={4} defaultPage={1} />)
    expect(screen.getByText('Página 1 de 4')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Próxima página' }))
    expect(screen.getByText('Página 2 de 4')).toBeTruthy()
  })
})

describe('Tooltip — hover, foco e Escape', () => {
  beforeEach(() => vi.useFakeTimers())

  it('abre com hover após o delay, liga aria-describedby e fecha ao sair', () => {
    render(
      <MaskedTooltip content="Excluir cliente" delay={100}>
        <button type="button">Excluir</button>
      </MaskedTooltip>
    )
    const button = screen.getByRole('button', { name: 'Excluir' })
    expect(screen.queryByRole('tooltip')).toBeNull()
    fireEvent.mouseEnter(button.parentElement!)
    expect(screen.queryByRole('tooltip')).toBeNull()
    act(() => vi.advanceTimersByTime(120))
    const tip = screen.getByRole('tooltip')
    expect(tip.textContent).toBe('Excluir cliente')
    expect(button.getAttribute('aria-describedby')).toBe(tip.id)
    fireEvent.mouseLeave(button.parentElement!)
    expect(screen.queryByRole('tooltip')).toBeNull()
    expect(button.hasAttribute('aria-describedby')).toBe(false)
  })

  it('sair antes do delay cancela; foco abre e blur fecha; Escape fecha', () => {
    render(
      <MaskedTooltip content="Dica" delay={100}>
        <button type="button">Gatilho</button>
      </MaskedTooltip>
    )
    const button = screen.getByRole('button', { name: 'Gatilho' })
    fireEvent.mouseEnter(button.parentElement!)
    act(() => vi.advanceTimersByTime(50))
    fireEvent.mouseLeave(button.parentElement!)
    act(() => vi.advanceTimersByTime(200))
    expect(screen.queryByRole('tooltip')).toBeNull()

    fireEvent.focus(button)
    act(() => vi.advanceTimersByTime(120))
    expect(screen.getByRole('tooltip')).toBeTruthy()
    fireEvent.keyDown(button, { key: 'Escape' })
    expect(screen.queryByRole('tooltip')).toBeNull()

    fireEvent.focus(button)
    act(() => vi.advanceTimersByTime(120))
    expect(screen.getByRole('tooltip')).toBeTruthy()
    fireEvent.blur(button)
    expect(screen.queryByRole('tooltip')).toBeNull()
  })

  it('preserva o aria-describedby que o filho já tinha enquanto fechado', () => {
    render(
      <MaskedTooltip content="Dica">
        <button type="button" aria-describedby="ajuda">
          Gatilho
        </button>
      </MaskedTooltip>
    )
    expect(screen.getByRole('button').getAttribute('aria-describedby')).toBe('ajuda')
  })
})

describe('Stepper — cliques', () => {
  it('só passos alcançados são clicáveis e informam o índice', () => {
    const onStepClick = vi.fn()
    render(
      <MaskedStepper
        steps={[{ label: 'Dados' }, { label: 'Pagamento' }, { label: 'Fim' }]}
        current={1}
        onStepClick={onStepClick}
      />
    )
    expect(screen.getAllByRole('button')).toHaveLength(2)
    fireEvent.click(screen.getByRole('button', { name: /Dados/ }))
    expect(onStepClick).toHaveBeenCalledWith(0)
    fireEvent.click(screen.getByRole('button', { name: /Pagamento/ }))
    expect(onStepClick).toHaveBeenLastCalledWith(1)
  })
})

describe('Table — ordenação e linhas clicáveis', () => {
  type Row = { id: number; nome: string; n: number }
  const data: Row[] = [
    { id: 1, nome: 'Bia', n: 10 },
    { id: 2, nome: 'Ana', n: 2 },
    { id: 3, nome: 'Caio', n: 7 }
  ]
  const columns = [
    { key: 'nome', header: 'Nome', sortable: true },
    { key: 'n', header: 'Qtd', sortable: true }
  ]
  const order = () => screen.getAllByRole('row').slice(1).map((r) => r.textContent!.replace(/\d+$/, '').trim())
  const header = (name: string) => screen.getByRole('columnheader', { name: new RegExp(name) })

  it('clicar no cabeçalho: asc → desc → sem ordenação, com aria-sort e onSortChange', () => {
    const onSortChange = vi.fn()
    render(<MaskedTable<Row> rowKey="id" data={data} columns={columns} onSortChange={onSortChange} />)
    expect(header('Nome').getAttribute('aria-sort')).toBe('none')
    fireEvent.click(within(header('Nome')).getByRole('button'))
    expect(header('Nome').getAttribute('aria-sort')).toBe('ascending')
    expect(order()).toEqual(['Ana', 'Bia', 'Caio'])
    fireEvent.click(within(header('Nome')).getByRole('button'))
    expect(header('Nome').getAttribute('aria-sort')).toBe('descending')
    expect(order()).toEqual(['Caio', 'Bia', 'Ana'])
    fireEvent.click(within(header('Nome')).getByRole('button'))
    expect(header('Nome').getAttribute('aria-sort')).toBe('none')
    expect(order()).toEqual(['Bia', 'Ana', 'Caio'])
    expect(onSortChange).toHaveBeenNthCalledWith(1, { key: 'nome', direction: 'asc' })
    expect(onSortChange).toHaveBeenNthCalledWith(3, undefined)
  })

  it('trocar de coluna reinicia em asc e só uma coluna fica ordenada; números ordenam como número', () => {
    render(<MaskedTable<Row> rowKey="id" data={data} columns={columns} />)
    fireEvent.click(within(header('Nome')).getByRole('button'))
    fireEvent.click(within(header('Qtd')).getByRole('button'))
    expect(header('Nome').getAttribute('aria-sort')).toBe('none')
    expect(header('Qtd').getAttribute('aria-sort')).toBe('ascending')
    expect(screen.getAllByRole('row').slice(1).map((r) => r.textContent)).toEqual(['Ana2', 'Caio7', 'Bia10'])
  })

  it('manualSort não reordena; sort controlado só muda pelo pai', () => {
    const onSortChange = vi.fn()
    render(<MaskedTable<Row> rowKey="id" data={data} columns={columns} manualSort onSortChange={onSortChange} />)
    fireEvent.click(within(header('Nome')).getByRole('button'))
    expect(onSortChange).toHaveBeenCalledWith({ key: 'nome', direction: 'asc' })
    expect(order()).toEqual(['Bia', 'Ana', 'Caio'])
    cleanup()
    render(<MaskedTable<Row> rowKey="id" data={data} columns={columns} sort={{ key: 'nome', direction: 'desc' }} onSortChange={onSortChange} />)
    expect(order()).toEqual(['Caio', 'Bia', 'Ana'])
    fireEvent.click(within(header('Nome')).getByRole('button'))
    expect(header('Nome').getAttribute('aria-sort')).toBe('descending')
  })

  it('onRowClick: clique, Enter e Espaço na linha; Enter em elemento interno não dispara a linha', () => {
    const onRowClick = vi.fn()
    render(
      <MaskedTable<Row>
        rowKey="id"
        data={data}
        onRowClick={onRowClick}
        columns={[{ key: 'nome', header: 'Nome', cell: (row) => <button type="button">{row.nome}</button> }]}
      />
    )
    const rows = screen.getAllByRole('row').slice(1)
    fireEvent.click(rows[0])
    expect(onRowClick).toHaveBeenLastCalledWith(data[0], 0)
    fireEvent.keyDown(rows[1], { key: 'Enter' })
    expect(onRowClick).toHaveBeenLastCalledWith(data[1], 1)
    fireEvent.keyDown(rows[2], { key: ' ' })
    expect(onRowClick).toHaveBeenLastCalledWith(data[2], 2)
    onRowClick.mockClear()
    fireEvent.keyDown(within(rows[0]).getByRole('button'), { key: 'Enter' })
    expect(onRowClick).not.toHaveBeenCalled()
  })
})

describe('Avatar — fallback de imagem', () => {
  it('imagem que falha vira iniciais com role=img', () => {
    render(<MaskedAvatar name="Ana Souza" src="/quebrada.jpg" />)
    const img = document.querySelector('img')!
    expect(img.getAttribute('alt')).toBe('Ana Souza')
    fireEvent.error(img)
    expect(document.querySelector('img')).toBeNull()
    expect(screen.getByRole('img', { name: 'Ana Souza' })).toBeTruthy()
    expect(screen.getByText('AS')).toBeTruthy()
  })
})

describe('Dashboard — menu mobile da sidebar', () => {
  const navItems = [
    { id: 'home', label: 'Início' },
    { id: 'clientes', label: 'Clientes' }
  ]
  const dialog = () => document.querySelector('[role="dialog"]') as HTMLElement
  const toggle = () => document.querySelector('button[aria-haspopup="dialog"]') as HTMLElement

  it('o botão abre e fecha a sidebar no Drawer; escolher item e Escape também fecham', async () => {
    render(<MaskedDashboard navItems={navItems} title="Painel" />)
    expect(toggle().getAttribute('aria-label')).toBe('Abrir menu de navegação')
    expect(dialog().getAttribute('aria-hidden')).toBe('true')
    fireEvent.click(toggle())
    await waitFor(() => expect(dialog().getAttribute('aria-hidden')).toBe('false'))
    expect(toggle().getAttribute('aria-expanded')).toBe('true')
    expect(toggle().getAttribute('aria-label')).toBe('Fechar menu de navegação')
    fireEvent.click(within(dialog()).getByText('Clientes'))
    await waitFor(() => expect(dialog().getAttribute('aria-hidden')).toBe('true'))
    expect(toggle().getAttribute('aria-expanded')).toBe('false')

    fireEvent.click(toggle())
    await waitFor(() => expect(dialog().getAttribute('aria-hidden')).toBe('false'))
    fireEvent.keyDown(document, { key: 'Escape' })
    await waitFor(() => expect(dialog().getAttribute('aria-hidden')).toBe('true'), { timeout: 3000 })
  })

  it('navegação funciona controlada e não controlada (aria-current na sidebar)', () => {
    const onActiveChange = vi.fn()
    render(<MaskedDashboard navItems={navItems} defaultActiveId="home" onActiveChange={onActiveChange} />)
    const aside = document.querySelector('aside') as HTMLElement
    expect(within(aside).getByRole('button', { name: 'Início' }).getAttribute('aria-current')).toBe('page')
    fireEvent.click(within(aside).getByRole('button', { name: 'Clientes' }))
    expect(onActiveChange).toHaveBeenCalledWith('clientes')
    expect(within(aside).getByRole('button', { name: 'Clientes' }).getAttribute('aria-current')).toBe('page')
  })
})
