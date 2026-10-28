// templates/masked-utils/time.ts
//
// Horário (HH:mm) e tempo relativo, com dicionários por locale.
// Funções puras, SSR-safe: Date/Date.now só lidos dentro das funções e
// sobrescrevíveis por parâmetro (now). TypeScript >= 4.9.

export interface TimeUntilDictionary {
  /** quando já passou ou é agora */
  now: string;
  /** prefixo relativo ("em" / "in") */
  prefix: string;
  /** rótulo de minutos */
  min: string;
  /** rótulo de horas */
  hour: string;
}

export interface TimeAgoDictionary {
  /** menos de 1 minuto ("agora" / "now") */
  now: string;
  /** rótulo de minutos */
  minute: string;
  /** rótulo de horas */
  hour: string;
  /** rótulo de dias */
  day: string;
}

export const timeUntilDictionaries: Record<string, TimeUntilDictionary> = {
  "pt-BR": { now: "agora", prefix: "em", min: "min", hour: "h" },
  en: { now: "now", prefix: "in", min: "min", hour: "h" },
};

export const timeAgoDictionaries: Record<string, TimeAgoDictionary> = {
  "pt-BR": { now: "agora", minute: "min", hour: "h", day: "d" },
  en: { now: "now", minute: "min", hour: "h", day: "d" },
};

function pickDict<T>(
  table: Record<string, T>,
  locale: string | undefined,
  fallback: T,
): T {
  return table[locale ?? "pt-BR"] ?? fallback;
}

/** "09:30" -> 570 (minutos desde 00:00). */
export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}

/** 570 -> "09:30" (clamp em 0). */
export function minutesToTime(totalMinutes: number): string {
  const clamped = Math.max(0, Math.floor(totalMinutes || 0));
  return `${String(Math.floor(clamped / 60)).padStart(2, "0")}:${String(clamped % 60).padStart(2, "0")}`;
}

/**
 * Soma minutos a "HH:MM" COM wrap de 24h — comportamento publicado da lib.
 * Trata negativos com wrap (00:30 - 60 -> "23:30"). Guard "--:--".
 * @example addMinutes('23:30', 60)  // "00:30"
 * @example addMinutes('00:30', -60) // "23:30"
 * @example addMinutes('--:--', 60)  // "--:--"
 */
export function addMinutes(time: string, minutes: number): string {
  if (!time || time === "--:--") return "--:--";
  const delta = Number(minutes);
  if (!Number.isFinite(delta)) return time;
  const total = timeToMinutes(time) + Math.trunc(delta);
  const wrapped = ((total % 1440) + 1440) % 1440;
  return minutesToTime(wrapped);
}

/**
 * Soma minutos a "HH:MM" SEM wrap de 24h — comportamento do Zandry.
 * Clamp em 0 (via minutesToTime), guard "--:--".
 * @example addMinutesNoWrap('23:30', 60) // "24:30"
 * @example addMinutesNoWrap('--:--', 60) // "--:--"
 */
export function addMinutesNoWrap(time: string, minutes: number): string {
  if (!time || time === "--:--") return "--:--";
  const delta = Number(minutes);
  if (!Number.isFinite(delta)) return time;
  return minutesToTime(timeToMinutes(time) + Math.trunc(delta));
}

/** "09:30:00" -> "09:30". */
export function formatTime(time: string): string {
  return time.split(":").slice(0, 2).join(":");
}

/**
 * Tempo relativo até um horário "HH:MM". `now` injetável (SSR/testes).
 * @example getTimeUntil('18:00', { now: new Date('2026-01-01T15:30:00') }) // "em 2h 30min"
 */
export function getTimeUntil(
  time: string,
  options: { now?: Date; locale?: string; dict?: TimeUntilDictionary } = {},
): string {
  const now = options.now ?? new Date();
  const dict =
    options.dict ??
    pickDict(
      timeUntilDictionaries,
      options.locale,
      timeUntilDictionaries["pt-BR"],
    );
  const diff = timeToMinutes(time) - (now.getHours() * 60 + now.getMinutes());
  if (diff <= 0) return dict.now;
  if (diff < 60) return `${dict.prefix} ${diff} ${dict.min}`;
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  return `${dict.prefix} ${h}${dict.hour}${m > 0 ? ` ${m}${dict.min}` : ""}`;
}

/**
 * Tempo decorrido desde uma data/ISO. Dicionário por locale, `now` injetável.
 * @example timeAgo('2026-01-01T12:00:00Z', { now: new Date('2026-01-01T15:00:00Z') }) // "3h"
 * @example timeAgo(date, { locale: 'en' }) // "now" / "5min" / "2h" / "3d"
 */
export function timeAgo(
  value: string | number | Date,
  options: {
    now?: Date | number;
    locale?: string;
    dict?: TimeAgoDictionary;
  } = {},
): string {
  const target =
    value instanceof Date ? value.getTime() : new Date(value).getTime();
  if (Number.isNaN(target)) return "";
  const nowMs =
    options.now instanceof Date
      ? options.now.getTime()
      : (options.now ?? Date.now());
  const dict =
    options.dict ??
    pickDict(timeAgoDictionaries, options.locale, timeAgoDictionaries["pt-BR"]);

  const minutes = Math.floor((nowMs - target) / 60000);
  if (minutes < 1) return dict.now;
  if (minutes < 60) return `${minutes}${dict.minute}`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}${dict.hour}`;
  return `${Math.floor(hours / 24)}${dict.day}`;
}

/* ----- preservados da lib (nada se perde) ----- */

/** Minutos totais -> "HH:MM" (90 -> "01:30"). */
export function minutesToClock(totalMinutes: number): string {
  const clamped = Math.max(0, Math.floor(totalMinutes || 0));
  const hours = Math.floor(clamped / 60);
  const minutes = clamped % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

/** "01:30" -> 90. */
export function clockToMinutes(value?: string | null): number {
  if (!value) return 0;
  const [h = "0", m = "0"] = value.split(":");
  return (Number(h) || 0) * 60 + (Number(m) || 0);
}

/** Data local "YYYY-MM-DD". Padrão: hoje. `date` injetável (testes/SSR). */
export function getLocalDateString(date: Date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
