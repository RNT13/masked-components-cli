import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import React from 'react'
import { ThemeProvider } from 'styled-components'
import { maskedTheme } from '../../templates/masked-themes/MaskedThemes/MaskedThemes'
import { MaskedConfigProvider } from '../../templates/masked-config/MaskedConfigProvider'
import { MaskedSlider } from '../../templates/masked-forms/MaskedSlider/MaskedSlider'
import { MaskedRating } from '../../templates/masked-forms/MaskedRating/MaskedRating'
import { MaskedDatePicker } from '../../templates/masked-forms/MaskedDatePicker/MaskedDatePicker'
import { MaskedCommandPalette } from '../../templates/masked-forms/MaskedCommandPalette/MaskedCommandPalette'
import { MaskedTeam } from '../../templates/masked-marketing/MaskedTeam/MaskedTeam'
import { MaskedContact } from '../../templates/masked-marketing/MaskedContact/MaskedContact'
import { MaskedPopup } from '../../templates/masked-popup/MaskedPopup/MaskedPopup'
import { MaskedDrawer } from '../../templates/masked-drawer/MaskedDrawer/MaskedDrawer'
import { MaskedHeader } from '../../templates/masked-page/MaskedHeader/MaskedHeader'
import { MaskedSidebar } from '../../templates/masked-page/MaskedSidebar/MaskedSidebar'

const html = (node: React.ReactElement) =>
  renderToStaticMarkup(<ThemeProvider theme={maskedTheme}>{node}</ThemeProvider>)
const en = (node: React.ReactElement) =>
  html(<MaskedConfigProvider config={{ locale: 'en' }}>{node}</MaskedConfigProvider>)

function FakeLink({
  children,
  ...props
}: {
  href: string
  className?: string
  children?: React.ReactNode
}) {
  return (
    <a data-fake-link="true" {...props}>
      {children}
    </a>
  )
}

describe('MaskedSlider', () => {
  it('input range nativo com label real ligado, min/max/step e valor em <output>', () => {
    const out = html(
      <MaskedSlider label="Volume" showValue defaultValue={30} min={0} max={50} step={5} />
    )
    const id = /<input[^>]*id="([^"]+)"/.exec(out)?.[1]
    expect(id).toBeTruthy()
    expect(out).toMatch(new RegExp(`<label[^>]*for="${id}"[^>]*>Volume</label>`))
    expect(out).toMatch(/<input[^>]*type="range"/)
    expect(out).toContain('min="0"')
    expect(out).toContain('max="50"')
    expect(out).toContain('step="5"')
    expect(out).toContain('value="30"')
    expect(out).toMatch(new RegExp(`<output[^>]*for="${id}"[^>]*>30</output>`))
  })

  it('formatValue alimenta o <output> e o aria-valuetext', () => {
    const out = html(
      <MaskedSlider
        aria-label="Opacidade"
        showValue
        defaultValue={40}
        formatValue={(v) => `${v}%`}
      />
    )
    expect(out).toContain('aria-valuetext="40%"')
    expect(out).toContain('>40%</output>')
  })

  it('props nativas vão para o input (name, disabled, aria-label); classe vai para o contêiner', () => {
    const out = html(<MaskedSlider aria-label="Preço" name="preco" disabled className="x" />)
    expect(out).toMatch(/<input[^>]*name="preco"/)
    expect(out).toMatch(/<input[^>]*disabled/)
    expect(out).toMatch(/<input[^>]*aria-label="Preço"/)
    expect(out).toMatch(/^<div[^>]*class="[^"]*x/)
  })

  it('steps: marcas decorativas (aria-hidden); filled/default não têm marcas; tokens inline', () => {
    const steps = html(<MaskedSlider variant="steps" aria-label="n" min={0} max={10} step={5} />)
    expect(steps.match(/<span/g)).toHaveLength(3)
    expect(steps).toContain('aria-hidden="true"')
    expect(html(<MaskedSlider variant="filled" aria-label="n" />)).not.toContain('aria-hidden')
    const out = html(<MaskedSlider aria-label="n" colorTheme="baseBlue" defaultValue={25} />)
    expect(out).toContain('--mc-slider-percent:25%')
    expect(out).toContain('--mc-slider-accent:')
    for (const leaked of ['variant=', 'colortheme=', 'showvalue=', 'formatvalue=', '$']) {
      expect(out.toLowerCase()).not.toContain(leaked)
    }
  })

  it('value controlado vence defaultValue', () => {
    expect(html(<MaskedSlider aria-label="n" value={70} defaultValue={10} />)).toContain(
      'value="70"'
    )
  })
})

