import * as React from 'react';
import { IMaskInput, ReactMaskOpts } from 'react-imask';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { InputAdornment, ThemeProvider } from '@mui/material';
import { standard, sx, theme } from '../../../styles/sx';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { cn } from '../../../lib/utils';

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
  mask: any;
}

const MaskCustom = React.forwardRef<HTMLInputElement, CustomProps>(
  function TextMaskCustom(props, ref) {
    const { onChange, mask, ...other } = props;
    return (
      <IMaskInput
        {...other}
        mask={mask}
        inputRef={ref}
        onAccept={(value: any) =>
          onChange({ target: { name: props.name, value } })
        }
        overwrite
      />
    );
  },
);

export type InputProps = TextFieldProps & {
  shrink?: boolean;
  readOnly?: boolean;
  xs?: number;
  onKeyEnter?: () => void;
  order?: number;
  render?: boolean;
  qtdSolicitada?: number;
  qtdSeparada?: number;
  onQtdSeparadaChange?: (newValue: number) => void;
  onCamera?: (value: string) => void;
  openCamera?: boolean;
  setOpenCamera?: React.Dispatch<React.SetStateAction<boolean>>;
  mask?: ReactMaskOpts['mask'];
};

export default function Input({
  shrink,
  readOnly,
  onKeyEnter,
  onCamera,
  setOpenCamera,
  size = 'small',
  type = 'text',
  mask,
  ...rest
}: Readonly<InputProps>) {
  function onEnter(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && onKeyEnter) {
      e.preventDefault();
      onKeyEnter();
    }

    if (typeof rest.onKeyDown === 'function') {
      rest.onKeyDown(e);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (rest.onChange) {
      rest.onChange({
        ...e,
        target: {
          ...e.target,
          value,
        },
      });
    }
  };

  let InputProps: any = {
    readOnly,
    inputComponent: mask ? (MaskCustom as any) : undefined,
    ...rest.InputProps,
  };

  if (mask) {
    InputProps.inputProps = { mask };
  }

  if (onCamera && !rest.disabled) {
    InputProps = {
      ...InputProps,
      endAdornment: (
        <InputAdornment
          className="cursor-pointer text-grzprimary"
          position="end"
          onClick={() => setOpenCamera && setOpenCamera(true)}
        >
          <CameraAltIcon className="cursor-pointer text-grzprimary" />
        </InputAdornment>
      ),
    };
  }

  return (
    <ThemeProvider theme={theme}>
      <TextField
        {...rest}
        sx={rest.sx || (rest.variant === 'standard' && standard) || sx}
        onKeyDown={onEnter}
        InputLabelProps={{
          ...rest.InputLabelProps,
          shrink,
        }}
        InputProps={InputProps}
        size={size}
        className={cn('select-none', rest.className)}
        type={['real', 'float'].includes(type) ? 'text' : type}
        onChange={handleChange}
        inputProps={{
          ...rest.inputProps,
          step:
            (type === 'real' && '0.01') ||
            (type === 'float' && '0.0000001') ||
            '1',
        }}
      />
    </ThemeProvider>
  );
}
