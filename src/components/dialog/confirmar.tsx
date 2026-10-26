import Button from '../button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import { Breakpoint } from '@mui/material'

interface ConfirmarDialogProps {
  open: boolean
  onClose?: () => void
  onConfirm?: () => void
  title?: string
  message: string
  inativaButtons?: boolean
  maxWidth: false | Breakpoint | undefined
}


const ConfirmarDialog = ({
  open,
  onClose,
  onConfirm,
  title = 'Confirmação',
  message,
  inativaButtons = false,
  maxWidth,
}: ConfirmarDialogProps): JSX.Element => {
  return (
    <Dialog onClose={onClose} open={open} fullWidth maxWidth={maxWidth}>
      <DialogTitle>
        <p className="text-lg font-semibold">{title}</p>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <span className="text-black">{message}</span>
        </DialogContentText>
      </DialogContent>
      {!inativaButtons && (
        <DialogActions>
          {onClose && (
            <Button color="error" onClick={onClose}>
              Cancelar
            </Button>
          )}
          {onConfirm && (
            <Button autoFocus onClick={onConfirm}>
              Confirmar
            </Button>
          )}
        </DialogActions>
      )}
    </Dialog>
  )
}

export default ConfirmarDialog
