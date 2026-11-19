import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import React from 'react'
import { ThemeProvider } from 'styled-components'
import { maskedTheme } from '../../templates/masked-themes/MaskedThemes/MaskedThemes'
import { MaskedConfigProvider } from '../../templates/masked-config/MaskedConfigProvider'
import { MaskedHero } from '../../templates/masked-marketing/MaskedHero/MaskedHero'
import { MaskedFeatures } from '../../templates/masked-marketing/MaskedFeatures/MaskedFeatures'
import { MaskedStats } from '../../templates/masked-marketing/MaskedStats/MaskedStats'
import { MaskedCTA } from '../../templates/masked-marketing/MaskedCTA/MaskedCTA'
import { MaskedLogoCloud } from '../../templates/masked-marketing/MaskedLogoCloud/MaskedLogoCloud'
import { MaskedTestimonials } from '../../templates/masked-marketing/MaskedTestimonials/MaskedTestimonials'
import { MaskedFAQ } from '../../templates/masked-marketing/MaskedFAQ/MaskedFAQ'
import { MaskedPricing } from '../../templates/masked-marketing/MaskedPricing/MaskedPricing'
import { MaskedNewsletter } from '../../templates/masked-marketing/MaskedNewsletter/MaskedNewsletter'

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

describe('MaskedHero', () => {
  it('título é h1 por padrão; headingLevel={2} vira h2; slots renderizados', () => {
    const out = html(
      <MaskedHero
        eyebrow="Novo"
        title="Agende"
        description="Descrição"
        actions={<button type="button">Começar</button>}
        media={<img src="/x.png" alt="Painel" />}
      />
    )
    expect(out).toContain('<section')
    expect(out).toMatch(/<h1[^>]*>Agende<\/h1>/)
    for (const part of [
      'Novo',
      'Descrição',
      '<button type="button">Começar</button>',
      'alt="Painel"'
    ]) {
      expect(out).toContain(part)
    }
    expect(html(<MaskedHero title="x" headingLevel={2} />)).toMatch(/<h2/)
  })

  it('gradient pinta via tokens; props da API não vazam', () => {
    const out = html(
      <MaskedHero variant="split" mediaPosition="start" colorTheme="baseBlue" title="x" />
    )
    expect(out).toContain('--mc-hero-accent:')
    expect(html(<MaskedHero variant="gradient" title="x" />)).toContain(
      '--mc-hero-bg:linear-gradient'
    )
    for (const leaked of ['variant=', 'mediaposition=', 'colortheme=', 'headinglevel=', '$']) {
      expect(out.toLowerCase()).not.toContain(leaked)
    }
  })
})

describe('MaskedFeatures', () => {
  const items = [
    { title: 'Agenda', description: 'Online', icon: <i>A</i> },
    { title: 'Clientes', description: 'Cadastro' }
  ]

  it('seção rotulada pelo título (h2); itens em <ul> com h3; ícone decorativo', () => {
    const out = html(<MaskedFeatures id="rec" title="Recursos" items={items} />)
    expect(out).toContain('aria-labelledby="rec-title"')
    expect(out).toMatch(/<h2[^>]*>Recursos<\/h2>/)
    expect(out.match(/<li[\s>]/g)).toHaveLength(2)
    expect(out).toMatch(/<h3[^>]*>Agenda<\/h3>/)
    expect(out).toMatch(/aria-hidden="true"[^>]*><i>A<\/i>/)
  })

  it('headingLevel da seção desce para os itens; timeline é <ol>', () => {
    expect(html(<MaskedFeatures title="x" headingLevel={3} items={items} />)).toMatch(
      /<h4[^>]*>Agenda/
    )
    const tl = html(<MaskedFeatures variant="timeline" items={items} />)
    expect(tl).toMatch(/<ol/)
    expect(tl).not.toMatch(/<ul/)
  })

  it('tokens e props não vazam', () => {
    const out = html(
      <MaskedFeatures colorTheme="baseBlue" cols={4} sectionVariant="tinted" items={items} />
    )
    expect(out).toContain('--mc-features-accent:')
    expect(out).toContain('--mc-section-bg:')
    for (const leaked of ['cols=', 'sectionvariant=', 'colortheme=', '$']) {
      expect(out.toLowerCase()).not.toContain(leaked)
    }
  })
})

