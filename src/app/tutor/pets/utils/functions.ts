import { dataCurta, hora } from '@/core/functions/format'
import type { Banco, Consulta, Pet, Vacina } from '@/core/interfaces/types'
import { consultaAtiva } from '@/service/mock/rules'

export function startOfDay(date: Date) {
  const copy = new Date(date)
  copy.setHours(0, 0, 0, 0)
  return copy
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

export function ageLabel(birth: string) {
  const born = new Date(`${birth}T12:00:00`)
  const now = new Date()
  let years = now.getFullYear() - born.getFullYear()
  const month = now.getMonth() - born.getMonth()
  if (month < 0 || (month === 0 && now.getDate() < born.getDate())) years -= 1
  if (years >= 1) return years === 1 ? '1 ano' : `${years} anos`
  return 'menos de 1 ano'
}

export function petEmoji(species: string) {
  if (species === 'Gato') return '🐱'
  if (species === 'Cão') return '🐶'
  return '🐾'
}

export function neuteredLabel(pet: Pet) {
  if (!pet.castrado) return 'Não castrado'
  return pet.sexo === 'Fêmea' ? 'Castrada' : 'Castrado'
}

export function vaccineBadge(vaccines: Vacina[]) {
  const soon = vaccines
    .filter((item) => item.proximaDose)
    .map((item) => ({ ...item, days: daysUntil(item.proximaDose!) }))
    .filter((item) => item.days <= 30)
    .sort((a, b) => a.days - b.days)[0]

  if (soon) {
    return {
      label: `${soon.nome} vence ${inDays(soon.proximaDose!)}`,
      tone: 'bg-amber-50 text-amber-700',
    }
  }

  if (vaccines.some((item) => item.aplicadaEm)) {
    return { label: 'Vacinas em dia', tone: 'bg-emerald-50 text-emerald-700' }
  }

  return { label: 'Sem vacinas', tone: 'bg-slate-100 text-slate-500' }
}

export function nextAppointmentBadge(appointments: Consulta[]) {
  const next = appointments
    .filter((item) => consultaAtiva(item.status))
    .sort((a, b) => a.dataHora.localeCompare(b.dataHora))[0]

  if (!next) {
    return {
      label: 'Sem consulta marcada',
      tone: 'bg-slate-100 text-slate-500',
    }
  }

  const days = daysUntil(next.dataHora)
  if (days <= 0)
    return { label: 'Consulta hoje', tone: 'bg-[#efe4ff] text-[#7434d6]' }
  if (days === 1)
    return { label: 'Consulta amanhã', tone: 'bg-[#efe4ff] text-[#7434d6]' }
  return {
    label: `Consulta em ${days} dias`,
    tone: 'bg-[#efe4ff] text-[#7434d6]',
  }
}

export function lastVisitLabel(appointments: Consulta[]) {
  const last = appointments
    .filter((item) => item.status === 'realizada')
    .sort((a, b) => b.dataHora.localeCompare(a.dataHora))[0]
  return last ? dataCurta(last.dataHora) : '—'
}

export function nextVisitSummary(bank: Banco, petIds: string[]) {
  const next = bank.consultas
    .filter((item) => petIds.includes(item.petId) && consultaAtiva(item.status))
    .sort((a, b) => a.dataHora.localeCompare(b.dataHora))[0]

  if (!next) return { value: 'Nenhuma', detail: 'Agende quando quiser' }

  const pet = bank.pets.find((item) => item.id === next.petId)
  const date = dataCurta(next.dataHora).slice(0, 5)
  return {
    value: `${date}, ${hora(next.dataHora)}`,
    detail: `${pet?.nome ?? 'Pet'} · em domicílio`,
  }
}

export function vaccinesOkSummary(pets: Pet[], vaccines: Vacina[]) {
  const ok = pets.filter((pet) => {
    const items = vaccines.filter((item) => item.petId === pet.id)
    const soon = items.some(
      (item) => item.proximaDose && daysUntil(item.proximaDose) <= 30,
    )
    return items.length > 0 && !soon
  }).length

  const warning = pets
    .map((pet) => {
      const soon = vaccines
        .filter((item) => item.petId === pet.id && item.proximaDose)
        .map((item) => ({ ...item, days: daysUntil(item.proximaDose!) }))
        .filter((item) => item.days <= 30)
        .sort((a, b) => a.days - b.days)[0]
      return soon ? `${pet.nome} com ${soon.nome} a vencer` : null
    })
    .find(Boolean)

  return {
    value: `${ok} de ${pets.length} pets`,
    detail: warning ?? 'Tudo em dia',
  }
}

export function planSummary(bank: Banco, tutorId: string, petCount: number) {
  const subscriptions = bank.assinaturas.filter(
    (item) => item.tutorId === tutorId && item.status === 'ativa',
  )
  const plan = subscriptions
    .map((item) => bank.planos.find((current) => current.id === item.planoId))
    .find(Boolean)

  if (!plan) return { value: 'Nenhum', detail: 'Contrate um plano' }

  const covered = subscriptions.length
  return {
    value: plan.nome,
    detail:
      covered === petCount
        ? `cobre ${petCount === 1 ? 'o pet' : `os ${petCount} pets`}`
        : `cobre ${covered} de ${petCount}`,
  }
}

export function speciesCount(pets: Pet[]) {
  const dogs = pets.filter((item) => item.especie === 'Cão').length
  const cats = pets.filter((item) => item.especie === 'Gato').length
  const parts: string[] = []
  if (dogs) parts.push(`${dogs} ${dogs === 1 ? 'cão' : 'cães'}`)
  if (cats) parts.push(`${cats} ${cats === 1 ? 'gato' : 'gatos'}`)
  const others = pets.length - dogs - cats
  if (others) parts.push(`${others} outro${others > 1 ? 's' : ''}`)
  return parts.join(' · ') || 'Nenhum pet'
}