describe('MaskedRating', () => {
  it('grupo de rádios nomeado, com o mesmo name e rótulo "n de max" em cada opção', () => {
    const out = html(<MaskedRating label="Atendimento" defaultValue={3} />)
    expect(out).toContain('role="radiogroup"')
    expect(out).toContain('aria-label="Atendimento"')
    expect(out.match(/type="radio"/g)).toHaveLength(5)
    const names = [...out.matchAll(/<input[^>]*name="([^"]+)"/g)].map((m) => m[1])
    expect(new Set(names).size).toBe(1)
    expect(out).toContain('aria-label="1 de 5"')
    expect(out).toContain('aria-label="5 de 5"')
    expect(out.match(/<input[^>]*checked/g)).toHaveLength(1)
    expect(out).toMatch(
      /<input[^>]*aria-label="3 de 5"[^>]*checked|<input[^>]*checked[^>]*aria-label="3 de 5"/
    )
  })

  it('glifos por forma: ★ cheio e ☆ vazio; hearts e numbers', () => {
    const stars = html(<MaskedRating defaultValue={2} />)
    expect(stars.match(/★/g)).toHaveLength(2)
    expect(stars.match(/☆/g)).toHaveLength(3)
    expect(html(<MaskedRating variant="hearts" defaultValue={1} />)).toContain('♥')
    const numbers = html(<MaskedRating variant="numbers" max={10} defaultValue={4} />)
    expect(numbers.match(/type="radio"/g)).toHaveLength(10)
    expect(numbers).toContain('>10<')
  })

  it('somente leitura: imagem com nome acessível, sem rádios; nota é arredondada e limitada', () => {
    const out = html(<MaskedRating readOnly value={4} />)
    expect(out).toContain('role="img"')
    expect(out).toContain('aria-label="Nota 4 de 5"')
    expect(out).not.toContain('type="radio"')
    expect(html(<MaskedRating readOnly value={9} />)).toContain('aria-label="Nota 5 de 5"')
    expect(html(<MaskedRating readOnly value={0} />)).toContain('aria-label="Sem avaliação"')
    expect(html(<MaskedRating readOnly value={4} label="Atendimento" />)).toContain(
      'aria-label="Atendimento: Nota 4 de 5"'
    )
  })

  it('locale en e name explícito; props da API não vazam', () => {
    expect(en(<MaskedRating readOnly value={3} />)).toContain('aria-label="Rating: 3 of 5"')
    expect(en(<MaskedRating />)).toContain('aria-label="Rating"')
    const out = html(<MaskedRating name="nota" colorTheme="baseBlue" allowClear size="lg" />)
    expect(out).toContain('name="nota"')
    for (const leaked of ['variant=', 'allowclear=', 'colortheme=', 'readonly=', 'size=', '$']) {
      expect(out.toLowerCase()).not.toContain(leaked)
    }
  })
})

