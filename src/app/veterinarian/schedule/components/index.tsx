'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

import { cx, hora } from '@/core/functions/format'
import { feedback } from '@/core/functions/feedback'
import { useUsuario } from '@/core/hooks/use-session'
import { consultaAtiva } from '@/service/mock/rules'

import {
  DAY_END,
  DAY_START,
  HOUR_PX,
  HOURS,
  TONE_CLASS,
  appointmentTone,
  dayHeader,
  heightPx,
  sameCalendarDay,
  sameDay,
  startOfDay,
  topPx,
  weekAppointments,
  weekBlocks,
  weekDays,
  weekLabel,
} from '../utils/functions'

type View = 'today' | 'week'

export function Schedule() {
  const router = useRouter()
  const { banco, usuario } = useUsuario()
  const veterinarianId = usuario?.veterinarioId ?? ''
  const veterinarian = banco.veterinarios.find(
    (item) => item.id === veterinarianId,
  )
  const [view, setView] = useState<View>('week')
  const [anchor, setAnchor] = useState(() => startOfDay(new Date()))
  const [hours, setHours] = useState({
    weekdays: true,
    saturday: true,
    sunday: false,
  })

  const days = useMemo(() => {
    if (view === 'today') return [anchor]
    return weekDays(anchor)
  }, [anchor, view])

  const appointments = weekAppointments(banco, veterinarianId, days)
  const blocks = weekBlocks(banco, veterinarianId, days)
  const marked = appointments.length
  const today = startOfDay(new Date())
  const cities = (veterinarian?.cidadeIds ?? [])
    .map((id) => banco.cidades.find((city) => city.id === id))
    .filter((city): city is NonNullable<typeof city> => Boolean(city))

  function goToday() {
    setAnchor(startOfDay(new Date()))
    setView('today')
  }

  function goWeek() {
    setAnchor(startOfDay(new Date()))
    setView('week')
  }

  return (
    <div
      className="space-y-4"
      style={{ animation: 'tt-surgir 0.6s ease both' }}
    >
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-marca uppercase">
            Veterinário
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
            Agenda
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {weekLabel(weekDays(anchor))} · {marked}{' '}
            {marked === 1 ? 'visita marcada' : 'visitas marcadas'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-full border border-slate-200 bg-white p-1">
            <button
              type="button"
              onClick={goToday}
              className={cx(
                'rounded-full px-3 py-1.5 text-sm font-medium transition',
                view === 'today'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-500 hover:text-slate-800',
              )}
            >
              Hoje
            </button>
            <button
              type="button"
              onClick={goWeek}
              className={cx(
                'rounded-full px-3 py-1.5 text-sm font-medium transition',
                view === 'week'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-500 hover:text-slate-800',
              )}
            >
              Semana ›
            </button>
          </div>
          <button
            type="button"
            onClick={() =>
              feedback('', 'Novo agendamento disponível no protótipo em breve.')
            }
            className="rounded-full bg-marca px-4 py-2.5 text-sm font-medium text-white hover:bg-marca-forte"
          >
            + Novo agendamento
          </button>
        </div>
      </header>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section className="min-w-0 overflow-x-auto rounded-3xl border border-slate-100 bg-white p-3 shadow-sm sm:p-4">
          <div
            className="min-w-[720px]"
            style={{
              display: 'grid',
              gridTemplateColumns: `56px repeat(${days.length}, minmax(0, 1fr))`,
              gap: '8px',
            }}
          >
            <div />
            {days.map((day) => {
              const header = dayHeader(day)
              const isToday = sameCalendarDay(day, today)
              return (
                <div
                  key={day.toISOString()}
                  className={cx(
                    'rounded-xl px-2 py-2 text-center',
                    isToday ? 'bg-[#f6f1fc]' : 'bg-slate-50',
                  )}
                >
                  <p
                    className={cx(
                      'text-[11px] font-semibold tracking-wide uppercase',
                      isToday ? 'text-marca' : 'text-slate-400',
                    )}
                  >
                    {header.weekday}
                  </p>
                  <p
                    className={cx(
                      'text-lg font-semibold',
                      isToday ? 'text-marca' : 'text-slate-800',
                    )}
                  >
                    {header.day}
                  </p>
                </div>
              )
            })}

            <div
              className="relative"
              style={{ height: (DAY_END - DAY_START) * HOUR_PX }}
            >
              {HOURS.map((hour) => (
                <div
                  key={hour}
                  className="absolute right-1 text-[11px] text-slate-400"
                  style={{ top: (hour - DAY_START) * HOUR_PX - 6 }}
                >
                  {String(hour).padStart(2, '0')}:00
                </div>
              ))}
            </div>

            {days.map((day) => {
              const dayAppointments = appointments.filter((item) =>
                sameDay(item.dataHora, day),
              )
              const dayBlocks = blocks.filter((item) =>
                sameDay(item.inicio, day),
              )
              return (
                <div
                  key={`col-${day.toISOString()}`}
                  className="relative rounded-2xl border border-slate-100 bg-slate-50/40"
                  style={{ height: (DAY_END - DAY_START) * HOUR_PX }}
                >
                  {HOURS.map((hour) => (
                    <div
                      key={hour}
                      className="absolute inset-x-0 border-t border-slate-100"
                      style={{ top: (hour - DAY_START) * HOUR_PX }}
                    />
                  ))}

                  {dayBlocks.map((block) => (
                    <div
                      key={block.id}
                      className="absolute inset-x-1 z-10 overflow-hidden rounded-xl border-l-4 border-slate-300 bg-slate-100 px-2 py-1.5 text-[11px] leading-snug text-slate-600"
                      style={{
                        top: topPx(block.inicio),
                        height: heightPx(block.inicio, block.fim),
                      }}
                      title={block.motivo}
                    >
                      <span className="font-semibold">
                        {hora(block.inicio)}
                      </span>{' '}
                      {block.motivo}
                    </div>
                  ))}

                  {dayAppointments.map((item) => {
                    const pet = banco.pets.find((p) => p.id === item.petId)
                    const city = banco.cidades.find(
                      (c) => c.id === item.cidadeId,
                    )
                    const tone = appointmentTone(item, city?.nome)
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          if (consultaAtiva(item.status)) {
                            router.push(`/veterinarian/appointments/${item.id}`)
                          }
                        }}
                        className={cx(
                          'absolute inset-x-1 z-20 overflow-hidden rounded-xl border-l-4 px-2 py-1.5 text-left text-[11px] leading-snug shadow-sm transition hover:brightness-95',
                          TONE_CLASS[tone],
                        )}
                        style={{
                          top: topPx(item.dataHora),
                          height: heightPx(item.dataHora),
                        }}
                      >
                        <span className="font-semibold">
                          {hora(item.dataHora)} {pet?.nome}
                        </span>
                        <span className="mt-0.5 block truncate opacity-80">
                          {item.motivo}
                        </span>
                      </button>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </section>

        <aside className="space-y-4">
          <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">
                Horários de atendimento
              </h2>
              <button
                type="button"
                onClick={() => feedback('', 'Edição de horários em breve.')}
                className="text-sm font-medium text-marca hover:underline"
              >
                Editar
              </button>
            </div>
            <ul className="mt-4 space-y-3">
              <HourRow
                label="Seg a sex"
                value="08:00 às 17:00"
                on={hours.weekdays}
                onToggle={() =>
                  setHours((prev) => ({ ...prev, weekdays: !prev.weekdays }))
                }
              />
              <HourRow
                label="Sábado"
                value="08:00 às 12:00"
                on={hours.saturday}
                onToggle={() =>
                  setHours((prev) => ({ ...prev, saturday: !prev.saturday }))
                }
              />
              <HourRow
                label="Domingo"
                value="Sem atendimento"
                on={hours.sunday}
                onToggle={() =>
                  setHours((prev) => ({ ...prev, sunday: !prev.sunday }))
                }
              />
            </ul>
            <div className="mt-4 space-y-1 border-t border-slate-100 pt-3 text-sm text-slate-500">
              <p>
                Duração:{' '}
                <span className="text-slate-700">60 min por visita</span>
              </p>
              <p>
                Intervalo:{' '}
                <span className="text-slate-700">30 min para deslocamento</span>
              </p>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">
                Cidades por dia
              </h2>
              <button
                type="button"
                onClick={() => feedback('', 'Edição de cidades em breve.')}
                className="text-sm font-medium text-marca hover:underline"
              >
                Editar
              </button>
            </div>
            <ul className="mt-4 divide-y divide-slate-100">
              {cities.map((city) => (
                <li
                  key={city.id}
                  className="flex items-start justify-between gap-3 py-3 text-sm"
                >
                  <span className="font-medium text-slate-800">
                    {city.nome}
                  </span>
                  <span className="text-right text-slate-500">
                    {city.id === 'cidade-marau'
                      ? 'qua à tarde e sáb'
                      : 'seg, ter, qui, sex'}
                  </span>
                </li>
              ))}
              {cities.length === 0 && (
                <li className="py-3 text-sm text-slate-400">
                  Nenhuma cidade vinculada.
                </li>
              )}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  )
}

function HourRow({
  label,
  value,
  on,
  onToggle,
}: {
  label: string
  value: string
  on: boolean
  onToggle: () => void
}) {
  return (
    <li className="flex items-center justify-between gap-3">
      <div>
        <p className="text-sm font-medium text-slate-800">{label}</p>
        <p className="text-xs text-slate-400">{value}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        onClick={onToggle}
        className={cx(
          'relative h-6 w-11 shrink-0 rounded-full transition',
          on ? 'bg-marca' : 'bg-slate-200',
        )}
      >
        <span
          className={cx(
            'absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition',
            on && 'translate-x-5',
          )}
        />
      </button>
    </li>
  )
}
