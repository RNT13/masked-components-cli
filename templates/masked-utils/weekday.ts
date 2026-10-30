// Dias da semana: chaves canônicas em inglês + rótulos por locale.
// - Funções puras, SSR-safe, TS >= 4.9.
// - Sem strings de UI fora dos dicionários.

export const DAY_ORDER = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export type Weekday = (typeof DAY_ORDER)[number];

/** Dicionário de rótulos de dia da semana (chave canônica -> rótulo). */
export type WeekdayDictionary = Record<Weekday, string>;

export const WEEKDAY_PT_BR: WeekdayDictionary = {
  monday: "Segunda-feira",
  tuesday: "Terça-feira",
  wednesday: "Quarta-feira",
  thursday: "Quinta-feira",
  friday: "Sexta-feira",
  saturday: "Sábado",
  sunday: "Domingo",
};

export const WEEKDAY_SHORT_PT_BR: WeekdayDictionary = {
  monday: "seg",
  tuesday: "ter",
  wednesday: "qua",
  thursday: "qui",
  friday: "sex",
  saturday: "sáb",
  sunday: "dom",
};

export const WEEKDAY_EN: WeekdayDictionary = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

export const WEEKDAY_SHORT_EN: WeekdayDictionary = {
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
  sunday: "Sun",
};

export const weekdayDictionaries: Record<
  string,
  { long: WeekdayDictionary; short: WeekdayDictionary }
> = {
  "pt-BR": { long: WEEKDAY_PT_BR, short: WEEKDAY_SHORT_PT_BR },
  en: { long: WEEKDAY_EN, short: WEEKDAY_SHORT_EN },
};

const JS_DAY_MAP: Record<number, Weekday> = {
  0: "sunday",
  1: "monday",
  2: "tuesday",
  3: "wednesday",
  4: "thursday",
  5: "friday",
  6: "saturday",
};

// Normaliza o que pode vir de backend ("monday" ou "Segunda-feira").
const PT_BR_TO_KEY: Record<string, Weekday> = {
  "segunda-feira": "monday",
  "terça-feira": "tuesday",
  "quarta-feira": "wednesday",
  "quinta-feira": "thursday",
  "sexta-feira": "friday",
  sábado: "saturday",
  domingo: "sunday",
};

function toWeekdayKey(raw: string): Weekday | null {
  const key = raw.trim().toLowerCase();
  if ((DAY_ORDER as readonly string[]).includes(key)) return key as Weekday;
  return PT_BR_TO_KEY[key] ?? null;
}

function pickWeekdayDict(locale = "pt-BR"): {
  long: WeekdayDictionary;
  short: WeekdayDictionary;
} {
  return (
    weekdayDictionaries[locale] ??
    weekdayDictionaries[locale.split("-")[0]] ??
    weekdayDictionaries["pt-BR"]
  );
}

/**
 * Chave canônica do dia atual ("monday".."sunday").
 * @example getTodayKey() // "wednesday"
 */
export function getTodayKey(options: { now?: Date } = {}): Weekday {
  return JS_DAY_MAP[(options.now ?? new Date()).getDay()];
}

/**
 * Rótulo localizado do dia. Aceita chave canônica ou nome em pt-BR.
 * Desconhecido -> retorna a entrada como veio.
 * @example weekdayLabel('monday')                    // "Segunda-feira"
 * @example weekdayLabel('sábado', { short: true })   // "sáb"
 * @example weekdayLabel('monday', { locale: 'en' })  // "Monday"
 */
export function weekdayLabel(
  raw: string,
  options: { short?: boolean; locale?: string; dict?: WeekdayDictionary } = {},
): string {
  const { short = false, locale, dict } = options;
  const key = toWeekdayKey(raw);
  if (!key) return raw;
  const d =
    dict ??
    (short ? pickWeekdayDict(locale).short : pickWeekdayDict(locale).long);
  return d[key];
}

/** @deprecated use weekdayLabel(raw, { short }) — nome histórico do Zandry. */
export const translateWeekday = (raw: string, short = false): string =>
  weekdayLabel(raw, { short });
