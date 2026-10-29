import { dataHora, novoId } from '@/core/functions/format'
import type {
  Banco,
  Perfil,
  Plano,
  StatusConsulta,
} from '@/core/interfaces/types'

import { CATALOGO_SERVICOS, SENHA_DEMO } from './catalog'
import { responderIa } from './chat'
import {
  horarioOcupado,
  motivoBloqueioAgendamento,
  veterinariosDisponiveis,
} from './rules'
import { alterar, bancoAtual } from './store'

function emailLivre(banco: Banco, email: string, ignorarId?: string) {
  return !banco.usuarios.some(
    (item) =>
      item.email.toLowerCase() === email.toLowerCase() && item.id !== ignorarId,
  )
}

function notificar(
  banco: Banco,
  tutorId: string,
  titulo: string,
  texto: string,
) {
  banco.notificacoes.unshift({
    id: novoId(),
    tutorId,
    titulo,
    texto,
    lida: false,
    criadaEm: new Date().toISOString(),
    tipo: 'consulta',
  })
}

export function entrar(email: string, senha: string) {
  const banco = bancoAtual()
  const usuario = banco.usuarios.find(
    (item) => item.email.toLowerCase() === email.trim().toLowerCase(),
  )
  if (!usuario || usuario.senha !== senha) {
    return { erro: 'Email ou senha inválidos.' }
  }

  if (usuario.perfil === 'veterinario') {
    const veterinario = banco.veterinarios.find(
      (item) => item.id === usuario.veterinarioId,
    )
    if (!veterinario?.ativo) {
      return { erro: 'Este veterinário está inativo.' }
    }
  }

  return { usuario }
}

export function cadastrarTutor(dados: {
  nome: string
  cpf: string
  telefone: string
  email: string
  senha: string
}) {
  const email = dados.email.trim().toLowerCase()
  const banco = bancoAtual()
  if (!emailLivre(banco, email)) return 'Já existe uma conta com este email.'
  if (dados.senha.length < 6)
    return 'A senha precisa ter ao menos 6 caracteres.'

  const tutorId = novoId()
  const usuarioId = novoId()
  alterar((atual) => {
    atual.tutores.push({
      id: tutorId,
      usuarioId,
      nome: dados.nome.trim(),
      cpf: dados.cpf.replace(/\D/g, ''),
      telefone: dados.telefone.replace(/\D/g, ''),
      email,
    })
    atual.usuarios.push({
      id: usuarioId,
      nome: dados.nome.trim(),
      email,
      senha: dados.senha,
      perfil: 'tutor',
      tutorId,
    })
  })
  return null
}

export function salvarPerfil(
  usuarioId: string,
  dados: {
    nome: string
    email: string
    telefone?: string
    senhaAtual: string
    senhaNova: string
  },
) {
  const banco = bancoAtual()
  const usuario = banco.usuarios.find((item) => item.id === usuarioId)
  if (!usuario) return 'Usuário não encontrado.'

  const email = dados.email.trim().toLowerCase()
  const nome = dados.nome.trim()
  if (nome.length < 2) return 'Informe o nome.'
  if (!emailLivre(banco, email, usuario.id))
    return 'Já existe uma conta com este email.'

  const trocaSenha = dados.senhaNova.trim().length > 0
  if (trocaSenha) {
    if (dados.senhaAtual !== usuario.senha) return 'A senha atual não confere.'
    if (dados.senhaNova.trim().length < 6)
      return 'A nova senha precisa ter ao menos 6 caracteres.'
  }

  alterar((atual) => {
    const item = atual.usuarios.find(
      (atualUsuario) => atualUsuario.id === usuarioId,
    )
    if (!item) return
    item.nome = nome
    item.email = email
    if (trocaSenha) item.senha = dados.senhaNova.trim()
    if (!item.tutorId) return
    const tutor = atual.tutores.find(
      (atualTutor) => atualTutor.id === item.tutorId,
    )
    if (!tutor) return
    tutor.nome = nome
    tutor.email = email
    if (dados.telefone) tutor.telefone = dados.telefone.replace(/\D/g, '')
  })
  return null
}

