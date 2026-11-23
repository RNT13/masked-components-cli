/**
 * Lógica de datas do MaskedDatePicker — funções puras, SSR-safe, sem fuso.
 *
 * Datas viajam como string ISO "YYYY-MM-DD" (a mesma do <input type="date">).
 * Toda conta usa UTC, então horário de verão e fuso do navegador nunca
 * deslocam um dia. A formatação usa `Intl` com `timeZone: 'UTC'` pelo mesmo motivo.
 */

/** "YYYY-MM-DD". */
export type ISODate = string

export interface YMD {
  year: number
  /** 0 a 11. */
  month: number
  day: number
}

const pad = (n: number, length = 2) => String(n).padStart(length, '0')

function utc(year: number, month: number, day: number): Date {
  const date = new Date(0)
  date.setUTCFullYear(year, month, day)
  date.setUTCHours(0, 0, 0, 0)
  return date
}

function fromDate(date: Date): ISODate {
  return `${pad(date.getUTCFullYear(), 4)}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`
}

/** Monta a string ISO a partir de ano/mês(0-11)/dia. */
export function toISO({ year, month, day }: YMD): ISODate {
  return `${pad(year, 4)}-${pad(month + 1)}-${pad(day)}`
}

/** Lê "YYYY-MM-DD". Devolve null se o formato ou a data (ex.: 2026-02-30) forem inválidos. */
export function parseISO(value: string | null | undefined): YMD | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value ?? '')
  if (!match) return null
  const year = Number(match[1])
  const month = Number(match[2]) - 1
  const day = Number(match[3])
  const date = utc(year, month, day)
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month || date.getUTCDate() !== day) {
    return null
  }
  return { year, month, day }
}

export function daysInMonth(year: number, month: number): number {
  return utc(year, month + 1, 0).getUTCDate()
}

export function addDays(iso: ISODate, amount: number): ISODate {
  const ymd = parseISO(iso)
  if (!ymd) return iso
  return fromDate(utc(ymd.year, ymd.month, ymd.day + amount))
}

/** Soma meses mantendo o dia, limitado ao último dia do mês (31/jan + 1 mês = 28 ou 29/fev). */
export function addMonths(iso: ISODate, amount: number): ISODate {
  const ymd = parseISO(iso)
  if (!ymd) return iso
  const total = ymd.year * 12 + ymd.month + amount
  const year = Math.floor(total / 12)
  const month = total - year * 12
  return toISO({ year, month, day: Math.min(ymd.day, daysInMonth(year, month)) })
}

export function addYears(iso: ISODate, amount: number): ISODate {
  return addMonths(iso, amount * 12)
}

/** Dia da semana: 0 (domingo) a 6 (sábado). */
export function weekdayOf(iso: ISODate): number {
  const ymd = parseISO(iso)
  return ymd ? utc(ymd.year, ymd.month, ymd.day).getUTCDay() : 0
}

/** Compara duas datas ISO (negativo, 0 ou positivo). */
export function compareISO(a: ISODate, b: ISODate): number {
  return a < b ? -1 : a > b ? 1 : 0
}

/** Limita `value` ao intervalo [min, max] (cada limite é opcional). */
export function clampISO(value: ISODate, min?: ISODate, max?: ISODate): ISODate {
  if (min && compareISO(value, min) < 0) return min
  if (max && compareISO(value, max) > 0) return max
  return value
}

/** Hoje, no relógio local do usuário, como ISO. */
export function todayISO(now: Date = new Date()): ISODate {
  return `${pad(now.getFullYear(), 4)}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

/** Primeiro dia da semana que contém `iso`. `weekStart`: 0 (domingo) a 6. */
export function startOfWeek(iso: ISODate, weekStart: number): ISODate {
  return addDays(iso, -((weekdayOf(iso) - weekStart + 7) % 7))
}

export function endOfWeek(iso: ISODate, weekStart: number): ISODate {
  return addDays(startOfWeek(iso, weekStart), 6)
}

/**
 * Semanas do mês (linhas de 7). Dias fora do mês vêm como `null`, então o
 * número de linhas é 4 a 6, só o necessário.
 */
export function buildMonthGrid(
  year: number,
  month: number,
  weekStart: number
): (ISODate | null)[][] {
  const first = toISO({ year, month, day: 1 })
  const offset = (weekdayOf(first) - weekStart + 7) % 7
  const total = daysInMonth(year, month)
  const rows = Math.ceil((offset + total) / 7)
  return Array.from({ length: rows }, (_, row) =>
    Array.from({ length: 7 }, (_, col) => {
      const day = row * 7 + col - offset + 1
      return day >= 1 && day <= total ? toISO({ year, month, day }) : null
    })
  )
}

/** Data por extenso/curta no idioma dado (`Intl`, sempre em UTC). */
export function formatISO(
  iso: ISODate,
  locale: string,
  options: Intl.DateTimeFormatOptions = { dateStyle: 'medium' }
): string {
  const ymd = parseISO(iso)
  if (!ymd) return ''
  return new Intl.DateTimeFormat(locale, { ...options, timeZone: 'UTC' }).format(
    utc(ymd.year, ymd.month, ymd.day)
  )
}

/** "novembro de 2026" / "November 2026". */
export function monthLabel(year: number, month: number, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(utc(year, month, 1))
}

/** Nomes dos dias da semana na ordem de exibição (curto e longo). */
export function weekdayLabels(
  locale: string,
  weekStart: number
): { short: string; long: string }[] {
  const short = new Intl.DateTimeFormat(locale, { weekday: 'short', timeZone: 'UTC' })
  const long = new Intl.DateTimeFormat(locale, { weekday: 'long', timeZone: 'UTC' })
  /* 2023-01-01 foi um domingo */
  return Array.from({ length: 7 }, (_, i) => {
    const date = utc(2023, 0, 1 + ((weekStart + i) % 7))
    return { short: short.format(date), long: long.format(date) }
  })
}
