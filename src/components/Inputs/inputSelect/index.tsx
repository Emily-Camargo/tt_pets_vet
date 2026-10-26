import React from 'react'
import Autocomplete, { AutocompleteProps } from '@mui/material/Autocomplete'
import { sxTextField } from '../../../styles/sx'
import InputPesquisar, { InputProps } from '../Input'

export interface CustomAutocompleteProps<T>
  extends Omit<
    AutocompleteProps<T, boolean, boolean, boolean, 'div'>,
    'renderInput'
  > {
  renderInput?: React.ReactNode
}

export interface InputSelectMultipleProps<T>
  extends CustomAutocompleteProps<T> {
  className?: string
  textFieldProps: InputProps
  optionLabel: (data: T) => string
  xs?: number
  order?: number
  render?: boolean
  disablePortal?: boolean
}

export default function InputSelectMultiple<T>({
  className,
  textFieldProps,
  optionLabel,
  disablePortal = true,
  ...rest
}: Readonly<InputSelectMultipleProps<T>>) {
  return (
    <div className={className}>
      <Autocomplete
        disablePortal={disablePortal}
        sx={sxTextField}
        filterSelectedOptions
        getOptionLabel={(data) =>
          typeof data !== 'string' ? optionLabel(data) : 'Não há dados'
        }
        {...rest}
        renderInput={(params) => (
          <InputPesquisar {...params} {...textFieldProps} />
        )}
      />
    </div>
  )
}
