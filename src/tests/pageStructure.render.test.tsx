import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import React from 'react'
import { ThemeProvider } from 'styled-components'
import { maskedTheme } from '../../templates/masked-themes/MaskedThemes/MaskedThemes'
import { MaskedConfigProvider } from '../../templates/masked-config/MaskedConfigProvider'
import { MaskedFooter } from '../../templates/masked-page/MaskedFooter/MaskedFooter'
import { MaskedPageHeader } from '../../templates/masked-page/MaskedPageHeader/MaskedPageHeader'
import { MaskedHeader } from '../../templates/masked-page/MaskedHeader/MaskedHeader'
import { MaskedSidebar } from '../../templates/masked-page/MaskedSidebar/MaskedSidebar'
import { MaskedShell } from '../../templates/masked-page/MaskedShell/MaskedShell'

const html = (node: React.ReactElement) =>
  renderToStaticMarkup(<ThemeProvider theme={maskedTheme}>{node}</ThemeProvider>)

/**
 * O MaskedDrawer mantém o painel no DOM mesmo fechado, mas com aria-hidden e
 * inert (some da árvore de acessibilidade e do foco). `visiblePart` devolve
 * só o que vem ANTES do painel, ou seja, o que o usuário realmente percebe.
 */
const DRAWER_CLOSED = '<div role="dialog" aria-modal="true" aria-hidden="true" inert=""'
const visiblePart = (out: string) => out.split('<div role="dialog"')[0]

/** Link falso para provar que o linkComponent do MaskedConfigProvider é usado. */
function FakeLink(props: { href: string; className?: string; children?: React.ReactNode }) {
  return (
    <a data-fake-link="true" href={props.href} className={props.className}>
      {props.children}
    </a>
  )
}

const columns = [
  { title: 'Produto', links: [{ label: 'Preços', href: '/precos' }] },
  { title: 'Empresa', links: [{ label: 'Sobre', href: '/sobre' }] }
]

describe('MaskedFooter', () => {
  it('é um <footer>; copyright em <small>; marca e descrição', () => {
    const out = html(
      <MaskedFooter brand="Acme" description="Feito com cuidado" copyright="© 2026 Acme" />
    )
    expect(out).toMatch(/^<footer/)
    expect(out).toContain('<small>© 2026 Acme</small>')
    expect(out).toContain('Feito com cuidado')
  })

  it('columns: cada coluna é um <nav> rotulado pelo próprio título (h2)', () => {
    const out = html(<MaskedFooter variant="columns" columns={columns} />)
    const labelledBy = [...out.matchAll(/<nav[^>]*aria-labelledby="([^"]+)"/g)].map((m) => m[1])
    expect(labelledBy).toHaveLength(2)
    for (const id of labelledBy) expect(out).toContain(`id="${id}"`)
    expect(out).toMatch(/<h2[^>]*>Produto<\/h2>/)
  })

  it('simple/centered: uma só navegação com todos os links, rotulada por locale', () => {
    const out = html(<MaskedFooter columns={columns} />)
    expect(out.match(/<nav/g)).toHaveLength(1)
    expect(out).toContain('aria-label="Rodapé"')
    expect(out).toContain('Preços')
    expect(out).toContain('Sobre')
  })

  it('locale en (via config) e navLabel explícito', () => {
    const en = html(
      <MaskedConfigProvider config={{ locale: 'en-US' }}>
        <MaskedFooter columns={columns} />
      </MaskedConfigProvider>
    )
    expect(en).toContain('aria-label="Footer"')
    expect(html(<MaskedFooter columns={columns} navLabel="Links úteis" />)).toContain(
      'aria-label="Links úteis"'
    )
  })

  it('usa o linkComponent do MaskedConfigProvider', () => {
    const out = html(
      <MaskedConfigProvider config={{ linkComponent: FakeLink }}>
        <MaskedFooter columns={columns} />
      </MaskedConfigProvider>
    )
    expect(out.match(/data-fake-link="true"/g)).toHaveLength(2)
  })

  it('tokens com colorTheme; props da API não vazam', () => {
    const out = html(<MaskedFooter variant="centered" colorTheme="baseBlue" brand="x" />)
    expect(out).toContain('--mc-footer-bg:')
    for (const leaked of ['variant=', 'colortheme=', 'navlabel=', '$']) {
      expect(out.toLowerCase()).not.toContain(leaked)
    }
  })
})

