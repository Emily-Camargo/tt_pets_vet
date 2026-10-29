import { ageLabel, daysUntil } from '@/app/tutor/pets/utils/functions'
import {
  initials,
  petTone,
  visitsUsedThisMonth,
} from '@/app/tutor/appointments/utils/functions'
import type { Banco, Pet, Tutor } from '@/core/interfaces/types'

export type ClientFilter = 'all' | 'with_plan' | 'no_plan' | 'late' | 'vaccine'

export type PaymentStatus = 'em_dia' | 'atrasado' | 'avulso'

export interface ClientRow {
  tutor: Tutor
  pets: Pet[]
  planName: string
  planPrice?: number
  planVisits: number | null
  cityName: string
  cityId?: string
  lastVisit?: string
  payment: PaymentStatus
  since: string
  visitsUsed: number
  vaccineAlert: boolean
}

export function buildClientRows(
  bank: Banco,
  veterinarianId: string,
): ClientRow[] {
  const appointments = bank.consultas.filter(
    (item) =>
      item.veterinarioId === veterinarianId && item.status !== 'cancelada',
  )
  const tutorIds = [...new Set(appointments.map((item) => item.tutorId))]

  const rows: ClientRow[] = []

  for (const tutorId of tutorIds) {
    const tutor = bank.tutores.find((item) => item.id === tutorId)
    if (!tutor) continue

    const petIds = [
      ...new Set(
        appointments
          .filter((item) => item.tutorId === tutorId)
          .map((item) => item.petId),
      ),
    ]
    const pets = petIds
      .map((id) => bank.pets.find((pet) => pet.id === id))
      .filter((pet): pet is Pet => Boolean(pet))

    const subscriptions = bank.assinaturas.filter((item) => {
      if (item.tutorId !== tutorId || item.status !== 'ativa') return false
      if (!petIds.includes(item.petId)) return false
      const plan = bank.planos.find((plano) => plano.id === item.planoId)
      return plan?.veterinarioId === veterinarianId
    })
    const primary = subscriptions[0]
    const plan = primary
      ? bank.planos.find((item) => item.id === primary.planoId)
      : undefined
    const cityId =
      primary?.cidadeId ??
      appointments.find((item) => item.tutorId === tutorId)?.cidadeId
    const city = bank.cidades.find((item) => item.id === cityId)

    let payment: PaymentStatus = 'avulso'
    if (subscriptions.some((item) => item.pagamento === 'atrasado')) {
      payment = 'atrasado'
    } else if (subscriptions.length > 0) {
      payment = 'em_dia'
    }

    const last = appointments
      .filter((item) => item.tutorId === tutorId)
      .sort((a, b) => b.dataHora.localeCompare(a.dataHora))[0]

    const sinceSource =
      subscriptions.map((item) => item.inicio).sort()[0] ??
      last?.dataHora.slice(0, 10)

    const vaccineAlert = pets.some((pet) =>
      bank.vacinas.some((vacina) => {
        if (vacina.petId !== pet.id || !vacina.proximaDose) return false
        const days = daysUntil(vacina.proximaDose)
        return days >= 0 && days <= 30
      }),
    )

    const visitsUsed = pets.reduce(
      (sum, pet) => sum + visitsUsedThisMonth(bank, pet.id),
      0,
    )

    rows.push({
      tutor,
      pets,
      planName: plan?.nome ?? 'Sem plano',
      planPrice: plan?.precoMensal,
      planVisits: plan?.visitasMes ?? null,
      cityName: city?.nome ?? '—',
      cityId,
      lastVisit: last?.dataHora,
      payment,
      since: sinceSource ?? '',
      visitsUsed,
      vaccineAlert,
    })
  }

  return rows.sort((a, b) => a.tutor.nome.localeCompare(b.tutor.nome))
}

export function filterClients(rows: ClientRow[], filter: ClientFilter) {
  if (filter === 'with_plan') {
    return rows.filter((item) => item.payment !== 'avulso')
  }
  if (filter === 'no_plan') {
    return rows.filter((item) => item.payment === 'avulso')
  }
  if (filter === 'late') {
    return rows.filter((item) => item.payment === 'atrasado')
  }
  if (filter === 'vaccine') {
    return rows.filter((item) => item.vaccineAlert)
  }
  return rows
}

export function matchSearch(row: ClientRow, query: string) {
  const q = query.trim().toLowerCase()
  if (!q) return true
  if (row.tutor.nome.toLowerCase().includes(q)) return true
  return row.pets.some((pet) => pet.nome.toLowerCase().includes(q))
}

export function lastVisitLabel(iso?: string) {
  if (!iso) return '—'
  const days = daysUntil(iso)
  if (days === 0) return 'Hoje'
  if (days === -1) return 'Ontem'
  if (days > 0 && days <= 7) return `Em ${days}d`
  const date = new Date(iso)
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`
}

export function sinceLabel(iso: string) {
  if (!iso) return '—'
  const date = new Date(iso.length === 10 ? `${iso}T12:00:00` : iso)
  const month = date
    .toLocaleDateString('pt-BR', { month: 'short' })
    .replace('.', '')
  return `${month} ${date.getFullYear()}`
}

export function petSummary(bank: Banco, pet: Pet) {
  const age = ageLabel(pet.nascimento)
  const breed =
    pet.especie === 'Gato' ? `Gata ${pet.raca}` : pet.raca.split(' ')[0]
  const upcoming = bank.vacinas
    .filter((item) => item.petId === pet.id && item.proximaDose)
    .sort((a, b) => (a.proximaDose ?? '').localeCompare(b.proximaDose ?? ''))[0]
  if (upcoming?.proximaDose) {
    const days = daysUntil(upcoming.proximaDose)
    if (days >= 0 && days <= 30) {
      return `${breed} · ${age} · ${upcoming.nome} em ${days} dias`
    }
  }
  return `${breed} · ${age} · vacinas em dia`
}

export function paymentUi(status: PaymentStatus) {
  if (status === 'em_dia') {
    return { label: 'Em dia', tone: 'bg-emerald-50 text-emerald-700' }
  }
  if (status === 'atrasado') {
    return { label: 'Atrasado', tone: 'bg-amber-50 text-amber-700' }
  }
  return { label: 'Avulso', tone: 'bg-slate-100 text-slate-500' }
}

export { initials, petTone }