describe('MaskedStats', () => {
  const items = [
    { value: '12k', label: 'Clientes', trend: { value: '+8%', direction: 'up' as const } },
    { value: '99,9%', label: 'Disponibilidade' }
  ]

  it('lista de definição: dt (rótulo) vem antes do dd (valor) no DOM', () => {
    const out = html(<MaskedStats items={items} />)
    expect(out).toMatch(/<dl/)
    expect(out.indexOf('<dt')).toBeLessThan(out.indexOf('<dd'))
    expect(out.match(/<dt/g)).toHaveLength(2)
    expect(out).toMatch(/<dt[^>]*>Clientes<\/dt>/)
  })

  it('tendência tem texto oculto além da seta (não depende só de símbolo)', () => {
    const pt = html(<MaskedStats items={items} />)
    expect(pt).toContain('Aumento de')
    expect(pt).toContain('+8%')
    expect(pt).toMatch(/aria-hidden="true"[^>]*>▲/)
    expect(en(<MaskedStats items={items} />)).toContain('Increase of')
  })
})

describe('MaskedCTA', () => {
  it('título h2 por padrão, descrição e ações', () => {
    const out = html(
      <MaskedCTA title="Comece" description="Hoje" actions={<button type="button">Criar</button>} />
    )
    expect(out).toMatch(/<h2[^>]*>Comece<\/h2>/)
    expect(out).toContain('Hoje')
    expect(out).toContain('<button type="button">Criar</button>')
    expect(html(<MaskedCTA title="x" headingLevel={3} />)).toMatch(/<h3/)
  })

  it('banner pinta com tokens; props não vazam', () => {
    const out = html(<MaskedCTA variant="gradient" colorTheme="baseBlue" title="x" />)
    expect(out).toContain('--mc-cta-bg:linear-gradient')
    for (const leaked of ['variant=', 'colortheme=', 'headinglevel=', '$']) {
      expect(out.toLowerCase()).not.toContain(leaked)
    }
  })
})

describe('MaskedLogoCloud', () => {
  const logos = [<img key="a" src="/a.svg" alt="Acme" />, <img key="b" src="/b.svg" alt="Globex" />]

  it('row/grid: uma lista, com os logos e alt', () => {
    const out = html(<MaskedLogoCloud logos={logos} />)
    expect(out.match(/<ul/g)).toHaveLength(1)
    expect(out.match(/<li[\s>]/g)).toHaveLength(2)
    expect(out).toContain('alt="Acme"')
    expect(out).not.toContain('aria-hidden')
  })

  it('marquee: segunda cópia da lista fica aria-hidden; duração vira token', () => {
    const out = html(<MaskedLogoCloud variant="marquee" speed={45} logos={logos} />)
    expect(out.match(/<ul/g)).toHaveLength(2)
    expect(out.match(/<ul[^>]*aria-hidden="true"/g)).toHaveLength(1)
    expect(out).toContain('--mc-logo-cloud-duration:45s')
  })
})

