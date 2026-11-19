// Resolução de valores de espaçamento contra uma escala recebida por
// parâmetro. A escala oficial da lib é `theme.spacing` (MaskedThemes, chaves
// 2xs..5xl); este util NÃO importa o MaskedThemes — masked-themes já depende
// de masked-utils, e importar de volta criaria um ciclo. Função pura, SSR-safe.

/** Valor aceito por props de espaçamento: chave da escala, número (px) ou string CSS. */
export type SpacingValue = string | number

/**
 * Resolve um valor de espaçamento para uma string CSS:  
 * - chave presente na escala ("md") -> valor da escala (ex.: "1rem");  
 * - número -> "24px";  
 * - qualquer outra string ("1.5rem", "10%") -> inalterada;  
 * - undefined -> fallback (ou undefined, para a propriedade não ser emitida).  
 *
 * @example resolveSpacing('md', theme.spacing)     // '1rem'  
 * @example resolveSpacing(24, theme.spacing)       // '24px'  
 * @example resolveSpacing('1.5rem', theme.spacing) // '1.5rem'  
 */
export function resolveSpacing(
  value: SpacingValue | undefined,
  scale: Readonly<Record<string, string>>,
  fallback?: string
): string | undefined {
  if (value === undefined) return fallback
  if (typeof value === 'number') return `${value}px`
  if (Object.prototype.hasOwnProperty.call(scale, value)) return scale[value]
  return value
}
