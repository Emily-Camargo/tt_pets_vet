'use client'

import { Button, Group, Text, Title } from '@mantine/core'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

import { PageHeader } from '@/core/components/page-header'
import { TimeSlot } from '@/core/components/time-slot'
import { cx } from '@/core/functions/format'
import { feedback } from '@/core/functions/feedback'
import { useUsuario } from '@/core/hooks/use-session'
import { mudarConsulta } from '@/service/mock/actions'

import { BookingForm } from './booking-dialog'
import { CardBooking } from './card-booking'
import { splitAppointments } from '../utils/functions'

type Tab = 'upcoming' | 'done' | 'canceled'

export function Bookings() {
  const router = useRouter()
  const { banco, usuario } = useUsuario()
  const tutorId = usuario?.tutorId ?? ''
  const pets = banco.pets.filter((item) => item.tutorId === tutorId)
  const appointments = banco.consultas.filter(
    (item) => item.tutorId === tutorId,
  )
  const groups = useMemo(() => splitAppointments(appointments), [appointments])

  const [tab, setTab] = useState<Tab>('upcoming')
  const [open, setOpen] = useState(true)
  const [rescheduleId, setRescheduleId] = useState<string | null>(null)
  const [slot, setSlot] = useState('')
  const current = appointments.find((item) => item.id === rescheduleId)
  const actor = { perfil: 'tutor' as const, tutorId }

  const list =
    tab === 'upcoming'
      ? groups.upcoming
      : tab === 'done'
        ? groups.done
        : groups.canceled

  return (
    <div
      className="grid gap-4"
      style={{ animation: 'tt-surgir 0.6s ease both' }}
    >
      <PageHeader
        eyebrow="Tutor"
        title="Consultas"
        description="Visitas em domicílio do seu plano e consultas avulsas."
        actions={
          <Button radius="xl" color="#7434d6" onClick={() => setOpen(true)}>
            + Agendar consulta
          </Button>
        }
      />

      <div
        className={`grid w-full gap-4 lg:gap-6 ${open ? 'xl:grid-cols-[minmax(0,1fr)_420px]' : ''}`}
      >
        <div className="min-w-0 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm lg:p-6">
          <Group gap="lg" className="border-b border-slate-100">
            {(
              [
                ['upcoming', `Próximas ${groups.upcoming.length}`],
                ['done', `Realizadas ${groups.done.length}`],
                ['canceled', `Canceladas ${groups.canceled.length}`],
              ] as const
            ).map(([id, label]) => (
              <Button
                key={id}
                variant="subtle"
                color={tab === id ? '#7434d6' : 'gray'}
                className={cx(
                  'rounded-none border-b-2 px-1 pb-3',
                  tab === id ? 'border-[#7434d6]' : 'border-transparent',
                )}
                styles={{ root: { height: 'auto' } }}
                onClick={() => setTab(id)}
              >
                {label}
              </Button>
            ))}
          </Group>

          {list.length === 0 ? (
            <Text py={40} ta="center" size="sm" c="dimmed">
              Nenhuma consulta neste filtro.
            </Text>
          ) : (
            <div>
              {list.map((item) => {
                const pet = pets.find((current) => current.id === item.petId)
                const petIndex = Math.max(
                  0,
                  pets.findIndex((current) => current.id === item.petId),
                )
                const vet = banco.veterinarios.find(
                  (current) => current.id === item.veterinarioId,
                )
                return (
                  <CardBooking
                    key={item.id}
                    appointment={item}
                    petName={pet?.nome ?? 'Pet'}
                    vetName={vet?.nome ?? 'Veterinário'}
                    petIndex={petIndex}
                    mode={tab}
                    onReschedule={() => {
                      setRescheduleId(item.id)
                      setSlot('')
                    }}
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
                    onReceipt={() => router.push('/tutor/history')}
                  />
                )
              })}
            </div>
          )}

          {tab === 'upcoming' && groups.done.length > 0 && (
            <div className="mt-6 border-t border-slate-100 pt-4">
              <Group justify="space-between" mb={8}>
                <Title order={4}>Últimas realizadas</Title>
                <Button
                  variant="subtle"
                  color="#7434d6"
                  size="compact-sm"
                  onClick={() => setTab('done')}
                >
                  Ver todas
                </Button>
              </Group>
              {groups.done.slice(0, 2).map((item) => {
                const pet = pets.find((current) => current.id === item.petId)
                const petIndex = Math.max(
                  0,
                  pets.findIndex((current) => current.id === item.petId),
                )
                const vet = banco.veterinarios.find(
                  (current) => current.id === item.veterinarioId,
                )
                return (
                  <CardBooking
                    key={item.id}
                    appointment={item}
                    petName={pet?.nome ?? 'Pet'}
                    vetName={vet?.nome ?? 'Veterinário'}
                    petIndex={petIndex}
                    mode="done"
                    onReceipt={() => router.push('/tutor/history')}
                  />
                )
              })}
            </div>
          )}
        </div>

        {open && (
          <BookingForm
            bank={banco}
            tutorId={tutorId}
            onClose={() => setOpen(false)}
          />
        )}
      </div>

      {current && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-5 shadow-xl">
            <Group justify="space-between" mb="md">
              <Title order={3}>Remarcar consulta</Title>
              <Button
                variant="subtle"
                color="gray"
                aria-label="Fechar"
                onClick={() => setRescheduleId(null)}
                px="xs"
              >
                ×
              </Button>
            </Group>
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
              <Button
                type="submit"
                radius="xl"
                color="#7434d6"
                disabled={!slot}
              >
                Confirmar remarcação
              </Button>
            </form>
          </div>
        </div>
      )}

      <Text size="xs" c="dimmed" ta="center" pt={8}>
        Protótipo com dados de exemplo.
      </Text>
    </div>
  )
}