export function salvarCidade(dados: { id?: string; nome: string; uf: string }) {
  const nome = dados.nome.trim()
  const uf = dados.uf.trim().toUpperCase()
  if (nome.length < 2 || uf.length !== 2) return 'Informe a cidade e a UF.'

  const repetida = bancoAtual().cidades.some(
    (item) =>
      item.id !== dados.id &&
      item.nome.toLowerCase() === nome.toLowerCase() &&
      item.uf === uf,
  )
  if (repetida) return 'Essa cidade já está cadastrada.'

  alterar((banco) => {
    if (dados.id) {
      const cidade = banco.cidades.find((item) => item.id === dados.id)
      if (!cidade) return
      cidade.nome = nome
      cidade.uf = uf
      return
    }
    banco.cidades.push({ id: novoId(), nome, uf })
  })
  return null
}

export function excluirCidade(id: string) {
  const banco = bancoAtual()
  const emUso =
    banco.planos.some((item) => item.cidadeId === id) ||
    banco.veterinarios.some((item) => item.cidadeIds.includes(id))
  if (emUso) return 'Esta cidade está ligada a um plano ou veterinário.'
  alterar((atual) => {
    atual.cidades = atual.cidades.filter((item) => item.id !== id)
  })
  return null
}

export function salvarPlano(dados: {
  id?: string
  veterinarioId: string
  cidadeId: string
  nome: string
  subtitulo: string
  precoMensal: number
  visitasMes: number | null
  destaque: boolean
  inclusos: string[]
  ativo: boolean
}) {
  if (!dados.veterinarioId || !dados.cidadeId)
    return 'Escolha o veterinário e a cidade.'
  if (dados.nome.trim().length < 2) return 'Informe o nome do plano.'
  if (dados.precoMensal <= 0) return 'Informe o preço mensal.'
  if (dados.visitasMes !== null && dados.visitasMes < 1) {
    return 'A quantidade de visitas precisa ser maior que zero.'
  }

  const veterinario = bancoAtual().veterinarios.find(
    (item) => item.id === dados.veterinarioId,
  )
  if (!veterinario?.cidadeIds.includes(dados.cidadeId)) {
    return 'Esse veterinário não atende essa cidade.'
  }

  const servicos = CATALOGO_SERVICOS.map((nome) => ({
    nome,
    incluso: dados.inclusos.includes(nome),
  }))

  alterar((banco) => {
    const plano: Plano = {
      id: dados.id ?? novoId(),
      veterinarioId: dados.veterinarioId,
      cidadeId: dados.cidadeId,
      nome: dados.nome.trim(),
      subtitulo: dados.subtitulo.trim() || 'Atendimento domiciliar',
      precoMensal: dados.precoMensal,
      visitasMes: dados.visitasMes,
      destaque: dados.destaque,
      servicos,
      ativo: dados.ativo,
    }
    if (dados.id) {
      const indice = banco.planos.findIndex((item) => item.id === dados.id)
      if (indice >= 0) banco.planos[indice] = plano
      return
    }
    banco.planos.push(plano)
  })
  return null
}

export function alternarPlano(id: string) {
  alterar((banco) => {
    const plano = banco.planos.find((item) => item.id === id)
    if (plano) plano.ativo = !plano.ativo
  })
}