describe('MaskedTestimonials', () => {
  const items = [
    { quote: 'Ótimo!', author: 'Ana', role: 'Dona de salão', avatar: <img src="/a.png" alt="" /> },
    { quote: 'Recomendo', author: 'Bia' }
  ]

  it('cada depoimento é figure > blockquote + figcaption com autor e cargo', () => {
    const out = html(<MaskedTestimonials items={items} />)
    expect(out.match(/<figure/g)).toHaveLength(2)
    expect(out).toMatch(/<blockquote[^>]*>Ótimo!<\/blockquote>/)
    expect(out).toMatch(/<figcaption/)
    expect(out).toContain('Dona de salão')
    expect(out).not.toContain('role="region"')
  })

  it('carousel: região rolável focável e rotulada (pt/en/custom)', () => {
    const pt = html(<MaskedTestimonials variant="carousel" items={items} />)
    expect(pt).toContain('role="region"')
    expect(pt).toContain('aria-label="Depoimentos"')
    expect(pt).toContain('tabindex="0"')
    expect(en(<MaskedTestimonials variant="carousel" items={items} />)).toContain(
      'aria-label="Testimonials"'
    )
    expect(
      html(<MaskedTestimonials variant="carousel" carouselLabel="Clientes" items={items} />)
    ).toContain('aria-label="Clientes"')
  })
})

describe('MaskedFAQ', () => {
  const items = [
    { question: 'Posso cancelar?', answer: 'Sim.' },
    { question: 'Tem teste?', answer: 'Tem.' }
  ]

  it('details/summary nativos com pergunta e resposta', () => {
    const out = html(<MaskedFAQ items={items} />)
    expect(out.match(/<details/g)).toHaveLength(2)
    expect(out).toMatch(/<summary[^>]*>Posso cancelar\?<\/summary>/)
    expect(out).toContain('Sim.')
    expect(out).not.toContain(' open')
  })

  it('defaultOpen abre os índices pedidos', () => {
    expect(
      html(<MaskedFAQ items={items} defaultOpen={1} />).match(/<details[^>]*open/g)
    ).toHaveLength(1)
    expect(
      html(<MaskedFAQ items={items} defaultOpen={[0, 1]} />).match(/<details[^>]*open/g)
    ).toHaveLength(2)
  })

  it('multiple={false}: todas compartilham o mesmo name (exclusivo); padrão não usa name', () => {
    const exclusive = html(<MaskedFAQ items={items} multiple={false} />)
    const names = [...exclusive.matchAll(/<details[^>]*name="([^"]+)"/g)].map((m) => m[1])
    expect(names).toHaveLength(2)
    expect(new Set(names).size).toBe(1)
    expect(html(<MaskedFAQ items={items} />)).not.toContain('name=')
  })
})

