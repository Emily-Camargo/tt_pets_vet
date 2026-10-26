'use client'

import DialogMui from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import type { Breakpoint } from '@mui/material'
import type { ReactNode } from 'react'

interface DialogProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  actions?: ReactNode
  maxWidth?: false | Breakpoint
}

const Dialog = ({
  open,
  onClose,
  title = 'Diálogo',
  children,
  actions,
  maxWidth = 'sm',
}: DialogProps) => {
  return (
    <DialogMui
      onClose={onClose}
      open={open}
      maxWidth={maxWidth}
      fullWidth
      slotProps={{
        paper: { sx: { borderRadius: '16px' } },
      }}
    >
      <DialogTitle sx={{ fontSize: 18, fontWeight: 600, pb: 1 }}>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      {actions && <DialogActions sx={{ px: 3, pb: 2 }}>{actions}</DialogActions>}
    </DialogMui>
  )
}

export default Dialog
