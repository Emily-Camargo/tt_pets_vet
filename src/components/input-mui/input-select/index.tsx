import Input from '../input'
import Autocomplete, {
  AutocompleteValue,
  AutocompleteChangeReason,
  AutocompleteChangeDetails,
} from '@mui/material/Autocomplete'
import { InputSelectProps } from './utils/interface'

const InputSelect = <T, M extends boolean = false>({
  multiple,
  optionLabel,
  onChange,
  textFieldProps,
  ...rest
}: InputSelectProps<T, M>): JSX.Element => {
  const handleChange = (
    event: React.SyntheticEvent,
    value: AutocompleteValue<T, M, false, false>,
    reason: AutocompleteChangeReason,
    details?: AutocompleteChangeDetails<T>,
  ) => {
    if (onChange) {
      onChange(event, value, reason, details)
    }
  }

  return (
    <Autocomplete
      multiple={multiple}
      {...rest}
      getOptionLabel={(v) => {
        if (typeof v === 'string') {
          return v
        }
        return optionLabel ? optionLabel(v) : String(v)
      }}
      onChange={handleChange}
      renderInput={(params) => <Input {...params} {...textFieldProps} />}
    />
  )
}

export default InputSelect