describe('MaskedPricing', () => {
  const plans = [
    {
      id: 'free',
      name: 'Grátis',
      price: 'R$ 0',
      features: ['Agenda'],
      cta: { label: 'Começar', href: '/signup' }
    },
    {
      id: 'pro',
      name: 'Pro',
      price: { monthly: 'R$ 49', yearly: 'R$ 39' },
      features: ['Agenda', 'Relatórios'],
      badge: 'Mais popular',
      cta: { label: 'Assinar', href: '/assinar' }
    }
  ]

  it('cards: article com h3, preço, recursos e CTA como link', () => {
    const out = html(<MaskedPricing title="Planos" plans={plans} highlight="pro" />)
    expect(out.match(/<article/g)).toHaveLength(2)
    expect(out).toMatch(/<h3[^>]*>Pro<\/h3>/)
    expect(out).toContain('Mais popular')
    expect(out).toMatch(/<a[^>]*href="\/assinar"[^>]*>Assinar<\/a>/)
    expect(out).toContain('R$ 49')
    expect(out).toContain('/mês')
  })

  it('alternador: grupo de botões com aria-pressed; yearly troca preço e sufixo', () => {
    const out = html(<MaskedPricing plans={plans} defaultBilling="yearly" yearlyBadge="-20%" />)
    expect(out).toContain('role="group"')
    expect(out).toContain('aria-label="Período de cobrança"')
    expect(out).toMatch(/aria-pressed="true"[^>]*>Anual/)
    expect(out).toMatch(/aria-pressed="false"[^>]*>Mensal/)
    expect(out).toContain('R$ 39')
    expect(out).toContain('/ano')
    expect(out).toContain('-20%')
  })

  it('billing controlado vence o defaultBilling; sem preços por período não há alternador', () => {
    expect(
      html(<MaskedPricing plans={plans} billing="monthly" defaultBilling="yearly" />)
    ).toContain('R$ 49')
    expect(html(<MaskedPricing plans={[plans[0]]} />)).not.toContain('aria-pressed')
    expect(html(<MaskedPricing plans={[plans[0]]} showBillingToggle />)).toContain('aria-pressed')
  })

  it('table: caption, cabeçalhos de coluna/linha e ✓ com texto oculto', () => {
    const out = html(<MaskedPricing variant="table" plans={plans} highlight="pro" />)
    expect(out).toMatch(/<caption/)
    expect(out).toContain('role="region"')
    expect(out).toContain('tabindex="0"')
    expect(out.match(/<th[^>]*scope="col"/g)).toHaveLength(3)
    expect(out.match(/<th[^>]*scope="row"/g)).toHaveLength(2)
    expect(out).toContain('Incluído')
    expect(out).toContain('Não incluído')
    expect(out.match(/<table/g)).toHaveLength(1)
  })

  it('usa o linkComponent; pt/en; props não vazam', () => {
    const linked = html(
      <MaskedConfigProvider config={{ linkComponent: FakeLink }}>
        <MaskedPricing plans={plans} />
      </MaskedConfigProvider>
    )
    expect(linked.match(/data-fake-link="true"/g)).toHaveLength(2)
    const english = en(<MaskedPricing plans={plans} />)
    expect(english).toContain('Billing period')
    expect(english).toContain('/month')
    const leaky = html(<MaskedPricing plans={plans} highlight="pro" colorTheme="baseBlue" />)
    for (const leaked of ['highlight=', 'colortheme=', 'defaultbilling=', 'plans=']) {
      expect(leaky.toLowerCase()).not.toContain(leaked)
    }
    expect(leaky).not.toMatch(/\s\$[a-zA-Z]+=/)
  })
})

describe('MaskedNewsletter', () => {
  const onSubmit = async () => {}

  it('campo com <label> associado, type=email, required; sem status inicial', () => {
    const out = html(
      <MaskedNewsletter title="Receba novidades" description="1x por mês" onSubmit={onSubmit} />
    )
    const id = /<input[^>]*id="([^"]+)"/.exec(out)?.[1]
    expect(id).toBeTruthy()
    expect(out).toMatch(new RegExp(`<label[^>]*for="${id}"[^>]*>E-mail</label>`))
    expect(out).toMatch(/<input[^>]*type="email"/)
    expect(out).toContain('required')
    expect(out.toLowerCase()).toContain('autocomplete="email"')
    expect(out).toMatch(/<h2[^>]*>Receba novidades<\/h2>/)
    expect(out).not.toContain('role="status"')
    expect(out).not.toContain('role="alert"')
  })

  it('textos por locale e personalizáveis', () => {
    const english = en(<MaskedNewsletter onSubmit={onSubmit} />)
    expect(english).toContain('>Email</label>')
    expect(english).toContain('Subscribe')
    const custom = html(
      <MaskedNewsletter
        onSubmit={onSubmit}
        buttonLabel="Quero"
        inputLabel="Seu e-mail"
        placeholder="a@b.c"
      />
    )
    expect(custom).toContain('Quero')
    expect(custom).toContain('Seu e-mail')
    expect(custom).toContain('placeholder="a@b.c"')
  })

  it('band pinta com tokens; props da API não vazam', () => {
    const out = html(<MaskedNewsletter variant="band" colorTheme="baseBlue" onSubmit={onSubmit} />)
    expect(out).toContain('--mc-newsletter-bg:')
    for (const leaked of ['variant=', 'colortheme=', 'successmessage=', 'onsubmit=', '$']) {
      expect(out.toLowerCase()).not.toContain(leaked)
    }
  })
})
