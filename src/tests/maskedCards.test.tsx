// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import { maskedTheme } from '../../templates/masked-themes/MaskedThemes/MaskedThemes'
import { MaskedCards } from '../../templates/masked-cards/MaskedCards/MaskedCards'
import { MaskedCardGroup } from '../../templates/masked-cards/MaskedCards/Group/MaskedCardGroup'
import type { CardProps } from '../../templates/masked-cards/MaskedCards/MaskedCards.types'

afterEach(cleanup)

function renderCard(props: CardProps) {
  return render(
    <ThemeProvider theme={maskedTheme}>
      <MaskedCards {...props} />
    </ThemeProvider>
  )
}

describe('MaskedCards — variantes', () => {
  it('metric', () => {
    renderCard({ $variant: 'metric', value: 'R$ 10k', label: 'Receita' })
    expect(screen.getByText('Receita')).toBeTruthy()
  })

  it('stat', () => {
    renderCard({ $variant: 'stat', label: 'Usuários', value: '1.2k' })
    expect(screen.getByText('Usuários')).toBeTruthy()
  })

  it('compare', () => {
    renderCard({ $variant: 'compare', value: '100', label: 'Hoje', compareText: 'ontem' })
    expect(screen.getByText('Hoje')).toBeTruthy()
  })

  it('product', () => {
    renderCard({ $variant: 'product', title: 'Camiseta', price: 'R$ 99' })
    expect(screen.getByText('Camiseta')).toBeTruthy()
  })

  it('feature', () => {
    renderCard({ $variant: 'feature', title: 'Rápido', description: 'Muito rápido' })
    expect(screen.getByText('Rápido')).toBeTruthy()
  })

  it('plan', () => {
    renderCard({ $variant: 'plan', planName: 'Pro' })
    expect(screen.getByText('Pro')).toBeTruthy()
  })

  it('profile', () => {
    renderCard({ $variant: 'profile', name: 'Ana Silva', role: 'Dev' })
    expect(screen.getByText('Ana Silva')).toBeTruthy()
  })

  it('article', () => {
    renderCard({ $variant: 'article', title: 'Novidades', excerpt: 'Resumo' })
    expect(screen.getByText('Novidades')).toBeTruthy()
  })

  it('service', () => {
    renderCard({ $variant: 'service', title: 'Consultoria', price: 500 })
    expect(screen.getByText('Consultoria')).toBeTruthy()
  })

  it('testimonial', () => {
    renderCard({ $variant: 'testimonial', quote: 'Excelente!', author: 'João' })
    expect(screen.getByText('João')).toBeTruthy()
  })

  it('pricing', () => {
    renderCard({
      $variant: 'pricing',
      planName: 'Pro',
      price: 29,
      features: [{ label: 'A' }, { label: 'B' }]
    })
    expect(screen.getByText('Pro')).toBeTruthy()
  })
})

describe('MaskedCards — seleção', () => {
  it('selectable multiple → role checkbox e alterna aria-checked', () => {
    renderCard({ $variant: 'feature', title: 'F', selectable: true, selectionMode: 'multiple' })
    const card = screen.getByRole('checkbox')
    expect(card.getAttribute('aria-checked')).toBe('false')
    fireEvent.click(card)
    expect(card.getAttribute('aria-checked')).toBe('true')
  })

  it('selectable single → role radio', () => {
    renderCard({ $variant: 'feature', title: 'F', selectable: true, selectionMode: 'single' })
    expect(screen.getByRole('radio')).toBeTruthy()
  })

  it('seleção múltipla controlada chama onSelectedChange', () => {
    const onChange = vi.fn()
    renderCard({
      $variant: 'feature',
      title: 'F',
      selectable: true,
      selectionMode: 'multiple',
      selected: true,
      onSelectedChange: onChange
    })
    const card = screen.getByRole('checkbox')
    expect(card.getAttribute('aria-checked')).toBe('true')
    fireEvent.click(card)
    expect(onChange).toHaveBeenCalledWith(false)
  })

  it('disabled não alterna seleção', () => {
    const onChange = vi.fn()
    renderCard({
      $variant: 'feature',
      title: 'F',
      selectable: true,
      selectionMode: 'multiple',
      disabled: true,
      onSelectedChange: onChange
    })
    const card = screen.getByRole('checkbox')
    fireEvent.click(card)
    expect(onChange).not.toHaveBeenCalled()
  })

  it('controlado: selected reflete o prop e o atributo não muda sozinho', () => {
    const onChange = vi.fn()
    renderCard({
      $variant: 'feature',
      title: 'F',
      selectable: true,
      selectionMode: 'multiple',
      selected: true,
      onSelectedChange: onChange
    })
    const card = screen.getByRole('checkbox')
    expect(card.getAttribute('aria-checked')).toBe('true')
    fireEvent.click(card)
    expect(onChange).toHaveBeenCalledWith(false)
    // controlado: o atributo não muda sem nova prop
    expect(card.getAttribute('aria-checked')).toBe('true')
  })
})

