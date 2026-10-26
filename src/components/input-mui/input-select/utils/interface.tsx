import {
  AutocompleteChangeDetails,
  AutocompleteChangeReason,
  AutocompleteProps,
} from '@mui/material'
import { InputProps } from '../../input/utils/interface'

/**
 * Interface para as propriedades do componente InputSelect.
 *
 * @template T - O tipo dos itens de opções no seletor.
 * @template M - Valor booleano que define se a seleção pode ser múltipla.
 */
export interface InputSelectProps<T, M extends boolean = false>
  extends Omit<
    AutocompleteProps<T, M, boolean | undefined, boolean | undefined>,
    'renderInput' | 'onChange'
  > {
  /**
   * Propriedades adicionais para o campo de entrada.
   * @type {InputProps}
   */
  textFieldProps?: InputProps

  /**
   * As opções a serem exibidas no seletor.
   * @type {T[]}
   */
  options: T[]

  /**
   * Função que retorna a string a ser exibida como o rótulo de uma opção.
   * @param {T} data - A opção de dado.
   * @returns {string} O rótulo da opção.
   */
  optionLabel: (data: T) => string

  /**
   * Define se o seletor permite múltiplas seleções.
   * @type {M}
   */
  multiple?: M

  /**
   * Função de callback disparada quando o valor do seletor é alterado.
   * @param {React.SyntheticEvent} event - O evento que disparou a alteração.
   * @param {M extends true ? T[] : T | null} value - O novo valor selecionado.
   * @param {AutocompleteChangeReason} reason - O motivo da alteração.
   * @param {AutocompleteChangeDetails<T>} [details] - Detalhes adicionais da alteração (opcional).
   */
  onChange?: (
    event: React.SyntheticEvent,
    value: M extends true ? T[] : T | null,
    reason: AutocompleteChangeReason,
    details?: AutocompleteChangeDetails<T>,
  ) => void
}
