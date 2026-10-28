import type {
  Banco,
  Consulta,
  Exame,
  Receita,
  Vacina,
} from '@/core/interfaces/types'

export type HistoryKind = 'consulta' | 'receita' | 'vacina' | 'exame'

export interface HistoryEntry {
  id: string
  kind: HistoryKind
  petId: string
  when: string
  title: string
  summary?: string
  vetName?: string
  prescriptions?: Receita['itens']
  examName?: string
  examResult?: string
}

export function kindLabel(kind: HistoryKind) {
  if (kind === 'receita') return 'Receita'
  if (kind === 'vacina') return 'Vacina'
  if (kind === 'exame') return 'Exame'
  return 'Consulta'
}

export function kindTone(kind: HistoryKind) {
  if (kind === 'receita') return 'bg-[#efe4ff] text-[#7434d6]'
  if (kind === 'vacina') return 'bg-emerald-50 text-emerald-700'
  if (kind === 'exame') return 'bg-slate-100 text-slate-600'
  return 'bg-slate-100 text-slate-600'
}

export function buildTimeline(bank: Banco, petIds: string[]): HistoryEntry[] {
  const entries: HistoryEntry[] = []

  const appointments = bank.consultas.filter(
    (item) => petIds.includes(item.petId) && item.status === 'realizada',
  ) as Consulta[]

  for (const appointment of appointments) {
    const vet = bank.veterinarios.find(
      (item) => item.id === appointment.veterinarioId,
    )
    const record = bank.prontuarios.find(
      (item) => item.consultaId === appointment.id,
    )
    const prescriptions = bank.receitas.filter(
      (item) => item.consultaId === appointment.id,
    )
    const exams = bank.exames.filter(
      (item) => item.consultaId === appointment.id,
    )

    if (prescriptions.length > 0) {
      for (const prescription of prescriptions) {
        entries.push({
          id: `rec-${prescription.id}`,
          kind: 'receita',
          petId: appointment.petId,
          when: appointment.dataHora,
          title: appointment.motivo,
          summary: record?.texto,
          vetName: vet?.nome,
          prescriptions: prescription.itens ?? [
            { nome: prescription.texto, uso: '' },
          ],
        })
      }
    } else if (exams.length > 0) {
      for (const exam of exams) {
        entries.push({
          id: `ex-${exam.id}`,
          kind: 'exame',
          petId: appointment.petId,
          when: appointment.dataHora,
          title: appointment.motivo,
          summary: record?.texto,
          vetName: vet?.nome,
          examName: exam.nome,
          examResult: exam.resultado,
        })
      }
    } else {
      entries.push({
        id: `con-${appointment.id}`,
        kind: 'consulta',
        petId: appointment.petId,
        when: appointment.dataHora,
        title: appointment.motivo,
        summary: record?.texto,
        vetName: vet?.nome,
      })
    }
  }

  for (const vaccine of bank.vacinas as Vacina[]) {
    if (!petIds.includes(vaccine.petId) || !vaccine.aplicadaEm) continue
    const vet = bank.veterinarios.find(
      (item) => item.id === vaccine.veterinarioId,
    )
    entries.push({
      id: `vac-${vaccine.id}`,
      kind: 'vacina',
      petId: vaccine.petId,
      when: `${vaccine.aplicadaEm}T12:00:00`,
      title: vaccine.nome,
      vetName: vet?.nome,
    })
  }

  for (const exam of bank.exames as Exame[]) {
    if (!petIds.includes(exam.petId) || exam.consultaId) continue
    entries.push({
      id: `ex-loose-${exam.id}`,
      kind: 'exame',
      petId: exam.petId,
      when: exam.criadoEm,
      title: exam.nome,
      examName: exam.nome,
      examResult: exam.resultado,
    })
  }

  return entries.sort((a, b) => b.when.localeCompare(a.when))
}

export function activePrescriptions(bank: Banco, petIds: string[]) {
  return bank.receitas.filter(
    (item) => item.ativo && petIds.includes(item.petId),
  )
}

export function progressDays(receita: Receita) {
  if (!receita.inicio || !receita.diasTotais) {
    return { current: 0, total: receita.diasTotais ?? 0, percent: 0 }
  }
  const start = new Date(`${receita.inicio}T12:00:00`)
  const today = new Date()
  today.setHours(12, 0, 0, 0)
  const current = Math.min(
    receita.diasTotais,
    Math.max(1, Math.round((today.getTime() - start.getTime()) / 86400000) + 1),
  )
  return {
    current,
    total: receita.diasTotais,
    percent: (current / receita.diasTotais) * 100,
  }
}

export function timelineDate(iso: string) {
  const date = new Date(iso.length === 10 ? `${iso}T12:00:00` : iso)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}
