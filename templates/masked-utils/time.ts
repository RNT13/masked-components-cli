// templates/masked-utils/time.ts

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

export const timeUntilDictionaries: Record<string, TimeUntilDictionary> = {
  "pt-BR": { now: "agora", prefix: "em", min: "min", hour: "h" },
  en: { now: "now", prefix: "in", min: "min", hour: "h" },
};

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
 * Guard "--:--". NÃO faz clamp de negativos (mantém a semântica atual).
 * @example addMinutes('23:30', 60) // "00:30"
 * @example addMinutes('--:--', 60) // "--:--"
 */
export function addMinutes(time: string, minutes: number): string {
  if (!time || time === "--:--") return "--:--";
  const [h, m] = time.split(":").map(Number);
  const total = (h || 0) * 60 + (m || 0) + Number(minutes);
  const hh = String(Math.floor(total / 60) % 24).padStart(2, "0");
  const mm = String(total % 60).padStart(2, "0");
  return `${hh}:${mm}`;
}

/**
 * Soma minutos a "HH:MM" SEM wrap de 24h — comportamento do Zandry.
 * Clamp em 0 (via minutesToTime), guard "--:--".
 * @example addMinutesNoWrap('23:30', 60) // "24:30"
 * @example addMinutesNoWrap('--:--', 60) // "--:--"
 */
export function addMinutesNoWrap(time: string, minutes: number): string {
  if (!time || time === "--:--") return "--:--";
  return minutesToTime(timeToMinutes(time) + Number(minutes));
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
  options: { now?: Date; dict?: TimeUntilDictionary } = {},
): string {
  const { now = new Date(), dict = timeUntilDictionaries["pt-BR"] } = options;
  const diff = timeToMinutes(time) - (now.getHours() * 60 + now.getMinutes());
  if (diff <= 0) return dict.now;
  if (diff < 60) return `${dict.prefix} ${diff} ${dict.min}`;
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  return `${dict.prefix} ${h}${dict.hour}${m > 0 ? ` ${m}${dict.min}` : ""}`;
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

/** Data local de hoje "YYYY-MM-DD". */
export function getLocalDateString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
