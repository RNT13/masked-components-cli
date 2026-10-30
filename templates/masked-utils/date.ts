//
// Datas (ISO "YYYY-MM-DD" / BR "DD/MM/YYYY") e rótulos de mês/dia.
// - Funções puras e SSR-safe: `new Date()` só é lido dentro das funções
//   e pode ser sobrescrito via options.now onde aplicável.
// - Locale padrão "pt-BR"; todos os formatos Intl aceitam options.locale.
// - Compatível com TypeScript >= 4.9.

const DEFAULT_LOCALE = "pt-BR";

/* ──────────────── conversões ISO <-> BR ──────────────── */

/**
 * "2026-08-09" -> "09/08/2026". Inválido -> "".
 * @example formatDateBR('2026-12-31') // "31/12/2026"
 */
export function formatDateBR(value?: string | null): string {
  if (!value) return "";
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return "";
  return `${day}/${month}/${year}`;
}

/** Sinônimo de formatDateBR (nomes históricos). */
export const isoToBr = formatDateBR;

/**
 * Sinônimo de formatDateBR — canônico do Zandry.
 * BREAKING vs. versão anterior da lib (Intl + locale posicional):
 * para formatação por locale use formatDateLong/dayMonthShortLabel.
 */
export const formatDate = formatDateBR;

/**
 * "09/08/2026" -> "2026-08-09". Inválido -> null.
 * @example brToIso('31/12/2025') // "2025-12-31"
 */
export function brToIso(value: string): string | null {
  if (!value) return null;
  const [day, month, year] = value.split("/");
  if (!day || !month || !year || year.length !== 4) return null;
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
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
 * "2026-08" -> "ago/26" (pt-BR) | "Aug 26" (en).
 * @example monthLabel('2026-08') // "ago/26"
 */
export function monthLabel(
  key: string,
  options: { locale?: string } = {},
): string {
  const { locale = DEFAULT_LOCALE } = options;
  const [year, month] = key.split("-");
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    year: "2-digit",
  }).format(new Date(Number(year), Number(month) - 1, 1));
}

/**
 * "2026-08-09" -> "09/08".
 * @example dayMonthLabel('2026-08-09') // "09/08"
 */
export function dayMonthLabel(value: string): string {
  const [, month, day] = value.split("-");
  return `${day}/${month}`;
}

/**
 * Últimos N meses (incluindo o atual) como chaves "YYYY-MM", em ordem crescente.
 * @example lastMonthKeys(3) // ["2026-08","2026-09","2026-10"]
 */
export function lastMonthKeys(
  months: number,
  options: { now?: Date } = {},
): string[] {
  const now = options.now ?? new Date();
  return Array.from({ length: months }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (months - 1 - i), 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
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
export function formatDateLong(
  value?: string | null,
  options: DateLongOptions = {},
): string {
  const {
    withYear = false,
    fallback = "--",
    locale = DEFAULT_LOCALE,
  } = options;
  if (!value) return fallback;
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return fallback;
  const fmt = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    ...(withYear ? { year: "numeric" as const } : {}),
  });
  return fmt.format(parsed);
}

/**
 * "2026-08-09" -> "09 ago" (label de gráfico). Inválido -> "".
 * @example dayShortMonthLabel('2026-08-09') // "09 ago"
 */
export function dayShortMonthLabel(
  value: string,
  options: { locale?: string } = {},
): string {
  const { locale = DEFAULT_LOCALE } = options;
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return "";
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
  }).format(parsed);
}

/**
 * "2026-09-08" -> "08 set". Inválido -> "" (guarda adicionada vs. Zandry, que lançava).
 * @example dayMonthShortLabel('2026-09-08') // "08 set"
 */
export function dayMonthShortLabel(
  value: string,
  options: { locale?: string } = {},
): string {
  const { locale = DEFAULT_LOCALE } = options;
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return "";
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
  }).format(parsed);
}

/**
 * month 1-12 -> "Janeiro" (capitalizado, por locale).
 * @example monthNameLong(8) // "Agosto"
 */
export function monthNameLong(
  month: number,
  options: { locale?: string } = {},
): string {
  const { locale = DEFAULT_LOCALE } = options;
  if (month < 1 || month > 12) return "";
  const name = new Intl.DateTimeFormat(locale, { month: "long" }).format(
    new Date(2020, month - 1, 1),
  );
  return name.charAt(0).toUpperCase() + name.slice(1);
}