describe('MaskedCards — expansão', () => {
  it('expandable renderiza botão com aria-expanded/aria-controls e alterna', () => {
    renderCard({
      $variant: 'feature',
      title: 'F',
      expandable: true,
      expandContent: <p>Detalhes</p>
    })
    const btn = screen.getByRole('button', { name: /mostrar mais/i })
    expect(btn.getAttribute('aria-expanded')).toBe('false')
    fireEvent.click(btn)
    expect(btn.getAttribute('aria-expanded')).toBe('true')
    expect(screen.getByText('Detalhes')).toBeTruthy()
  })

  it('expandLabel/collapseLabel customizados', () => {
    renderCard({
      $variant: 'feature',
      title: 'F',
      expandable: true,
      expandContent: <p>X</p>,
      expandLabel: 'Ver mais',
      collapseLabel: 'Ver menos'
    })
    const btn = screen.getByRole('button', { name: 'Ver mais' })
    fireEvent.click(btn)
    expect(screen.getByRole('button', { name: 'Ver menos' })).toBeTruthy()
  })
})

describe('MaskedCards — interatividade', () => {
  it('href renderiza link esticado', () => {
    renderCard({ $variant: 'feature', title: 'F', href: '/detalhe', hrefLabel: 'Ver F' })
    const link = screen.getByRole('link', { name: 'Ver F' })
    expect(link.getAttribute('href')).toBe('/detalhe')
  })

  it('onClick renderiza button', () => {
    const onClick = vi.fn()
    renderCard({ $variant: 'feature', title: 'F', onClick })
    fireEvent.click(screen.getByRole('button', { name: 'F' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('href + actions: actions ficam fora do link (sem interativo aninhado)', () => {
    renderCard({
      $variant: 'feature',
      title: 'F',
      href: '/x',
      hrefLabel: 'Abrir',
      action: <button type="button">Btn</button>
    })
    const link = screen.getByRole('link', { name: 'Abrir' })
    const innerBtn = screen.getByRole('button', { name: 'Btn' })
    expect(link.contains(innerBtn)).toBe(false)
  })
})

describe('MaskedCardGroup', () => {
  function renderGroup(mode: 'single' | 'multiple') {
    return render(
      <ThemeProvider theme={maskedTheme}>
        <MaskedCardGroup selectionMode={mode} ariaLabel="Grupo">
          <MaskedCards $variant="feature" title="A" selectionValue="a" />
          <MaskedCards $variant="feature" title="B" selectionValue="b" />
        </MaskedCardGroup>
      </ThemeProvider>
    )
  }

  it('single: selecionar um desmarca o outro', () => {
    renderGroup('single')
    const [a, b] = screen.getAllByRole('radio')
    fireEvent.click(a)
    expect(a.getAttribute('aria-checked')).toBe('true')
    fireEvent.click(b)
    expect(b.getAttribute('aria-checked')).toBe('true')
    expect(a.getAttribute('aria-checked')).toBe('false')
  })

  it('multiple: ambos podem ficar selecionados', () => {
    renderGroup('multiple')
    const [a, b] = screen.getAllByRole('checkbox')
    fireEvent.click(a)
    fireEvent.click(b)
    expect(a.getAttribute('aria-checked')).toBe('true')
    expect(b.getAttribute('aria-checked')).toBe('true')
  })

  it('setas movem o foco entre cards (roving tabindex)', () => {
    renderGroup('single')
    const [a, b] = screen.getAllByRole('radio')
    fireEvent.keyDown(a, { key: 'ArrowDown' })
    expect(b.getAttribute('tabindex')).toBe('0')
    expect(a.getAttribute('tabindex')).toBe('-1')
  })
})
