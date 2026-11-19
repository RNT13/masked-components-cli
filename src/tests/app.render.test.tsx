import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import React from 'react'
import { ThemeProvider } from 'styled-components'
import { maskedTheme } from '../../templates/masked-themes/MaskedThemes/MaskedThemes'
import { MaskedConfigProvider } from '../../templates/masked-config/MaskedConfigProvider'
import { MaskedBadge } from '../../templates/masked-app/MaskedBadge/MaskedBadge'
import { MaskedAvatar } from '../../templates/masked-app/MaskedAvatar/MaskedAvatar'
import { MaskedTooltip } from '../../templates/masked-app/MaskedTooltip/MaskedTooltip'
import { MaskedBreadcrumb } from '../../templates/masked-app/MaskedBreadcrumb/MaskedBreadcrumb'
import { MaskedEmptyState } from '../../templates/masked-app/MaskedEmptyState/MaskedEmptyState'
import { MaskedTabs } from '../../templates/masked-app/MaskedTabs/MaskedTabs'
import { MaskedAccordion } from '../../templates/masked-app/MaskedAccordion/MaskedAccordion'
import { MaskedPagination } from '../../templates/masked-app/MaskedPagination/MaskedPagination'
import { MaskedStepper } from '../../templates/masked-app/MaskedStepper/MaskedStepper'
import { MaskedTable } from '../../templates/masked-app/MaskedTable/MaskedTable'
import { MaskedDashboard } from '../../templates/masked-app/MaskedDashboard/MaskedDashboard'

const html = (node: React.ReactElement) =>
  renderToStaticMarkup(<ThemeProvider theme={maskedTheme}>{node}</ThemeProvider>)
const en = (node: React.ReactElement) =>
  html(<MaskedConfigProvider config={{ locale: 'en' }}>{node}</MaskedConfigProvider>)

function FakeLink(props: { href: string; className?: string; children?: React.ReactNode }) {
  return (
    <a data-fake-link="true" href={props.href} className={props.className}>
      {props.children}
    </a>
  )
}

describe('MaskedBadge', () => {
  it('é um <span> só com texto; dot não cria elemento extra (ponto é pseudo-elemento)', () => {
    const out = html(<MaskedBadge variant="dot">Offline</MaskedBadge>)
    expect(out).toMatch(/^<span[^>]*>Offline<\/span>$/)
  })

  it('`as` troca o elemento; tokens inline; props da API não vazam', () => {
    const out = html(
      <MaskedBadge as="strong" variant="solid" size="sm" colorTheme="baseGreen">
        Ativo
      </MaskedBadge>
    )
    expect(out).toMatch(/^<strong/)
    expect(out).toContain('--mc-badge-bg:')
    for (const leaked of ['variant=', 'size=', 'colortheme=', '$']) {
      expect(out.toLowerCase()).not.toContain(leaked)
    }
  })
})

describe('MaskedAvatar', () => {
  it('com imagem: <img> com alt (default = name); sem imagem: iniciais com role=img e nome', () => {
    const withImage = html(<MaskedAvatar name="Ana Souza" src="/ana.jpg" />)
    expect(withImage).toMatch(/<img[^>]*alt="Ana Souza"/)
    expect(withImage).not.toContain('role="img"')
    const initials = html(<MaskedAvatar name="Ana Souza" />)
    expect(initials).toContain('role="img"')
    expect(initials).toContain('aria-label="Ana Souza"')
    expect(initials).toContain('>AS<')
    expect(html(<MaskedAvatar name="Ana Souza" src="/a.jpg" alt="" />)).toContain('alt=""')
  })

  it('sem nome nem imagem: decorativo (aria-hidden)', () => {
    expect(html(<MaskedAvatar />)).toContain('aria-hidden="true"')
  })

  it('status: ponto decorativo + texto oculto por locale', () => {
    expect(html(<MaskedAvatar name="Ana" status="online" />)).toContain('>Online<')
    expect(html(<MaskedAvatar name="Ana" status="away" />)).toContain('>Ausente<')
    expect(en(<MaskedAvatar name="Ana" status="busy" />)).toContain('>Busy<')
  })

  it('usa o imageComponent do config e o tamanho nomeado/numérico', () => {
    function FakeImage(props: { src: string; alt: string; width?: number }) {
      return <img data-fake-image="true" src={props.src} alt={props.alt} width={props.width} />
    }
    const out = html(
      <MaskedConfigProvider config={{ imageComponent: FakeImage }}>
        <MaskedAvatar name="Ana" src="/a.jpg" size="lg" />
      </MaskedConfigProvider>
    )
    expect(out).toContain('data-fake-image="true"')
    expect(out).toContain('width="56"')
    expect(html(<MaskedAvatar name="Ana" src="/a.jpg" size={52} />)).toMatch(/<img[^>]*width="52"/)
  })
})

