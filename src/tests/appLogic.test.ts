import { describe, expect, it } from 'vitest'
import { maskedTheme } from '../../templates/masked-themes/MaskedThemes/MaskedThemes'
import { listColorThemes } from '../../templates/masked-themes/MaskedThemes/ColorThemes'
import { contrastRatio } from '../../templates/masked-utils/color'
import {
  clampPage,
  getPageRange
} from '../../templates/masked-app/MaskedPagination/paginationTokens'
import { nextSort, sortRows } from '../../templates/masked-app/MaskedTable/tableTokens'
import { toggleOpen } from '../../templates/masked-app/MaskedAccordion/accordionTokens'
import {
  edgeEnabledIndex,
  nextEnabledIndex
} from '../../templates/masked-app/MaskedTabs/tabsTokens'
import { collapseBreadcrumb } from '../../templates/masked-app/MaskedBreadcrumb/breadcrumbTokens'
import {
  getStepProgress,
  getStepStatus
} from '../../templates/masked-app/MaskedStepper/stepperTokens'
import { resolveAvatarSize } from '../../templates/masked-app/MaskedAvatar/avatarTokens'

describe('getPageRange', () => {
  it('poucas páginas: mostra todas', () => {
    expect(getPageRange(1, 1)).toEqual([1])
    expect(getPageRange(3, 5)).toEqual([1, 2, 3, 4, 5])
    expect(getPageRange(4, 7)).toEqual([1, 2, 3, 4, 5, 6, 7])
  })

  it('início, meio e fim com reticências', () => {
    expect(getPageRange(1, 20)).toEqual([1, 2, 3, 4, 5, 'ellipsis-end', 20])
    expect(getPageRange(10, 20)).toEqual([1, 'ellipsis-start', 9, 10, 11, 'ellipsis-end', 20])
    expect(getPageRange(20, 20)).toEqual([1, 'ellipsis-start', 16, 17, 18, 19, 20])
  })

  it('a quantidade de itens é constante (2*sibling + 5) para a barra não pular', () => {
    for (const sibling of [0, 1, 2]) {
      for (let page = 1; page <= 30; page++) {
        expect(getPageRange(page, 30, sibling)).toHaveLength(sibling * 2 + 5)
      }
    }
  })

  it('sempre inclui a primeira, a última e a atual; sem duplicatas', () => {
    for (let page = 1; page <= 30; page++) {
      const range = getPageRange(page, 30)
      expect(range[0]).toBe(1)
      expect(range[range.length - 1]).toBe(30)
      expect(range).toContain(page)
      const numbers = range.filter((x) => typeof x === 'number')
      expect(new Set(numbers).size).toBe(numbers.length)
    }
  })

  it('valores inválidos são limitados ao intervalo', () => {
    expect(getPageRange(99, 20).includes(20)).toBe(true)
    expect(getPageRange(-5, 20)[0]).toBe(1)
    expect(getPageRange(1, 0)).toEqual([1])
    expect(clampPage(0, 10)).toBe(1)
    expect(clampPage(11, 10)).toBe(10)
    expect(clampPage(4.7, 10)).toBe(4)
  })
})

describe('sortRows / nextSort', () => {
  type Row = { id: number; name: string | null; n: number | null; d?: Date }
  const columns = [
    { key: 'name', header: 'Nome', sortable: true },
    { key: 'n', header: 'N', sortable: true },
    { key: 'd', header: 'Data', sortable: true },
    { key: 'len', header: 'Tam', sortValue: (r: Row) => (r.name ?? '').length }
  ]
  const data: Row[] = [
    { id: 1, name: 'item 10', n: 10, d: new Date('2026-03-01') },
    { id: 2, name: 'item 2', n: 2, d: new Date('2026-01-01') },
    { id: 3, name: null, n: null },
    { id: 4, name: 'Abacaxi', n: 7, d: new Date('2026-02-01') }
  ]
  const ids = (rows: Row[]) => rows.map((r) => r.id)

  it('sem ordenação ou coluna desconhecida: devolve os dados como estão', () => {
    expect(sortRows(data, columns, undefined)).toBe(data)
    expect(sortRows(data, columns, { key: 'x', direction: 'asc' })).toBe(data)
  })

  it('números, texto com ordem natural ("2" antes de "10") e datas', () => {
    expect(ids(sortRows(data, columns, { key: 'n', direction: 'asc' }))).toEqual([2, 4, 1, 3])
    expect(ids(sortRows(data, columns, { key: 'name', direction: 'asc' }))).toEqual([4, 2, 1, 3])
    expect(ids(sortRows(data, columns, { key: 'd', direction: 'asc' }))).toEqual([2, 4, 1, 3])
  })

  it('valores vazios vão para o fim em qualquer direção; desc inverte o resto', () => {
    expect(ids(sortRows(data, columns, { key: 'n', direction: 'desc' }))).toEqual([1, 4, 2, 3])
    expect(sortRows(data, columns, { key: 'name', direction: 'desc' }).at(-1)?.id).toBe(3)
  })

  it('usa sortValue quando existe; é estável e não altera o array original', () => {
    const copy = [...data]
    const sorted = sortRows(data, columns, { key: 'len', direction: 'asc' })
    expect(ids(sorted)).toEqual([3, 2, 1, 4])
    expect(data).toEqual(copy)
    const ties = [
      { id: 1, name: 'a', n: 1 },
      { id: 2, name: 'b', n: 1 },
      { id: 3, name: 'c', n: 1 }
    ]
    expect(ids(sortRows(ties, columns, { key: 'n', direction: 'desc' }))).toEqual([1, 2, 3])
  })

  it('nextSort percorre asc → desc → sem ordenação e troca de coluna reinicia', () => {
    const a = nextSort(undefined, 'name')
    expect(a).toEqual({ key: 'name', direction: 'asc' })
    const b = nextSort(a, 'name')
    expect(b).toEqual({ key: 'name', direction: 'desc' })
    expect(nextSort(b, 'name')).toBeUndefined()
    expect(nextSort(b, 'n')).toEqual({ key: 'n', direction: 'asc' })
  })
})

