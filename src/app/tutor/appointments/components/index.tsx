'use client'

import { Dialog } from '@grazziotin/react-components-next/ui'
import { Button, Stack } from '@mantine/core'
import { useState } from 'react'

import { TimeSlot } from '@/core/components/time-slot'
import { EmptyState } from '@/core/components/empty-state'
import { Screen } from '@/core/components/screen'
import { feedback } from '@/core/functions/feedback'
import { useUsuario } from '@/core/hooks/use-session'
import { mudarConsulta } from '@/service/mock/actions'

import { BookingDialog } from './booking-dialog'
import { CardBooking } from './card-booking'

export function Bookings() {
  const { banco, usuario } = useUsuario()
  const tutorId = usuario?.tutorId ?? ''
  const appointments = banco.consultas
    .filter((item) => item.tutorId === tutorId)
    .sort((a, b) => b.dataHora.localeCompare(a.dataHora))
  const [open, setOpen] = useState(false)
  const [rescheduleId, setRescheduleId] = useState<string | null>(null)
  const [slot, setSlot] = useState('')
  const current = appointments.find((item) => item.id === rescheduleId)
  const actor = { perfil: 'tutor' as const, tutorId }

  return (
    <Screen
      title="Agendamentos"
      description="A consulta domiciliar só abre se o pet tiver plano ativo na cidade."
      action={
        <Button color="#7434d6" onClick={() => setOpen(true)}>
          Nova consulta
        </Button>
      }
    >
      {appointments.length === 0 ? (
        <EmptyState text="Nenhuma consulta ainda." />
      ) : (
        <Stack gap="sm">
          {appointments.map((item) => (
            <CardBooking
              key={item.id}
              petName={banco.pets.find((pet) => pet.id === item.petId)?.nome}
              when={item.dataHora}
              vetName={
                banco.veterinarios.find((vet) => vet.id === item.veterinarioId)
                  ?.nome
              }
              reason={item.motivo}
              status={item.status}
              open={item.status !== 'cancelada' && item.status !== 'realizada'}
              onReschedule={() => setRescheduleId(item.id)}
              onCancel={() =>
                feedback(
                  mudarConsulta({
                    consultaId: item.id,
                    status: 'cancelada',
                    ator: actor,
                  }),
                  'Consulta cancelada.',
                )
              }
            />
          ))}
        </Stack>
      )}
      {open && (
        <BookingDialog
          open={open}
          bank={banco}
          tutorId={tutorId}
          onClose={() => setOpen(false)}
        />
      )}
      <Dialog
        open={Boolean(current)}
        title="Remarcar consulta"
        onClose={() => setRescheduleId(null)}
        maxWidth="sm"
      >
        {current && (
          <form
            className="flex flex-col gap-3"
            onSubmit={(event) => {
              event.preventDefault()
              const error = mudarConsulta({
                consultaId: current.id,
                status: 'remarcada',
                dataHora: slot,
                ator: actor,
              })
              feedback(error, 'Consulta remarcada.')
              if (!error) setRescheduleId(null)
            }}
          >
            <TimeSlot
              veterinarianId={current.veterinarioId}
              ignoreAppointmentId={current.id}
              value={slot}
              onChange={setSlot}
              label="Novo horário"
            />
            <Button type="submit" color="#7434d6" disabled={!slot}>
              Confirmar remarcação
            </Button>
          </form>
        )}
      </Dialog>
    </Screen>
  )
}
