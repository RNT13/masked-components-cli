// templates/masked-utils/duration.ts
//
// Duração em minutos -> texto legível, com dicionários por locale.
// Funções puras, SSR-safe, TypeScript >= 4.9.

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

export const durationDictionaries: Record<string, DurationDictionary> = {
  "pt-BR": { min: "min", hour: "h", minute: "min", empty: "—" },
  en: { min: "min", hour: "h", minute: "min", empty: "—" },
};

function pickDurationDict(options: {
  locale?: string;
  dict?: DurationDictionary;
}): DurationDictionary {
  if (options.dict) return options.dict;
  return (
    durationDictionaries[options.locale ?? "pt-BR"] ??
    durationDictionaries["pt-BR"]
  );
}

/**
 * Formata minutos como duração legível. Inválido/<=0 -> empty do dicionário.
 * @example formatDuration(45)  // "45min"
 * @example formatDuration(90)  // "1h 30min"
 * @example formatDuration(120) // "2h"
 * @example formatDuration(undefined) // "—"
 */
export function formatDuration(
  minutes: number | string | null | undefined,
  options: { locale?: string; dict?: DurationDictionary } = {},
): string {
  const dict = pickDurationDict(options);
  const total = Number(minutes);
  if (!Number.isFinite(total) || total <= 0) return dict.empty;
  if (total < 60) return `${Math.floor(total)}${dict.min}`;
  const hours = Math.floor(total / 60);
  const rest = Math.floor(total) % 60;
  return `${hours}${dict.hour}${rest > 0 ? ` ${rest}${dict.minute}` : ""}`;
}

/**
 * Média de minutos de uma lista, com casas decimais. Lista vazia -> empty do dicionário.
 * @example averageDuration([{ duration: 30 }, { duration: 60 }]) // "45"
 */
export function averageDuration(
  items: Array<{ duration?: number | string | null }>,
  decimals = 0,
  options: { locale?: string; dict?: DurationDictionary } = {},
): string {
  const dict = pickDurationDict(options);
  if (!items.length) return dict.empty;
  const total = items.reduce(
    (acc, item) => acc + (Number(item.duration) || 0),
    0,
  );
  return (total / items.length).toFixed(decimals);
}
