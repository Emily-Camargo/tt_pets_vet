export type Perfil = 'admin' | 'gestor' | 'veterinario' | 'tutor'

export type StatusConsulta =
  | 'agendada'
  | 'confirmada'
  | 'remarcada'
  | 'cancelada'
  | 'realizada'

export interface Cidade {
  id: string
  nome: string
  uf: string
}

export interface Clinica {
  id: string
  nome: string
  cnpj: string
  cidadeIds: string[]
  ativa: boolean
}

export interface ServicoPlano {
  nome: string
  incluso: boolean
}

export interface Plano {
  id: string
  clinicaId: string
  cidadeId: string
  nome: string
  subtitulo: string
  precoMensal: number
  visitasMes: number | null
  destaque: boolean
  servicos: ServicoPlano[]
  ativo: boolean
}

export interface Usuario {
  id: string
  nome: string
  email: string
  senha: string
  perfil: Perfil
  clinicaId?: string
  veterinarioId?: string
  tutorId?: string
}

export interface Tutor {
  id: string
  usuarioId: string
  nome: string
  cpf: string
  telefone: string
  email: string
}

export interface Pet {
  id: string
  tutorId: string
  nome: string
  especie: string
  raca: string
  nascimento: string
  peso: number
  foto?: string
}

export interface Veterinario {
  id: string
  usuarioId: string
  clinicaId: string
  nome: string
  crmv: string
  especialidade: string
  ativo: boolean
}

export interface Assinatura {
  id: string
  petId: string
  planoId: string
  cidadeId: string
  clinicaId: string
  tutorId: string
  status: 'ativa' | 'cancelada'
  inicio: string
}

export interface Bloqueio {
  id: string
  veterinarioId: string
  clinicaId: string
  inicio: string
  fim: string
  motivo: string
}

export interface Consulta {
  id: string
  petId: string
  tutorId: string
  veterinarioId: string
  clinicaId: string
  cidadeId: string
  dataHora: string
  status: StatusConsulta
  motivo: string
}

export interface MensagemChat {
  id: string
  consultaId: string
  autor: 'vet' | 'ia'
  texto: string
  criadaEm: string
}

export interface Prontuario {
  id: string
  consultaId: string
  petId: string
  texto: string
  criadoEm: string
}

export interface Receita {
  id: string
  consultaId: string
  petId: string
  texto: string
  criadoEm: string
}

export interface Vacina {
  id: string
  petId: string
  nome: string
  aplicadaEm: string
  proximaDose: string
  veterinarioId?: string
  consultaId?: string
}

export interface Notificacao {
  id: string
  tutorId: string
  titulo: string
  texto: string
  lida: boolean
  criadaEm: string
  tipo: 'vacina' | 'consulta'
}

export interface Banco {
  versao: number
  cidades: Cidade[]
  clinicas: Clinica[]
  planos: Plano[]
  usuarios: Usuario[]
  tutores: Tutor[]
  pets: Pet[]
  veterinarios: Veterinario[]
  assinaturas: Assinatura[]
  bloqueios: Bloqueio[]
  consultas: Consulta[]
  mensagens: MensagemChat[]
  prontuarios: Prontuario[]
  receitas: Receita[]
  vacinas: Vacina[]
  notificacoes: Notificacao[]
}
