import { hora } from '@/core/functions/format'
import type { Banco, Bloqueio, Consulta } from '@/core/interfaces/types'
import { consultaAtiva } from '@/service/mock/rules'

export const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16] as const
export const HOUR_PX = 76
export const DAY_START = 8
export const DAY_END = 17

export type AgendaTone = 'slate' | 'purple' | 'green' | 'amber'

export function startOfDay(date: Date) {
  const copy = new Date(date)
  copy.setHours(0, 0, 0, 0)
  return copy
}

export function sameCalendarDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export function sameDay(iso: string, day: Date) {
  return sameCalendarDay(new Date(iso), day)
}

export function weekDays(anchor = new Date()) {
  const today = startOfDay(anchor)
  const weekday = today.getDay()
  const monday = new Date(today)
  monday.setDate(today.getDate() + (weekday === 0 ? -6 : 1 - weekday))
  return Array.from({ length: 6 }, (_, index) => {
    const day = new Date(monday)
    day.setDate(monday.getDate() + index)
    return day
  })
}

export function weekLabel(days: Date[]) {
  const first = days[0]
  const last = days[days.length - 1]
  if (!first || !last) return ''
  const month = last
    .toLocaleDateString('pt-BR', { month: 'long' })
    .toLowerCase()
  return `${first.getDate()} a ${last.getDate()} de ${month}`
}

export function dayHeader(day: Date) {
  const weekday = day
    .toLocaleDateString('pt-BR', { weekday: 'short' })
    .replace('.', '')
    .toUpperCase()
    .slice(0, 3)
  return { weekday, day: String(day.getDate()).padStart(2, '0') }
}

export function minutesFromStart(iso: string) {
  const date = new Date(iso)
  return date.getHours() * 60 + date.getMinutes() - DAY_START * 60
}

export function topPx(iso: string) {
  return (minutesFromStart(iso) / 60) * HOUR_PX
}

export function heightPx(startIso: string, endIso?: string) {
  if (!endIso) return HOUR_PX - 6
  const start = new Date(startIso).getTime()
  const end = new Date(endIso).getTime()
  const minutes = Math.max(30, (end - start) / 60000)
  return (minutes / 60) * HOUR_PX - 6
}

export function appointmentTone(item: Consulta, cityName?: string): AgendaTone {
  const text =
    `${item.motivo} ${item.tipo ?? ''} ${cityName ?? ''}`.toLowerCase()
  if (
    text.includes('vacina') ||
    text.includes('v4') ||
    text.includes('v10') ||
    text.includes('marau')
  ) {
    return 'green'
  }
  if (text.includes('avalia') || text.includes('aguard')) {
    return 'amber'
  }
  if (text.includes('consulta') || text.includes('retorno')) {
    return 'purple'
  }
  return 'slate'
}

export const TONE_CLASS: Record<AgendaTone, string> = {
  slate: 'border-slate-300 bg-slate-50 text-slate-700',
  purple: 'border-[#c4a6f2] bg-[#f6f1fc] text-[#5b2bb0]',
  green: 'border-emerald-300 bg-emerald-50 text-emerald-800',
  amber: 'border-amber-300 bg-amber-50 text-amber-800',
}

export function weekAppointments(
  bank: Banco,
  veterinarianId: string,
  days: Date[],
) {
  return bank.consultas.filter(
    (item) =>
      item.veterinarioId === veterinarianId &&
      item.status !== 'cancelada' &&
      days.some((day) => sameDay(item.dataHora, day)),
  )
}

export function weekBlocks(bank: Banco, veterinarianId: string, days: Date[]) {
  return bank.bloqueios.filter(
    (item) =>
      item.veterinarioId === veterinarianId &&
      days.some((day) => sameDay(item.inicio, day)),
  )
}

export function openAppointments(items: Consulta[]) {
  return items.filter((item) => consultaAtiva(item.status))
}

export function eventLabel(item: Consulta | Bloqueio, petName?: string) {
  if ('motivo' in item && 'petId' in item) {
    return `${hora(item.dataHora)} ${petName ?? ''}`.trim()
  }
  return hora(item.inicio)
}
