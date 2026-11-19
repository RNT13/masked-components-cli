import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import React from 'react'
import { ThemeProvider } from 'styled-components'
import { maskedTheme } from '../../templates/masked-themes/MaskedThemes/MaskedThemes'
import { MaskedContainer } from '../../templates/masked-layout/MaskedContainer/MaskedContainer'
import { MaskedSection } from '../../templates/masked-layout/MaskedSection/MaskedSection'
import { MaskedDivider } from '../../templates/masked-layout/MaskedDivider/MaskedDivider'

const html = (node: React.ReactElement) =>
  renderToStaticMarkup(<ThemeProvider theme={maskedTheme}>{node}</ThemeProvider>)

describe('MaskedContainer — render', () => {
  it('uso mínimo: div com largura máxima do variant default', () => {
    const out = html(<MaskedContainer>x</MaskedContainer>)
    expect(out).toMatch(/^<div/)
    expect(out).toContain('--mc-container-max-width:1120px')
  })

  it('`as` troca o elemento; props da API não vazam para o DOM', () => {
    const out = html(
      <MaskedContainer as="main" variant="narrow" paddingX="xl" centered={false} id="conteudo">
        x
      </MaskedContainer>
    )
    expect(out).toMatch(/^<main/)
    expect(out).toContain('id="conteudo"')
    expect(out).toContain('--mc-container-max-width:720px')
    for (const leaked of ['variant=', 'paddingx=', 'centered=', '$']) {
      expect(out.toLowerCase()).not.toContain(leaked)
    }
  })

  it('funciona sem ThemeProvider', () => {
    expect(renderToStaticMarkup(<MaskedContainer variant="wide">x</MaskedContainer>)).toContain(
      '--mc-container-max-width:1440px'
    )
  })
})

describe('MaskedSection — render e a11y', () => {
  it('com title: <section> rotulada pelo h2 (aria-labelledby aponta para o id do título)', () => {
    const out = html(
      <MaskedSection id="recursos" title="Recursos" description="Tudo que você precisa">
        conteúdo
      </MaskedSection>
    )
    expect(out).toMatch(/^<section/)
    expect(out).toContain('aria-labelledby="recursos-title"')
    expect(out).toMatch(/<h2[^>]*id="recursos-title"[^>]*>Recursos<\/h2>/)
    expect(out).toContain('Tudo que você precisa')
    expect(out).toContain('conteúdo')
  })

  it('headingLevel troca o nível do título', () => {
    const out = html(<MaskedSection title="Sub" headingLevel={3} />)
    expect(out).toMatch(/<h3/)
    expect(out).not.toMatch(/<h2/)
  })

  it('sem title: sem aria-labelledby e sem cabeçalho', () => {
    const out = html(<MaskedSection>só conteúdo</MaskedSection>)
    expect(out).not.toContain('aria-labelledby')
    expect(out).not.toMatch(/<h[1-6]/)
  })

  it('actions aparecem no cabeçalho; aria-label manual é repassado', () => {
    const out = html(
      <MaskedSection
        title="Planos"
        actions={<button type="button">Ver todos</button>}
        aria-label="x"
      >
        c
      </MaskedSection>
    )
    expect(out).toContain('<button type="button">Ver todos</button>')
    expect(out).toContain('aria-label="x"')
  })

  it('variants pintam via tokens inline; props da API não vazam', () => {
    const out = html(
      <MaskedSection variant="gradient" colorTheme="baseBlue" align="center" paddingY="xl">
        x
      </MaskedSection>
    )
    expect(out).toContain('--mc-section-bg:linear-gradient')
    expect(out).toContain('--mc-section-padding-y')
    for (const leaked of ['variant=', 'colortheme=', 'paddingy=', 'align=', '$']) {
      expect(out.toLowerCase()).not.toContain(leaked)
    }
  })

  it('ids únicos quando não há `id`: duas seções não compartilham o aria-labelledby', () => {
    const out = html(
      <>
        <MaskedSection title="A" />
        <MaskedSection title="B" />
      </>
    )
    const ids = [...out.matchAll(/aria-labelledby="([^"]+)"/g)].map((m) => m[1])
    expect(ids).toHaveLength(2)
    expect(new Set(ids).size).toBe(2)
  })
})

describe('MaskedDivider — render e a11y', () => {
  it('padrão: decorativo (aria-hidden), sem role', () => {
    const out = html(<MaskedDivider />)
    expect(out).toContain('aria-hidden="true"')
    expect(out).not.toContain('role=')
  })

  it('decorative={false}: separador semântico com orientação', () => {
    const horizontal = html(<MaskedDivider decorative={false} />)
    expect(horizontal).toContain('role="separator"')
    expect(horizontal).toContain('aria-orientation="horizontal"')
    expect(horizontal).not.toContain('aria-hidden')
    const vertical = html(<MaskedDivider variant="vertical" decorative={false} />)
    expect(vertical).toContain('aria-orientation="vertical"')
  })

  it('labeled: o texto é conteúdo; só as 2 linhas ficam aria-hidden', () => {
    const out = html(<MaskedDivider variant="labeled" label="ou" />)
    expect(out).toContain('>ou<')
    expect(out.match(/aria-hidden="true"/g)).toHaveLength(2)
    expect(out).not.toContain('role=')
  })

  it('tokens de cor/espaço inline; props da API não vazam', () => {
    const out = html(<MaskedDivider spacing="lg" thickness="2px" colorTheme="baseBlue" />)
    expect(out).toContain('--mc-divider-color:')
    expect(out).toContain('--mc-divider-thickness:2px')
    for (const leaked of [
      'variant=',
      'spacing=',
      'thickness=',
      'colortheme=',
      'decorative=',
      '$'
    ]) {
      expect(out.toLowerCase()).not.toContain(leaked)
    }
  })
})
