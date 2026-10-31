// Escolha de dicionário por locale. Função pura, SSR-safe, TypeScript >= 4.9.

/** Locale padrão dos utils e dos dicionários embutidos. */
export const DEFAULT_LOCALE = "pt-BR";

/**
 * Escolhe o dicionário de um locale:
 *  1. casa exato ("pt-BR");
 *  2. casa pelo idioma base ("en-US" → "en", "pt" → "pt-BR");
 *  3. cai no `fallback`.
 *
 * @example pickDictionary({ "pt-BR": a, en: b }, "en-GB", a) // b
 */
export function pickDictionary<T>(dictionaries: Record<string, T>, locale: string | undefined, fallback: T): T {
  if (!locale) return fallback;

  const exact = dictionaries[locale];
  if (exact !== undefined) return exact;

  const base = locale.split("-")[0]?.toLowerCase();
  for (const key of Object.keys(dictionaries)) {
    if (key.split("-")[0]?.toLowerCase() === base) {
      const found = dictionaries[key];
      if (found !== undefined) return found;
    }
  }
  return fallback;
}