describe('MaskedDatePicker', () => {
  it('fechado: botão com aria-haspopup, nome = rótulo + valor, e campo oculto para <form>', () => {
    const out = html(<MaskedDatePicker label="Consulta" name="data" defaultValue="2026-11-20" />)
    expect(out).toMatch(/<button[^>]*aria-haspopup="dialog"/)
    expect(out).toContain('aria-expanded="false"')
    const labelledby = /<button[^>]*aria-labelledby="([^"]+)"/.exec(out)?.[1] ?? ''
    for (const id of labelledby.split(' ')) expect(out).toContain(`id="${id}"`)
    expect(out).toContain('type="hidden"')
    expect(out).toContain('name="data"')
    expect(out).toContain('value="2026-11-20"')
    expect(out).toContain('20 de nov. de 2026')
    expect(out).not.toContain('role="grid"')
  })

  it('sem valor: placeholder por locale; valor inválido também cai no placeholder', () => {
    expect(html(<MaskedDatePicker ariaLabel="Data" />)).toContain('Selecione uma data')
    expect(en(<MaskedDatePicker ariaLabel="Date" />)).toContain('Select a date')
    expect(html(<MaskedDatePicker ariaLabel="Data" value="2026-02-30" />)).toContain(
      'Selecione uma data'
    )
    expect(html(<MaskedDatePicker ariaLabel="Data" placeholder="Escolha" />)).toContain('Escolha')
  })

  it('inline: grade ARIA com cabeçalhos, 30 dias de novembro, selecionado e roving tabindex', () => {
    const out = html(
      <MaskedDatePicker variant="inline" ariaLabel="Agenda" defaultValue="2026-11-20" />
    )
    expect(out).toContain('role="group"')
    expect(out).toContain('aria-label="Agenda"')
    expect(out).toContain('role="grid"')
    expect(out).toContain('novembro de 2026')
    expect(out.match(/<th[^>]*scope="col"/g)).toHaveLength(7)
    expect(out).toMatch(/<th[^>]*abbr="domingo"/)
    expect(out.match(/data-iso="/g)).toHaveLength(30)
    expect(out.match(/<td[^>]*aria-selected="true"/g)).toHaveLength(1)
    expect(out).toMatch(
      /data-iso="2026-11-20"[^>]*tabindex="0"|tabindex="0"[^>]*data-iso="2026-11-20"/
    )
    expect(out.match(/tabindex="0"/g)).toHaveLength(1)
    expect(out).toContain('aria-label="sexta-feira, 20 de novembro de 2026"')
    expect(out).not.toContain('aria-haspopup')
  })

  it('weekStart muda a ordem dos dias; en traduz mês e botões', () => {
    const monday = html(
      <MaskedDatePicker variant="inline" ariaLabel="a" defaultValue="2026-11-20" weekStart={1} />
    )
    expect(monday).toMatch(/<th[^>]*abbr="segunda-feira"/)
    const english = en(
      <MaskedDatePicker variant="inline" ariaLabel="a" defaultValue="2026-11-20" />
    )
    expect(english).toContain('November 2026')
    expect(english).toContain('aria-label="Previous month"')
    expect(english).toContain('>Today<')
  })

  it('min/max/isDateDisabled: dias bloqueados ficam focáveis com aria-disabled', () => {
    const out = html(
      <MaskedDatePicker
        variant="inline"
        ariaLabel="a"
        defaultValue="2026-11-20"
        min="2026-11-10"
        max="2026-11-25"
        isDateDisabled={(d) => d === '2026-11-15'}
      />
    )
    expect(out.match(/aria-disabled="true"/g)).toHaveLength(9 + 5 + 1)
    expect(out.match(/<button[^>]*data-iso="[^"]+"[^>]*disabled(?!=)/g)).toBeNull()
  })

  it('limpar só aparece com data; clearable={false} esconde', () => {
    expect(
      html(<MaskedDatePicker variant="inline" ariaLabel="a" defaultValue="2026-11-20" />)
    ).toContain('>Limpar<')
    expect(html(<MaskedDatePicker variant="inline" ariaLabel="a" />)).not.toContain('>Limpar<')
    expect(
      html(
        <MaskedDatePicker
          variant="inline"
          ariaLabel="a"
          defaultValue="2026-11-20"
          clearable={false}
        />
      )
    ).not.toContain('>Limpar<')
  })

  it('props da API não vazam', () => {
    const out = html(
      <MaskedDatePicker
        variant="inline"
        ariaLabel="a"
        colorTheme="baseBlue"
        weekStart={1}
        min="2026-01-01"
      />
    )
    for (const leaked of ['variant=', 'weekstart=', 'colortheme=', 'datedisabled=', '$']) {
      expect(out.toLowerCase()).not.toContain(leaked)
    }
  })
})

describe('MaskedCommandPalette', () => {
  const items = [
    {
      id: 'novo',
      label: 'Novo cliente',
      group: 'Clientes',
      description: 'Cadastrar',
      shortcut: 'N',
      icon: '➕'
    },
    { id: 'lista', label: 'Lista de clientes', group: 'Clientes' },
    { id: 'config', label: 'Configurações', group: 'Conta' },
    { id: 'sair', label: 'Sair', disabled: true }
  ]

  it('fechada: não renderiza nada (sem cópia escondida no DOM)', () => {
    expect(html(<MaskedCommandPalette items={items} />)).toBe('')
  })

  it('aberta: combobox com aria-controls, listbox, grupos rotulados e opções', () => {
    const out = html(<MaskedCommandPalette items={items} defaultOpen />)
    expect(out).toMatch(/role="dialog"[^>]*aria-hidden="false"/)
    expect(out).toContain('aria-label="Paleta de comandos"')
    expect(out).toContain('role="combobox"')
    const controls =
      /role="combobox"[^>]*aria-controls="([^"]+)"|aria-controls="([^"]+)"[^>]*role="combobox"/.exec(
        out
      )
    const listId = controls?.[1] ?? controls?.[2]
    expect(out).toMatch(
      new RegExp(`id="${listId}"[^>]*role="listbox"|role="listbox"[^>]*id="${listId}"`)
    )
    expect(out).toContain('aria-expanded="true"')
    expect(out).toContain('aria-autocomplete="list"')
    expect(out.match(/role="option"/g)).toHaveLength(4)
    expect(out.match(/role="group"/g)).toHaveLength(2)
    const groupLabels = [...out.matchAll(/role="group"[^>]*aria-labelledby="([^"]+)"/g)].map(
      (m) => m[1]
    )
    for (const id of groupLabels) expect(out).toContain(`id="${id}"`)
    expect(out).toContain('>Clientes<')
    expect(out).toContain('>Conta<')
  })

  it('o primeiro item é o ativo (aria-activedescendant e aria-selected); desabilitado marcado', () => {
    const out = html(<MaskedCommandPalette items={items} defaultOpen />)
    const active = /aria-activedescendant="([^"]+)"/.exec(out)?.[1]
    expect(active).toBeTruthy()
    expect(out).toMatch(
      new RegExp(`id="${active}"[^>]*aria-selected="true"|aria-selected="true"[^>]*id="${active}"`)
    )
    expect(out.match(/aria-selected="true"/g)).toHaveLength(1)
    expect(out).toMatch(/aria-disabled="true"/)
  })

  it('default mostra descrição, ícone decorativo e atalho; compact só rótulo e atalho', () => {
    const full = html(<MaskedCommandPalette items={items} defaultOpen />)
    expect(full).toContain('Cadastrar')
    expect(full).toMatch(/aria-hidden="true"[^>]*>➕/)
    expect(full).toContain('<kbd')
    const compact = html(<MaskedCommandPalette variant="compact" items={items} defaultOpen />)
    expect(compact).not.toContain('Cadastrar')
    expect(compact).not.toContain('➕')
    expect(compact).toContain('<kbd')
  })

  it('região viva com a contagem; en traduz; label e placeholder customizáveis', () => {
    expect(html(<MaskedCommandPalette items={items} defaultOpen />)).toMatch(
      /role="status"[^>]*>4 resultados/
    )
    const english = en(<MaskedCommandPalette items={items} defaultOpen />)
    expect(english).toContain('aria-label="Command palette"')
    expect(english).toContain('4 results')
    expect(english).toContain('placeholder="Type a command or search…"')
    const custom = html(
      <MaskedCommandPalette items={items} defaultOpen label="Ir para" placeholder="Buscar" />
    )
    expect(custom).toContain('aria-label="Ir para"')
    expect(custom).toContain('placeholder="Buscar"')
  })

  it('open controlado vence defaultOpen; sem itens mostra a mensagem vazia', () => {
    expect(html(<MaskedCommandPalette items={items} open={false} defaultOpen />)).toBe('')
    const empty = html(<MaskedCommandPalette items={[]} defaultOpen emptyMessage="Nada aqui" />)
    expect(empty).toContain('Nada aqui')
    expect(empty).not.toContain('role="option"')
  })

  it('props da API não vazam', () => {
    const out = html(
      <MaskedCommandPalette
        items={items}
        defaultOpen
        hotkey={false}
        colorTheme="baseBlue"
        variant="compact"
      />
    )
    for (const leaked of ['hotkey=', 'colortheme=', 'emptymessage=', 'defaultopen=', 'variant=']) {
      expect(out.toLowerCase()).not.toContain(leaked)
    }
  })
})

