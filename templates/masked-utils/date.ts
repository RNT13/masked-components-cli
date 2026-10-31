//
// Datas (ISO "YYYY-MM-DD" / BR "DD/MM/YYYY") e rótulos de mês/dia.
// - Funções puras e SSR-safe: `new Date()` só é lido dentro das funções e pode
//   ser sobrescrito via options.now onde aplicável.
// - Datas "só dia" são tratadas como dia de calendário (UTC), então o resultado
//   NÃO muda com o fuso da máquina nem em virada de horário de verão.
// - Locale padrão "pt-BR"; os formatos Intl aceitam options.locale.
// - Compatível com TypeScript >= 4.9.

const DEFAULT_LOCALE = "pt-BR";

interface YmdParts {
  year: number;
  month: number;
  day: number;
}

/** A data existe no calendário? (rejeita 31/02, mês 13 etc.) */
function isValidYmd(year: number, month: number, day: number): boolean {
  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day);
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

/** Lê "YYYY-MM-DD" (aceita sufixo de horário: "2025-12-31T10:00:00Z"). */
function parseIsoDate(value: string | null | undefined): YmdParts | null {
  if (!value) return null;
  const match = /^(\d{4})-(\d{1,2})-(\d{1,2})(?:$|[T\s])/.exec(value.trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  return isValidYmd(year, month, day) ? { year, month, day } : null;
}

function toUtcDate(parts: YmdParts): Date {
  const date = new Date(0);
  date.setUTCFullYear(parts.year, parts.month - 1, parts.day);
  return date;
}

const formatterCache = new Map<string, Intl.DateTimeFormat>();

function getFormatter(locale: string, options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  const key = `${locale}|${JSON.stringify(options)}`;
  let formatter = formatterCache.get(key);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(locale, { ...options, timeZone: "UTC" });
    formatterCache.set(key, formatter);
  }
  return formatter;
}

const pad2 = (value: number): string => String(value).padStart(2, "0");

/* ──────────────── conversões ISO <-> BR ──────────────── */

/**
 * "2026-08-09" -> "09/08/2026". Aceita data com horário. Inválido -> "".
 * @example formatDateBR('2026-12-31') // "31/12/2026"
 */
export function formatDateBR(value?: string | null): string {
  const parts = parseIsoDate(value);
  if (!parts) return "";
  return `${pad2(parts.day)}/${pad2(parts.month)}/${String(parts.year).padStart(4, "0")}`;
}

/**
 * Sinônimo de formatDateBR (nome histórico da lib).
 * @example isoToBr('2025-12-31') // "31/12/2025"
 */
export function isoToBr(value?: string | null): string {
  return formatDateBR(value);
}

/**
 * Data formatada via Intl no `locale` (padrão pt-BR -> "31/12/2025").
 * Mantém a assinatura publicada da lib: o locale NÃO é ignorado.
 * Inválido -> "" (não lança erro).
 * @example formatDate('2025-12-31') // "31/12/2025"
 * @example formatDate('2025-12-31', 'en-US') // "12/31/2025"
 */
export function formatDate(value: string | null | undefined, locale = DEFAULT_LOCALE): string {
  const parts = parseIsoDate(value);
  if (!parts) return "";
  return getFormatter(locale, { day: "2-digit", month: "2-digit", year: "numeric" }).format(toUtcDate(parts));
}

/**
 * "09/08/2026" -> "2026-08-09". Formato ou data inexistente -> null.
 * @example brToIso('31/12/2025') // "2025-12-31"
 * @example brToIso('31/02/2025') // null
 */
export function brToIso(value: string): string | null {
  if (!value) return null;
  const match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(value.trim());
  if (!match) return null;
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  if (!isValidYmd(year, month, day)) return null;
  return `${String(year).padStart(4, "0")}-${pad2(month)}-${pad2(day)}`;
}

/* ──────────────── chaves e rótulos curtos ──────────────── */

