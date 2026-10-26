'use client'

import { Dialog } from '@grazziotin/react-components-next/ui'
import { Button } from '@mantine/core'
import { useState } from 'react'

import { TimeSlot } from '@/core/components/time-slot'
import { feedback } from '@/core/functions/feedback'
import type { Consulta, Perfil } from '@/core/interfaces/types'
import { mudarConsulta } from '@/service/mock/actions'

export function RescheduleDialog({
  appointment,
  actor,
  onClose,
}: {
  appointment: Consulta | undefined
  actor: { perfil: Perfil; veterinarioId?: string; tutorId?: string }
  onClose: () => void
}) {
  const [slot, setSlot] = useState('')

  return (
    <Dialog
      open={Boolean(appointment)}
      title="Remarcar"
      onClose={onClose}
      maxWidth="sm"
    >
      {appointment && (
        <form
          className="flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault()
            const error = mudarConsulta({
              consultaId: appointment.id,
              status: 'remarcada',
              dataHora: slot,
              ator: actor,
            })
            feedback(error, 'Consulta remarcada.')
            if (!error) onClose()
          }}
        >
          <TimeSlot
            veterinarianId={appointment.veterinarioId}
            ignoreAppointmentId={appointment.id}
            value={slot}
            onChange={setSlot}
            label="Novo horário"
          />
          <Button type="submit" color="#7434d6">
            Salvar
          </Button>
        </form>
      )}
    </Dialog>
  )
}
