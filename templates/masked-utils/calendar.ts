// Link "Adicionar ao Google Agenda". Função pura, SSR-safe, TypeScript >= 4.9.

export interface CalendarEventInput {
  title: string;
  description?: string;
  location?: string;
  /** Data no formato YYYY-MM-DD */
  date: string;
  /** Hora no formato HH:MM (horário local do evento) */
  startTime: string;
  /** Duração em minutos */
  durationMinutes: number;
  /**
   * Fuso IANA do evento (ex.: "America/Sao_Paulo").
   * Sem ele, o Google interpreta o horário no fuso do calendário de quem abre o link.
   */
  timeZone?: string;
}

const pad = (value: number): string => String(value).padStart(2, "0");

/** "YYYYMMDDTHHmmss" SEM "Z": horário de relógio, não UTC. Inválido -> null. */
function toGoogleWallClock(date: string, time: string, additionalMinutes: number): string | null {
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  const timeMatch = /^(\d{1,2}):(\d{2})$/.exec(time);
  if (!dateMatch || !timeMatch) return null;

  const [year, month, day] = [Number(dateMatch[1]), Number(dateMatch[2]), Number(dateMatch[3])];
  const [hour, minute] = [Number(timeMatch[1]), Number(timeMatch[2])];
  if (hour > 23 || minute > 59) return null;

  // Aritmética de calendário em UTC só para somar minutos; o resultado é lido de volta como relógio.
  const moment = new Date(Date.UTC(year, month - 1, day, hour, minute));
  if (moment.getUTCFullYear() !== year || moment.getUTCMonth() !== month - 1 || moment.getUTCDate() !== day) return null;
  moment.setUTCMinutes(moment.getUTCMinutes() + additionalMinutes);

  return (
    `${moment.getUTCFullYear()}${pad(moment.getUTCMonth() + 1)}${pad(moment.getUTCDate())}` +
    `T${pad(moment.getUTCHours())}${pad(moment.getUTCMinutes())}00`
  );
}

/**
 * Monta a URL do Google Agenda. Data/hora inválidas -> "".
 *
 * ATENÇÃO (mudança de comportamento): o horário agora é tratado como horário LOCAL do evento
 * (sem sufixo "Z"). Antes ele era enviado como UTC e o Google deslocava a hora pelo fuso de quem abria.
 *
 * @example buildGoogleCalendarUrl({ title: 'Corte', date: '2026-03-10', startTime: '14:30', durationMinutes: 45, timeZone: 'America/Sao_Paulo' })
 */
export function buildGoogleCalendarUrl(event: CalendarEventInput): string {
  const duration = Number.isFinite(event.durationMinutes) ? Math.max(0, Math.trunc(event.durationMinutes)) : 0;
  const start = toGoogleWallClock(event.date, event.startTime, 0);
  const end = toGoogleWallClock(event.date, event.startTime, duration);
  if (!start || !end) return "";

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${start}/${end}`,
    details: event.description ?? "",
    location: event.location ?? "",
  });
  if (event.timeZone) params.set("ctz", event.timeZone);

  return "https://calendar.google.com/calendar/render?" + params.toString();
}
