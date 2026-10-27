// templates/masked-utils/duration.ts

export interface DurationDictionary {
  /** rótulo de minutos curtos (ex.: "45 min") */
  min: string;
  /** rótulo de horas (ex.: "1h") */
  hour: string;
  /** rótulo de minutos compostos (ex.: "1h 30m") */
  minute: string;
  /** texto para lista vazia */
  empty: string;
}

export const durationDictionaries: Record<string, DurationDictionary> = {
  "pt-BR": { min: "min", hour: "h", minute: "m", empty: "—" },
  en: { min: "min", hour: "h", minute: "m", empty: "—" },
};

/**
 * Formata minutos como duração legível.
 * @example formatDuration(90) // "1h 30m"
 * @example formatDuration(45) // "45 min"
 * @example formatDuration(0)  // "0 min"
 */
export function formatDuration(
  minutes: number | string,
  dict: DurationDictionary = durationDictionaries["pt-BR"],
): string {
  const total = Number(minutes);
  if (!Number.isFinite(total) || total <= 0) return `0 ${dict.min}`;
  if (total < 60) return `${total} ${dict.min}`;
  const hours = Math.floor(total / 60);
  const rest = total % 60;
  return `${hours}${dict.hour}${rest > 0 ? ` ${rest}${dict.minute}` : ""}`;
}

/**
 * Média de minutos de uma lista, com casas decimais. Lista vazia -> empty do dicionário.
 * @example averageDuration([{ duration: 30 }, { duration: 60 }]) // "45"
 */
export function averageDuration(
  items: Array<{ duration?: number | string | null }>,
  decimals = 0,
  dict: DurationDictionary = durationDictionaries["pt-BR"],
): string {
  if (!items.length) return dict.empty;
  const total = items.reduce(
    (acc, item) => acc + (Number(item.duration) || 0),
    0,
  );
  return (total / items.length).toFixed(decimals);
}
