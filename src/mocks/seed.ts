import { diaIso, isoEm } from '@/domain/formatacao'
import type { Banco } from '@/domain/tipos'

import { SENHA_DEMO, VERSAO_BANCO, servicosDoPlano } from './catalogo'

const basicos = [
  'Consulta veterinária em domicílio',
  'Telemedicina',
  'Vacinas essenciais (V10/V4)',
]

const saude = [...basicos, 'Antirrábica', 'Coleta de exames em casa']

const total = [...saude, 'Vermifugação', 'Consulta de retorno']

const premium = [...total, 'Atendimento em feriados']

export function criarSeed(): Banco {
  return {
    versao: VERSAO_BANCO,
    cidades: [
      { id: 'cidade-pf', nome: 'Passo Fundo', uf: 'RS' },
      { id: 'cidade-marau', nome: 'Marau', uf: 'RS' },
    ],
    planos: [
      {
        id: 'plano-basico',
        veterinarioId: 'vet-paulo',
        cidadeId: 'cidade-pf',
        nome: 'Pet Básico',
        subtitulo: 'Cuidados do dia a dia',
        precoMensal: 29.9,
        visitasMes: 1,
        destaque: false,
        servicos: servicosDoPlano(basicos),
        ativo: true,
      },
      {
        id: 'plano-saude',
        veterinarioId: 'vet-paulo',
        cidadeId: 'cidade-pf',
        nome: 'Pet Saúde',
        subtitulo: 'Saúde em dia',
        precoMensal: 59.9,
        visitasMes: 2,
        destaque: false,
        servicos: servicosDoPlano(saude),
        ativo: true,
      },
      {
        id: 'plano-total',
        veterinarioId: 'vet-paulo',
        cidadeId: 'cidade-pf',
        nome: 'Pet Total',
        subtitulo: 'Melhor custo-benefício',
        precoMensal: 99.9,
        visitasMes: 4,
        destaque: true,
        servicos: servicosDoPlano(total),
        ativo: true,
      },
      {
        id: 'plano-premium',
        veterinarioId: 'vet-paulo',
        cidadeId: 'cidade-pf',
        nome: 'Pet Premium',
        subtitulo: 'Máxima proteção',
        precoMensal: 159.9,
        visitasMes: null,
        destaque: false,
        servicos: servicosDoPlano(premium),
        ativo: true,
      },
      {
        id: 'plano-marau-basico',
        veterinarioId: 'vet-renata',
        cidadeId: 'cidade-marau',
        nome: 'Pet Básico',
        subtitulo: 'Cuidados do dia a dia',
        precoMensal: 34.9,
        visitasMes: 1,
        destaque: false,
        servicos: servicosDoPlano(basicos),
        ativo: true,
      },
      {
        id: 'plano-marau-total',
        veterinarioId: 'vet-renata',
        cidadeId: 'cidade-marau',
        nome: 'Pet Total',
        subtitulo: 'Melhor custo-benefício',
        precoMensal: 109.9,
        visitasMes: 4,
        destaque: true,
        servicos: servicosDoPlano(total),
        ativo: true,
      },
    ],
    usuarios: [
      {
        id: 'user-admin',
        nome: 'Helena Admin',
        email: 'admin@ttpets.com',
        senha: SENHA_DEMO,
        perfil: 'admin',
      },
      {
        id: 'user-paulo',
        nome: 'Paulo Vieira',
        email: 'paulo.vet@ttpets.com',
        senha: SENHA_DEMO,
        perfil: 'veterinario',
        veterinarioId: 'vet-paulo',
      },
      {
        id: 'user-julia',
        nome: 'Júlia Ramos',
        email: 'julia.vet@ttpets.com',
        senha: SENHA_DEMO,
        perfil: 'veterinario',
        veterinarioId: 'vet-julia',
      },
      {
        id: 'user-vet-marau',
        nome: 'Renata Luz',
        email: 'renata.vet@ttpets.com',
        senha: SENHA_DEMO,
        perfil: 'veterinario',
        veterinarioId: 'vet-renata',
      },
      {
        id: 'user-ana',
        nome: 'Ana Souza',
        email: 'ana.tutor@ttpets.com',
        senha: SENHA_DEMO,
        perfil: 'tutor',
        tutorId: 'tutor-ana',
      },
      {
        id: 'user-bruno',
        nome: 'Bruno Keller',
        email: 'bruno.tutor@ttpets.com',
        senha: SENHA_DEMO,
        perfil: 'tutor',
        tutorId: 'tutor-bruno',
      },
    ],
    tutores: [
      {
        id: 'tutor-ana',
        usuarioId: 'user-ana',
        nome: 'Ana Souza',
        cpf: '12345678901',
        telefone: '54999990001',
        email: 'ana.tutor@ttpets.com',
      },
      {
        id: 'tutor-bruno',
        usuarioId: 'user-bruno',
        nome: 'Bruno Keller',
        cpf: '98765432100',
        telefone: '54988880002',
        email: 'bruno.tutor@ttpets.com',
      },
    ],
    pets: [
      {
        id: 'pet-thor',
        tutorId: 'tutor-ana',
        nome: 'Thor',
        especie: 'Cão',
        raca: 'Golden Retriever',
        nascimento: '2022-03-10',
        peso: 28,
      },
      {
        id: 'pet-luna',
        tutorId: 'tutor-ana',
        nome: 'Luna',
        especie: 'Gato',
        raca: 'SRD',
        nascimento: '2023-07-02',
        peso: 4.2,
      },
      {
        id: 'pet-nina',
        tutorId: 'tutor-bruno',
        nome: 'Nina',
        especie: 'Cão',
        raca: 'Poodle',
        nascimento: '2021-11-20',
        peso: 6.5,
      },
    ],
    veterinarios: [
      {
        id: 'vet-paulo',
        usuarioId: 'user-paulo',
        cidadeIds: ['cidade-pf'],
        nome: 'Paulo Vieira',
        crmv: 'CRMV-RS 12345',
        especialidade: 'Clínica geral',
        ativo: true,
      },
      {
        id: 'vet-julia',
        usuarioId: 'user-julia',
        cidadeIds: ['cidade-pf'],
        nome: 'Júlia Ramos',
        crmv: 'CRMV-RS 54321',
        especialidade: 'Dermatologia',
        ativo: true,
      },
      {
        id: 'vet-renata',
        usuarioId: 'user-vet-marau',
        cidadeIds: ['cidade-marau'],
        nome: 'Renata Luz',
        crmv: 'CRMV-RS 67890',
        especialidade: 'Clínica geral',
        ativo: true,
      },
    ],
    assinaturas: [
      {
        id: 'ass-thor',
        petId: 'pet-thor',
        planoId: 'plano-saude',
        cidadeId: 'cidade-pf',
        tutorId: 'tutor-ana',
        status: 'ativa',
        inicio: diaIso(-40),
      },
      {
        id: 'ass-nina',
        petId: 'pet-nina',
        planoId: 'plano-marau-total',
        cidadeId: 'cidade-marau',
        tutorId: 'tutor-bruno',
        status: 'ativa',
        inicio: diaIso(-15),
      },
    ],
    bloqueios: [
      {
        id: 'bloq-paulo',
        veterinarioId: 'vet-paulo',
        inicio: isoEm(1, 14),
        fim: isoEm(1, 16),
        motivo: 'Reunião da equipe',
      },
    ],
    consultas: [
      {
        id: 'con-thor-amanha',
        petId: 'pet-thor',
        tutorId: 'tutor-ana',
        veterinarioId: 'vet-paulo',
        cidadeId: 'cidade-pf',
        dataHora: isoEm(1, 10),
        status: 'confirmada',
        motivo: 'Consulta de rotina em domicílio',
      },
      {
        id: 'con-thor-julia',
        petId: 'pet-thor',
        tutorId: 'tutor-ana',
        veterinarioId: 'vet-julia',
        cidadeId: 'cidade-pf',
        dataHora: isoEm(3, 15),
        status: 'agendada',
        motivo: 'Avaliação de coceira',
      },
      {
        id: 'con-thor-passada',
        petId: 'pet-thor',
        tutorId: 'tutor-ana',
        veterinarioId: 'vet-paulo',
        cidadeId: 'cidade-pf',
        dataHora: isoEm(-8, 9),
        status: 'realizada',
        motivo: 'Retorno de vacina',
      },
      {
        id: 'con-nina',
        petId: 'pet-nina',
        tutorId: 'tutor-bruno',
        veterinarioId: 'vet-renata',
        cidadeId: 'cidade-marau',
        dataHora: isoEm(2, 11),
        status: 'agendada',
        motivo: 'Check-up domiciliar',
      },
    ],
    mensagens: [],
    prontuarios: [
      {
        id: 'pront-thor',
        consultaId: 'con-thor-passada',
        petId: 'pet-thor',
        texto:
          'Paciente ativo, mucosas normocoradas. Vacina V10 aplicada sem reação imediata. Orientada observação por 24 horas.',
        criadoEm: isoEm(-8, 10),
      },
    ],
    receitas: [
      {
        id: 'rec-thor',
        consultaId: 'con-thor-passada',
        petId: 'pet-thor',
        texto:
          'Dipirona 500 mg: 1/4 do comprimido se houver dor, a cada 8 horas, por no máximo 2 dias. Retorno se houver vômito.',
        criadoEm: isoEm(-8, 10),
      },
    ],
    vacinas: [
      {
        id: 'vac-thor',
        petId: 'pet-thor',
        nome: 'V10',
        aplicadaEm: diaIso(-340),
        proximaDose: diaIso(5),
        veterinarioId: 'vet-paulo',
        consultaId: 'con-thor-passada',
      },
    ],
    notificacoes: [
      {
        id: 'lembrete-vac-thor',
        tutorId: 'tutor-ana',
        titulo: 'Vacina do Thor próxima',
        texto: 'A V10 do Thor vence em breve. Agende a dose de reforço.',
        lida: false,
        criadaEm: isoEm(0, 8),
        tipo: 'vacina',
      },
      {
        id: 'aviso-con-thor',
        tutorId: 'tutor-ana',
        titulo: 'Consulta confirmada',
        texto: 'A consulta do Thor com Paulo Vieira está confirmada.',
        lida: false,
        criadaEm: isoEm(0, 9),
        tipo: 'consulta',
      },
    ],
  }
}

const DATAS_CONSULTA: Record<string, [number, number]> = {
  'con-thor-amanha': [1, 10],
  'con-thor-julia': [3, 15],
  'con-thor-passada': [-8, 9],
  'con-nina': [2, 11],
}

export function aplicarDatasDemo(banco: Banco) {
  for (const consulta of banco.consultas) {
    const referencia = DATAS_CONSULTA[consulta.id]
    if (!referencia) continue
    consulta.dataHora = isoEm(referencia[0], referencia[1])
  }

  const bloqueio = banco.bloqueios.find((item) => item.id === 'bloq-paulo')
  if (bloqueio) {
    bloqueio.inicio = isoEm(1, 14)
    bloqueio.fim = isoEm(1, 16)
  }

  const vacina = banco.vacinas.find((item) => item.id === 'vac-thor')
  if (vacina) {
    vacina.aplicadaEm = diaIso(-340)
    vacina.proximaDose = diaIso(5)
  }
}
