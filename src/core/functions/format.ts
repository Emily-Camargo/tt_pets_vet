import {
  cn,
  formatCpfCnpj,
  formatDateBr,
  formatDateTimeBr,
  formatPhoneBr,
  formatPriceBrl,
} from '@grazziotin/react-components-next/functions'

import type { Perfil, StatusConsulta } from '@/core/interfaces/types'

export function moeda(valor: number) {
  return formatPriceBrl(valor)
}

export function visitas(qtd: number | null) {
  if (qtd === null) return 'Visitas ilimitadas'
  if (qtd === 1) return '1 visita por mês'
  return `${qtd} visitas por mês`
}

export function dataHora(iso: string) {
  return formatDateTimeBr(iso).replace(/:\d{2}$/, '')
}

export function dataCurta(iso: string) {
  return formatDateBr(iso)
}

export function soData(iso: string) {
  return formatDateBr(iso)
}

export function hora(iso: string) {
  const formatted = formatDateTimeBr(iso)
  const time = formatted.split(' ')[1] ?? ''
  return time.replace(/:\d{2}$/, '')
}

export function cnpj(valor: string) {
  return formatCpfCnpj(valor)
}

export function cpf(valor: string) {
  return formatCpfCnpj(valor)
}

export function telefone(valor: string) {
  return formatPhoneBr(valor)
}

export function rotuloPerfil(perfil: Perfil) {
  if (perfil === 'admin') return 'Admin'
  if (perfil === 'veterinario') return 'Veterinário'
  return 'Tutor'
}

export function rotuloStatus(status: StatusConsulta) {
  if (status === 'agendada') return 'Agendada'
  if (status === 'confirmada') return 'Confirmada'
  if (status === 'remarcada') return 'Remarcada'
  if (status === 'cancelada') return 'Cancelada'
  return 'Realizada'
}

export function statusColor(status: StatusConsulta) {
  if (status === 'cancelada') return 'red'
  if (status === 'realizada') return 'teal'
  if (status === 'confirmada') return 'green'
  return 'violet'
}

export function destino(_perfil: Perfil) {
  return '/home'
}

export function novoId() {
  return crypto.randomUUID()
}

export function isoEm(dias: number, horaDoDia: number, minuto = 0) {
  const data = new Date()
  data.setDate(data.getDate() + dias)
  data.setHours(horaDoDia, minuto, 0, 0)
  return data.toISOString()
}

/** Dia da semana corrente: 1=seg … 6=sáb, 0=dom. */
export function isoNaSemana(diaSemana: number, horaDoDia: number, minuto = 0) {
  const hoje = new Date()
  const weekday = hoje.getDay()
  const mondayOffset = weekday === 0 ? -6 : 1 - weekday
  const alvo =
    diaSemana === 0 ? mondayOffset + 6 : mondayOffset + (diaSemana - 1)
  return isoEm(alvo, horaDoDia, minuto)
}

export function diaIso(dias: number) {
  return isoEm(dias, 12).slice(0, 10)
}

export function cx(...partes: Array<string | false | null | undefined>) {
  return cn(...partes)
}

export {
  cn,
  formatCpfCnpj,
  formatDateBr,
  formatDateTimeBr,
  formatPhoneBr,
  formatPriceBrl,
}
