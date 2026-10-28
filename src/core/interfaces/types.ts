export type Perfil = 'admin' | 'veterinario' | 'tutor'

export type StatusConsulta =
  'agendada' | 'confirmada' | 'remarcada' | 'cancelada' | 'realizada'

export interface Cidade {
  id: string
  nome: string
  uf: string
}

export interface ServicoPlano {
  nome: string
  incluso: boolean
}

export interface Plano {
  id: string
  veterinarioId: string
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
  endereco?: string
}

export interface Pet {
  id: string
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
}

export interface Veterinario {
  id: string
  usuarioId: string
  cidadeIds: string[]
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
  tutorId: string
  status: 'ativa' | 'cancelada'
  inicio: string
}

export interface Bloqueio {
  id: string
  veterinarioId: string
  inicio: string
  fim: string
  motivo: string
}

export interface Consulta {
  id: string
  petId: string
  tutorId: string
  veterinarioId: string
  cidadeId: string
  dataHora: string
  status: StatusConsulta
  motivo: string
  tipo?: string
  endereco?: string
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

export interface ItemReceita {
  nome: string
  uso: string
}

export interface Receita {
  id: string
  consultaId: string
  petId: string
  texto: string
  itens?: ItemReceita[]
  ativo?: boolean
  inicio?: string
  fim?: string
  diasTotais?: number
  criadoEm: string
}

export interface Exame {
  id: string
  petId: string
  consultaId?: string
  nome: string
  resultado: string
  criadoEm: string
}

export interface Vacina {
  id: string
  petId: string
  nome: string
  dose?: string
  lote?: string
  aplicadaEm?: string
  proximaDose?: string
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
  exames: Exame[]
  vacinas: Vacina[]
  notificacoes: Notificacao[]
}
