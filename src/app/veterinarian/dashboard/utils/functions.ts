import type { Banco } from '@/core/interfaces/types'
import { resumo } from '@/service/mock/rules'

export type ReceiptStatus = 'pago' | 'atrasado' | 'pendente'

export interface ReceiptRow {
  id: string
  cliente: string
  detalhe: string
  vencimento: string
  valor: number
  status: ReceiptStatus
}

export interface FinanceSnapshot {
  receitaMes: number
  crescimento: number
  recorrente: number
  assinaturas: number
  avulsos: number
  atendimentosAvulsos: number
  inadimplencia: number
  clientesAtrasados: number
  receipts: ReceiptRow[]
  monthly: Array<{ mes: string; Planos: number; Avulsos: number }>
  byCity: Array<{ id: string; label: string; value: number }>
  byPlan: Array<{ id: string; label: string; value: number }>
  statusMix: Array<{ id: string; label: string; value: number }>
  monthLabel: string
}

const MONTHS = [
  'jan',
  'fev',
  'mar',
  'abr',
  'mai',
  'jun',
  'jul',
  'ago',
  'set',
  'out',
  'nov',
  'dez',
]

export function buildFinance(
  bank: Banco,
  veterinarianId: string,
): FinanceSnapshot {
  const summary = resumo(bank, { veterinarioId: veterinarianId })
  const now = new Date()
  const monthLabel = now.toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  })
  const monthName = MONTHS[now.getMonth()]

  const plans = bank.planos.filter(
    (item) => item.veterinarioId === veterinarianId,
  )
  const planIds = new Set(plans.map((item) => item.id))
  const subscriptions = bank.assinaturas.filter(
    (item) => item.status === 'ativa' && planIds.has(item.planoId),
  )

  const recorrente = summary.mrr
  const doneMonth = bank.consultas.filter((item) => {
    if (item.veterinarioId !== veterinarianId || item.status !== 'realizada') {
      return false
    }
    const date = new Date(item.dataHora)
    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    )
  })

  const avulsoUnit = 150
  const avulsosBase = Math.max(doneMonth.length, 4) * avulsoUnit
  const avulsosBoost = Math.round(recorrente * 1.32)
  const avulsos = Math.max(avulsosBase, avulsosBoost)
  const receitaMes = recorrente + avulsos

  const lateSubs = subscriptions.filter((item) => item.pagamento === 'atrasado')
  const inadimplencia = lateSubs.reduce((total, item) => {
    const plan = plans.find((plano) => plano.id === item.planoId)
    return total + (plan?.precoMensal ?? 0)
  }, 0)
  const clientesAtrasados = new Set(lateSubs.map((item) => item.tutorId)).size

  const receipts: ReceiptRow[] = subscriptions.map((item, index) => {
    const tutor = bank.tutores.find((t) => t.id === item.tutorId)
    const plan = plans.find((p) => p.id === item.planoId)
    const day = 5 + (index % 20)
    const status: ReceiptStatus =
      item.pagamento === 'atrasado'
        ? 'atrasado'
        : index % 5 === 0
          ? 'pendente'
          : 'pago'
    return {
      id: item.id,
      cliente: tutor?.nome ?? 'Tutor',
      detalhe: `${plan?.nome ?? 'Plano'} · ${monthName}`,
      vencimento: `${String(day).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}`,
      valor: plan?.precoMensal ?? 0,
      status,
    }
  })

  // avulso receipts demo
  const avulsoClients = bank.consultas
    .filter(
      (item) =>
        item.veterinarioId === veterinarianId && item.status !== 'cancelada',
    )
    .slice(0, 4)
  for (const [index, item] of avulsoClients.entries()) {
    const hasPlan = subscriptions.some((sub) => sub.tutorId === item.tutorId)
    if (hasPlan && index > 1) continue
    const tutor = bank.tutores.find((t) => t.id === item.tutorId)
    receipts.push({
      id: `avulso-${item.id}`,
      cliente: tutor?.nome ?? 'Tutor',
      detalhe: 'Consulta avulsa',
      vencimento: `${String(10 + index).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}`,
      valor: avulsoUnit,
      status: index === 0 ? 'pendente' : 'pago',
    })
  }

  receipts.sort((a, b) => a.vencimento.localeCompare(b.vencimento))

  const monthly = Array.from({ length: 6 }, (_, offset) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - offset), 1)
    const factor = 0.72 + offset * 0.055
    return {
      mes: MONTHS[date.getMonth()],
      Planos: Math.round(recorrente * factor),
      Avulsos: Math.round(avulsos * (0.65 + offset * 0.07)),
    }
  })

  const byCityMap = new Map<string, number>()
  for (const sub of subscriptions) {
    const plan = plans.find((item) => item.id === sub.planoId)
    const city = bank.cidades.find((item) => item.id === sub.cidadeId)
    if (!city || !plan) continue
    byCityMap.set(city.nome, (byCityMap.get(city.nome) ?? 0) + plan.precoMensal)
  }
  // distribute avulsos roughly
  const cityEntries = [...byCityMap.entries()]
  if (cityEntries.length === 0) {
    byCityMap.set('Passo Fundo', receitaMes)
  } else {
    const share = avulsos / cityEntries.length
    for (const [name, value] of cityEntries) {
      byCityMap.set(name, Math.round(value + share))
    }
  }

  const byCity = [...byCityMap.entries()]
    .map(([label, value]) => ({ id: label, label, value }))
    .sort((a, b) => b.value - a.value)

  const byPlanMap = new Map<string, number>()
  for (const sub of subscriptions) {
    const plan = plans.find((item) => item.id === sub.planoId)
    if (!plan) continue
    byPlanMap.set(plan.nome, (byPlanMap.get(plan.nome) ?? 0) + plan.precoMensal)
  }
  const byPlan = [...byPlanMap.entries()].map(([label, value]) => ({
    id: label,
    label,
    value,
  }))

  const statusMix = [
    {
      id: 'pago',
      label: 'Pago',
      value: receipts.filter((item) => item.status === 'pago').length,
    },
    {
      id: 'pendente',
      label: 'Pendente',
      value: receipts.filter((item) => item.status === 'pendente').length,
    },
    {
      id: 'atrasado',
      label: 'Atrasado',
      value: receipts.filter((item) => item.status === 'atrasado').length,
    },
  ].filter((item) => item.value > 0)

  return {
    receitaMes,
    crescimento: 12,
    recorrente,
    assinaturas: subscriptions.length,
    avulsos,
    atendimentosAvulsos: Math.max(
      doneMonth.length,
      receipts.filter((r) => r.detalhe.includes('avulsa')).length + 3,
    ),
    inadimplencia: inadimplencia || 2310,
    clientesAtrasados: clientesAtrasados || lateSubs.length || 4,
    receipts,
    monthly,
    byCity,
    byPlan,
    statusMix,
    monthLabel: monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1),
  }
}

export function receiptTone(status: ReceiptStatus) {
  if (status === 'pago') return 'bg-emerald-50 text-emerald-700'
  if (status === 'atrasado') return 'bg-amber-50 text-amber-700'
  return 'bg-slate-100 text-slate-500'
}

export function receiptLabel(status: ReceiptStatus) {
  if (status === 'pago') return 'Pago'
  if (status === 'atrasado') return 'Atrasado'
  return 'Pendente'
}
