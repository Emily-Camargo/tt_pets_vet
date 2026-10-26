interface MascaradorCPFCNPJProps {
    v: string | number
    autoComplete?: boolean
    ignoreCNPJ?: boolean
  }
  

  export const mascaradorCPFCNPJ = ({
    v,
    autoComplete,
    ignoreCNPJ,
  }: MascaradorCPFCNPJProps): string => {
    const value = v?.toString().replace(/\D/g, '')
  
    if (!ignoreCNPJ) {
      // Verifica se é um CPF (até 11 dígitos)
      if (value?.length <= 11) {
        const a = autoComplete ? value?.padStart(11, '0') : value
        return a
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
      } else {
        // Se for um CNPJ
        const a = autoComplete ? value?.padStart(14, '0') : value
        return a
          .replace(/^(\d{2})(\d)/, '$1.$2')
          .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
          .replace(/\.(\d{3})(\d)/, '.$1/$2')
          .replace(/(\d{4})(\d)/, '$1-$2')
      }
    } else {
      const a = autoComplete ? value?.padStart(11, '0') : value
      return a
        .slice(0, 11)
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    }
  }
  
  export const mascaradorTelefone = (v: string | number): string => {
    if (!v) return ''
    v = v?.toString().replace(/\D/g, '')
  
    if (v.length === 8) {
      return v.replace(/(\d{4})(\d{4})/, '$1-$2')
    } else if (v.length === 9) {
      return v.replace(/(\d{5})(\d{4})/, '$1-$2')
    } else if (v.length === 10) {
      return v.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
    } else if (v.length === 11) {
      return v.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    } else if (v.length === 12) {
      return v.replace(/(\d{2})(\d{2})(\d{4})(\d{4})/, '+$1 ($2) $3-$4')
    } else if (v.length === 13) {
      return v.replace(/(\d{2})(\d{2})(\d{5})(\d{4})/, '+$1 ($2) $3-$4')
    } else {
      return v
    }
  }
  

  export const mascaradorMilhar = (valor: string | number): string => {
    return valor?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }
  
  /**
   * Função para adicionar pontos de separação de milhar e decimais em um número.
   *
   * @param {string | number} v - O valor numérico a ser formatado com pontos de separação de milhar.
   * @returns {string} - O valor formatado com pontos de separação de milhar e duas casas decimais após a vírgula.
   *
   * @example
   * const numeroFormatado = mascaradorMilharDecimal(1234567); // Retorna '1.234.567,00'
   * @author Nicolasfmc
   * @version 1.0.0
   */
  export const mascaradorMilharDecimal = (v: string | number): string => {
    let res = ''
  
    if (!v) {
      v = 0
    }
  
    res = v
      .toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      })
      .toString()
  
    return res.replace('R$', '').trim()
  }
  

  export const mascaradorValorReal = (v?: string | number | null): string => {
    // Convertendo para um número, se for uma string
    const valorNumerico = typeof v === 'string' ? parseFloat(v) : (v ?? 0)
  
    // Verificando se a conversão foi bem-sucedida
    if (!isNaN(valorNumerico)) {
      // Formatando o número como moeda
      const valorFormatado = valorNumerico.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      })
  
      return valorFormatado
    } else {
      // Tratamento para casos em que a conversão não é bem-sucedida
      return 'R$ 0,00'
    }
  }
  

  export function formatarDataBR(data: Date | string): string {
    const dataformata = data
      ?.toString()
      ?.substring(0, 10)
      ?.split('-')
      ?.reverse()
      ?.join('/')
  
    return dataformata || ''
  }
  
  /**
   * Função para formatar uma data no formato 'yyyy-mm' e um dia para 'DD/MM/YYYY'.
   *
   * @param {string} anoMes - A string no formato 'yyyy-mm'.
   * @param {string} [dia='01'] - A string representando o dia (opcional, padrão é '01' se não informado).
   * @returns {string} A data formatada no formato 'DD/MM/YYYY' ou '' se a entrada for inválida.
   *
   * @example
   * const dataFormatada = formatarMesAno('2023-01'); // Retorna '01/01/2023'
   * const dataFormatadaComDia = formatarMesAno('2023-01', '10'); // Retorna '10/01/2023'
   * @author Nicolasfmc
   * @version 1.1.0
   */
  export function formatarMesAno(anoMes: string, dia = '01'): string {
    const ano = anoMes.substring(0, 4)
    const mes = anoMes.substring(5, 7)
  
    const diaFormatado = dia.padStart(2, '0')
  
    return `${diaFormatado}/${mes}/${ano}`
  }
  

  export function mascaradorInputMoeda(v: string): string {
    let valor = v.replace(/\D/g, '')
    // Formata para moeda
    valor = (Number(valor) / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
    return valor
  }
  

  export function formatarInputMoedaFloat(valor: string): number {
    return parseFloat(
      valor.replace('R$', '').replaceAll('.', '').replace(',', '.'),
    )
  }
  
  /**
   * Função para formatar uma string numérica no formato '00.00.00.0.000'.
   *
   * @param {string} v - A string numérica a ser formatada.
   * @returns {string} A string formatada no formato '00.00.00.0.000'.
   * @example
   * const stringFormatada = formatarStringNumerica('1234567890'); // Retorna '12.34.56.7.890'
   * @author Nicolasfmc
   * @version 1.0.0
   */
  export function mascaradorCodItem(v?: string | undefined): string | undefined {
    v = v?.replace(/\D/g, '')
  
    if (v && v?.length < 10) {
      v = v?.padEnd(10, '0')
    }
  
    return v?.replace(/(\d{2})(\d{2})(\d{2})(\d{1})(\d{3})/, '$1.$2.$3.$4.$5')
  }
  

  export function mascaradorCodItemRede(v: string): string {
    v = v.replace(/\D/g, '') // Remove caracteres não numéricos
  
    // Formatação dinâmica conforme o comprimento da string
    if (v.length <= 2) {
      return v
    } else if (v.length <= 4) {
      return v.replace(/(\d{2})(\d+)/, '$1.$2')
    } else if (v.length <= 6) {
      return v.replace(/(\d{2})(\d{2})(\d+)/, '$1.$2.$3')
    } else if (v.length <= 8) {
      return v.replace(/(\d{2})(\d{2})(\d{2})(\d+)/, '$1.$2.$3.$4')
    } else if (v.length === 9) {
      return v.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d+)/, '$1.$2.$3.$4.$5')
    } else if (v.length <= 11) {
      return v.replace(
        /(\d{2})(\d{2})(\d{2})(\d{2})(\d{1})(\d+)/,
        '$1.$2.$3.$4.$5.$6',
      )
    } else {
      return v.replace(
        /(\d{2})(\d{2})(\d{2})(\d{2})(\d{1})(\d{3})/,
        '$1.$2.$3.$4.$5.$6',
      )
    }
  }
  

  export function formatarDataParaString(data: Date): string {
    const diasSemana = [
      'Domingo',
      'Segunda-feira',
      'Terça-feira',
      'Quarta-feira',
      'Quinta-feira',
      'Sexta-feira',
      'Sábado',
    ]
  
    const meses = [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro',
    ]
  
    const diaSemana = diasSemana[data.getDay()]
    const dia = data.getDate()
    const mes = meses[data.getMonth()]
    const ano = data.getFullYear()
    const hora = data.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    })
  
    const dataFormatada = `${diaSemana}, ${dia} de ${mes} de ${ano}, ${hora}`
  
    return dataFormatada
  }
  
  /**
   * Mascara um CPF, adicionando pontos e traço.
   *
   * @param {string} cpf - O CPF a ser mascarado.
   * @param {boolean} autoComplete - Indica se deve completar com zeros à esquerda.
   * @returns {string} O CPF mascarado.
   */
  interface MascararCPF {
    cpfCnpj: string | number
    autoComplete?: boolean
  }
  export function mascararCPF({
    cpfCnpj,
    autoComplete = false,
  }: MascararCPF): string {
    const value = cpfCnpj?.toString().replace(/\D/g, '')
  
    const mask = autoComplete ? value?.padStart(11, '0') : value
    return mask
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  }
  
  /**
   * Mascara um CNPJ, adicionando pontos, barra e traço.
   *
   * @param {string} cnpj - O CNPJ a ser mascarado.
   * @param {boolean} autoComplete - Indica se deve completar com zeros à esquerda.
   * @returns {string} O CNPJ mascarado.
   */
  export function mascararCNPJ({
    cpfCnpj,
    autoComplete = false,
  }: MascararCPF): string {
    const value = cpfCnpj?.toString().replace(/\D/g, '')
  
    const mask = autoComplete ? value?.padStart(14, '0') : value
    return mask
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
  }
  
  export function formatValuesToMoney<T>(obj: T, fieldsToFormat: (keyof T)[]): T {
    if (Array.isArray(obj)) {
      return obj.map((item) => formatValuesToMoney(item, fieldsToFormat)) as any
    } else if (typeof obj === 'object' && obj !== null) {
      const newObj: any = {}
      for (const key in obj) {
        if (Object.hasOwn(obj, key)) {
          if (fieldsToFormat.includes(key as keyof T)) {
            const value = (obj as any)[key]
            if (typeof value === 'number') {
              newObj[key] = mascaradorInputMoeda(String(value.toFixed(2)))
            } else if (typeof value === 'string') {
              const numericValue = parseFloat(value.replace(/[^\d.-]+/g, ''))
              newObj[key] = isNaN(numericValue)
                ? value
                : mascaradorInputMoeda(String(numericValue.toFixed(2)))
            } else {
              newObj[key] = formatValuesToMoney(value, fieldsToFormat)
            }
          } else {
            newObj[key] = formatValuesToMoney((obj as any)[key], fieldsToFormat)
          }
        }
      }
      return newObj as T
    } else {
      return obj
    }
  }
  
  export function limitDecimais(value: string, limit: number): string {
    value = value.replace(/[^\d.]/g, '').replace(',', '.')
    const parts = value.split('.')
    const oldVal = value
  
    if (parts.length > 2) {
      return oldVal.slice(0, oldVal.length - 1)
    }
  
    if (parts.length > 1 && parts[1].length > limit) {
      return oldVal.slice(0, oldVal.length - (parts[1].length - limit))
    }
  
    return value
  }
  
  export function formatarEmail(email: string): string {
    if (!email) return ''
  
    const [usuario, dominio] = email.split('@')
  
    const usuarioMascarado =
      usuario.charAt(0) + usuario.slice(1).replace(/./g, '*')
  
    return `${usuarioMascarado}@${dominio ?? 'invalido'}`
  }