export function salvarPet(dados: {
  id?: string
  tutorId: string
  nome: string
  especie: string
  raca: string
  sexo: 'Macho' | 'Fêmea'
  castrado: boolean
  nascimento: string
  peso: number
  microchip?: string
  observacoes?: string
  foto?: string
}) {
  if (dados.nome.trim().length < 2) return 'Informe o nome do pet.'
  if (!dados.especie || !dados.raca.trim()) return 'Informe espécie e raça.'
  if (!dados.sexo) return 'Informe o sexo.'
  if (!dados.nascimento) return 'Informe o nascimento.'
  if (dados.peso <= 0) return 'Informe o peso.'

  alterar((banco) => {
    if (dados.id) {
      const pet = banco.pets.find((item) => item.id === dados.id)
      if (!pet || pet.tutorId !== dados.tutorId) return
      pet.nome = dados.nome.trim()
      pet.especie = dados.especie
      pet.raca = dados.raca.trim()
      pet.sexo = dados.sexo
      pet.castrado = dados.castrado
      pet.nascimento = dados.nascimento
      pet.peso = dados.peso
      pet.microchip = dados.microchip?.trim() || undefined
      pet.observacoes = dados.observacoes?.trim() || undefined
      pet.foto = dados.foto
      return
    }
    banco.pets.push({
      id: novoId(),
      tutorId: dados.tutorId,
      nome: dados.nome.trim(),
      especie: dados.especie,
      raca: dados.raca.trim(),
      sexo: dados.sexo,
      castrado: dados.castrado,
      nascimento: dados.nascimento,
      peso: dados.peso,
      microchip: dados.microchip?.trim() || undefined,
      observacoes: dados.observacoes?.trim() || undefined,
      foto: dados.foto,
    })
  })
  return null
}

export function excluirPet(petId: string, tutorId: string) {
  const banco = bancoAtual()
  const pet = banco.pets.find((item) => item.id === petId)
  if (!pet || pet.tutorId !== tutorId) return 'Pet não encontrado.'
  const temConsulta = banco.consultas.some(
    (item) => item.petId === petId && item.status !== 'cancelada',
  )
  if (temConsulta) return 'Este pet tem consultas em aberto ou realizadas.'

  alterar((atual) => {
    atual.pets = atual.pets.filter((item) => item.id !== petId)
    atual.assinaturas = atual.assinaturas.filter((item) => item.petId !== petId)
  })
  return null
}

export function contratarPlano(dados: {
  petId: string
  planoId: string
  tutorId: string
}) {
  const banco = bancoAtual()
  const pet = banco.pets.find((item) => item.id === dados.petId)
  const plano = banco.planos.find((item) => item.id === dados.planoId)
  if (!pet || pet.tutorId !== dados.tutorId) return 'Escolha um pet seu.'
  if (!plano?.ativo) return 'Este plano não está disponível.'
  const veterinario = banco.veterinarios.find(
    (item) => item.id === plano.veterinarioId,
  )
  if (!veterinario?.ativo || !veterinario.cidadeIds.includes(plano.cidadeId)) {
    return 'O veterinário deste plano não atende essa cidade.'
  }

  alterar((atual) => {
    for (const assinatura of atual.assinaturas) {
      if (assinatura.petId === pet.id && assinatura.status === 'ativa') {
        assinatura.status = 'cancelada'
      }
    }
    atual.assinaturas.push({
      id: novoId(),
      petId: pet.id,
      planoId: plano.id,
      cidadeId: plano.cidadeId,
      tutorId: dados.tutorId,
      status: 'ativa',
      inicio: new Date().toISOString(),
    })
    atual.notificacoes.unshift({
      id: novoId(),
      tutorId: dados.tutorId,
      titulo: 'Plano contratado',
      texto: `${plano.nome} ativo para ${pet.nome}. O pagamento foi simulado.`,
      lida: false,
      criadaEm: new Date().toISOString(),
      tipo: 'consulta',
    })
  })
  return null
}

