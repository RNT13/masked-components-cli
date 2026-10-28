// templates/masked-utils/dateTimeUtils.ts  
// TEMPORÁRIO: só funções de data até a 3.1b migrá-las para date.ts.  
// Horário (HH:mm) está em time.ts; moeda em currency.ts.  
// - Funções puras e SSR-safe: nenhuma leitura de Date.now()/new Date() implícita.  
// - Compatível com TypeScript >= 4.9.  
  
/* ───────────────────────── helpers internos ───────────────────────── */  
  
/** Valida "YYYY-MM-DD" como data real (ex.: 2025-02-30 -> false). */  
function isValidIsoDate(value: string): boolean {  
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);  
  if (!match) return false;  
  const year = Number(match[1]);  
  const month = Number(match[2]);  
  const day = Number(match[3]);  
  // Construção em UTC para não depender do fuso do ambiente.  
  const date = new Date(Date.UTC(year, month - 1, day));  
  return (  
    date.getUTCFullYear() === year &&  
    date.getUTCMonth() === month - 1 &&  
    date.getUTCDate() === day  
  );  
}  
  
/* ───────────────────────── conversões BR <-> ISO ───────────────────────── */  
  
/**  
 * Converte "31/12/2025" -> "2025-12-31". Inválido -> null.  
 * @example brToIso('31/12/2025') // "2025-12-31"  
 * @example brToIso('31/02/2025') // null  
 */  
export function brToIso(value: string): string | null {  
  if (!value) return null;  
  const [day, month, year] = value.split("/");  
  if (!day || !month || !year || year.length !== 4) return null;  
  const iso = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;  
  return isValidIsoDate(iso) ? iso : null;  
}  
  
/**  
 * Converte "2025-12-31" -> "31/12/2025". Vazio em inválido.  
 * @example isoToBr('2025-12-31') // "31/12/2025"  
 */  
export function isoToBr(value?: string | null): string {  
  if (!value) return "";  
  const [year, month, day] = value.split("-");  
  if (!year || !month || !day) return "";  
  return `${day}/${month}/${year}`;  
}  
  
/**  
 * Formata "2025-12-31" pelo Intl do locale (default pt-BR -> "31/12/2025").  
 * Interpreta a data em meio-dia UTC para evitar virada de dia por fuso.  
 * Inválido -> "".  
 * @example formatDate('2025-12-31') // "31/12/2025"  
 * @example formatDate('2025-12-31', 'en-US') // "12/31/2025"  
 */  
export function formatDate(value: string, locale = "pt-BR"): string {  
  if (!isValidIsoDate(value)) return "";  
  return new Intl.DateTimeFormat(locale, {  
    day: "2-digit",  
    month: "2-digit",  
    year: "numeric",  
    timeZone: "UTC",  
  }).format(new Date(`${value}T12:00:00Z`));  
}