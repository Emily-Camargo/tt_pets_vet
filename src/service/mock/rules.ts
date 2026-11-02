import type { Banco, Consulta } from '@/core/interfaces/types'

const HORARIOS = [
  [8, 0],
  [9, 30],
  [11, 0],
  [14, 0],
  [15, 30],
  [17, 0],
] as const

export function consultaAtiva(status: Consulta['status']) {
  return status !== 'cancelada' && status !== 'realizada'
}

export function nomeCidade(banco: Banco, id: string) {
  const cidade = banco.cidades.find((item) => item.id === id)
  return cidade ? `${cidade.nome} - ${cidade.uf}` : 'Cidade'
}

export function nomeVeterinario(banco: Banco, id: string) {
  return (
    banco.veterinarios.find((item) => item.id === id)?.nome ?? 'Veterinário'
  )
}

export function assinaturaAtivaDoPet(banco: Banco, petId: string) {
  return banco.assinaturas.find(
    (item) => item.petId === petId && item.status === 'ativa',
  )
}

export function motivoBloqueioAgendamento(banco: Banco, petId: string) {
  const assinatura = assinaturaAtivaDoPet(banco, petId)
  if (!assinatura) {
    return 'Este pet precisa de um plano ativo para agendar.'
  }

  const plano = banco.planos.find((item) => item.id === assinatura.planoId)
  if (!plano?.ativo) return 'O plano deste pet está inativo.'

  const veterinario = banco.veterinarios.find(
    (item) => item.id === plano.veterinarioId,
  )
  if (
    !veterinario?.ativo ||
    !veterinario.cidadeIds.includes(assinatura.cidadeId)
  ) {
    return 'O veterinário do plano não atende mais essa cidade.'
  }

  return null
}

export function veterinariosDisponiveis(banco: Banco, cidadeId: string) {
  return banco.veterinarios.filter(
    (item) => item.ativo && item.cidadeIds.includes(cidadeId),
  )
}

function mesmoHorario(a: string, b: string) {
  const dataA = new Date(a)
  const dataB = new Date(b)
  return (
    dataA.getFullYear() === dataB.getFullYear() &&
    dataA.getMonth() === dataB.getMonth() &&
    dataA.getDate() === dataB.getDate() &&
    dataA.getHours() === dataB.getHours() &&
    dataA.getMinutes() === dataB.getMinutes()
  )
}

export function horarioOcupado(
  banco: Banco,
  veterinarioId: string,
  iso: string,
  ignorarConsultaId?: string,
) {
  const instante = new Date(iso).getTime()
  const bloqueado = banco.bloqueios.some((item) => {
    if (item.veterinarioId !== veterinarioId) return false
    const inicio = new Date(item.inicio).getTime()
    const fim = new Date(item.fim).getTime()
    return instante >= inicio && instante < fim
  })
  if (bloqueado) return true

  return banco.consultas.some(
    (item) =>
      item.id !== ignorarConsultaId &&
      item.veterinarioId === veterinarioId &&
      item.status !== 'cancelada' &&
      mesmoHorario(item.dataHora, iso),
  )
}

export function horariosDoDia(
  banco: Banco,
  veterinarioId: string,
  diaIso: string,
  ignorarConsultaId?: string,
) {
  const base = new Date(`${diaIso}T12:00:00`)
  const semana = base.getDay()
  if (semana === 0) return []

  const lista = semana === 6 ? HORARIOS.slice(0, 3) : HORARIOS
  return lista.map(([hora, minuto]) => {
    const slot = new Date(base)
    slot.setHours(hora, minuto, 0, 0)
    const iso = slot.toISOString()
    return {
      iso,
      label: `${String(hora).padStart(2, '0')}:${String(minuto).padStart(2, '0')}`,
      livre:
        slot > new Date() &&
        !horarioOcupado(banco, veterinarioId, iso, ignorarConsultaId),
    }
  })
}

