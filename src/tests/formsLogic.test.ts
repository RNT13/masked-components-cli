import { describe, expect, it } from 'vitest'
import {
  addDays,
  addMonths,
  addYears,
  buildMonthGrid,
  clampISO,
  compareISO,
  daysInMonth,
  endOfWeek,
  formatISO,
  monthLabel,
  parseISO,
  startOfWeek,
  todayISO,
  toISO,
  weekdayLabels,
  weekdayOf
} from '../../templates/masked-forms/MaskedDatePicker/dateGrid'
import {
  filterCommands,
  firstEnabled,
  groupCommands,
  moveActive,
  normalizeText
} from '../../templates/masked-forms/MaskedCommandPalette/commandPaletteTokens'
import { getStepMarks, percentOf } from '../../templates/masked-forms/MaskedSlider/sliderTokens'
import { clampRating } from '../../templates/masked-forms/MaskedRating/ratingTokens'

describe('dateGrid — leitura, validação e aritmética', () => {
  it('parseISO aceita só datas reais no formato YYYY-MM-DD', () => {
    expect(parseISO('2026-11-20')).toEqual({ year: 2026, month: 10, day: 20 })
    expect(parseISO('2024-02-29')).toEqual({ year: 2024, month: 1, day: 29 })
    for (const bad of [
      '2026-02-30',
      '2025-02-29',
      '2026-13-01',
      '2026-00-10',
      '20-11-2026',
      '2026-1-5',
      '',
      null,
      undefined
    ]) {
      expect(parseISO(bad as string)).toBeNull()
    }
    expect(toISO({ year: 2026, month: 10, day: 5 })).toBe('2026-11-05')
  })

  it('daysInMonth respeita ano bissexto', () => {
    expect(daysInMonth(2024, 1)).toBe(29)
    expect(daysInMonth(2026, 1)).toBe(28)
    expect(daysInMonth(2026, 10)).toBe(30)
    expect(daysInMonth(2026, 11)).toBe(31)
    expect(daysInMonth(1900, 1)).toBe(28)
    expect(daysInMonth(2000, 1)).toBe(29)
  })

  it('addDays atravessa mês e ano, também para trás', () => {
    expect(addDays('2026-11-30', 1)).toBe('2026-12-01')
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01')
    expect(addDays('2027-01-01', -1)).toBe('2026-12-31')
    expect(addDays('2024-02-28', 2)).toBe('2024-03-01')
    expect(addDays('2026-11-20', 0)).toBe('2026-11-20')
  })

  it('addDays não é afetado por horário de verão (conta em UTC)', () => {
    expect(addDays('2026-03-07', 1)).toBe('2026-03-08')
    expect(addDays('2026-03-08', 1)).toBe('2026-03-09')
    expect(addDays('2026-10-31', 1)).toBe('2026-11-01')
    expect(addDays('2026-11-01', 1)).toBe('2026-11-02')
    expect(addDays('2026-01-01', 365)).toBe('2027-01-01')
  })

  it('addMonths limita o dia ao último do mês; addYears trata 29/fev', () => {
    expect(addMonths('2026-01-31', 1)).toBe('2026-02-28')
    expect(addMonths('2024-01-31', 1)).toBe('2024-02-29')
    expect(addMonths('2026-03-31', -1)).toBe('2026-02-28')
    expect(addMonths('2026-12-15', 1)).toBe('2027-01-15')
    expect(addMonths('2026-01-15', -1)).toBe('2025-12-15')
    expect(addMonths('2026-01-15', 14)).toBe('2027-03-15')
    expect(addYears('2024-02-29', 1)).toBe('2025-02-28')
    expect(addYears('2024-02-29', 4)).toBe('2028-02-29')
  })

  it('valores inválidos passam sem quebrar', () => {
    expect(addDays('lixo', 3)).toBe('lixo')
    expect(addMonths('lixo', 1)).toBe('lixo')
    expect(weekdayOf('lixo')).toBe(0)
  })
})