describe('MaskedTooltip', () => {
  it('fechado: só o filho, sem balão e sem aria-describedby', () => {
    const out = html(
      <MaskedTooltip content="Excluir">
        <button type="button">🗑</button>
      </MaskedTooltip>
    )
    expect(out).toContain('<button type="button">🗑</button>')
    expect(out).not.toContain('role="tooltip"')
    expect(out).not.toContain('aria-describedby')
  })

  it('disabled: renderiza só o filho, sem wrapper', () => {
    expect(
      html(
        <MaskedTooltip content="x" disabled>
          <button type="button">ok</button>
        </MaskedTooltip>
      )
    ).toBe('<button type="button">ok</button>')
  })
})

describe('MaskedBreadcrumb', () => {
  const items = [
    { label: 'Início', href: '/' },
    { label: 'Clientes', href: '/clientes' },
    { label: 'Ana' }
  ]

  it('nav rotulado > ol; último é a página atual sem link; separadores decorativos', () => {
    const out = html(<MaskedBreadcrumb items={items} />)
    expect(out).toMatch(/<nav[^>]*aria-label="Trilha de navegação"/)
    expect(out).toMatch(/<ol/)
    expect(out.match(/<a[ >]/g)).toHaveLength(2)
    expect(out).toMatch(/<span[^>]*aria-current="page"[^>]*>Ana<\/span>/)
    expect(out.match(/aria-hidden="true"[^>]*>\//g)).toHaveLength(2)
  })

  it('rótulo por locale e customizado; linkComponent do config', () => {
    expect(en(<MaskedBreadcrumb items={items} />)).toContain('aria-label="Breadcrumb"')
    expect(html(<MaskedBreadcrumb items={items} label="Onde estou" />)).toContain(
      'aria-label="Onde estou"'
    )
    const out = html(
      <MaskedConfigProvider config={{ linkComponent: FakeLink }}>
        <MaskedBreadcrumb items={items} />
      </MaskedConfigProvider>
    )
    expect(out.match(/data-fake-link="true"/g)).toHaveLength(2)
  })

  it('compact/maxItems: itens do meio viram … (aria-hidden)', () => {
    const many = [...items, { label: 'D', href: '/d' }, { label: 'E' }]
    const out = html(<MaskedBreadcrumb variant="compact" items={many} />)
    expect(out).toContain('>…<')
    expect(out).not.toContain('Clientes')
    expect(out).toContain('Início')
    expect(out).toContain('>E<')
  })
})

describe('MaskedEmptyState', () => {
  it('título é h3 por padrão; ícone decorativo; descrição e ação', () => {
    const out = html(
      <MaskedEmptyState
        icon="🔍"
        title="Nada encontrado"
        description="Tente outro termo"
        action={<button type="button">Limpar</button>}
      />
    )
    expect(out).toMatch(/<h3[^>]*>Nada encontrado<\/h3>/)
    expect(out).toMatch(/aria-hidden="true"[^>]*>🔍/)
    expect(out).toContain('Tente outro termo')
    expect(out).toContain('<button type="button">Limpar</button>')
    expect(html(<MaskedEmptyState title="x" headingLevel={2} />)).toMatch(/<h2/)
  })

  it('role repassado (ex.: alert); props da API não vazam', () => {
    const out = html(
      <MaskedEmptyState variant="error" role="alert" colorTheme="baseRed" title="Falhou" />
    )
    expect(out).toContain('role="alert"')
    for (const leaked of ['variant=', 'colortheme=', 'headinglevel=', '$']) {
      expect(out.toLowerCase()).not.toContain(leaked)
    }
  })
})

describe('MaskedTabs', () => {
  const items = [
    { id: 'a', label: 'Dados', content: 'Painel A' },
    { id: 'b', label: 'Agenda', content: 'Painel B' },
    { id: 'c', label: 'Extra', content: 'Painel C', disabled: true }
  ]

  it('tablist > tab (aria-selected/controls) e tabpanel (aria-labelledby); só o painel ativo visível', () => {
    const out = html(<MaskedTabs label="Cliente" items={items} />)
    expect(out).toContain('role="tablist"')
    expect(out).toContain('aria-label="Cliente"')
    expect(out).toContain('aria-orientation="horizontal"')
    expect(out.match(/role="tab"/g)).toHaveLength(3)
    expect(out.match(/aria-selected="true"/g)).toHaveLength(1)
    expect(out.match(/role="tabpanel"/g)).toHaveLength(3)
    expect(out.match(/<div[^>]*role="tabpanel"[^>]*hidden/g)).toHaveLength(2)
    const controls = [...out.matchAll(/aria-controls="([^"]+)"/g)].map((m) => m[1])
    for (const id of controls) expect(out).toContain(`id="${id}"`)
  })

  it('roving tabindex: só a aba selecionada é tabbable; desabilitada fica disabled', () => {
    const out = html(<MaskedTabs items={items} defaultValue="b" />)
    expect(out.match(/tabindex="0"[^>]*role="tab"|role="tab"[^>]*tabindex="0"/g)).toHaveLength(1)
    expect(out).toMatch(/<button[^>]*role="tab"[^>]*aria-selected="true"[^>]*>Agenda/)
    expect(out).toMatch(/<button[^>]*disabled[^>]*>Extra/)
  })

  it('value controlado vence defaultValue; vertical muda aria-orientation; lazy esvazia painéis inativos', () => {
    expect(html(<MaskedTabs items={items} value="b" defaultValue="a" />)).toMatch(
      /aria-selected="true"[^>]*>Agenda/
    )
    expect(html(<MaskedTabs variant="vertical" items={items} />)).toContain(
      'aria-orientation="vertical"'
    )
    const lazy = html(<MaskedTabs lazy items={items} />)
    expect(lazy).toContain('Painel A')
    expect(lazy).not.toContain('Painel B')
  })
})

describe('MaskedAccordion', () => {
  const items = [
    { id: 'a', title: 'Plano', content: 'Detalhes A' },
    { id: 'b', title: 'Cobrança', content: 'Detalhes B', disabled: true }
  ]

  it('heading > button (aria-expanded/controls) e region rotulada pelo botão', () => {
    const out = html(<MaskedAccordion items={items} defaultValue={['a']} />)
    expect(out.match(/<h3/g)).toHaveLength(2)
    expect(out).toMatch(/<button[^>]*aria-expanded="true"[^>]*>/)
    expect(out).toMatch(/<button[^>]*aria-expanded="false"[^>]*disabled/)
    expect(out.match(/role="region"/g)).toHaveLength(2)
    const ids = [...out.matchAll(/aria-controls="([^"]+)"/g)].map((m) => m[1])
    for (const id of ids) expect(out).toContain(`id="${id}"`)
    expect(out.match(/<div[^>]*role="region"[^>]*hidden/g)).toHaveLength(1)
  })

  it('headingLevel troca o nível; value controlado vence defaultValue', () => {
    expect(html(<MaskedAccordion items={items} headingLevel={2} />)).toMatch(/<h2/)
    const out = html(<MaskedAccordion items={items} value={[]} defaultValue={['a']} />)
    expect(out).not.toContain('aria-expanded="true"')
  })
})

describe('MaskedPagination', () => {
  it('nav rotulado; atual com aria-current; itens com rótulo completo; anterior desabilitada na 1ª', () => {
    const out = html(<MaskedPagination pageCount={10} defaultPage={1} />)
    expect(out).toMatch(/<nav[^>]*aria-label="Paginação"/)
    expect(out.match(/aria-current="page"/g)).toHaveLength(1)
    expect(out).toMatch(/aria-current="page"[^>]*>1</)
    expect(out).toContain('aria-label="Página 2"')
    expect(out).toMatch(/<button[^>]*aria-label="Página anterior"[^>]*disabled/)
    expect(out).not.toMatch(/<button[^>]*aria-label="Próxima página"[^>]*disabled/)
    expect(out).toContain('>…<')
  })

  it('na última página a próxima fica desabilitada; edges adiciona primeira/última', () => {
    const out = html(<MaskedPagination variant="edges" pageCount={3} page={3} />)
    expect(out).toMatch(/<button[^>]*aria-label="Próxima página"[^>]*disabled/)
    expect(out).toMatch(/<button[^>]*aria-label="Última página"[^>]*disabled/)
    expect(out).toContain('aria-label="Primeira página"')
  })

  it('compact mostra "Página X de Y" em região viva; en traduz', () => {
    const out = html(<MaskedPagination variant="compact" pageCount={8} page={3} />)
    expect(out).toContain('Página 3 de 8')
    expect(out).toContain('aria-live="polite"')
    expect(en(<MaskedPagination variant="compact" pageCount={8} page={3} />)).toContain(
      'Page 3 of 8'
    )
  })

  it('hrefBuilder: itens viram links reais (linkComponent) e desabilitados ficam aria-disabled', () => {
    const out = html(
      <MaskedConfigProvider config={{ linkComponent: FakeLink }}>
        <MaskedPagination pageCount={4} page={1} hrefBuilder={(p) => `/lista?page=${p}`} />
      </MaskedConfigProvider>
    )
    expect(out).toContain('href="/lista?page=2"')
    expect(out).toContain('data-fake-link="true"')
    expect(out).toMatch(
      /aria-label="Página anterior"[^>]*aria-disabled="true"|aria-disabled="true"[^>]*aria-label="Página anterior"/
    )
  })

  it('page fora do intervalo é limitado', () => {
    expect(html(<MaskedPagination pageCount={3} page={99} />)).toMatch(
      /aria-current="page"[^>]*>3</
    )
  })
})

describe('MaskedStepper', () => {
  const steps = [
    { label: 'Dados' },
    { label: 'Pagamento', description: 'Cartão ou PIX' },
    { label: 'Fim' }
  ]

  it('lista ordenada; atual com aria-current=step; status em texto oculto em todos', () => {
    const out = html(<MaskedStepper steps={steps} current={1} />)
    expect(out).toMatch(/<ol[^>]*aria-label="Etapas"/)
    expect(out.match(/aria-current="step"/g)).toHaveLength(1)
    expect(out).toContain('>Concluído<')
    expect(out).toContain('>Atual<')
    expect(out).toContain('>Pendente<')
    expect(out).toContain('Cartão ou PIX')
    expect(en(<MaskedStepper steps={steps} current={1} />)).toContain('>Completed<')
  })

  it('só informativo sem onStepClick; com ele, passos alcançados viram botões', () => {
    expect(html(<MaskedStepper steps={steps} current={1} />)).not.toContain('<button')
    const out = html(<MaskedStepper steps={steps} current={1} onStepClick={() => {}} />)
    expect(out.match(/<button/g)).toHaveLength(2)
  })

  it('progress: progressbar com valuenow e valuetext', () => {
    const out = html(<MaskedStepper variant="progress" steps={steps} current={1} />)
    expect(out).toContain('role="progressbar"')
    expect(out).toContain('aria-valuenow="2"')
    expect(out).toContain('aria-valuemax="3"')
    expect(out).toContain('aria-valuetext="Passo 2 de 3: Pagamento"')
    expect(out).not.toContain('<ol')
  })

  it('dots: só o rótulo atual é visível; os demais ficam em texto oculto', () => {
    const out = html(<MaskedStepper variant="dots" steps={steps} current={0} />)
    expect(out).toContain('Dados')
    expect(out).toContain('Pagamento')
    expect(out).toContain('Fim')
  })
})

describe('MaskedTable', () => {
  type Row = { id: number; nome: string; plano: string }
  const data: Row[] = [
    { id: 1, nome: 'Bia', plano: 'Pro' },
    { id: 2, nome: 'Ana', plano: 'Grátis' }
  ]
  const columns = [
    { key: 'nome', header: 'Nome', sortable: true, rowHeader: true },
    { key: 'plano', header: 'Plano' }
  ]

  it('table real: caption oculta, th scope=col/row, região rolável focável e rotulada', () => {
    const out = html(
      <MaskedTable<Row> caption="Clientes" rowKey="id" data={data} columns={columns} />
    )
    expect(out).toMatch(/<table/)
    expect(out).toMatch(/<caption[^>]*>Clientes<\/caption>/)
    expect(out.match(/<th[^>]*scope="col"/g)).toHaveLength(2)
    expect(out.match(/<th[^>]*scope="row"/g)).toHaveLength(2)
    expect(out).toContain('role="region"')
    expect(out).toContain('aria-label="Clientes"')
    expect(out).toContain('tabindex="0"')
  })

  it('coluna ordenável: botão + aria-sort; defaultSort ordena e marca a direção', () => {
    const out = html(
      <MaskedTable<Row>
        rowKey="id"
        data={data}
        columns={columns}
        defaultSort={{ key: 'nome', direction: 'asc' }}
      />
    )
    expect(out).toMatch(/aria-sort="ascending"/)
    expect(out.match(/<button/g)).toHaveLength(1)
    expect(out.indexOf('Ana')).toBeLessThan(out.indexOf('Bia'))
    const none = html(<MaskedTable<Row> rowKey="id" data={data} columns={columns} />)
    expect(none).toMatch(/aria-sort="none"/)
    expect(none.indexOf('Bia')).toBeLessThan(none.indexOf('Ana'))
  })

  it('manualSort não reordena; rowKey por função', () => {
    const out = html(
      <MaskedTable<Row>
        rowKey={(row) => `r-${row.id}`}
        data={data}
        columns={columns}
        manualSort
        defaultSort={{ key: 'nome', direction: 'asc' }}
      />
    )
    expect(out.indexOf('Bia')).toBeLessThan(out.indexOf('Ana'))
  })

  it('loading: aria-busy e linhas de skeleton (decorativas); sem dados reais', () => {
    const out = html(
      <MaskedTable<Row> rowKey="id" data={data} columns={columns} loading loadingRows={3} />
    )
    expect(out).toContain('aria-busy="true"')
    /* 3 linhas x 2 colunas de skeleton + o ícone decorativo da coluna ordenável */
    expect(out.match(/aria-hidden="true"/g)).toHaveLength(3 * 2 + 1)
    expect(out).not.toContain('Bia')
  })

  it('vazio: mensagem por locale, personalizável, ocupando todas as colunas', () => {
    expect(html(<MaskedTable<Row> rowKey="id" data={[]} columns={columns} />)).toContain(
      'Nenhum registro encontrado'
    )
    expect(en(<MaskedTable<Row> rowKey="id" data={[]} columns={columns} />)).toContain(
      'No records found'
    )
    const custom = html(
      <MaskedTable<Row> rowKey="id" data={[]} columns={columns} empty="Sem clientes" />
    )
    expect(custom).toContain('Sem clientes')
    expect(custom.toLowerCase()).toContain('colspan="2"')
  })

  it('onRowClick: linhas focáveis; props da API não vazam', () => {
    const out = html(
      <MaskedTable<Row>
        variant="striped"
        rowKey="id"
        data={data}
        columns={columns}
        onRowClick={() => {}}
        maxHeight="300px"
        colorTheme="baseBlue"
      />
    )
    expect(out.match(/<tr[^>]*tabindex="0"/g)).toHaveLength(2)
    expect(out).toContain('max-height:300px')
    for (const leaked of ['variant=', 'rowkey=', 'maxheight=', 'colortheme=', 'onrowclick=']) {
      expect(out.toLowerCase()).not.toContain(leaked)
    }
  })
})

describe('MaskedDashboard', () => {
  const navItems = [
    { id: 'home', label: 'Início', href: '/' },
    { id: 'clientes', label: 'Clientes' }
  ]

  it('compõe shell + topbar + sidebar + cabeçalho de página; um h1; conteúdo dentro de <main>', () => {
    const out = html(
      <MaskedDashboard
        brand="Zandry"
        navItems={navItems}
        title="Painel"
        description="Visão geral"
        topbar={<span>Ana</span>}
      >
        <p>widgets</p>
      </MaskedDashboard>
    )
    expect(out).toContain('href="#main-content"')
    expect(out.match(/<h1/g)).toHaveLength(1)
    expect(out).toMatch(/<main[^>]*id="main-content"/)
    expect(out).toMatch(/<aside/)
    expect(out).toContain('<span>Ana</span>')
    expect(out).toContain('widgets')
    expect(out.indexOf('<h1')).toBeLessThan(out.indexOf('widgets'))
  })

  it('sem title: não renderiza o cabeçalho de página', () => {
    expect(html(<MaskedDashboard navItems={navItems}>x</MaskedDashboard>)).not.toMatch(/<h1/)
  })

  it('botão do menu mobile: fechado, rótulo por locale, e o Drawer da sidebar fica inert', () => {
    const pt = html(<MaskedDashboard navItems={navItems} />)
    expect(pt).toContain('aria-label="Abrir menu de navegação"')
    expect(pt).toContain('aria-expanded="false"')
    expect(pt).toContain('<div role="dialog" aria-modal="true" aria-hidden="true" inert=""')
    expect(en(<MaskedDashboard navItems={navItems} />)).toContain(
      'aria-label="Open navigation menu"'
    )
  })

  it('variants escolhem sidebar e cabeçalho; tokens da barra superior; props não vazam', () => {
    const out = html(
      <MaskedDashboard
        variant="saas"
        colorTheme="baseBlue"
        contentWidth="full"
        navItems={navItems}
        title="T"
      />
    )
    expect(out).toContain('--mc-dashboard-topbar-bg:')
    expect(out).toContain('--mc-page-header-bg:')
    for (const leaked of [
      'variant=',
      'navitems=',
      'contentwidth=',
      'colortheme=',
      'sidebarfooter='
    ]) {
      expect(out.toLowerCase()).not.toContain(leaked)
    }
  })

  it('linkComponent do config chega nos itens da sidebar', () => {
    const out = html(
      <MaskedConfigProvider config={{ linkComponent: FakeLink }}>
        <MaskedDashboard navItems={navItems} />
      </MaskedConfigProvider>
    )
    expect(out).toContain('data-fake-link="true"')
  })
})
