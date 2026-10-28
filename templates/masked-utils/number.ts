// templates/masked-utils/number.ts

export interface NumberFormatOptions {
  /** Locale de formatação. Padrão "pt-BR". */
  locale?: string;
}

const DEFAULT_LOCALE = "pt-BR";

/**
 * Converte valor em número seguro. Inválido -> 0.
 * Strings usam parseFloat (parsing "solto": '12,5' -> 12, '10abc' -> 10).
 * @example toNumber('1234.5') // 1234.5
 * @example toNumber('12,5')   // 12
 * @example toNumber('abc')    // 0
 */
export function toNumber(value: string | number | null | undefined): number {
  const parsed =
    typeof value === "string" ? parseFloat(value) : Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

/**
 * Formata número com separadores do locale.
 * @example formatNumber(1234.5) // "1.234,5"
 * @example formatNumber(1234.5, 2, { locale: 'en-US' }) // "1,234.50"
 */
export function formatNumber(
  value: number | string | null | undefined,
  decimals?: number,
  options: NumberFormatOptions = {},
): string {
  const { locale = DEFAULT_LOCALE } = options;
  return toNumber(value).toLocaleString(
    locale,
    decimals !== undefined
      ? { minimumFractionDigits: decimals, maximumFractionDigits: decimals }
      : undefined,
  );
}

/**
 * Número com casas fixas, no separador do locale (bug fix: Zandry emitia "." sempre).
 * @example formatDecimal(12.345) // "12,3"
 * @example formatDecimal(12.345, 1, { locale: 'en-US' }) // "12.3"
 */
export function formatDecimal(
  value: number | string | null | undefined,
  decimals = 1,
  options: NumberFormatOptions = {},
): string {
  const { locale = DEFAULT_LOCALE } = options;
  return toNumber(value).toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Percentual formatado, com sinal opcional.
 * @example formatPercent(12.345) // "12,3%"
 * @example formatPercent(12.3, 1, { showSign: true }) // "+12,3%"
 * @example formatPercent(12.3, 1, { locale: 'en-US' }) // "12.3%"
 */
export function formatPercent(
  value: number | string | null | undefined,
  decimals = 1,
  options: NumberFormatOptions & { showSign?: boolean } = {},
): string {
  const { locale = DEFAULT_LOCALE, showSign = false } = options;
  const n = toNumber(value);
  const sign = showSign && n > 0 ? "+" : "";
  return `${sign}${n.toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}%`;
}

/**
 * Percentual 0–100 com clamp.
 * @example getPercentage(25, 50) // 50
 */
export function getPercentage(value: number, maxValue: number): number {
  if (!maxValue || maxValue <= 0) return 0;
  return Math.min(100, Math.round((value / maxValue) * 100));
}
