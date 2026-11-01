'use client'

import { Dialog } from '@grazziotin/react-components-next/ui'
import { Button, Group, Text, Title } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

import { PageHeader } from '@/core/components/page-header'
import { TimeSlot } from '@/core/components/time-slot'
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
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const booted = useRef(false)

  const [tab, setTab] = useState<Tab>('upcoming')
  const [open, setOpen] = useState(false)
  const [rescheduleId, setRescheduleId] = useState<string | null>(null)
  const [slot, setSlot] = useState('')
  const current = appointments.find((item) => item.id === rescheduleId)
  const actor = { perfil: 'tutor' as const, tutorId }

  useEffect(() => {
    if (isDesktop == null || booted.current) return
    setOpen(Boolean(isDesktop))
    booted.current = true
  }, [isDesktop])

  const list =
    tab === 'upcoming'
      ? groups.upcoming
      : tab === 'done'
        ? groups.done
        : groups.canceled

  const tabs = [
    {
      id: 'upcoming' as const,
      label: 'Próximas',
      count: groups.upcoming.length,
    },
    { id: 'done' as const, label: 'Realizadas', count: groups.done.length },
    {
      id: 'canceled' as const,
      label: 'Canceladas',
      count: groups.canceled.length,
    },
  ]

  function openBooking() {
    setOpen(true)
  }

  function closeBooking() {
    setOpen(false)
  }

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
          open && isDesktop ? (
            <Button
              radius="xl"
              variant="light"
              color="gray"
              onClick={closeBooking}
            >
              Fechar
            </Button>
          ) : (
            <Button
              radius="xl"
              variant="gradient"
              gradient={{ from: '#7434d6', to: '#ec4899', deg: 135 }}
              onClick={openBooking}
            >
              + Agendar consulta
            </Button>
          )
        }
      />

      <div
        className={`grid w-full gap-4 lg:gap-6 ${isDesktop && open ? 'lg:grid-cols-[minmax(0,1fr)_400px]' : ''}`}
      >
        <div className="min-w-0 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
          <Group gap="xs" wrap="wrap" mb="md">
            {tabs.map((item) => (
              <Button
                key={item.id}
                radius="xl"
                size="compact-sm"
                variant={tab === item.id ? 'gradient' : 'light'}
                gradient={
                  tab === item.id
                    ? { from: '#7434d6', to: '#a855f7', deg: 135 }
                    : undefined
                }
                color={tab === item.id ? undefined : 'gray'}
                onClick={() => setTab(item.id)}
              >
                {item.label} {item.count}
              </Button>
            ))}
          </Group>

          {list.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-[#faf7ff] px-6 py-14 text-center">
              <Text size="sm" c="#94a3b8">
                Nenhuma consulta neste filtro.
              </Text>
              {tab === 'upcoming' && (
                <Button
                  mt="md"
                  radius="xl"
                  variant="light"
                  color="violet"
                  onClick={openBooking}
                >
                  Agendar agora
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-3">
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
            <div className="mt-6 border-t border-slate-100 pt-5">
              <Group justify="space-between" mb="md">
                <Text size="sm" fw={600} c="#64748b">
                  Últimas realizadas
                </Text>
                <Button
                  variant="subtle"
                  color="violet"
                  size="compact-sm"
                  onClick={() => setTab('done')}
                >
                  Ver todas
                </Button>
              </Group>
              <div className="grid gap-3">
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
            </div>
          )}
        </div>

        {Boolean(isDesktop) && open && (
          <BookingForm bank={banco} tutorId={tutorId} onClose={closeBooking} />
        )}
      </div>

      <Dialog
        open={isDesktop === false && open}
        title="Nova consulta"
        onClose={closeBooking}
        maxWidth="sm"
      >
        <BookingForm
          bank={banco}
          tutorId={tutorId}
          onClose={closeBooking}
          embedded
        />
      </Dialog>

      {current && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 p-4">
          <div className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-5 shadow-xl">
            <Group justify="space-between" mb="md">
              <Title order={4} fw={600} c="#475569">
                Remarcar consulta
              </Title>
              <Button
                variant="light"
                color="gray"
                aria-label="Fechar"
                onClick={() => setRescheduleId(null)}
                px="xs"
                radius="xl"
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
                variant="gradient"
                gradient={{ from: '#7434d6', to: '#ec4899', deg: 135 }}
                disabled={!slot}
              >
                Confirmar remarcação
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
