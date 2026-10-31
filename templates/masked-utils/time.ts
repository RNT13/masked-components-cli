// templates/masked-utils/time.ts
//
// Horário (HH:mm) e tempo relativo, com dicionários por locale.
// Funções puras, SSR-safe: Date/Date.now só são lidos dentro das funções e
// podem ser sobrescritos por parâmetro (now). TypeScript >= 4.9.

import { pickDictionary } from "./locale";

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

const TIME_UNTIL_PT_BR: TimeUntilDictionary = { now: "agora", prefix: "em", min: "min", hour: "h" };
const TIME_AGO_PT_BR: TimeAgoDictionary = { now: "agora", minute: "min", hour: "h", day: "d" };

/** Dicionários de `getTimeUntil`. Para outro idioma: `timeUntilDictionaries.es = {...}`. */
export const timeUntilDictionaries: Record<string, TimeUntilDictionary> = {
  "pt-BR": TIME_UNTIL_PT_BR,
  en: { now: "now", prefix: "in", min: "min", hour: "h" },
};

/** Dicionários de `timeAgo`. */
export const timeAgoDictionaries: Record<string, TimeAgoDictionary> = {
  "pt-BR": TIME_AGO_PT_BR,
  en: { now: "now", minute: "min", hour: "h", day: "d" },
};

const MINUTES_PER_DAY = 24 * 60;

/**
 * "09:30" -> 570 (minutos desde 00:00). Vazio/nulo/inválido -> 0.
 * @example timeToMinutes('09:30') // 570
 */
export function timeToMinutes(time: string | null | undefined): number {
  if (!time) return 0;
  const [hours, minutes] = time.split(":").map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}

/**
 * 570 -> "09:30" (clamp em 0, sem wrap de 24h: 1500 -> "25:00").
 * @example minutesToTime(570) // "09:30"
 */
export function minutesToTime(totalMinutes: number): string {
  const clamped = Math.max(0, Math.floor(totalMinutes || 0));
  return `${String(Math.floor(clamped / 60)).padStart(2, "0")}:${String(clamped % 60).padStart(2, "0")}`;
}

/**
 * Soma minutos a "HH:MM" COM wrap de 24h — comportamento publicado da lib.
 * Aceita negativos (00:30 - 60min -> "23:30"). Guard "--:--".
 * Minutos fracionários são truncados; minutos inválidos devolvem `time` intacto.
 * @example addMinutes('23:30', 60)  // "00:30"
 * @example addMinutes('00:30', -60) // "23:30"
 * @example addMinutes('--:--', 60)  // "--:--"
 */
export function addMinutes(time: string, minutes: number): string {
  if (!time || time === "--:--") return "--:--";
  const delta = Number(minutes);
  if (!Number.isFinite(delta)) return time;
  const total = timeToMinutes(time) + Math.trunc(delta);
  const wrapped = ((total % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  return minutesToTime(wrapped);
}

/**
 * Soma minutos a "HH:MM" SEM wrap de 24h — comportamento do Zandry.
 * Clamp em 0 (via minutesToTime). Guard "--:--". Minutos inválidos devolvem `time`.
 * @example addMinutesNoWrap('23:30', 60) // "24:30"
 * @example addMinutesNoWrap('--:--', 60) // "--:--"
 */
export function addMinutesNoWrap(time: string, minutes: number): string {
  if (!time || time === "--:--") return "--:--";
  const delta = Number(minutes);
  if (!Number.isFinite(delta)) return time;
  return minutesToTime(timeToMinutes(time) + Math.trunc(delta));
}

/**
 * "09:30:00" -> "09:30". Vazio/nulo -> "".
 * @example formatTime('09:30:00') // "09:30"
 */
export function formatTime(time: string | null | undefined): string {
  if (!time) return "";
  return time.split(":").slice(0, 2).join(":");
}

/**
 * Tempo relativo até um horário "HH:MM" no mesmo dia. Já passou/igual -> "agora".
 * `now` injetável (SSR/testes); `locale` ("en", "en-US", "pt-BR"...) ou `dict` controlam os textos.
 * @example getTimeUntil('18:00', { now: new Date('2026-01-01T15:30:00') }) // "em 2h 30min"
 * @example getTimeUntil('18:00', { now, locale: 'en-US' }) // "in 2h 30min"
 */
export function getTimeUntil(
  time: string,
  options: { now?: Date; locale?: string; dict?: TimeUntilDictionary } = {},
): string {
  const now = options.now ?? new Date();
  const dict = options.dict ?? pickDictionary(timeUntilDictionaries, options.locale, TIME_UNTIL_PT_BR);
  const diff = timeToMinutes(time) - (now.getHours() * 60 + now.getMinutes());
  if (diff <= 0) return dict.now;
  if (diff < 60) return `${dict.prefix} ${diff} ${dict.min}`;
  const hours = Math.floor(diff / 60);
  const minutes = diff % 60;
  return `${dict.prefix} ${hours}${dict.hour}${minutes > 0 ? ` ${minutes}${dict.min}` : ""}`;
}

/**
 * Tempo decorrido desde uma data/ISO: "agora" | "5min" | "3h" | "2d".
 * Aceita string, timestamp ou Date. Futuro -> "agora". Inválido -> "".
 * @example timeAgo('2026-01-01T12:00:00Z', { now: new Date('2026-01-01T15:00:00Z') }) // "3h"
 */
export function timeAgo(
  value: string | number | Date,
  options: { now?: Date | number; locale?: string; dict?: TimeAgoDictionary } = {},
): string {
  const target = value instanceof Date ? value.getTime() : new Date(value).getTime();
  if (Number.isNaN(target)) return "";
  const nowMs = options.now instanceof Date ? options.now.getTime() : (options.now ?? Date.now());
  const dict = options.dict ?? pickDictionary(timeAgoDictionaries, options.locale, TIME_AGO_PT_BR);

  const minutes = Math.floor((nowMs - target) / 60000);
  if (minutes < 1) return dict.now;
  if (minutes < 60) return `${minutes}${dict.minute}`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}${dict.hour}`;
  return `${Math.floor(hours / 24)}${dict.day}`;
}

/* ----- nomes publicados na lib (nada se perde) ----- */

/** Minutos totais -> "HH:MM" (90 -> "01:30"). Igual a `minutesToTime`. */
export function minutesToClock(totalMinutes: number): string {
  return minutesToTime(totalMinutes);
}

/** "01:30" -> 90. Igual a `timeToMinutes`. */
export function clockToMinutes(value?: string | null): number {
  return timeToMinutes(value);
}

/**
 * Data LOCAL "YYYY-MM-DD" (por padrão, hoje). `date` injetável (testes/SSR).
 * @example getLocalDateString(new Date(2026, 0, 5)) // "2026-01-05"
 */
export function getLocalDateString(date: Date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
