import type { Banco, Consulta } from '@/domain/tipos'

const HORAS = [8, 9, 10, 11, 14, 15, 16, 17]

export function consultaAtiva(status: Consulta['status']) {
  return status !== 'cancelada' && status !== 'realizada'
}

export function nomeCidade(banco: Banco, id: string) {
  const cidade = banco.cidades.find((item) => item.id === id)
  return cidade ? `${cidade.nome} - ${cidade.uf}` : 'Cidade'
}

export function nomeClinica(banco: Banco, id: string) {
  return banco.clinicas.find((item) => item.id === id)?.nome ?? 'Clínica'
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
  const clinica = banco.clinicas.find((item) => item.id === assinatura.clinicaId)
  if (!plano?.ativo || !clinica?.ativa) {
    return 'O plano ou a clínica deste pet está inativo.'
  }

  if (!clinica.cidadeIds.includes(assinatura.cidadeId)) {
    return 'A clínica não atende mais a cidade do plano.'
  }

  return null
}

export function veterinariosDisponiveis(banco: Banco, clinicaId: string) {
  return banco.veterinarios.filter(
    (item) => item.clinicaId === clinicaId && item.ativo,
  )
}

function mesmoHorario(a: string, b: string) {
  const dataA = new Date(a)
  const dataB = new Date(b)
  return (
    dataA.getFullYear() === dataB.getFullYear() &&
    dataA.getMonth() === dataB.getMonth() &&
    dataA.getDate() === dataB.getDate() &&
    dataA.getHours() === dataB.getHours()
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

    const horas = semana === 6 ? [8, 9, 10, 11] : HORAS
    for (const hora of horas) {
      const slot = new Date(data)
      slot.setHours(hora, 0, 0, 0)
      if (slot <= agora) continue
      const iso = slot.toISOString()
      if (!horarioOcupado(banco, veterinarioId, iso, ignorarConsultaId)) {
        slots.push(iso)
      }
    }
  }

  return slots
}

export function sincronizarLembretes(banco: Banco) {
  const agora = new Date().toISOString()
  for (const vacina of banco.vacinas) {
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
      const clinica = banco.clinicas.find((item) => item.id === plano.clinicaId)
      return Boolean(
        clinica?.ativa && clinica.cidadeIds.includes(cidadeId),
      )
    })
    .sort((a, b) => a.precoMensal - b.precoMensal)
}

export function resumo(
  banco: Banco,
  filtro: { clinicaId: string; veterinarioId?: string },
) {
  const consultas = banco.consultas.filter((item) => {
    if (item.clinicaId !== filtro.clinicaId) return false
    if (filtro.veterinarioId && item.veterinarioId !== filtro.veterinarioId) {
      return false
    }
    return true
  })

  const agora = new Date()
  const doMes = consultas.filter((item) => {
    const data = new Date(item.dataHora)
    return (
      item.status === 'realizada' &&
      data.getMonth() === agora.getMonth() &&
      data.getFullYear() === agora.getFullYear()
    )
  })

  const petsAtendidos = new Set(consultas.map((item) => item.petId))
  const assinaturas = banco.assinaturas.filter((item) => {
    if (item.status !== 'ativa' || item.clinicaId !== filtro.clinicaId) {
      return false
    }
    if (!filtro.veterinarioId) return true
    return petsAtendidos.has(item.petId)
  })

  const mrr = assinaturas.reduce((total, item) => {
    const plano = banco.planos.find((planoItem) => planoItem.id === item.planoId)
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
