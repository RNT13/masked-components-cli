// templates/masked-utils/dateTimeUtils.ts
// TEMPORÁRIO: só funções de data até a 3.1b migrá-las para date.ts.
// As funções de tempo saíram para time.ts (currency saiu para currency.ts).

/** "31/12/2025" -> "2025-12-31" */
export function brToIso(value: string): string | null {
  if (!value) return null;
  const [day, month, year] = value.split("/");
  if (!day || !month || !year || year.length !== 4) return null;
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

/** "2025-12-31" -> "31/12/2025" (vazio em inválido). */
export function isoToBr(value?: string | null): string {
  if (!value) return "";
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return "";
  return `${day}/${month}/${year}`;
}

/** "2025-12-31" -> "31/12/2025" (via Intl, locale configurável). */
export function formatDate(value: string, locale = "pt-BR"): string {
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

/** ISO/date string -> "agora" | "5min" | "3h" | "2d" (será dicionarizado na 3.1b). */
export function timeAgo(dateString: string): string {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "agora";
  if (minutes < 60) return `${minutes}min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}