describe('dateGrid — semana e grade do mês', () => {
  it('dia da semana de datas conhecidas (0 = domingo)', () => {
    expect(weekdayOf('2026-11-01')).toBe(0)
    expect(weekdayOf('2026-11-20')).toBe(5)
    expect(weekdayOf('2024-02-29')).toBe(4)
    expect(weekdayOf('2000-01-01')).toBe(6)
  })

  it('início e fim da semana para weekStart domingo e segunda', () => {
    expect(startOfWeek('2026-11-20', 0)).toBe('2026-11-15')
    expect(endOfWeek('2026-11-20', 0)).toBe('2026-11-21')
    expect(startOfWeek('2026-11-20', 1)).toBe('2026-11-16')
    expect(endOfWeek('2026-11-20', 1)).toBe('2026-11-22')
    expect(startOfWeek('2026-11-15', 0)).toBe('2026-11-15')
    expect(startOfWeek('2026-11-15', 1)).toBe('2026-11-09')
  })

  it('buildMonthGrid: só as semanas necessárias, dias fora do mês como null', () => {
    const nov = buildMonthGrid(2026, 10, 0)
    expect(nov).toHaveLength(5)
    expect(nov[0][0]).toBe('2026-11-01')
    expect(nov[4].filter(Boolean)).toEqual(['2026-11-29', '2026-11-30'])
    expect(nov.flat().filter(Boolean)).toHaveLength(30)
    const feb = buildMonthGrid(2026, 1, 0)
    expect(feb).toHaveLength(4)
    expect(feb.flat().filter(Boolean)).toHaveLength(28)
    const mon = buildMonthGrid(2026, 10, 1)
    expect(mon[0].slice(0, 6).every((cell) => cell === null)).toBe(true)
    expect(mon[0][6]).toBe('2026-11-01')
    expect(buildMonthGrid(2026, 7, 0)).toHaveLength(6)
  })

  it('toda grade tem 7 colunas, dias em ordem e sem repetição', () => {
    for (let month = 0; month < 12; month++) {
      for (const weekStart of [0, 1, 6]) {
        const grid = buildMonthGrid(2026, month, weekStart)
        expect(grid.every((row) => row.length === 7)).toBe(true)
        const days = grid.flat().filter((d): d is string => d !== null)
        expect(days).toHaveLength(daysInMonth(2026, month))
        expect([...days].sort()).toEqual(days)
        expect(new Set(days).size).toBe(days.length)
      }
    }
  })

  it('comparar e limitar', () => {
    expect(compareISO('2026-01-01', '2026-01-02')).toBeLessThan(0)
    expect(compareISO('2026-01-02', '2026-01-02')).toBe(0)
    expect(clampISO('2026-05-10', '2026-06-01', '2026-06-30')).toBe('2026-06-01')
    expect(clampISO('2026-07-10', '2026-06-01', '2026-06-30')).toBe('2026-06-30')
    expect(clampISO('2026-06-10', '2026-06-01', '2026-06-30')).toBe('2026-06-10')
    expect(clampISO('2026-06-10')).toBe('2026-06-10')
  })

  it('todayISO usa o relógio local (data, não instante UTC)', () => {
    expect(todayISO(new Date(2026, 10, 20, 23, 59))).toBe('2026-11-20')
    expect(todayISO(new Date(2026, 0, 1, 0, 0))).toBe('2026-01-01')
  })
})

describe('dateGrid — formatação por locale (sem deslocar o dia)', () => {
  it('formata em pt-BR e en sem erro de um dia', () => {
    expect(
      formatISO('2026-11-20', 'pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })
    ).toBe('20 de novembro de 2026')
    expect(
      formatISO('2026-11-20', 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })
    ).toBe('November 20, 2026')
    expect(formatISO('2026-01-01', 'pt-BR', { dateStyle: 'full' })).toBe(
      'quinta-feira, 1 de janeiro de 2026'
    )
    expect(formatISO('lixo', 'pt-BR')).toBe('')
  })

  it('rótulo do mês e dos dias da semana na ordem certa', () => {
    expect(monthLabel(2026, 10, 'pt-BR')).toBe('novembro de 2026')
    expect(monthLabel(2026, 10, 'en-US')).toBe('November 2026')
    const sunday = weekdayLabels('pt-BR', 0)
    expect(sunday).toHaveLength(7)
    expect(sunday[0].long).toBe('domingo')
    expect(sunday[6].long).toBe('sábado')
    const monday = weekdayLabels('pt-BR', 1)
    expect(monday[0].long).toBe('segunda-feira')
    expect(monday[6].long).toBe('domingo')
    expect(weekdayLabels('en-US', 0)[1].long).toBe('Monday')
  })
})

