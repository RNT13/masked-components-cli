// templates/masked-utils/duration.ts
//
// Duração em minutos -> texto legível, com dicionários por locale.
// Funções puras, SSR-safe, TypeScript >= 4.9.

import { pickDictionary } from "./locale";

export interface DurationDictionary {
  /** rótulo de minutos isolados (ex.: "45min") */
  min: string;
  /** rótulo de horas (ex.: "1h") */
  hour: string;
  /** rótulo de minutos compostos (ex.: "1h 30min") */
  minute: string;
  /** texto para vazio/inválido/lista vazia */
  empty: string;
}

const DURATION_PT_BR: DurationDictionary = { min: "min", hour: "h", minute: "min", empty: "—" };

export const durationDictionaries: Record<string, DurationDictionary> = {
  "pt-BR": DURATION_PT_BR,
  en: { min: "min", hour: "h", minute: "min", empty: "—" },
};

function resolveDict(options: { locale?: string; dict?: DurationDictionary }): DurationDictionary {
  return options.dict ?? pickDictionary(durationDictionaries, options.locale, DURATION_PT_BR);
}

/**
 * Formata minutos como duração legível. Inválido/menor que 1 -> `empty` do dicionário.
 * @example formatDuration(45)  // "45min"
 * @example formatDuration(90)  // "1h 30min"
 * @example formatDuration(120) // "2h"
 * @example formatDuration(undefined) // "—"
 */
export function formatDuration(
  minutes: number | string | null | undefined,
  options: { locale?: string; dict?: DurationDictionary } = {},
): string {
  const dict = resolveDict(options);
  const total = Math.floor(Number(minutes));
  if (!Number.isFinite(total) || total <= 0) return dict.empty;
  if (total < 60) return `${total}${dict.min}`;
  const hours = Math.floor(total / 60);
  const rest = total % 60;
  return `${hours}${dict.hour}${rest > 0 ? ` ${rest}${dict.minute}` : ""}`;
}

/**
 * Média de minutos de uma lista, com casas decimais. Lista vazia -> `empty` do dicionário.
 * @example averageDuration([{ duration: 30 }, { duration: 60 }]) // "45"
 */
export function averageDuration(
  items: Array<{ duration?: number | string | null }>,
  decimals = 0,
  options: { locale?: string; dict?: DurationDictionary } = {},
): string {
  const dict = resolveDict(options);
  if (!items.length) return dict.empty;
  const total = items.reduce((acc, item) => acc + (Number(item.duration) || 0), 0);
  return (total / items.length).toFixed(decimals);
}