export function agendarConsulta(dados: {
  petId: string
  veterinarioId?: string
  dataHora: string
  motivo: string
  tipo?: string
  endereco?: string
}) {
  const banco = bancoAtual()
  const bloqueio = motivoBloqueioAgendamento(banco, dados.petId)
  if (bloqueio) return bloqueio
  if (!dados.motivo.trim()) return 'Informe o motivo da consulta.'

  const assinatura = banco.assinaturas.find(
    (item) => item.petId === dados.petId && item.status === 'ativa',
  )
  if (!assinatura) return 'Este pet precisa de um plano ativo.'

  const disponiveis = veterinariosDisponiveis(banco, assinatura.cidadeId)
  const veterinario = dados.veterinarioId
    ? disponiveis.find((item) => item.id === dados.veterinarioId)
    : disponiveis[0]
  if (!veterinario)
    return 'Escolha um veterinário que atenda a cidade do plano.'
  if (horarioOcupado(banco, veterinario.id, dados.dataHora)) {
    return 'Esse horário não está livre.'
  }

  const pet = banco.pets.find((item) => item.id === dados.petId)
  if (!pet) return 'Pet não encontrado.'
  const tutor = banco.tutores.find((item) => item.id === pet.tutorId)

  alterar((atual) => {
    atual.consultas.push({
      id: novoId(),
      petId: pet.id,
      tutorId: pet.tutorId,
      veterinarioId: veterinario.id,
      cidadeId: assinatura.cidadeId,
      dataHora: dados.dataHora,
      status: 'agendada',
      motivo: dados.motivo.trim(),
      tipo: dados.tipo?.trim() || 'Consulta em domicílio',
      endereco: dados.endereco?.trim() || tutor?.endereco,
    })
    notificar(
      atual,
      pet.tutorId,
      'Consulta agendada',
      `${pet.nome} com ${veterinario.nome} em ${dataHora(dados.dataHora)}.`,
    )
  })
  return null
}

function podeMexer(
  banco: Banco,
  consultaId: string,
  ator: {
    perfil: Perfil
    tutorId?: string
    veterinarioId?: string
  },
) {
  const consulta = banco.consultas.find((item) => item.id === consultaId)
  if (!consulta) return 'Consulta não encontrada.'
  if (ator.perfil === 'tutor' && consulta.tutorId !== ator.tutorId) {
    return 'Essa consulta não é sua.'
  }
  if (
    ator.perfil === 'veterinario' &&
    consulta.veterinarioId !== ator.veterinarioId
  ) {
    return 'Essa consulta é de outro veterinário.'
  }
  return null
}

export function mudarConsulta(dados: {
  consultaId: string
  status: StatusConsulta
  dataHora?: string
  ator: {
    perfil: Perfil
    tutorId?: string
    veterinarioId?: string
  }
}) {
  const banco = bancoAtual()
  const proibido = podeMexer(banco, dados.consultaId, dados.ator)
  if (proibido) return proibido
  const consulta = banco.consultas.find((item) => item.id === dados.consultaId)
  if (
    !consulta ||
    consulta.status === 'realizada' ||
    consulta.status === 'cancelada'
  ) {
    return 'Essa consulta não pode mais ser alterada.'
  }

  if (dados.status === 'remarcada') {
    if (!dados.dataHora) return 'Escolha o novo horário.'
    if (
      horarioOcupado(banco, consulta.veterinarioId, dados.dataHora, consulta.id)
    ) {
      return 'Esse horário não está livre.'
    }
  }

  alterar((atual) => {
    const item = atual.consultas.find(
      (consultaItem) => consultaItem.id === dados.consultaId,
    )
    if (!item) return
    item.status = dados.status
    if (dados.dataHora) item.dataHora = dados.dataHora
    const pet = atual.pets.find((petItem) => petItem.id === item.petId)
    const texto =
      dados.status === 'cancelada'
        ? `A consulta de ${pet?.nome ?? 'seu pet'} foi cancelada.`
        : dados.status === 'remarcada'
          ? `A consulta de ${pet?.nome ?? 'seu pet'} foi remarcada para ${dataHora(item.dataHora)}.`
          : `A consulta de ${pet?.nome ?? 'seu pet'} foi confirmada.`
    notificar(atual, item.tutorId, 'Atualização de consulta', texto)
  })
  return null
}

export function salvarBloqueio(dados: {
  veterinarioId: string
  inicio: string
  fim: string
  motivo: string
}) {
  if (!dados.inicio || !dados.fim) return 'Informe o intervalo.'
  if (new Date(dados.fim) <= new Date(dados.inicio)) {
    return 'O fim precisa ser depois do início.'
  }
  if (!dados.motivo.trim()) return 'Informe o motivo do bloqueio.'

  alterar((banco) => {
    banco.bloqueios.push({
      id: novoId(),
      veterinarioId: dados.veterinarioId,
      inicio: new Date(dados.inicio).toISOString(),
      fim: new Date(dados.fim).toISOString(),
      motivo: dados.motivo.trim(),
    })
  })
  return null
}