describe('busca da paleta de comandos', () => {
  const items = [
    { id: 'novo', label: 'Novo cliente', group: 'Clientes', keywords: ['cadastrar', 'adicionar'] },
    { id: 'lista', label: 'Lista de clientes', group: 'Clientes', description: 'Ver todos' },
    { id: 'config', label: 'Configurações', group: 'Conta' },
    { id: 'tema', label: 'Alternar tema escuro', group: 'Conta', keywords: ['dark'] },
    { id: 'sair', label: 'Sair', disabled: true }
  ]

  it('normaliza acentos, caixa e espaços', () => {
    expect(normalizeText('  Configurações ')).toBe('configuracoes')
    expect(normalizeText('AÇÃO')).toBe('acao')
  })

  it('busca vazia devolve a lista inteira, na mesma ordem', () => {
    expect(filterCommands(items, '')).toBe(items)
    expect(filterCommands(items, '   ')).toBe(items)
  })

  it('acha sem acento e sem diferenciar maiúsculas', () => {
    expect(filterCommands(items, 'configuracoes').map((i) => i.id)).toEqual(['config'])
    expect(filterCommands(items, 'CONFIG').map((i) => i.id)).toEqual(['config'])
  })

  it('várias palavras: todas precisam casar (em rótulo, sinônimo, grupo ou descrição)', () => {
    expect(filterCommands(items, 'cliente novo').map((i) => i.id)).toEqual(['novo'])
    expect(filterCommands(items, 'cadastrar').map((i) => i.id)).toEqual(['novo'])
    expect(filterCommands(items, 'dark').map((i) => i.id)).toEqual(['tema'])
    expect(filterCommands(items, 'conta tema').map((i) => i.id)).toEqual(['tema'])
    expect(filterCommands(items, 'todos').map((i) => i.id)).toEqual(['lista'])
    expect(filterCommands(items, 'zzz')).toEqual([])
  })

  it('ordena por relevância: começa com o termo antes de só conter; empate mantém a ordem', () => {
    expect(filterCommands(items, 'lista').map((i) => i.id)).toEqual(['lista'])
    const result = filterCommands(items, 'cli').map((i) => i.id)
    expect(result).toEqual(['novo', 'lista'])
    const ranked = filterCommands(
      [
        { id: 'a', label: 'Abrir configuração' },
        { id: 'b', label: 'Configuração' }
      ],
      'config'
    ).map((i) => i.id)
    expect(ranked).toEqual(['b', 'a'])
  })

  it('agrupa pela ordem em que cada grupo aparece; itens sem grupo formam um bloco', () => {
    const groups = groupCommands(filterCommands(items, ''))
    expect(groups.map((g) => g.group)).toEqual(['Clientes', 'Conta', undefined])
    expect(groups[0].items.map((i) => i.id)).toEqual(['novo', 'lista'])
  })

  it('navegação pula desabilitados e dá a volta', () => {
    const flat = [
      { id: 'a' },
      { id: 'b', disabled: true },
      { id: 'c' },
      { id: 'd', disabled: true }
    ]
    expect(firstEnabled(flat)).toBe(0)
    expect(firstEnabled([{ disabled: true }])).toBe(-1)
    expect(moveActive(flat, 0, 1)).toBe(2)
    expect(moveActive(flat, 2, 1)).toBe(0)
    expect(moveActive(flat, 0, -1)).toBe(2)
    expect(moveActive([], 0, 1)).toBe(-1)
    expect(moveActive([{ disabled: true }], 0, 1)).toBe(0)
  })
})

describe('slider e rating', () => {
  it('percentOf limita a [0, 100] e trata faixa vazia', () => {
    expect(percentOf(50, 0, 100)).toBe(50)
    expect(percentOf(5, 0, 20)).toBe(25)
    expect(percentOf(-10, 0, 100)).toBe(0)
    expect(percentOf(500, 0, 100)).toBe(100)
    expect(percentOf(3, 1, 5)).toBe(50)
    expect(percentOf(1, 5, 5)).toBe(0)
  })

  it('getStepMarks: uma por passo, ou 11 quando há passos demais', () => {
    expect(getStepMarks(0, 10, 2)).toEqual([0, 2, 4, 6, 8, 10])
    expect(getStepMarks(0, 100, 1)).toHaveLength(11)
    expect(getStepMarks(0, 100, 1)[10]).toBe(100)
    expect(getStepMarks(0, 0, 1)).toEqual([])
    expect(getStepMarks(0, 10, 0)).toEqual([])
  })

  it('clampRating arredonda e mantém em [0, max]', () => {
    expect(clampRating(3.4, 5)).toBe(3)
    expect(clampRating(4.6, 5)).toBe(5)
    expect(clampRating(-2, 5)).toBe(0)
    expect(clampRating(99, 5)).toBe(5)
    expect(clampRating(Number.NaN, 5)).toBe(0)
    expect(clampRating(2, 0)).toBe(1)
  })
})
