// Manipulação de nomes/textos de exibição. Funções puras, SSR-safe, TS >= 4.9.

/**
 * Colapsa espaços: "  Ana   Souza " -> "Ana Souza".
 * @example normalizeDisplayName('  Ana   Souza ') // "Ana Souza"
 */
export function normalizeDisplayName(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

/**
 * "Ana Souza Lima" -> "Ana".
 * @example getFirstName('Ana Souza Lima') // "Ana"
 */
export function getFirstName(fullName: string): string {
  return fullName.trim().split(" ")[0];
}

/**
 * "Ana Souza Lima" -> "AS". Vazio -> "?".
 * @example getInitials('Ana Souza Lima') // "AS"
 */
export function getInitials(name: string): string {
  const parts = name.split(" ").filter(Boolean);
  if (!parts.length) return "?";
  return parts
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

/**
 * "texto longo" -> "texto lo..." (máx. maxLength).
 * @example truncateText('texto longo', 8) // "texto..."
 */
export function truncateText(value: string, maxLength: number): string {
  const normalized = normalizeDisplayName(value);
  if (!normalized || maxLength <= 0) return "";
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, Math.max(1, maxLength - 3)).trimEnd()}...`;
}

/**
 * Trunca por palavra completa quando possível (nomes de empresa).
 * @example truncateByWord('Empresa Muito Grande SA', 15) // "Empresa Muito..."
 */
export function truncateByWord(value: string, maxLength = 22): string {
  const normalized = normalizeDisplayName(value);
  if (!normalized || normalized.length <= maxLength) return normalized;
  let result = "";
  for (const word of normalized.split(" ")) {
    const next = result ? `${result} ${word}` : word;
    if (next.length + 3 > maxLength) break;
    result = next;
  }
  return result ? `${result}...` : truncateText(normalized, maxLength);
}

/**
 * "ana souza" -> "A". Vazio -> "?".
 * @example getInitial('ana souza') // "A"
 */
export function getInitial(name: string): string {
  return name.trim().charAt(0).toUpperCase() || "?";
}

/**
 * "Ana Souza Lima" -> "Ana L.". Um nome só -> o próprio. Vazio -> "".
 * @example abbreviateName('Ana Souza Lima') // "Ana L."
 */
export function abbreviateName(fullName: string): string {
  const parts = normalizeDisplayName(fullName).split(" ").filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1][0].toUpperCase()}.`;
}
