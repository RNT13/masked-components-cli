export interface CalendarEventInput {  
  title: string  
  description?: string  
  location?: string  
  /** Data no formato YYYY-MM-DD */  
  date: string  
  /** Hora no formato HH:MM */  
  startTime: string  
  /** Duração em minutos */  
  durationMinutes: number  
}  
  
function pad(value: number): string {  
  return String(value).padStart(2, '0')  
}  
  
function toGoogleDateTime(date: string, time: string, additionalMinutes = 0): string {  
  const [year, month, day] = date.split('-').map(Number)  
  const [hour, minute] = time.split(':').map(Number)  
  
  const dateTime = new Date(Date.UTC(year, month - 1, day, hour, minute))  
  dateTime.setUTCMinutes(dateTime.getUTCMinutes() + additionalMinutes)  
  
  return (  
    `${dateTime.getUTCFullYear()}` +  
    `${pad(dateTime.getUTCMonth() + 1)}` +  
    `${pad(dateTime.getUTCDate())}` +  
    `T${pad(dateTime.getUTCHours())}` +  
    `${pad(dateTime.getUTCMinutes())}` +  
    `00Z`  
  )  
}  
  
export function buildGoogleCalendarUrl(event: CalendarEventInput): string {  
  const start = toGoogleDateTime(event.date, event.startTime)  
  const end = toGoogleDateTime(event.date, event.startTime, event.durationMinutes)  
  
  const params = new URLSearchParams({  
    action: 'TEMPLATE',  
    text: event.title,  
    dates: `${start}/${end}`,  
    details: event.description ?? '',  
    location: event.location ?? ''  
  })  
  
  return 'https://calendar.google.com/calendar/render?' + params.toString()  
}