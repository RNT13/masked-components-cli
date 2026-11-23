import { describe, expect, it } from 'vitest'
import { registry, resolveComponents } from '../registry'

const ids = (list: string[]) => resolveComponents(list, 'next').ordered.map((e) => e.id)

describe('registry — fundações de layout e estrutura de página', () => {
  it('masked-layout instala os 6 componentes de layout', () => {
    expect(ids(['masked-layout'])).toEqual(
      expect.arrayContaining([
        'masked-div',
        'masked-stack',
        'masked-grid',
        'masked-container',
        'masked-section',
        'masked-divider'
      ])
    )
  })

  it('masked-page instala Shell, Header, Sidebar, Footer e PageHeader (+ drawer e config)', () => {
    expect(ids(['masked-page'])).toEqual(
      expect.arrayContaining([
        'masked-shell',
        'masked-header',
        'masked-sidebar',
        'masked-footer',
        'masked-page-header',
        'masked-drawer',
        'masked-config',
        'masked-themes',
        'masked-utils'
      ])
    )
  })

  it('presets são só agregadores: sem arquivos próprios e marcados como preset', () => {
    const presets = registry.filter((entry) => entry.preset)
    expect(presets.map((p) => p.id).sort()).toEqual([
      'masked-app',
      'masked-forms',
      'masked-layout',
      'masked-marketing',
      'masked-page'
    ])
    for (const preset of presets) expect(preset.templates).toEqual([])
  })

  it('instalação granular: Header puxa Drawer e Config; Container e Divider só o tema', () => {
    expect(ids(['masked-header'])).toEqual([
      'masked-utils',
      'masked-themes',
      'masked-config',
      'masked-drawer',
      'masked-header'
    ])
    expect(ids(['masked-container'])).toEqual(['masked-utils', 'masked-themes', 'masked-container'])
    expect(ids(['masked-divider'])).toEqual(['masked-utils', 'masked-themes', 'masked-divider'])
  })

  it('Section e PageHeader não arrastam Config nem Drawer', () => {
    for (const id of ['masked-section', 'masked-page-header']) {
      const installed = ids([id])
      expect(installed).not.toContain('masked-config')
      expect(installed).not.toContain('masked-drawer')
    }
  })
})

describe('registry — marketing', () => {
  it('masked-marketing instala os 9 componentes (+ section, themes, config, utils)', () => {
    expect(ids(['masked-marketing'])).toEqual(
      expect.arrayContaining([
        'masked-hero',
        'masked-features',
        'masked-stats',
        'masked-cta',
        'masked-logo-cloud',
        'masked-testimonials',
        'masked-faq',
        'masked-pricing',
        'masked-newsletter',
        'masked-section',
        'masked-themes',
        'masked-config',
        'masked-utils'
      ])
    )
  })

  it('instalação granular: Hero e CTA só com o tema; Features puxa a Section; Pricing, a Section e o Config', () => {
    expect(ids(['masked-hero'])).toEqual(['masked-utils', 'masked-themes', 'masked-hero'])
    expect(ids(['masked-cta'])).toEqual(['masked-utils', 'masked-themes', 'masked-cta'])
    expect(ids(['masked-features'])).toEqual([
      'masked-utils',
      'masked-themes',
      'masked-section',
      'masked-features'
    ])
    expect(ids(['masked-pricing'])).toEqual([
      'masked-utils',
      'masked-themes',
      'masked-config',
      'masked-section',
      'masked-pricing'
    ])
    expect(ids(['masked-newsletter'])).toEqual([
      'masked-utils',
      'masked-themes',
      'masked-config',
      'masked-newsletter'
    ])
  })

  it('nenhum componente de marketing arrasta Drawer, Buttons ou Animations', () => {
    const installed = ids(['masked-marketing'])
    for (const heavy of ['masked-drawer', 'masked-buttons', 'masked-animations', 'masked-input']) {
      expect(installed).not.toContain(heavy)
    }
  })
})

describe('registry — forms e complementos', () => {
  it('masked-forms instala slider, rating, date-picker e command-palette (+ popup e config)', () => {
    expect(ids(['masked-forms'])).toEqual(
      expect.arrayContaining([
        'masked-slider',
        'masked-rating',
        'masked-date-picker',
        'masked-command-palette',
        'masked-popup',
        'masked-config',
        'masked-themes'
      ])
    )
  })

  it('instalação granular: Slider só com o tema; DatePicker com o config; CommandPalette com o Popup', () => {
    expect(ids(['masked-slider'])).toEqual(['masked-utils', 'masked-themes', 'masked-slider'])
    expect(ids(['masked-date-picker'])).toEqual([
      'masked-utils',
      'masked-themes',
      'masked-config',
      'masked-date-picker'
    ])
    expect(ids(['masked-command-palette'])).toEqual([
      'masked-utils',
      'masked-themes',
      'masked-config',
      'masked-popup',
      'masked-command-palette'
    ])
  })

  it('Team puxa Section e Avatar; Contact puxa Section; ambos entram no preset de marketing', () => {
    expect(ids(['masked-team'])).toEqual(
      expect.arrayContaining(['masked-section', 'masked-avatar'])
    )
    expect(ids(['masked-contact'])).toEqual(
      expect.arrayContaining(['masked-section', 'masked-config'])
    )
    expect(ids(['masked-marketing'])).toEqual(
      expect.arrayContaining(['masked-team', 'masked-contact'])
    )
  })
})