describe('MaskedPageHeader', () => {
  it('título é h1 por padrão; headingLevel={2} vira h2', () => {
    expect(html(<MaskedPageHeader title="Clientes" />)).toMatch(/<h1[^>]*>Clientes<\/h1>/)
    expect(html(<MaskedPageHeader title="Clientes" headingLevel={2} />)).toMatch(/<h2/)
  })

  it('breadcrumbs, descrição e ações nos seus slots', () => {
    const out = html(
      <MaskedPageHeader
        title="T"
        description="Descrição"
        breadcrumbs={<nav aria-label="Breadcrumb">crumbs</nav>}
        actions={<button type="button">Novo</button>}
      />
    )
    expect(out).toContain('Descrição')
    expect(out).toContain('<nav aria-label="Breadcrumb">crumbs</nav>')
    expect(out).toContain('<button type="button">Novo</button>')
  })
})

describe('MaskedHeader', () => {
  const links = [
    { label: 'Início', href: '/', active: true },
    { label: 'Preços', href: '/precos' }
  ]

  it('landmarks e semântica: <header>, nav rotulado, aria-current no ativo', () => {
    const out = html(<MaskedHeader brand="Acme" links={links} />)
    const bar = visiblePart(out)
    expect(out).toMatch(/^<header/)
    expect(bar).toContain('aria-label="Principal"')
    expect(bar.match(/aria-current="page"/g)).toHaveLength(1)
    expect(bar).toMatch(/<a[^>]*aria-current="page"[^>]*>Início<\/a>/)
  })

  it('botão do menu: fechado por padrão, rótulo por locale; painel do menu inert e aria-hidden', () => {
    const pt = html(<MaskedHeader links={links} />)
    expect(pt).toContain('aria-label="Abrir menu"')
    expect(pt).toContain('aria-expanded="false"')
    expect(pt).toContain('aria-haspopup="dialog"')
    expect(pt).toContain(DRAWER_CLOSED)
    expect(pt).not.toContain('aria-hidden="false"')
    const en = html(
      <MaskedConfigProvider config={{ locale: 'en' }}>
        <MaskedHeader links={links} />
      </MaskedConfigProvider>
    )
    expect(en).toContain('aria-label="Open menu"')
    expect(en).toContain('aria-label="Main"')
  })

  it('sem links nem ações: não renderiza botão de menu', () => {
    const out = html(<MaskedHeader brand="Acme" />)
    expect(out).not.toContain('aria-haspopup')
  })

  it('actions: uma cópia na barra e outra dentro do menu mobile (esta inert enquanto fechado)', () => {
    const out = html(<MaskedHeader links={links} actions={<button type="button">Entrar</button>} />)
    expect(visiblePart(out).match(/Entrar/g)).toHaveLength(1)
    expect(out.match(/Entrar/g)).toHaveLength(2)
  })

  it('usa o linkComponent; tokens inline; props da API não vazam', () => {
    const out = html(
      <MaskedConfigProvider config={{ linkComponent: FakeLink }}>
        <MaskedHeader
          variant="sticky"
          colorTheme="baseBlue"
          links={links}
          menuBreakpoint="desktop"
        />
      </MaskedConfigProvider>
    )
    expect(visiblePart(out).match(/data-fake-link="true"/g)).toHaveLength(2)
    expect(out).toContain('--mc-header-bg:')
    for (const leaked of ['variant=', 'colortheme=', 'menubreakpoint=', 'contained=', '$']) {
      expect(out.toLowerCase()).not.toContain(leaked)
    }
  })
})

