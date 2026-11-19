import { describe, expect, it } from 'vitest'
import { maskedTheme } from '../../templates/masked-themes/MaskedThemes/MaskedThemes'
import { listColorThemes } from '../../templates/masked-themes/MaskedThemes/ColorThemes'
import { resolveSemanticColors } from '../../templates/masked-themes/semanticColors'
import { contrastRatio } from '../../templates/masked-utils/color'
import { resolveFooterTokens } from '../../templates/masked-page/MaskedFooter/footerTokens'
import { resolvePageHeaderTokens } from '../../templates/masked-page/MaskedPageHeader/pageHeaderTokens'
import { resolveHeaderTokens } from '../../templates/masked-page/MaskedHeader/headerTokens'
import { resolveSidebarTokens } from '../../templates/masked-page/MaskedSidebar/sidebarTokens'
import { resolveShellTokens } from '../../templates/masked-page/MaskedShell/shellTokens'

const THEMES = [...listColorThemes(), 'baseBlue', 'baseRose', 'baseLilac']
const AA = 4.5

describe('resolveSemanticColors', () => {
  it('lê as cores semânticas do tema ativo', () => {
    const c = resolveSemanticColors(maskedTheme)
    expect(c.surface).toBe(maskedTheme.colors.surfaceColor)
    expect(c.text).toBe(maskedTheme.colors.textColor)
    expect(c.border).toBe(maskedTheme.colors.borderColor)
  })

  it('cai em valores seguros se o tema não define as semânticas', () => {
    const bare = { ...maskedTheme, colors: { ...maskedTheme.colors } }
    delete bare.colors.surfaceColor
    delete bare.colors.textColor
    expect(resolveSemanticColors(bare).surface).toBe('#ffffff')
    expect(resolveSemanticColors(bare).text).toBe('#111111')
  })
})

describe('contraste WCAG AA — fg sobre bg com colorTheme, em todos os temas', () => {
  for (const colorTheme of THEMES) {
    it(`${colorTheme}: footer, header(static/sticky), sidebar(fixed) e shell`, () => {
      const footer = resolveFooterTokens({ colorTheme }, maskedTheme)
      expect(
        contrastRatio(footer['--mc-footer-fg'], footer['--mc-footer-bg'])!
      ).toBeGreaterThanOrEqual(AA)

      for (const variant of ['static', 'sticky'] as const) {
        const header = resolveHeaderTokens({ variant, colorTheme }, maskedTheme)
        expect(
          contrastRatio(header['--mc-header-fg'], header['--mc-header-bg'])!
        ).toBeGreaterThanOrEqual(AA)
        /* o texto do menu mobile fica sobre a base do colorTheme (painel do Drawer) */
        expect(
          contrastRatio(header['--mc-header-menu-fg'], header['--mc-header-bg'])!
        ).toBeGreaterThanOrEqual(AA)
      }

      const sidebar = resolveSidebarTokens({ variant: 'fixed', colorTheme }, maskedTheme)
      expect(
        contrastRatio(sidebar['--mc-sidebar-fg'], sidebar['--mc-sidebar-bg'])!
      ).toBeGreaterThanOrEqual(AA)

      const shell = resolveShellTokens({ colorTheme }, maskedTheme)
      expect(contrastRatio(shell['--mc-shell-fg'], shell['--mc-shell-bg'])!).toBeGreaterThanOrEqual(
        AA
      )
    })
  }

  it('sem colorTheme: superfície e texto do tema (também com contraste AA)', () => {
    const footer = resolveFooterTokens({}, maskedTheme)
    expect(footer['--mc-footer-bg']).toBe(maskedTheme.colors.surfaceColor)
    expect(
      contrastRatio(footer['--mc-footer-fg'], footer['--mc-footer-bg'])!
    ).toBeGreaterThanOrEqual(AA)
    const shell = resolveShellTokens({}, maskedTheme)
    expect(shell['--mc-shell-bg']).toBe(maskedTheme.colors.surfaceColor)
  })
})

describe('MaskedPageHeader — variantes', () => {
  it('simple: só borda e texto secundário, sem fundo', () => {
    const style = resolvePageHeaderTokens({ variant: 'simple' }, maskedTheme)
    expect(style['--mc-page-header-bg']).toBeUndefined()
    expect(style['--mc-page-header-border']).toBeDefined()
  })

  it('banner: fundo suave', () => {
    expect(
      resolvePageHeaderTokens({ variant: 'banner', colorTheme: 'baseBlue' }, maskedTheme)[
        '--mc-page-header-bg'
      ]
    ).toContain('color-mix')
  })

  for (const colorTheme of THEMES) {
    it(`gradient (${colorTheme}): texto com contraste >= 4.5 sobre a base`, () => {
      const style = resolvePageHeaderTokens({ variant: 'gradient', colorTheme }, maskedTheme)
      const from =
        /linear-gradient\(135deg, ((?:hsla?|rgba?)\([^)]*\)|#[0-9a-f]+),/i.exec(
          style['--mc-page-header-bg']
        )?.[1] ?? ''
      expect(contrastRatio(style['--mc-page-header-fg'], from)!).toBeGreaterThanOrEqual(AA)
    })
  }
})

describe('MaskedHeader — variantes e precedência', () => {
  it('transparent: sem fundo e sem borda visível; texto herdado', () => {
    const style = resolveHeaderTokens(
      { variant: 'transparent', colorTheme: 'baseBlue' },
      maskedTheme
    )
    expect(style['--mc-header-bg']).toBeUndefined()
    expect(style['--mc-header-fg']).toBeUndefined()
    expect(style['--mc-header-border']).toBe('transparent')
  })

  it('blur: fundo a 80% de opacidade', () => {
    expect(resolveHeaderTokens({ variant: 'blur' }, maskedTheme)['--mc-header-bg']).toContain('80%')
  })

  it('tokens.bg sem tokens.fg re-deriva o fg por contraste', () => {
    const style = resolveHeaderTokens({ variant: 'static', tokens: { bg: '#000000' } }, maskedTheme)
    expect(contrastRatio(style['--mc-header-fg'], '#000000')!).toBeGreaterThanOrEqual(AA)
  })
})

describe('MaskedSidebar — tokens', () => {
  it('minimal não pinta fundo nem borda', () => {
    const style = resolveSidebarTokens({ variant: 'minimal' }, maskedTheme)
    expect(style['--mc-sidebar-bg']).toBeUndefined()
    expect(style['--mc-sidebar-border']).toBeUndefined()
  })

  it('larguras viram tokens', () => {
    const style = resolveSidebarTokens({ width: '300px', collapsedWidth: '64px' }, maskedTheme)
    expect(style['--mc-sidebar-width']).toBe('300px')
    expect(style['--mc-sidebar-collapsed-width']).toBe('64px')
  })
})
