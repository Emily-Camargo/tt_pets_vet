import React from 'react'
import { Breakpoint } from '@mui/material'
import DialogMui from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'

interface DialogProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  actions?: React.ReactNode
  maxWidth: false | Breakpoint | undefined
}

const Dialog = ({
  open,
  onClose,
  title = 'Diálogo',
  children,
  actions,
  maxWidth,
}: DialogProps): JSX.Element => {
  return (
    <DialogMui onClose={onClose} open={open} maxWidth={maxWidth} fullWidth>
      <DialogTitle>
        <p className="text-lg font-semibold">{title}</p>
      </DialogTitle>
      <DialogContent className="text-black">{children}</DialogContent>
      {actions && <DialogActions>{actions}</DialogActions>}
    </DialogMui>
  )
}

export default Dialog
