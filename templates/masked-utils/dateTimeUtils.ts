/** "31/12/2025" -> "2025-12-31" */  
export function brToIso(value: string): string | null {  
  if (!value) return null  
  const [day, month, year] = value.split('/')  
  if (!day || !month || !year || year.length !== 4) return null  
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`  
}  
  
/** "2025-12-31" -> "31/12/2025" */  
export function isoToBr(value?: string | null): string {  
  if (!value) return ''  
  const [year, month, day] = value.split('-')  
  if (!year || !month || !day) return ''  
  return `${day}/${month}/${year}`  
}  
  
/** Minutos totais -> "HH:MM" (90 -> "01:30") */  
export function minutesToClock(totalMinutes: number): string {  
  const clamped = Math.max(0, Math.floor(totalMinutes || 0))  
  const hours = Math.floor(clamped / 60)  
  const minutes = clamped % 60  
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`  
}  
  
/** "01:30" -> 90 */  
export function clockToMinutes(value?: string | null): number {  
  if (!value) return 0  
  const [h = '0', m = '0'] = value.split(':')  
  return (Number(h) || 0) * 60 + (Number(m) || 0)  
}  
  
/** "09:00" -> 540 (minutos desde 00:00) */  
export function timeToMinutes(time: string): number {  
  const [hours, minutes] = time.split(':').map(Number)  
  return (hours || 0) * 60 + (minutes || 0)  
}  
  
/** 540 -> "09:00" */  
export function minutesToTime(totalMinutes: number): string {  
  const hours = Math.floor(totalMinutes / 60)  
  const minutes = totalMinutes % 60  
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`  
}  
  
/** Soma minutos a um horário "HH:MM" (wrap em 24h). */  
export function addMinutes(time: string, minutes: number): string {  
  if (!time || time === '--:--') return '--:--'  
  const [h, m] = time.split(':').map(Number)  
  const total = (h || 0) * 60 + (m || 0) + Number(minutes)  
  const hh = String(Math.floor(total / 60) % 24).padStart(2, '0')  
  const mm = String(total % 60).padStart(2, '0')  
  return `${hh}:${mm}`  
}  
  
/** Data local de hoje no formato "YYYY-MM-DD". */  
export function getLocalDateString(): string {  
  const d = new Date()  
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(  
    d.getDate()  
  ).padStart(2, '0')}`  
}  
  
/** "2025-12-31" -> "31/12/2025" (formatação por Intl). */  
export function formatDate(value: string, locale = 'pt-BR'): string {  
  return new Intl.DateTimeFormat(locale, {  
    day: '2-digit',  
    month: '2-digit',  
    year: 'numeric'  
  }).format(new Date(`${value}T00:00:00`))  
}  
  
/** "HH:MM:SS" -> "HH:MM" */  
export function formatTime(time: string): string {  
  return time.split(':').slice(0, 2).join(':')  
}  
  
/** ISO/date string -> "agora" | "5min" | "3h" | "2d" */  
export function timeAgo(dateString: string): string {  
  const diffMs = Date.now() - new Date(dateString).getTime()  
  const minutes = Math.floor(diffMs / 60000)  
  if (minutes < 1) return 'agora'  
  if (minutes < 60) return `${minutes}min`  
  const hours = Math.floor(minutes / 60)  
  if (hours < 24) return `${hours}h`  
  return `${Math.floor(hours / 24)}d`  
}  
  
/** "14:30" -> "em 2h 30min" (relativo ao horário atual). */  
export function getTimeUntil(time: string): string {  
  const parts = time.split(':').map(Number)  
  const h = parts[0] ?? 0  
  const m = parts[1] ?? 0  
  const now = new Date()  
  const diff = h * 60 + m - (now.getHours() * 60 + now.getMinutes())  
  if (diff <= 0) return 'agora'  
  if (diff < 60) return `em ${diff} min`  
  const hh = Math.floor(diff / 60)  
  const mm = diff % 60  
  return `em ${hh}h${mm > 0 ? ` ${mm}min` : ''}`  
}