export function excluirBloqueio(id: string, veterinarioId: string) {
  alterar((banco) => {
    banco.bloqueios = banco.bloqueios.filter(
      (item) => !(item.id === id && item.veterinarioId === veterinarioId),
    )
  })
}

export function salvarVeterinario(dados: {
  id?: string
  cidadeIds: string[]
  nome: string
  email: string
  senha?: string
  crmv: string
  especialidade: string
  ativo: boolean
}) {
  const nome = dados.nome.trim()
  const email = dados.email.trim().toLowerCase()
  if (nome.length < 3) return 'Informe o nome.'
  if (!email.includes('@')) return 'Informe um email válido.'
  if (!dados.crmv.trim()) return 'Informe o CRMV.'
  if (dados.cidadeIds.length === 0) return 'Escolha ao menos uma cidade.'
  if (!dados.id && (dados.senha ?? '').length < 6) {
    return 'A senha inicial precisa ter ao menos 6 caracteres.'
  }

  const banco = bancoAtual()
  const atualVet = banco.veterinarios.find((item) => item.id === dados.id)
  const usuarioAtual = banco.usuarios.find(
    (item) => item.id === atualVet?.usuarioId,
  )
  if (!emailLivre(banco, email, usuarioAtual?.id)) {
    return 'Já existe um acesso com este email.'
  }

  alterar((atual) => {
    if (atualVet && usuarioAtual) {
      const veterinario = atual.veterinarios.find(
        (item) => item.id === atualVet.id,
      )
      const usuario = atual.usuarios.find((item) => item.id === usuarioAtual.id)
      if (!veterinario || !usuario) return
      veterinario.nome = nome
      veterinario.crmv = dados.crmv.trim()
      veterinario.especialidade = dados.especialidade.trim() || 'Clínica geral'
      veterinario.cidadeIds = dados.cidadeIds
      veterinario.ativo = dados.ativo
      usuario.nome = nome
      usuario.email = email
      if (dados.senha && dados.senha.length >= 6) usuario.senha = dados.senha
      return
    }

    const veterinarioId = novoId()
    const usuarioId = novoId()
    atual.veterinarios.push({
      id: veterinarioId,
      usuarioId,
      cidadeIds: dados.cidadeIds,
      nome,
      crmv: dados.crmv.trim(),
      especialidade: dados.especialidade.trim() || 'Clínica geral',
      ativo: dados.ativo,
    })
    atual.usuarios.push({
      id: usuarioId,
      nome,
      email,
      senha: dados.senha || SENHA_DEMO,
      perfil: 'veterinario',
      veterinarioId,
    })
  })
  return null
}

export function enviarChat(
  consultaId: string,
  texto: string,
  veterinarioId: string,
) {
  const banco = bancoAtual()
  const consulta = banco.consultas.find((item) => item.id === consultaId)
  if (!consulta || consulta.veterinarioId !== veterinarioId) {
    return 'Você não atende esta consulta.'
  }
  if (!texto.trim()) return 'Escreva uma mensagem.'

  const ia = responderIa(texto)
  alterar((atual) => {
    const agora = new Date().toISOString()
    atual.mensagens.push({
      id: novoId(),
      consultaId,
      autor: 'vet',
      texto: texto.trim(),
      criadaEm: agora,
    })
    atual.mensagens.push({
      id: novoId(),
      consultaId,
      autor: 'ia',
      texto: ia.alerta ? `${ia.resposta}\n\n⚠️ ${ia.alerta}` : ia.resposta,
      criadaEm: agora,
    })
  })
  return { sugestoes: ia.sugestoes, alerta: ia.alerta }
}

export function salvarProntuario(
  consultaId: string,
  texto: string,
  veterinarioId: string,
) {
  if (!texto.trim()) return 'Escreva o prontuário.'
  const consulta = bancoAtual().consultas.find((item) => item.id === consultaId)
  if (!consulta || consulta.veterinarioId !== veterinarioId) {
    return 'Consulta fora do seu acesso.'
  }
  alterar((banco) => {
    const existente = banco.prontuarios.find(
      (item) => item.consultaId === consultaId,
    )
    if (existente) {
      existente.texto = texto.trim()
      return
    }
    banco.prontuarios.push({
      id: novoId(),
      consultaId,
      petId: consulta.petId,
      texto: texto.trim(),
      criadoEm: new Date().toISOString(),
    })
  })
  return null
}

