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
    expect(presets.map((p) => p.id).sort()).toEqual(['masked-layout', 'masked-page'])
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
