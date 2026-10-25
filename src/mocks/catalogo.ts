export const SENHA_DEMO = 'Pet@1234'
export const VERSAO_BANCO = 1

export const CATALOGO_SERVICOS = [
  'Consulta veterinária em domicílio',
  'Telemedicina',
  'Vacinas essenciais (V10/V4)',
  'Antirrábica',
  'Coleta de exames em casa',
  'Vermifugação',
  'Consulta de retorno',
  'Atendimento em feriados',
]

export function servicosDoPlano(inclusos: string[]) {
  return CATALOGO_SERVICOS.map((nome) => ({
    nome,
    incluso: inclusos.includes(nome),
  }))
}
