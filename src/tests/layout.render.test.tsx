import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import React from 'react'
import { ThemeProvider } from 'styled-components'
import { maskedTheme } from '../../templates/masked-themes/MaskedThemes/MaskedThemes'
import { MaskedDiv } from '../../templates/masked-layout/MaskedDiv/MaskedDiv'
import { MaskedStack } from '../../templates/masked-layout/MaskedStack/MaskedStack'
import { MaskedGrid } from '../../templates/masked-layout/MaskedGrid/MaskedGrid'

/**
 * Renderização real (SSR) das fundações de layout: semântica via `as`,
 * repasse de atributos ARIA/HTML, divisores fora da árvore de acessibilidade
 * e tokens aplicados como variáveis CSS inline.
 */
const html = (node: React.ReactElement) =>
  renderToStaticMarkup(<ThemeProvider theme={maskedTheme}>{node}</ThemeProvider>)

describe('MaskedDiv — render', () => {
  it('uso mínimo: renderiza uma div com o conteúdo', () => {
    const out = html(<MaskedDiv>Olá</MaskedDiv>)
    expect(out).toMatch(/^<div[^>]*>Olá<\/div>$/)
  })

  it('`as` troca o elemento (landmark semântico) e repassa atributos ARIA', () => {
    const out = html(
      <MaskedDiv as="section" aria-label="Resumo" id="resumo">
        x
      </MaskedDiv>
    )
    expect(out).toMatch(/^<section/)
    expect(out).toContain('aria-label="Resumo"')
    expect(out).toContain('id="resumo"')
  })

  it('não vaza props transient nem props da API para o DOM', () => {
    const out = html(
      <MaskedDiv variant="card" direction="row" fullWidth colorTheme="baseBlue">
        x
      </MaskedDiv>
    )
    for (const leaked of ['variant=', 'direction=', 'fullwidth=', 'colortheme=', '$']) {
      expect(out.toLowerCase()).not.toContain(leaked)
    }
  })

  it('colorTheme vira variáveis --mc-div-* no style inline; style do usuário é preservado', () => {
    const out = html(
      <MaskedDiv variant="card" colorTheme="baseBlue" style={{ marginTop: 4 }}>
        x
      </MaskedDiv>
    )
    expect(out).toContain('--mc-div-bg:')
    expect(out).toContain('--mc-div-fg:')
    expect(out).toContain('margin-top:4px')
  })

  it('funciona sem ThemeProvider, inclusive com colorTheme (cai no tema base)', () => {
    const out = renderToStaticMarkup(
      <MaskedDiv variant="card" colorTheme="baseBlue">
        sem provider
      </MaskedDiv>
    )
    expect(out).toContain('sem provider')
    expect(out).toContain('--mc-div-bg:')
  })
})

describe('MaskedStack — render e a11y do divisor', () => {
  it('sem divider: só os filhos', () => {
    const out = html(
      <MaskedStack>
        <span>a</span>
        <span>b</span>
      </MaskedStack>
    )
    expect(out).not.toContain('masked-stack-divider')
    expect(out).toContain(`--mc-stack-gap:${maskedTheme.spacing.md}`)
  })

  it('divider={true}: N-1 linhas decorativas, fora da árvore de acessibilidade', () => {
    const out = html(
      <MaskedStack divider>
        <span>a</span>
        <span>b</span>
        <span>c</span>
      </MaskedStack>
    )
    const dividers = out.match(/masked-stack-divider/g) ?? []
    expect(dividers).toHaveLength(2)
    expect(out.match(/aria-hidden="true"/g) ?? []).toHaveLength(2)
  })

  it('divider customizado é renderizado e permanece acessível (conteúdo do autor)', () => {
    const out = html(
      <MaskedStack divider={<em>ou</em>}>
        <span>a</span>
        <span>b</span>
      </MaskedStack>
    )
    expect(out).toContain('<em>ou</em>')
    expect(out).not.toContain('aria-hidden')
  })

  it('`as="ul"` mantém a semântica de lista', () => {
    const out = html(
      <MaskedStack as="ul">
        <li>1</li>
        <li>2</li>
      </MaskedStack>
    )
    expect(out).toMatch(/^<ul[^>]*><li>1<\/li><li>2<\/li><\/ul>$/)
  })
})

describe('MaskedGrid — render', () => {
  it('cols responsivo vira tokens por breakpoint', () => {
    const out = html(
      <MaskedGrid cols={4}>
        <div>1</div>
      </MaskedGrid>
    )
    expect(out).toContain('--mc-grid-cols-desktop:4')
    expect(out).toContain('--mc-grid-cols-tablet:2')
    expect(out).toContain('--mc-grid-cols-mobile:1')
  })

  it('`as` e atributos repassados (ex.: lista semântica com role)', () => {
    const out = html(
      <MaskedGrid as="ul" aria-label="Produtos">
        <li>1</li>
      </MaskedGrid>
    )
    expect(out).toMatch(/^<ul/)
    expect(out).toContain('aria-label="Produtos"')
  })
})
