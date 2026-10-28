import { dataCurta, hora } from '@/core/functions/format'
import type { Banco, Consulta, StatusConsulta } from '@/core/interfaces/types'
import { consultaAtiva } from '@/service/mock/rules'

import { daysUntil } from '@/app/tutor/pets/utils/functions'

export function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

export function petTone(index: number) {
  const tones = [
    'bg-[#efe4ff] text-[#7434d6]',
    'bg-rose-50 text-rose-500',
    'bg-emerald-50 text-emerald-600',
    'bg-sky-50 text-sky-600',
  ]
  return tones[index % tones.length]
}

export function dateStamp(iso: string) {
  const date = new Date(iso)
  const month = date
    .toLocaleDateString('pt-BR', { month: 'short' })
    .replace('.', '')
    .slice(0, 3)
    .toUpperCase()
  return { month, day: String(date.getDate()).padStart(2, '0') }
}

export function whenLabel(iso: string) {
  const days = daysUntil(iso)
  const time = hora(iso)
  if (days <= 0) return `Hoje, ${time}`
  if (days === 1) return `Amanhã, ${time}`
  const weekday = new Date(iso).toLocaleDateString('pt-BR', { weekday: 'long' })
  const short = weekday.charAt(0).toUpperCase() + weekday.slice(1, 3)
  return `${short}, ${time}`
}

export function statusUi(status: StatusConsulta) {
  if (status === 'confirmada') {
    return { label: 'Confirmada', tone: 'bg-emerald-50 text-emerald-700' }
  }
  if (status === 'realizada') {
    return { label: 'Realizada', tone: 'bg-slate-100 text-slate-500' }
  }
  if (status === 'cancelada') {
    return { label: 'Cancelada', tone: 'bg-rose-50 text-rose-600' }
  }
  return { label: 'Aguardando', tone: 'bg-amber-50 text-amber-700' }
}

export function splitAppointments(items: Consulta[]) {
  const upcoming = items
    .filter((item) => consultaAtiva(item.status))
    .sort((a, b) => a.dataHora.localeCompare(b.dataHora))
  const done = items
    .filter((item) => item.status === 'realizada')
    .sort((a, b) => b.dataHora.localeCompare(a.dataHora))
  const canceled = items
    .filter((item) => item.status === 'cancelada')
    .sort((a, b) => b.dataHora.localeCompare(a.dataHora))
  return { upcoming, done, canceled }
}

export function visitsUsedThisMonth(bank: Banco, petId: string) {
  const now = new Date()
  return bank.consultas.filter((item) => {
    if (item.petId !== petId || item.status === 'cancelada') return false
    const date = new Date(item.dataHora)
    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    )
  }).length
}

export function dayKey(date: Date) {
  return date.toISOString().slice(0, 10)
}

export function dayLabel(date: Date) {
  const weekday = date
    .toLocaleDateString('pt-BR', { weekday: 'short' })
    .replace('.', '')
    .toUpperCase()
  return {
    weekday: weekday.slice(0, 3),
    day: String(date.getDate()).padStart(2, '0'),
  }
}

export function shortDate(iso: string) {
  return dataCurta(iso)
}
