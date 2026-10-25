import type { Perfil, StatusConsulta } from './tipos'

export function moeda(valor: number) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function visitas(qtd: number | null) {
  if (qtd === null) return 'Visitas ilimitadas'
  if (qtd === 1) return '1 visita por mês'
  return `${qtd} visitas por mês`
}

export function dataHora(iso: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(iso))
}

export function dataCurta(iso: string) {
  const valor = iso.length === 10 ? `${iso}T12:00:00` : iso
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' }).format(
    new Date(valor),
  )
}

export function soData(iso: string) {
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(
    new Date(iso),
  )
}

export function hora(iso: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

export function cnpj(valor: string) {
  const digitos = valor.replace(/\D/g, '').slice(0, 14)
  return digitos
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
}

export function cpf(valor: string) {
  const digitos = valor.replace(/\D/g, '').slice(0, 11)
  return digitos
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

export function telefone(valor: string) {
  const digitos = valor.replace(/\D/g, '').slice(0, 11)
  if (digitos.length <= 10) {
    return digitos.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').trim()
  }
  return digitos.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').trim()
}

export function rotuloPerfil(perfil: Perfil) {
  if (perfil === 'admin') return 'Admin'
  if (perfil === 'gestor') return 'Clínica'
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

export function destino(perfil: Perfil) {
  if (perfil === 'admin') return '/TT-Pets/admin/clinicas'
  if (perfil === 'gestor') return '/TT-Pets/clinica/dashboard'
  if (perfil === 'veterinario') return '/TT-Pets/veterinario/agenda'
  return '/TT-Pets/tutor/planos'
}

export function novoId() {
  return crypto.randomUUID()
}

export function isoEm(dias: number, horaDoDia: number) {
  const data = new Date()
  data.setDate(data.getDate() + dias)
  data.setHours(horaDoDia, 0, 0, 0)
  return data.toISOString()
}

export function diaIso(dias: number) {
  return isoEm(dias, 12).slice(0, 10)
}

export function cx(...partes: Array<string | false | null | undefined>) {
  return partes.filter(Boolean).join(' ')
}
