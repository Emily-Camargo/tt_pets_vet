import { dataCurta } from '@/core/functions/format'
import type { Vacina } from '@/core/interfaces/types'

import { daysUntil, inDays } from '@/app/tutor/pets/utils/functions'

export { daysUntil, inDays }

export type VaccineStatus = 'em_dia' | 'concluida' | 'recomendada' | 'atrasada'

export function vaccineStatus(item: Vacina): VaccineStatus {
  if (!item.aplicadaEm) return 'recomendada'
  if (!item.proximaDose) return 'concluida'
  if (daysUntil(item.proximaDose) < 0) return 'atrasada'
  return 'em_dia'
}

export function statusLabel(status: VaccineStatus) {
  if (status === 'em_dia') return 'Em dia'
  if (status === 'concluida') return 'Concluída'
  if (status === 'atrasada') return 'Atrasada'
  return 'Recomendada'
}

export function statusTone(status: VaccineStatus) {
  if (status === 'em_dia') return 'bg-emerald-50 text-emerald-700'
  if (status === 'concluida') return 'bg-[#efe4ff] text-[#7434d6]'
  if (status === 'atrasada') return 'bg-amber-50 text-amber-700'
  return 'bg-slate-100 text-slate-500'
}

export function upcomingDoses(vaccines: Vacina[]) {
  return vaccines
    .filter((item) => item.proximaDose)
    .map((item) => ({ ...item, days: daysUntil(item.proximaDose!) }))
    .filter((item) => item.days >= 0)
    .sort((a, b) => a.days - b.days)
}

export function dueInDays(vaccines: Vacina[], days: number) {
  return vaccines.filter(
    (item) =>
      item.proximaDose &&
      daysUntil(item.proximaDose) >= 0 &&
      daysUntil(item.proximaDose) <= days,
  ).length
}

export function overdueCount(vaccines: Vacina[]) {
  return vaccines.filter(
    (item) => item.proximaDose && daysUntil(item.proximaDose) < 0,
  ).length
}

export function appliedCount(vaccines: Vacina[]) {
  return vaccines.filter((item) => item.aplicadaEm).length
}

export function nextDoseSummary(vaccines: Vacina[]) {
  const next = upcomingDoses(vaccines)[0]
  if (!next?.proximaDose)
    return { value: 'Nenhuma', detail: 'Sem dose marcada' }
  return {
    value: next.nome,
    detail: dataCurta(next.proximaDose),
  }
}

export function protocolCoverage(vaccines: Vacina[]) {
  const recommended = vaccines.length
  const covered = vaccines.filter((item) => item.aplicadaEm).length
  return {
    covered,
    recommended,
    percent: recommended ? (covered / recommended) * 100 : 0,
  }
}

export function dateStamp(iso: string) {
  const date = new Date(iso.length === 10 ? `${iso}T12:00:00` : iso)
  const month = date
    .toLocaleDateString('pt-BR', { month: 'short' })
    .replace('.', '')
    .slice(0, 3)
    .toUpperCase()
  return { month, day: String(date.getDate()).padStart(2, '0') }
}

export function remainingLabel(days: number) {
  if (days <= 0) return 'Vence hoje'
  if (days === 1) return 'Falta 1 dia'
  return `Faltam ${days} dias`
}

export function formatChip(chip?: string) {
  if (!chip) return 'Sem microchip'
  if (chip.length < 10) return chip
  return `Microchip ${chip.slice(0, 4)}…${chip.slice(-4)}`
}