/**
 * "2026-08-09" | ISO datetime -> "2026-08".
 * @example monthKey('2026-08-09') // "2026-08"
 */
export function monthKey(value: string): string {
  return value.slice(0, 7);
}

/**
 * "2026-08" -> mês abreviado + ano de 2 dígitos no locale (pt-BR: "ago. de 26"). Inválido -> "".
 * @example monthLabel('2026-08', { locale: 'en' }) // "Aug 26"
 */
export function monthLabel(key: string, options: { locale?: string } = {}): string {
  const { locale = DEFAULT_LOCALE } = options;
  const match = /^(\d{4})-(\d{2})/.exec(key);
  if (!match) return "";
  const parts = { year: Number(match[1]), month: Number(match[2]), day: 1 };
  if (!isValidYmd(parts.year, parts.month, parts.day)) return "";
  return getFormatter(locale, { month: "short", year: "2-digit" }).format(toUtcDate(parts));
}

/**
 * "2026-08-09" -> "09/08". Inválido -> "".
 * @example dayMonthLabel('2026-08-09') // "09/08"
 */
export function dayMonthLabel(value: string): string {
  const parts = parseIsoDate(value);
  return parts ? `${pad2(parts.day)}/${pad2(parts.month)}` : "";
}

/**
 * Últimos N meses (incluindo o atual) como chaves "YYYY-MM", em ordem crescente.
 * @example lastMonthKeys(3, { now: new Date(2026, 9, 28) }) // ["2026-08","2026-09","2026-10"]
 */
export function lastMonthKeys(months: number, options: { now?: Date } = {}): string[] {
  const now = options.now ?? new Date();
  return Array.from({ length: Math.max(0, Math.floor(months)) }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (months - 1 - i), 1);
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}`;
  });
}

/* ──────────────── formatos longos (Intl, por locale) ──────────────── */

export interface DateLongOptions {
  /** Inclui o ano ("… de 2026"). */
  withYear?: boolean;
  /** Retorno quando a data é inválida/vazia. */
  fallback?: string;
  locale?: string;
}

/**
 * "2026-08-09" -> "domingo, 9 de agosto" (withYear -> "… de 2026"). Inválido -> fallback.
 * @example formatDateLong('2026-08-09') // "domingo, 9 de agosto"
 */
export function formatDateLong(value?: string | null, options: DateLongOptions = {}): string {
  const { withYear = false, fallback = "--", locale = DEFAULT_LOCALE } = options;
  const parts = parseIsoDate(value);
  if (!parts) return fallback;
  return getFormatter(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    ...(withYear ? { year: "numeric" as const } : {}),
  }).format(toUtcDate(parts));
}

/**
 * "2026-08-09" -> "09 ago" (rótulo de gráfico). Inválido -> "".
 * @example dayMonthShortLabel('2026-09-08') // "08 set"
 */
export function dayMonthShortLabel(value: string, options: { locale?: string } = {}): string {
  const { locale = DEFAULT_LOCALE } = options;
  const parts = parseIsoDate(value);
  if (!parts) return "";
  return getFormatter(locale, { day: "2-digit", month: "short" }).format(toUtcDate(parts));
}

/** Sinônimo de dayMonthShortLabel (nome histórico). */
export function dayShortMonthLabel(value: string, options: { locale?: string } = {}): string {
  return dayMonthShortLabel(value, options);
}

/**
 * month 1-12 -> "Janeiro" (capitalizado, por locale). Fora do intervalo -> "".
 * @example monthNameLong(8) // "Agosto"
 * @example monthNameLong(8, { locale: 'en' }) // "August"
 */
export function monthNameLong(month: number, options: { locale?: string } = {}): string {
  const { locale = DEFAULT_LOCALE } = options;
  if (!Number.isInteger(month) || month < 1 || month > 12) return "";
  const name = getFormatter(locale, { month: "long" }).format(toUtcDate({ year: 2020, month, day: 1 }));
  return name.charAt(0).toUpperCase() + name.slice(1);
}
