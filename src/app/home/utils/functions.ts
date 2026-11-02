import { dataHora, hora } from '@/core/functions/format'

export function firstName(name: string) {
  return name.split(' ')[0]
}

export function startOfDay(date: Date) {
  const copy = new Date(date)
  copy.setHours(0, 0, 0, 0)
  return copy
}

export function sameDay(iso: string, day: Date) {
  const date = new Date(iso)
  return (
    date.getFullYear() === day.getFullYear() &&
    date.getMonth() === day.getMonth() &&
    date.getDate() === day.getDate()
  )
}

export function daysUntil(iso: string) {
  const target = new Date(iso.length === 10 ? `${iso}T12:00:00` : iso)
  const today = startOfDay(new Date())
  target.setHours(0, 0, 0, 0)
  return Math.round((target.getTime() - today.getTime()) / 86400000)
}

export function inDays(iso: string) {
  const days = daysUntil(iso)
  if (days <= 0) return 'hoje'
  if (days === 1) return 'amanhã'
  return `em ${days} dias`
}

export function whenLabel(iso: string) {
  const days = daysUntil(iso)
  const time = hora(iso)
  if (days <= 0) return `Hoje, ${time}`
  if (days === 1) return `Amanhã, ${time}`
  return dataHora(iso)
}

export function ageLabel(birth: string) {
  const born = new Date(`${birth}T12:00:00`)
  const now = new Date()
  let years = now.getFullYear() - born.getFullYear()
  const month = now.getMonth() - born.getMonth()
  if (month < 0 || (month === 0 && now.getDate() < born.getDate())) years -= 1
  if (years >= 1) return years === 1 ? '1 ano' : `${years} anos`
  return 'menos de 1 ano'
}