describe('MaskedTeam', () => {
  const members = [
    {
      name: 'Ana Souza',
      role: 'CEO',
      bio: 'Fundadora',
      avatar: '/ana.jpg',
      links: [{ label: 'LinkedIn', href: 'https://x.test/ana' }]
    },
    { name: 'Bia Lima', role: 'CTO' }
  ]

  it('<ul> de pessoas; nome é heading um nível abaixo do título da seção; avatar decorativo', () => {
    const out = html(<MaskedTeam title="Quem faz" members={members} />)
    expect(out).toMatch(/<h2[^>]*>Quem faz<\/h2>/)
    expect(out).toMatch(/<h3[^>]*>Ana Souza<\/h3>/)
    expect(out).toMatch(/<h3[^>]*>Bia Lima<\/h3>/)
    expect(
      out.match(/<span aria-hidden="true"><span[^>]*role="img"|<span aria-hidden="true"><img/g)
        ?.length ?? 0
    ).toBeGreaterThan(0)
    expect(html(<MaskedTeam title="x" headingLevel={3} members={members} />)).toMatch(
      /<h4[^>]*>Ana/
    )
  })

  it('link com nome acessível "rótulo: pessoa" e linkComponent do config', () => {
    const out = html(
      <MaskedConfigProvider config={{ linkComponent: FakeLink }}>
        <MaskedTeam members={members} />
      </MaskedConfigProvider>
    )
    expect(out).toContain('aria-label="LinkedIn: Ana Souza"')
    expect(out.match(/data-fake-link="true"/g)).toHaveLength(1)
  })

  it('bio só em list/cards; grid não mostra', () => {
    expect(html(<MaskedTeam members={members} />)).not.toContain('Fundadora')
    expect(html(<MaskedTeam variant="cards" members={members} />)).toContain('Fundadora')
    expect(html(<MaskedTeam variant="list" members={members} />)).toContain('Fundadora')
  })

  it('props da API não vazam', () => {
    const out = html(
      <MaskedTeam variant="cards" colorTheme="baseBlue" sectionVariant="tinted" members={members} />
    )
    for (const leaked of ['members=', 'sectionvariant=', 'colortheme=', 'variant=']) {
      expect(out.toLowerCase()).not.toContain(leaked)
    }
  })
})

