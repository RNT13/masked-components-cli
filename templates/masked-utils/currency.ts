// templates/masked-utils/currency.ts

export interface CurrencyOptions {
  locale?: string;
  currency?: string;
}

const DEFAULT_LOCALE = "pt-BR";
const DEFAULT_CURRENCY = "BRL";

const formatterCache = new Map<string, Intl.NumberFormat>();

function getFormatter(locale: string, currency: string): Intl.NumberFormat {
  const key = `${locale}|${currency}`;
  let fmt = formatterCache.get(key);
  if (!fmt) {
    fmt = new Intl.NumberFormat(locale, { style: "currency", currency });
    formatterCache.set(key, fmt);
  }
  return fmt;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Separadores decimal/grupo reais do locale (ex.: pt-BR -> ","/"."; en-US -> "."/","). */
function getSeparators(locale: string): { decimal: string; group: string } {
  const parts = new Intl.NumberFormat(locale).formatToParts(12345.6);
  const decimal = parts.find((p) => p.type === "decimal")?.value ?? ".";
  const group = parts.find((p) => p.type === "group")?.value ?? ",";
  return { decimal, group };
}

/**
 * Formata um número como moeda. Padrão: pt-BR / BRL.
 * @example formatCurrency(1234.5) // "R$ 1.234,50"
 * @example formatCurrency(1234.5, { locale: 'en-US', currency: 'USD' }) // "$1,234.50"
 */
export function formatCurrency(
  value: string | number | null | undefined,
  options: CurrencyOptions = {},
): string {
  const { locale = DEFAULT_LOCALE, currency = DEFAULT_CURRENCY } = options;
  const n = typeof value === "number" ? value : Number(value ?? 0);
  return getFormatter(locale, currency).format(Number.isFinite(n) ? n : 0);
}

/**
 * Converte uma string de moeda em número, respeitando os separadores do locale.
 * @example parseCurrency('R$ 1.234,56') // 1234.56
 * @example parseCurrency('$1,234.56', { locale: 'en-US' }) // 1234.56
 */
export function parseCurrency(
  value: string | number | null | undefined,
  options: { locale?: string } = {},
): number {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (!value) return 0;
  const { locale = DEFAULT_LOCALE } = options;
  const { decimal, group } = getSeparators(locale);
  const cleaned = value
    .replace(
      new RegExp(`[^\\d${escapeRegExp(decimal)}${escapeRegExp(group)}-]`, "g"),
      "",
    )
    .replace(new RegExp(escapeRegExp(group), "g"), "")
    .replace(new RegExp(escapeRegExp(decimal)), ".");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Converte um valor em unidade cheia para centavos (10.5 -> 1050).
 * @example toCents('R$ 10,50') // 1050
 */
export function toCents(
  value: string | number,
  options?: { locale?: string },
): number {
  const n = typeof value === "number" ? value : parseCurrency(value, options);
  return Math.round((Number.isFinite(n) ? n : 0) * 100);
}

/**
 * Converte centavos para unidade cheia (1050 -> 10.5).
 * @example fromCents(1050) // 10.5
 */
export function fromCents(cents: number): number {
  return (Number.isFinite(cents) ? cents : 0) / 100;
}
