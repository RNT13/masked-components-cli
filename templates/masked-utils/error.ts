// Extração de mensagens de payloads de erro. Domínio: erro.
// Funções puras, SSR-safe, sem dependências. TS >= 4.9.

/**
 * Extrai a primeira mensagem legível de um payload de erro aninhado
 * (envelope de API, erros de campo, listas). Percorre strings, arrays
 * e objetos em profundidade; retorna `null` se nada legível for achado.
 * @param skipKeys chaves ignoradas na varredura (metadados do envelope).
 * @example extractFirstError({ detail: 'Falha ao salvar' }) // 'Falha ao salvar'
 * @example extractFirstError({ success: false, errors: { name: ['Obrigatório'] } }) // 'Obrigatório'
 * @example extractFirstError(null) // null
 */
export function extractFirstError(
  value: unknown,
  skipKeys: string[] = ["success", "code"],
): string | null {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return extractFirstError(value[0], skipKeys);
  if (typeof value === "object") {
    const keys = Object.keys(value as object).filter(
      (k) => !skipKeys.includes(k),
    );
    for (const key of keys) {
      const found = extractFirstError(
        (value as Record<string, unknown>)[key],
        skipKeys,
      );
      if (found) return found;
    }
  }
  return null;
}
