/** Remove acentos, baixa a caixa e faz trim — ideal para busca/comparação. */  
export function normalizeText(value: unknown): string {  
  return String(value ?? '')  
    .normalize('NFD')  
    .replace(/[\u0300-\u036f]/g, '')  
    .toLowerCase()  
    .trim()  
}  
  
/** "Olá Mundo!" -> "ola-mundo" */  
export function slugify(value: string): string {  
  return normalizeText(value)  
    .replace(/[^a-z0-9\s-]/g, '')  
    .replace(/\s+/g, '-')  
    .replace(/-+/g, '-')  
    .replace(/^-|-$/g, '')  
}  
  
/** Trunca com reticências preservando palavras inteiras quando possível. */  
export function truncate(value: string, max: number, suffix = '…'): string {  
  if (!value || value.length <= max) return value  
  return value.slice(0, max).trimEnd() + suffix  
}  
  
/** "João da Silva" -> "João" */  
export function getFirstName(fullName: string): string {  
  return fullName.trim().split(' ')[0] ?? ''  
}  
  
/** "João Silva" -> "JS" (máx. 2 iniciais). */  
export function getInitials(name: string): string {  
  return name  
    .split(' ')  
    .filter(Boolean)  
    .slice(0, 2)  
    .map(word => word[0]?.toUpperCase() ?? '')  
    .join('')  
}  
  
/** Percentual limitado a 0–100. */  
export function getPercentage(value: number, maxValue: number): number {  
  if (!maxValue || maxValue <= 0) return 0  
  return Math.min(100, Math.round((value / maxValue) * 100))  
}