import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import 'dayjs/locale/es'

dayjs.extend(relativeTime)
dayjs.extend(localizedFormat)
dayjs.locale('es')

export function formatDate(date: Date | string | number, format = 'DD/MM/YYYY'): string {
  return dayjs(date).format(format)
}

export function formatDateTime(date: Date | string | number): string {
  return dayjs(date).format('DD/MM/YYYY HH:mm')
}

export function formatRelative(date: Date | string | number): string {
  return dayjs(date).fromNow()
}

export function parseDate(dateString: string, format = 'DD/MM/YYYY'): Date {
  return dayjs(dateString, format).toDate()
}

export function isValidDate(date: unknown): boolean {
  return dayjs(date as string).isValid()
}

export function addDays(date: Date | string, days: number): Date {
  return dayjs(date).add(days, 'day').toDate()
}