describe('MaskedSidebar', () => {
  const items = [
    { id: 'home', label: 'Início', href: '/', icon: <i>H</i> },
    { id: 'users', label: 'Clientes', icon: <i>U</i>, badge: '3' },
    { id: 'off', label: 'Desativado', disabled: true }
  ]

  it('aside > nav rotulado; item ativo com aria-current; href vira link, sem href vira botão', () => {
    const out = html(<MaskedSidebar items={items} defaultActiveId="home" />)
    expect(out).toMatch(/^<aside/)
    expect(out).toContain('aria-label="Navegação lateral"')
    expect(out.match(/aria-current="page"/g)).toHaveLength(1)
    expect(out).toMatch(/<a[^>]*href="\/"[^>]*>/)
    expect(out).toMatch(/<button[^>]*type="button"[^>]*>/)
  })

  it('activeId controlado vence o defaultActiveId', () => {
    const out = html(<MaskedSidebar items={items} activeId="users" defaultActiveId="home" />)
    expect(out).toMatch(/<button[^>]*aria-current="page"[^>]*>/)
    expect(out).not.toMatch(/<a[^>]*aria-current/)
  })

  it('item desabilitado vira botão disabled (mesmo com href)', () => {
    const out = html(
      <MaskedSidebar items={[{ id: 'x', label: 'X', href: '/x', disabled: true }]} />
    )
    expect(out).toMatch(/<button[^>]*disabled/)
    expect(out).not.toContain('href="/x"')
  })

  it('expandida: botão de recolher com aria-expanded=true e badge visível', () => {
    const out = html(<MaskedSidebar items={items} />)
    expect(out).toContain('aria-label="Recolher menu"')
    expect(out).toContain('aria-expanded="true"')
    expect(out).toContain('>3<')
  })

  it('recolhida: labels continuam no DOM (leitor de tela), title no item, badge some, botão vira "Expandir"', () => {
    const out = html(<MaskedSidebar items={items} defaultCollapsed />)
    expect(out).toContain('aria-label="Expandir menu"')
    expect(out).toContain('aria-expanded="false"')
    expect(out).toContain('title="Clientes"')
    expect(out).toContain('Clientes')
    expect(out).not.toContain('>3<')
  })

  it('collapsible={false}: sem botão de recolher', () => {
    expect(html(<MaskedSidebar items={items} collapsible={false} />)).not.toContain('aria-expanded')
  })

  it('mobileOpen definido: aside + painel do Drawer (inert enquanto fechado); sem ele, só o aside', () => {
    const withDrawer = html(<MaskedSidebar items={items} mobileOpen={false} width="300px" />)
    expect(withDrawer).toContain(DRAWER_CLOSED)
    expect(visiblePart(withDrawer).match(/Início/g)).toHaveLength(1)
    expect(withDrawer).toContain('--mc-sidebar-width:300px')
    const without = html(<MaskedSidebar items={items} />)
    expect(without).not.toContain('role="dialog"')
    expect(without.match(/Início/g)).toHaveLength(1)
  })

  it('usa o linkComponent; props da API não vazam', () => {
    const out = html(
      <MaskedConfigProvider config={{ linkComponent: FakeLink }}>
        <MaskedSidebar items={items} variant="floating" colorTheme="baseBlue" />
      </MaskedConfigProvider>
    )
    expect(out.match(/data-fake-link="true"/g)).toHaveLength(1)
    for (const leaked of [
      'variant=',
      'colortheme=',
      'collapsible=',
      'mobileopen=',
      'defaultcollapsed=',
      '$'
    ]) {
      expect(out.toLowerCase()).not.toContain(leaked)
    }
  })
})

describe('MaskedShell', () => {
  it('<main id> como alvo do link de pular; link em pt/en', () => {
    const out = html(<MaskedShell>conteúdo</MaskedShell>)
    expect(out).toMatch(/<main[^>]*id="main-content"[^>]*>conteúdo<\/main>/)
    expect(out).toContain('href="#main-content"')
    expect(out).toContain('Pular para o conteúdo')
    const en = html(
      <MaskedConfigProvider config={{ locale: 'en' }}>
        <MaskedShell mainId="app">x</MaskedShell>
      </MaskedConfigProvider>
    )
    expect(en).toContain('Skip to content')
    expect(en).toContain('href="#app"')
  })

  it('slots: header, sidebar e footer renderizados nas suas áreas', () => {
    const out = html(
      <MaskedShell
        variant="app"
        header={<header>H</header>}
        sidebar={<aside>S</aside>}
        footer={<footer>F</footer>}
      >
        M
      </MaskedShell>
    )
    for (const part of [
      '<header>H</header>',
      '<aside>S</aside>',
      '<footer>F</footer>',
      '>M</main>'
    ]) {
      expect(out).toContain(part)
    }
  })

  it('site e centered ignoram a sidebar; split e app a mostram', () => {
    const sidebar = <aside>PAINEL</aside>
    expect(
      html(
        <MaskedShell variant="site" sidebar={sidebar}>
          x
        </MaskedShell>
      )
    ).not.toContain('PAINEL')
    expect(
      html(
        <MaskedShell variant="centered" sidebar={sidebar}>
          x
        </MaskedShell>
      )
    ).not.toContain('PAINEL')
    expect(
      html(
        <MaskedShell variant="split" sidebar={sidebar}>
          x
        </MaskedShell>
      )
    ).toContain('PAINEL')
    expect(
      html(
        <MaskedShell variant="app" sidebar={sidebar}>
          x
        </MaskedShell>
      )
    ).toContain('PAINEL')
  })

  it('tokens de fundo/texto da página inline; props da API não vazam', () => {
    const out = html(<MaskedShell colorTheme="baseBlue">x</MaskedShell>)
    expect(out).toContain('--mc-shell-bg:')
    expect(out).toContain('--mc-shell-fg:')
    for (const leaked of ['variant=', 'colortheme=', 'mainid=', 'skiplinklabel=', '$']) {
      expect(out.toLowerCase()).not.toContain(leaked)
    }
  })
})
