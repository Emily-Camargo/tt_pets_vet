export interface Sugestao {
  tipo: 'prontuario' | 'receita' | 'vacina'
  titulo: string
  conteudo: string
  vacina?: { nome: string; proximaDoseDias: number }
}

export function responderIa(texto: string) {
  const mensagem = texto.toLowerCase()
  const sugestoes: Sugestao[] = []
  let resposta =
    'Anote espécie, queixa, há quanto tempo começou e se o pet está comendo. Posso sugerir prontuário, receita ou vacina.'
  let alerta: string | undefined

  if (
    mensagem.includes('apoquel') ||
    mensagem.includes('dose') ||
    mensagem.includes('mg/kg')
  ) {
    resposta =
      'Para 28 kg, a faixa usual de oclacitinib é 0,4 a 0,6 mg/kg a cada 12 h nos primeiros 14 dias (cerca de 11–17 mg), depois 1× ao dia. Com 16 mg, 1 comprimido ao dia costuma cobrir a manutenção. No Thor já há 45 dias de uso — mantenha enquanto houver prurido e reavalie em 30 dias.'
    alerta =
      'Lembrete: o Thor tem alergia a frango registrada. Evite petiscos e medicamentos com sabor de frango; a pomada atual é segura.'
    sugestoes.push({
      tipo: 'receita',
      titulo: 'Receita sugerida',
      conteudo: 'Apoquel 16 mg — 1 comprimido ao dia por 30 dias',
    })
  } else if (mensagem.includes('coceira') || mensagem.includes('coçando')) {
    resposta =
      'Prurido em domicílio pede olhar pele, orelha e pulgas. Registre o exame e, se não houver ferida grave, uma receita de suporte já ajuda.'
    sugestoes.push({
      tipo: 'prontuario',
      titulo: 'Prontuário sugerido',
      conteudo:
        'Queixa de coceira. Pele sem lesão ulcerada no exame domiciliar. Conduta: controle de ectoparasitas e reavaliação em 10 dias.',
    })
    sugestoes.push({
      tipo: 'receita',
      titulo: 'Receita sugerida',
      conteudo:
        'Shampoo hipoalergênico 1 vez por semana. Antipulgas conforme peso. Se a coceira continuar, retornar antes de usar corticoide.',
    })
  } else if (mensagem.includes('histórico') || mensagem.includes('resum')) {
    resposta =
      'Histórico recente: dermatite atópica em acompanhamento, V10 em dia, Apoquel em uso contínuo e melhora parcial do prurido nas patas. Próximo passo: manter anti-pruriginoso e reavaliar pele em 30 dias.'
  } else if (mensagem.includes('orientação') || mensagem.includes('tutor')) {
    resposta =
      'Oriente a tutora a manter o Apoquel no horário fixo, evitar banho diário, usar shampoo indicado 1×/semana e retornar se houver feridas, vômito ou piora da coceira em 48 h.'
  } else if (
    mensagem.includes('interação') ||
    mensagem.includes('medicament')
  ) {
    resposta =
      'Oclacitinib (Apoquel) tem baixo risco de interação com a pomada tópica atual. Evite corticoides sistêmicos em dose alta sem indicação e monitore infecções cutâneas secundárias.'
  } else if (mensagem.includes('vômito') || mensagem.includes('vomito')) {
    resposta =
      'Vômito isolado pode ser dieta. Se houver sangue, apatia ou repetição, o atendimento deixa de ser só orientativo.'
    sugestoes.push({
      tipo: 'receita',
      titulo: 'Receita sugerida',
      conteudo:
        'Jejum hídrico curto de 4 horas se não houver desidratação. Dieta leve fracionada por 24 horas. Antiemético conforme peso, se o vômito repetir.',
    })
  } else if (mensagem.includes('vacina')) {
    resposta =
      'Confira a carteira antes de aplicar. Se o pet estiver ativo e sem febre, a V10 pode ser registrada agora.'
    sugestoes.push({
      tipo: 'vacina',
      titulo: 'Vacina sugerida',
      conteudo: 'V10 aplicada em domicílio, sem reação imediata.',
      vacina: { nome: 'V10', proximaDoseDias: 365 },
    })
  } else if (mensagem.includes('retorno')) {
    resposta =
      'No retorno, compare com a consulta anterior e feche a conduta no prontuário.'
    sugestoes.push({
      tipo: 'prontuario',
      titulo: 'Prontuário sugerido',
      conteudo:
        'Retorno domiciliar. Tutor relata melhora. Exame sem piora. Alta da queixa atual, com orientação de retorno se os sinais voltarem.',
    })
  }

  return { resposta, sugestoes, alerta }
}
