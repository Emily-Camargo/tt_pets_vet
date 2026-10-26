import { ReactMaskOpts } from 'react-imask'
import { TextFieldProps } from '@mui/material'

export type InputPropsCustomTypes =
  | 'button'
  | 'checkbox'
  | 'color'
  | 'date'
  | 'datetime-local'
  | 'email'
  | 'file'
  | 'hidden'
  | 'image'
  | 'month'
  | 'number'
  | 'password'
  | 'radio'
  | 'range'
  | 'reset'
  | 'search'
  | 'submit'
  | 'tel'
  | 'text'
  | 'time'
  | 'url'
  | 'week'
  | 'float'
  | 'real'
  | 'cpf'
  | 'celular'

export type InputProps = TextFieldProps & {
  shrink?: boolean
  openCamera?: boolean
  onKeyEnter?: () => void
  type?: InputPropsCustomTypes
  mask?: ReactMaskOpts['mask']
  onCamera?: (v: string) => void
  setOpenCamera?: React.Dispatch<React.SetStateAction<boolean>>
}

export interface MaskCustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void
  name: string
  mask: any[]
}
