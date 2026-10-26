import type { Consulta } from '@/core/interfaces/types'

export interface AppointmentCardProps {
  appointment: Consulta
  petName?: string
  tutorName?: string
  vetName?: string
  open: boolean
  onConfirm: () => void
  onReschedule: () => void
  onCancel: () => void
}