describe('toggleOpen (accordion)', () => {
  it('múltiplo: adiciona e remove', () => {
    const o = { multiple: true, collapsible: true }
    expect(toggleOpen([], 'a', o)).toEqual(['a'])
    expect(toggleOpen(['a'], 'b', o)).toEqual(['a', 'b'])
    expect(toggleOpen(['a', 'b'], 'a', o)).toEqual(['b'])
  })

  it('único: abre só um; fechar depende de collapsible', () => {
    expect(toggleOpen(['a'], 'b', { multiple: false, collapsible: true })).toEqual(['b'])
    expect(toggleOpen(['a'], 'a', { multiple: false, collapsible: true })).toEqual([])
    expect(toggleOpen(['a'], 'a', { multiple: false, collapsible: false })).toEqual(['a'])
  })
})

describe('navegação das abas', () => {
  const disabled = [false, true, false, false]

  it('pula abas desabilitadas e dá a volta', () => {
    expect(nextEnabledIndex(disabled, 0, 1)).toBe(2)
    expect(nextEnabledIndex(disabled, 3, 1)).toBe(0)
    expect(nextEnabledIndex(disabled, 0, -1)).toBe(3)
    expect(nextEnabledIndex(disabled, 2, -1)).toBe(0)
  })

  it('Home/End vão para a primeira/última habilitada; tudo desabilitado fica onde está', () => {
    expect(edgeEnabledIndex([true, false, false, true], 'first')).toBe(1)
    expect(edgeEnabledIndex([true, false, false, true], 'last')).toBe(2)
    expect(nextEnabledIndex([true, true], 0, 1)).toBe(0)
  })
})

describe('collapseBreadcrumb', () => {
  const items = ['a', 'b', 'c', 'd', 'e']

  it('sem limite ou dentro do limite: tudo visível', () => {
    expect(collapseBreadcrumb(items, undefined)).toHaveLength(5)
    expect(collapseBreadcrumb(items, 5)).toHaveLength(5)
  })

  it('acima do limite: primeiro + … + últimos', () => {
    const entries = collapseBreadcrumb(items, 3)
    expect(entries.map((e) => (e.kind === 'ellipsis' ? '…' : e.item))).toEqual(['a', '…', 'e'])
    const four = collapseBreadcrumb(items, 4)
    expect(four.map((e) => (e.kind === 'ellipsis' ? '…' : e.item))).toEqual(['a', '…', 'd', 'e'])
  })

  it('limite menor que 3 não colapsa (evita esconder a página atual)', () => {
    expect(collapseBreadcrumb(items, 2)).toHaveLength(5)
  })
})

describe('stepper', () => {
  it('status por índice, com atual limitado ao intervalo', () => {
    expect([0, 1, 2].map((i) => getStepStatus(i, 1, 3))).toEqual([
      'complete',
      'current',
      'upcoming'
    ])
    expect(getStepStatus(2, 99, 3)).toBe('current')
    expect(getStepStatus(0, -4, 3)).toBe('current')
  })

  it('progresso em percentual', () => {
    expect(getStepProgress(0, 4)).toBe(0)
    expect(getStepProgress(1, 4)).toBe(33)
    expect(getStepProgress(3, 4)).toBe(100)
    expect(getStepProgress(0, 1)).toBe(100)
  })
})

describe('avatar', () => {
  it('tamanhos nomeados e numéricos', () => {
    expect(resolveAvatarSize(undefined)).toBe(40)
    expect(resolveAvatarSize('xs')).toBe(24)
    expect(resolveAvatarSize('xl')).toBe(80)
    expect(resolveAvatarSize(52)).toBe(52)
  })
})