export function horariosDisponiveis(
  banco: Banco,
  veterinarioId: string,
  ignorarConsultaId?: string,
) {
  const slots: string[] = []
  const agora = new Date()

  for (let dia = 0; dia < 14; dia += 1) {
    const data = new Date()
    data.setDate(agora.getDate() + dia)
    const semana = data.getDay()
    if (semana === 0) continue

    const lista = semana === 6 ? HORARIOS.slice(0, 3) : HORARIOS
    for (const [hora, minuto] of lista) {
      const slot = new Date(data)
      slot.setHours(hora, minuto, 0, 0)
      if (slot <= agora) continue
      const iso = slot.toISOString()
      if (!horarioOcupado(banco, veterinarioId, iso, ignorarConsultaId)) {
        slots.push(iso)
      }
    }
  }

  return slots
}

export function diasAgendaveis(quantidade = 7) {
  const dias: Date[] = []
  const cursor = new Date()
  cursor.setHours(12, 0, 0, 0)
  while (dias.length < quantidade) {
    if (cursor.getDay() !== 0) dias.push(new Date(cursor))
    cursor.setDate(cursor.getDate() + 1)
  }
  return dias
}

export function sincronizarLembretes(banco: Banco) {
  const agora = new Date().toISOString()
  for (const vacina of banco.vacinas) {
    if (!vacina.proximaDose) continue
    const limite = new Date(vacina.proximaDose)
    const hoje = new Date()
    const diferenca = (limite.getTime() - hoje.getTime()) / 86400000
    if (diferenca > 20) continue

    const pet = banco.pets.find((item) => item.id === vacina.petId)
    if (!pet) continue
    const id = `lembrete-${vacina.id}`
    if (banco.notificacoes.some((item) => item.id === id)) continue

    banco.notificacoes.unshift({
      id,
      tutorId: pet.tutorId,
      titulo: `Vacina de ${pet.nome} próxima`,
      texto: `A ${vacina.nome} de ${pet.nome} vence em breve.`,
      lida: false,
      criadaEm: agora,
      tipo: 'vacina',
    })
  }
}

export function planosDaCidade(banco: Banco, cidadeId: string) {
  return banco.planos
    .filter((plano) => {
      if (!plano.ativo || plano.cidadeId !== cidadeId) return false
      const veterinario = banco.veterinarios.find(
        (item) => item.id === plano.veterinarioId,
      )
      return Boolean(
        veterinario?.ativo && veterinario.cidadeIds.includes(cidadeId),
      )
    })
    .sort((a, b) => a.precoMensal - b.precoMensal)
}

export function resumo(banco: Banco, filtro: { veterinarioId: string }) {
  const consultas = banco.consultas.filter(
    (item) => item.veterinarioId === filtro.veterinarioId,
  )

  const agora = new Date()
  const doMes = consultas.filter((item) => {
    const data = new Date(item.dataHora)
    return (
      item.status === 'realizada' &&
      data.getMonth() === agora.getMonth() &&
      data.getFullYear() === agora.getFullYear()
    )
  })

  const assinaturas = banco.assinaturas.filter((item) => {
    if (item.status !== 'ativa') return false
    const plano = banco.planos.find(
      (planoItem) => planoItem.id === item.planoId,
    )
    return plano?.veterinarioId === filtro.veterinarioId
  })

  const mrr = assinaturas.reduce((total, item) => {
    const plano = banco.planos.find(
      (planoItem) => planoItem.id === item.planoId,
    )
    return total + (plano?.precoMensal ?? 0)
  }, 0)

  return {
    mrr,
    assinaturas: assinaturas.length,
    realizadasMes: doMes.length,
    agendadas: consultas.filter((item) => consultaAtiva(item.status)).length,
    canceladas: consultas.filter((item) => item.status === 'cancelada').length,
    realizadas: consultas.filter((item) => item.status === 'realizada').length,
    consultas,
  }
}
