'use client'

import { Button, Group, Switch, Text, Title } from '@mantine/core'

import { PageHeader } from '@/core/components/page-header'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'

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
      className="grid gap-4"
      style={{ animation: 'tt-surgir 0.6s ease both' }}
    >
      <PageHeader
        eyebrow="Veterinário"
        title="Agenda"
        description={`${weekLabel(weekDays(anchor))} · ${marked} ${
          marked === 1 ? 'visita marcada' : 'visitas marcadas'
        }`}
        actions={
          <>
            <Group
              gap={4}
              className="rounded-full border border-slate-200 bg-white p-1"
            >
              <Button
                radius="xl"
                size="compact-sm"
                variant={view === 'today' ? 'gradient' : 'subtle'}
                gradient={
                  view === 'today'
                    ? { from: '#7434d6', to: '#a855f7', deg: 135 }
                    : undefined
                }
                color={view === 'today' ? undefined : 'gray'}
                onClick={goToday}
              >
                Hoje
              </Button>
              <Button
                radius="xl"
                size="compact-sm"
                variant={view === 'week' ? 'gradient' : 'subtle'}
                gradient={
                  view === 'week'
                    ? { from: '#7434d6', to: '#a855f7', deg: 135 }
                    : undefined
                }
                color={view === 'week' ? undefined : 'gray'}
                onClick={goWeek}
              >
                Semana ›
              </Button>
            </Group>
            <Button
              radius="xl"
              variant="gradient"
              gradient={{ from: '#7434d6', to: '#a855f7', deg: 135 }}
              onClick={() =>
                feedback(
                  '',
                  'Novo agendamento disponível no protótipo em breve.',
                )
              }
            >
              + Novo agendamento
            </Button>
          </>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 overflow-x-auto rounded-3xl border border-slate-100 bg-white p-3 shadow-sm sm:p-4">
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
                  <Text
                    size="xs"
                    fw={600}
                    tt="uppercase"
                    c={isToday ? '#7434d6' : 'dimmed'}
                  >
                    {header.weekday}
                  </Text>
                  <Text size="lg" fw={600} c={isToday ? '#7434d6' : '#1e293b'}>
                    {header.day}
                  </Text>
                </div>
              )
            })}

            <div
              className="relative"
              style={{ height: (DAY_END - DAY_START) * HOUR_PX }}
            >
              {HOURS.map((hour) => (
                <Text
                  key={hour}
                  size="xs"
                  c="dimmed"
                  className="absolute right-1"
                  style={{ top: (hour - DAY_START) * HOUR_PX - 6 }}
                >
                  {String(hour).padStart(2, '0')}:00
                </Text>
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
                      <Text span size="xs" fw={600}>
                        {hora(block.inicio)}
                      </Text>{' '}
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
                      <Button
                        key={item.id}
                        unstyled
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
                        <Text span size="xs" fw={600}>
                          {hora(item.dataHora)} {pet?.nome}
                        </Text>
                        <Text size="xs" className="mt-0.5 truncate opacity-80">
                          {item.motivo}
                        </Text>
                      </Button>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
            <Group justify="space-between" align="center">
              <Title order={4}>Horários de atendimento</Title>
              <Button
                variant="subtle"
                color="#7434d6"
                size="compact-sm"
                onClick={() => feedback('', 'Edição de horários em breve.')}
              >
                Editar
              </Button>
            </Group>
            <div className="mt-4 grid gap-3">
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
            </div>
            <div className="mt-4 grid gap-1 border-t border-slate-100 pt-3">
              <Text size="sm" c="dimmed">
                Duração:{' '}
                <Text span size="sm" c="#334155">
                  60 min por visita
                </Text>
              </Text>
              <Text size="sm" c="dimmed">
                Intervalo:{' '}
                <Text span size="sm" c="#334155">
                  30 min para deslocamento
                </Text>
              </Text>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
            <Group justify="space-between" align="center">
              <Title order={4}>Cidades por dia</Title>
              <Button
                variant="subtle"
                color="#7434d6"
                size="compact-sm"
                onClick={() => feedback('', 'Edição de cidades em breve.')}
              >
                Editar
              </Button>
            </Group>
            <div className="mt-4 divide-y divide-slate-100">
              {cities.map((city) => (
                <div
                  key={city.id}
                  className="flex items-start justify-between gap-3 py-3"
                >
                  <Text size="sm" fw={500} c="#1e293b">
                    {city.nome}
                  </Text>
                  <Text size="sm" c="dimmed" ta="right">
                    {city.id === 'cidade-marau'
                      ? 'qua à tarde e sáb'
                      : 'seg, ter, qui, sex'}
                  </Text>
                </div>
              ))}
              {cities.length === 0 && (
                <Text size="sm" c="dimmed" py="sm">
                  Nenhuma cidade vinculada.
                </Text>
              )}
            </div>
          </div>
        </div>
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
    <Group justify="space-between" wrap="nowrap">
      <div>
        <Text size="sm" fw={500} c="#1e293b">
          {label}
        </Text>
        <Text size="xs" c="dimmed">
          {value}
        </Text>
      </div>
      <Switch
        checked={on}
        onChange={onToggle}
        color="#7434d6"
        aria-label={label}
      />
    </Group>
  )
}
