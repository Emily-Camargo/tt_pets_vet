'use client'

import { InputSelect } from '@grazziotin/react-components-next/ui'

import { dataHora } from '@/core/functions/format'
import { useBanco } from '@/core/hooks/use-session'
import { horariosDisponiveis } from '@/service/mock/rules'

export function TimeSlot({
  veterinarianId,
  ignoreAppointmentId,
  value,
  onChange,
  label = 'Horário',
}: {
  veterinarianId: string
  ignoreAppointmentId?: string
  value: string
  onChange: (value: string) => void
  label?: string
}) {
  const bank = useBanco()
  const slots = veterinarianId
    ? horariosDisponiveis(bank, veterinarianId, ignoreAppointmentId)
    : []

  return (
    <InputSelect
      options={slots}
      value={slots.find((slot) => slot === value) ?? null}
      optionLabel={(slot) => dataHora(slot)}
      onChange={(_, next) => onChange(next ?? '')}
      input={{ label }}
    />
  )
}
