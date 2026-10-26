// interface.ts
import { ButtonExcelProps } from '../../button/button-excel'
import { InputProps } from '../../input-mui/input/utils/interface'
import { InputSelectProps } from '../../input-mui/input-select/utils/interface'

/**
 * Propriedades para o componente CSV.
 */
export interface CsvProps {
  /**
   * Função chamada ao clicar no botão CSV.
   */
  onClick: () => void

  /**
   * Indica se o CSV está em processo de carregamento.
   */
  isLoading: boolean
}

/**
 * Propriedades para o componente FiltroCard.
 *
 * @template T - Tipo dos dados utilizados.
 */
export interface FiltroCardProps<T> {
  /**
   * Propriedades para manipulação do CSV.
   */
  csv?: CsvProps

  /**
   * Título do cartão de filtros.
   */
  title?: string

  /**
   * Texto de pesquisa utilizado para filtrar dados.
   */
  pesquisa?: string

  /**
   * Indica se os filtros devem ser renderizados.
   */
  renderFiltro: boolean

  /**
   * Propriedades para o botão Excel.
   */
  excelProps?: ButtonExcelProps<T>

  /**
   * Função para atualizar o valor da pesquisa.
   */
  setPesquisa?: (value: string) => void

  /**
   * Função para alterar o estado de abertura do cartão.
   */
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

/**
 * Propriedades adicionais para inputs.
 */
export interface AdicionalPropsInput {
  /**
   * Ordem de exibição do input.
   */
  order?: number

  /**
   * Tamanho do grid para o input.
   */
  xs?: number
}

export type InputsTypeFiltro = Omit<InputProps, 'sx'> & AdicionalPropsInput

/**
 * Propriedades para o componente Filtros.
 *
 * @template T - Tipo dos dados utilizados.
 * @template M - Tipo opcional que define um parâmetro booleano.
 */
export interface FiltrosProps<T, M extends boolean = false> {
  /**
   * Estado que determina se o drawer está aberto.
   */
  open?: boolean

  /**
   * Função para alterar o estado do drawer.
   */
  setOpen: React.Dispatch<React.SetStateAction<boolean>>

  /**
   * Lista de entradas do tipo Input.
   */
  inputs?: InputsTypeFiltro[]

  /**
   * Lista de entradas do tipo InputSelect.
   */
  inputSelect?: Array<Omit<InputSelectProps<T, M>, 'sx'> & AdicionalPropsInput>

  /**
   * Função chamada ao limpar os filtros.
   */
  onClear?: () => void

  /**
   * Função chamada ao submeter os filtros.
   */
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void
}

/**
 * Propriedades para o componente Filtro.
 *
 * @template T - Tipo dos dados utilizados.
 * @template M - Tipo opcional que define um parâmetro booleano.
 */
export interface FiltroProps<T, M extends boolean = false>
  extends Omit<FiltroCardProps<T>, 'renderFiltro' | 'setOpen'>,
    Omit<FiltrosProps<T, M>, 'open' | 'setOpen'> {}