describe('MaskedContact', () => {
  const onSubmit = async () => {}

  it('campos com <label> visível ligado, required e autocomplete corretos; sem status inicial', () => {
    const out = html(<MaskedContact title="Fale conosco" onSubmit={onSubmit} />)
    for (const [label, type, auto] of [
      ['Nome', 'text', 'name'],
      ['E-mail', 'email', 'email']
    ]) {
      const id = new RegExp(`<label[^>]*for="([^"]+)"[^>]*>${label}</label>`).exec(out)?.[1]
      expect(id, label).toBeTruthy()
      expect(out).toMatch(new RegExp(`<input[^>]*id="${id}"`))
      expect(out).toMatch(new RegExp(`<input[^>]*type="${type}"`))
      expect(out.toLowerCase()).toContain(`autocomplete="${auto}"`)
    }
    expect(out).toMatch(/<label[^>]*for="([^"]+)"[^>]*>Mensagem<\/label>/)
    expect(out).toMatch(/<textarea[^>]*required/)
    expect(out.match(/required/g)).toHaveLength(3)
    expect(out).not.toContain('role="status"')
    expect(out).not.toContain('role="alert"')
  })

  it('split mostra info; card e minimal não', () => {
    const info = <address>Rua A, 10</address>
    expect(html(<MaskedContact variant="split" info={info} onSubmit={onSubmit} />)).toContain(
      'Rua A, 10'
    )
    expect(html(<MaskedContact variant="card" info={info} onSubmit={onSubmit} />)).not.toContain(
      'Rua A, 10'
    )
    expect(html(<MaskedContact variant="minimal" info={info} onSubmit={onSubmit} />)).not.toContain(
      'Rua A, 10'
    )
  })

  it('textos por locale e personalizáveis', () => {
    expect(en(<MaskedContact onSubmit={onSubmit} />)).toContain('>Send message<')
    const custom = html(
      <MaskedContact onSubmit={onSubmit} labels={{ name: 'Seu nome', submit: 'Enviar' }} />
    )
    expect(custom).toContain('>Seu nome<')
    expect(custom).toContain('>Enviar<')
  })

  it('props da API não vazam', () => {
    const out = html(
      <MaskedContact
        variant="split"
        colorTheme="baseBlue"
        onSubmit={onSubmit}
        successMessage="ok"
      />
    )
    for (const leaked of ['variant=', 'onsubmit=', 'colortheme=', 'successmessage=', 'labels=']) {
      expect(out.toLowerCase()).not.toContain(leaked)
    }
  })
})

