import { toast } from 'react-toastify'

export function feedback(error: string | null, success: string) {
  if (error) {
    toast.error(error)
    return
  }
  toast.success(success)
}
