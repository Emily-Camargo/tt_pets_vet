import { memo } from 'react'
import { styled, TextField } from '@mui/material'

const InputTextField = styled(TextField)({
  '& input': {
    fontFamily: 'Montserrat !important',
    fontSize: '14px',
    color: '#333',
  },
  '& label': {
    fontFamily: 'Montserrat !important',
    fontSize: '14px',
    color: '#333',
  },
  '& label.Mui-focused': {
    color: '#2563EB',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#2563EB',
  },
  '& .MuiOutlinedInput-root': {
    fontFamily: 'Montserrat !important',
    '& fieldset': {
      borderColor: '#2563EB',
    },
    '&:hover fieldset': {
      borderColor: '#2563EB',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#2563EB',
    },
  },
  '& .MuiFilledInput-root': {
    fontFamily: 'Montserrat !important',
    backgroundColor: '#f5f5f5',
    '&:hover': {
      backgroundColor: '#e0e0e0',
    },
    '&:before': {
      borderBottomColor: '#2563EB',
    },
    '&:hover:before': {
      borderBottomColor: '#2563EB',
    },
    '&:after': {
      borderBottomColor: '#2563EB',
    },
  },
  '& .MuiInputBase-input': {
    fontFamily: 'Montserrat !important',
    fontSize: '14px',
    color: '#333',
  },
  '& .MuiFormHelperText-root': {
    fontFamily: 'Montserrat !important',
    fontSize: '10px',
    marginLeft: 2,
  },
})
export default memo(InputTextField)