export function salvarReceita(
  consultaId: string,
  texto: string,
  veterinarioId: string,
  itens?: Array<{ nome: string; uso: string }>,
) {
  if (!texto.trim() && (!itens || itens.length === 0)) {
    return 'Escreva a receita.'
  }
  const consulta = bancoAtual().consultas.find((item) => item.id === consultaId)
  if (!consulta || consulta.veterinarioId !== veterinarioId) {
    return 'Consulta fora do seu acesso.'
  }
  const lista = (itens ?? []).filter((item) => item.nome.trim())
  const corpo =
    texto.trim() || lista.map((item) => `${item.nome} — ${item.uso}`).join('\n')
  alterar((banco) => {
    banco.receitas.push({
      id: novoId(),
      consultaId,
      petId: consulta.petId,
      texto: corpo,
      itens: lista.length > 0 ? lista : undefined,
      ativo: true,
      criadoEm: new Date().toISOString(),
    })
  })
  return null
}

export function salvarVacina(dados: {
  petId: string
  nome: string
  dose?: string
  lote?: string
  aplicadaEm?: string
  proximaDose?: string
  veterinarioId?: string
  consultaId?: string
  tutorId?: string
}) {
  if (!dados.nome.trim()) return 'Informe o nome da vacina.'
  if (!dados.aplicadaEm && !dados.proximaDose) {
    return 'Informe a aplicação ou a próxima dose.'
  }
  const pet = bancoAtual().pets.find((item) => item.id === dados.petId)
  if (!pet) return 'Pet não encontrado.'
  if (dados.tutorId && pet.tutorId !== dados.tutorId)
    return 'Esse pet não é seu.'

  alterar((banco) => {
    banco.vacinas.push({
      id: novoId(),
      petId: dados.petId,
      nome: dados.nome.trim(),
      dose: dados.dose?.trim() || undefined,
      lote: dados.lote?.trim() || undefined,
      aplicadaEm: dados.aplicadaEm || undefined,
      proximaDose: dados.proximaDose || undefined,
      veterinarioId: dados.veterinarioId,
      consultaId: dados.consultaId,
    })
  })
  return null
}

export function concluirConsulta(consultaId: string, veterinarioId: string) {
  const banco = bancoAtual()
  const consulta = banco.consultas.find((item) => item.id === consultaId)
  if (!consulta || consulta.veterinarioId !== veterinarioId) {
    return 'Consulta fora do seu acesso.'
  }
  if (consulta.status === 'cancelada' || consulta.status === 'realizada') {
    return 'Essa consulta já foi encerrada.'
  }
  const prontuario = banco.prontuarios.find(
    (item) => item.consultaId === consultaId,
  )
  if (!prontuario) return 'Registre o prontuário antes de concluir.'

  alterar((atual) => {
    const item = atual.consultas.find(
      (consultaItem) => consultaItem.id === consultaId,
    )
    if (!item) return
    item.status = 'realizada'
    const pet = atual.pets.find((petItem) => petItem.id === item.petId)
    notificar(
      atual,
      item.tutorId,
      'Consulta realizada',
      `O atendimento de ${pet?.nome ?? 'seu pet'} foi concluído. Receitas e histórico já estão disponíveis.`,
    )
  })
  return null
}

export function marcarNotificacoes(tutorId: string, id?: string) {
  alterar((banco) => {
    for (const item of banco.notificacoes) {
      if (item.tutorId !== tutorId) continue
      if (!id || item.id === id) item.lida = true
    }
  })
}

export function excluirNotificacao(tutorId: string, id: string) {
  alterar((banco) => {
    banco.notificacoes = banco.notificacoes.filter(
      (item) => !(item.id === id && item.tutorId === tutorId),
    )
  })
}