describe('diálogos com nome acessível (Popup, Drawer, Header, Sidebar)', () => {
  it('MaskedPopup e MaskedDrawer: ariaLabel e ariaLabelledBy chegam ao role="dialog"', () => {
    const popup = html(
      <MaskedPopup isOpen onClose={() => {}} ariaLabel="Confirmar exclusão">
        x
      </MaskedPopup>
    )
    expect(popup).toMatch(/role="dialog"[^>]*aria-label="Confirmar exclusão"/)
    const drawer = html(
      <MaskedDrawer isOpen onClose={() => {}} ariaLabelledBy="titulo">
        x
      </MaskedDrawer>
    )
    expect(drawer).toMatch(/role="dialog"[^>]*aria-labelledby="titulo"/)
  })

  it('MaskedPopup e MaskedCommandPalette abertos funcionam sem <ThemeProvider> (não lançam)', () => {
    expect(() =>
      renderToStaticMarkup(
        <MaskedPopup isOpen onClose={() => {}} ariaLabel="x">
          conteúdo
        </MaskedPopup>
      )
    ).not.toThrow()
    const palette = renderToStaticMarkup(
      <MaskedCommandPalette items={[{ id: 'a', label: 'Abrir' }]} defaultOpen />
    )
    expect(palette).toContain('role="combobox"')
    expect(palette).toContain('Abrir')
  })

  it('sem as props novas, nada muda (retrocompatível)', () => {
    const popup = html(
      <MaskedPopup isOpen onClose={() => {}}>
        x
      </MaskedPopup>
    )
    expect(popup).not.toContain('aria-label=')
    expect(popup).not.toContain('aria-labelledby=')
  })

  it('Drawer do menu do Header e da Sidebar agora tem nome', () => {
    const header = html(<MaskedHeader links={[{ label: 'A', href: '/' }]} />)
    expect(header).toMatch(/role="dialog"[^>]*aria-label="Principal"/)
    const sidebar = html(<MaskedSidebar items={[{ id: 'a', label: 'A' }]} mobileOpen={false} />)
    expect(sidebar).toMatch(/role="dialog"[^>]*aria-label="Navegação lateral"/)
    expect(en(<MaskedSidebar items={[{ id: 'a', label: 'A' }]} mobileOpen={false} />)).toMatch(
      /role="dialog"[^>]*aria-label="Sidebar"/
    )
  })
})
