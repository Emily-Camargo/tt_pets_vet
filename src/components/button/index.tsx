import React from 'react'
import {
  Button as ButtonMui,
  ThemeProvider,
  createTheme,
  ButtonProps,
  PaletteOptions,
} from '@mui/material'

export type ButtonColor =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'error'
  | 'info'
  | 'warning'
  | 'inherit'

export interface ButtonDisprops extends ButtonProps {
  width?: string
  height?: string
  fontSize?: string
  fontWeight?: string
  borderRadius?: string
  textTransform?: 'uppercase' | 'none'
  border?: string
  color?: ButtonColor
  variant?: 'contained' | 'outlined' | 'text'
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#10B981',
      light: '#019F98',
      dark: '#019F98',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#05376A',
      light: '#253E56',
      dark: '#253E56',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#EF4444',
      light: '#CA3449',
      dark: '#CA3449',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#ECC005',
      light: '#E0B605',
      dark: '#E0B605',
      contrastText: '#FFFFFF',
    },
    orange: {
      main: '#ED5500',
      light: '#E45505',
      dark: '#E45505',
      contrastText: '#FFFFFF',
    },
    purple: {
      main: '#5E4FA2',
      light: '#542788',
      dark: '#542788',
      contrastText: '#FFFFFF',
    },
    info: {
      main: '#0878BD',
      light: '#0768A4',
      dark: '#0768A4',
      contrastText: '#FFFFFF',
    },
    inherit: {
      disabledBackground: '#E0E0E0 !important',
      disabled: '#CBCBCB !important',
    },
  } as PaletteOptions,
})

const Button = React.forwardRef<HTMLButtonElement, ButtonDisprops>(
  (
    {
      width,
      height,
      children,
      fontSize,
      fontWeight,
      borderRadius,
      textTransform,
      border,
      color = 'primary',
      ...rest
    }: ButtonDisprops,
    ref,
  ) => {
    return (
      <ThemeProvider theme={theme}>
        <ButtonMui
          ref={ref}
          color={(rest.disabled && 'inherit') || color}
          sx={{
            '&.MuiButton-root': {
              fontSize: fontSize ?? '12px',
              fontWeight: fontWeight ?? '800',
              fontFamily: 'Montserrat',
              textTransform: textTransform ?? 'uppercase',
              borderRadius: borderRadius ?? '4px',
              width,
              height,
              border:
                rest.variant === 'contained' && !border && color === 'primary'
                  ? '1px solid #10B981'
                  : border,
            },
          }}
          {...rest}
        >
          {children || rest.title}
        </ButtonMui>
      </ThemeProvider>
    )
  },
)

Button.displayName = 'Button'

export default Button