describe('contraste WCAG AA dos componentes de app, em todos os temas', () => {
  const THEMES = [...listColorThemes(), 'baseBlue', 'baseRose', 'baseLilac']
  it('exporta os resolvedores de tokens', async () => {
    const [badge, avatar, empty, tabs, pagination, stepper, dashboard] = await Promise.all([
      import('../../templates/masked-app/MaskedBadge/badgeTokens'),
      import('../../templates/masked-app/MaskedAvatar/avatarTokens'),
      import('../../templates/masked-app/MaskedEmptyState/emptyStateTokens'),
      import('../../templates/masked-app/MaskedTabs/tabsTokens'),
      import('../../templates/masked-app/MaskedPagination/paginationTokens'),
      import('../../templates/masked-app/MaskedStepper/stepperTokens'),
      import('../../templates/masked-app/MaskedDashboard/dashboardTokens')
    ])
    for (const colorTheme of THEMES) {
      const b = badge.resolveBadgeTokens({ variant: 'solid', colorTheme }, maskedTheme)
      expect(
        contrastRatio(b['--mc-badge-fg'], b['--mc-badge-bg'])!,
        `badge ${colorTheme}`
      ).toBeGreaterThanOrEqual(4.5)
      const a = avatar.resolveAvatarTokens({ colorTheme }, maskedTheme)
      expect(
        contrastRatio(a['--mc-avatar-fg'], a['--mc-avatar-bg'])!,
        `avatar ${colorTheme}`
      ).toBeGreaterThanOrEqual(4.5)
      const e = empty.resolveEmptyStateTokens({ colorTheme }, maskedTheme)
      expect(
        contrastRatio(e['--mc-empty-state-accent-fg'], e['--mc-empty-state-accent'])!
      ).toBeGreaterThanOrEqual(4.5)
      const t = tabs.resolveTabsTokens({ colorTheme }, maskedTheme)
      expect(
        contrastRatio(t['--mc-tabs-accent-fg'], t['--mc-tabs-accent'])!
      ).toBeGreaterThanOrEqual(4.5)
      const p = pagination.resolvePaginationTokens({ colorTheme }, maskedTheme)
      expect(
        contrastRatio(p['--mc-pagination-accent-fg'], p['--mc-pagination-accent'])!
      ).toBeGreaterThanOrEqual(4.5)
      const s = stepper.resolveStepperTokens({ colorTheme }, maskedTheme)
      expect(
        contrastRatio(s['--mc-stepper-accent-fg'], s['--mc-stepper-accent'])!
      ).toBeGreaterThanOrEqual(4.5)
      const d = dashboard.resolveDashboardTokens({ variant: 'saas', colorTheme }, maskedTheme)
      expect(
        contrastRatio(d['--mc-dashboard-topbar-fg'], d['--mc-dashboard-topbar-bg'])!
      ).toBeGreaterThanOrEqual(4.5)
    }
  })

  it('sem colorTheme: pares neutros do tema também com contraste (badge sólido, avatar, tooltip)', async () => {
    const { resolveBadgeTokens } =
      await import('../../templates/masked-app/MaskedBadge/badgeTokens')
    const { resolveTooltipTokens } =
      await import('../../templates/masked-app/MaskedTooltip/tooltipTokens')
    const { resolveAvatarTokens } =
      await import('../../templates/masked-app/MaskedAvatar/avatarTokens')
    const b = resolveBadgeTokens({ variant: 'solid' }, maskedTheme)
    expect(contrastRatio(b['--mc-badge-fg'], b['--mc-badge-bg'])!).toBeGreaterThanOrEqual(4.5)
    for (const variant of ['dark', 'light'] as const) {
      const t = resolveTooltipTokens({ variant }, maskedTheme)
      expect(contrastRatio(t['--mc-tooltip-fg'], t['--mc-tooltip-bg'])!).toBeGreaterThanOrEqual(4.5)
    }
    const a = resolveAvatarTokens({}, maskedTheme)
    expect(contrastRatio(a['--mc-avatar-fg'], a['--mc-avatar-bg'])!).toBeGreaterThanOrEqual(4.5)
  })

  it('badge: soft/outline/dot só emitem o que pintam; dashboard: analytics tinge o conteúdo', async () => {
    const { resolveBadgeTokens } =
      await import('../../templates/masked-app/MaskedBadge/badgeTokens')
    const { resolveDashboardTokens } =
      await import('../../templates/masked-app/MaskedDashboard/dashboardTokens')
    expect(
      resolveBadgeTokens({ variant: 'dot', colorTheme: 'baseBlue' }, maskedTheme)['--mc-badge-dot']
    ).toBeDefined()
    expect(
      resolveBadgeTokens({ variant: 'outline', colorTheme: 'baseBlue' }, maskedTheme)[
        '--mc-badge-bg'
      ]
    ).toBeUndefined()
    expect(
      resolveDashboardTokens({ variant: 'analytics' }, maskedTheme)['--mc-dashboard-content-bg']
    ).toBeDefined()
    expect(
      resolveDashboardTokens({ variant: 'minimal' }, maskedTheme)['--mc-dashboard-content-bg']
    ).toBeUndefined()
    const t = resolveDashboardTokens(
      { variant: 'saas', tokens: { topbarBg: '#000000' } },
      maskedTheme
    )
    expect(contrastRatio(t['--mc-dashboard-topbar-fg'], '#000000')!).toBeGreaterThanOrEqual(4.5)
  })
})
