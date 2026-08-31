/**  
 * Formata um valor numérico (ou string numérica) como moeda.  
 * Padrão: pt-BR / BRL.  
 */  
export function formatCurrency(  
  value: string | number,  
  options: { locale?: string; currency?: string } = {}  
): string {  
  const { locale = 'pt-BR', currency = 'BRL' } = options  
  const n = typeof value === 'number' ? value : Number(value)  
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(  
    Number.isFinite(n) ? n : 0  
  )  
}  
  
/**  
 * Converte uma string de moeda ("R$ 1.234,56") em número (1234.56).  
 */  
export function parseCurrency(value: string): number {  
  if (!value) return 0  
  const normalized = value  
    .replace(/[^\d,-]/g, '')  
    .replace(/\./g, '')  
    .replace(',', '.')  
  const n = Number(normalized)  
  return Number.isFinite(n) ? n : 0  
}  
  
/**  
 * Converte um valor em reais para centavos (10.5 -> 1050).  
 */  
export function toCents(value: string | number): number {  
  const n = typeof value === 'number' ? value : parseCurrency(value)  
  return Math.round((Number.isFinite(n) ? n : 0) * 100)  
}  
  
/**  
 * Converte centavos para reais (1050 -> 10.5).  
 */  
export function fromCents(cents: number): number {  
  return (Number.isFinite(cents) ? cents : 0) / 100  
}