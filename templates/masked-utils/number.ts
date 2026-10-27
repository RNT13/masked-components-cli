// templates/masked-utils/number.ts

const DEFAULT_LOCALE = "pt-BR";

/**
 * Converte valor em número seguro. Inválido -> 0.
 * @example toNumber('1234.5') // 1234.5
 */
export function toNumber(value: string | number | null | undefined): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

/**
 * Formata número com separadores do locale.
 * @example formatNumber(1234.5) // "1.234,5"
 * @example formatNumber(1234.5, 2, 'en-US') // "1,234.50"
 */
export function formatNumber(
  value: number | string | null | undefined,
  decimals?: number,
  locale: string = DEFAULT_LOCALE,
): string {
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
 */
export function formatDecimal(
  value: number | string | null | undefined,
  decimals = 1,
  locale: string = DEFAULT_LOCALE,
): string {
  return toNumber(value).toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Percentual formatado, com sinal opcional.
 * @example formatPercent(12.345) // "12,3%"
 * @example formatPercent(12.3, 1, true) // "+12,3%"
 */
export function formatPercent(
  value: number | string | null | undefined,
  decimals = 1,
  showSign = false,
  locale: string = DEFAULT_LOCALE,
): string {
  const n = toNumber(value);
  const sign = showSign && n > 0 ? "+" : "";
  return `${sign}${n.toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}%`;
}

/**
 * Percentual 0–100 com clamp.
 * @example percentOf(25, 50) // 50
 */
export function percentOf(
  value: number | null | undefined,
  max: number | null | undefined,
): number {
  if (value == null || max == null) return 0;
  if (!Number.isFinite(value) || !Number.isFinite(max) || max <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((value / max) * 100)));
}

/**
 * padStart de 2 dígitos.
 * @example pad2(5) // "05"
 */
export function pad2(value: number): string {
  return String(value).padStart(2, "0");
}
