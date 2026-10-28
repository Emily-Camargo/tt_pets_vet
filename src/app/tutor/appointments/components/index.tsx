'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

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
      className="space-y-4"
      style={{ animation: 'tt-surgir 0.6s ease both' }}
    >
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-marca uppercase">
            Tutor
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
            Consultas
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Visitas em domicílio do seu plano e consultas avulsas.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-full bg-marca px-4 py-2.5 text-sm font-medium text-white hover:bg-marca-forte"
        >
          + Agendar consulta
        </button>
      </header>

      <div
        className={`grid w-full gap-4 lg:gap-6 ${open ? 'xl:grid-cols-[minmax(0,1fr)_420px]' : ''}`}
      >
        <section className="min-w-0 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm lg:p-6">
          <div className="flex gap-4 border-b border-slate-100">
            {(
              [
                ['upcoming', `Próximas ${groups.upcoming.length}`],
                ['done', `Realizadas ${groups.done.length}`],
                ['canceled', `Canceladas ${groups.canceled.length}`],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={cx(
                  'border-b-2 px-1 pb-3 text-sm font-medium transition',
                  tab === id
                    ? 'border-marca text-marca'
                    : 'border-transparent text-slate-400 hover:text-slate-600',
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {list.length === 0 ? (
            <p className="py-10 text-center text-sm text-slate-400">
              Nenhuma consulta neste filtro.
            </p>
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
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">
                  Últimas realizadas
                </h3>
                <button
                  type="button"
                  onClick={() => setTab('done')}
                  className="text-sm font-medium text-marca"
                >
                  Ver todas
                </button>
              </div>
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
        </section>

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
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                Remarcar consulta
              </h2>
              <button
                type="button"
                aria-label="Fechar"
                onClick={() => setRescheduleId(null)}
                className="grid h-8 w-8 place-items-center rounded-full text-slate-400 hover:bg-slate-50"
              >
                ×
              </button>
            </div>
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
              <button
                type="submit"
                disabled={!slot}
                className="rounded-full bg-marca px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
              >
                Confirmar remarcação
              </button>
            </form>
          </div>
        </div>
      )}

      <p className="pt-2 text-center text-xs text-slate-400">
        Protótipo com dados de exemplo.
      </p>
    </div>
  )
}
