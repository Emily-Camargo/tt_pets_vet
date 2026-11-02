'use client'

import { Badge, Button, Group, Text, TextInput } from '@mantine/core'
import { useRouter } from 'next/navigation'
import { useMemo, useState, type ReactNode } from 'react'
import {
  FiCheck,
  FiClock,
  FiFileText,
  FiMapPin,
  FiPlay,
  FiPlus,
  FiSearch,
} from 'react-icons/fi'
import { LuRoute } from 'react-icons/lu'

import { initials, petTone } from '@/app/tutor/appointments/utils/functions'
import { PageHeader } from '@/core/components/page-header'
import { cx, hora } from '@/core/functions/format'
import { feedback } from '@/core/functions/feedback'
import { useUsuario } from '@/core/hooks/use-session'
import type { Consulta } from '@/core/interfaces/types'
import { consultaAtiva } from '@/service/mock/rules'

type Tab = 'hoje' | 'amanha' | 'semana' | 'atrasados'

type Row = {
  item: Consulta
  petName: string
  petBreed: string
  tutorName: string
  cityName: string
  planName?: string
  allergy?: string
  address: string
  inProgress: boolean
  done: boolean
  pendingRecord: boolean
  index: number
}

function startOfDay(date: Date) {
  const next = new Date(date)
  next.setHours(0, 0, 0, 0)
  return next
}

function addDays(date: Date, amount: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + amount)
  return next
}

function sameDay(iso: string, day: Date) {
  const date = new Date(iso)
  return (
    date.getFullYear() === day.getFullYear() &&
    date.getMonth() === day.getMonth() &&
    date.getDate() === day.getDate()
  )
}

function dayLabel(date = new Date()) {
  const label = date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
  return label.charAt(0).toUpperCase() + label.slice(1)
}

export function Appointments() {
  const router = useRouter()
  const { banco, usuario } = useUsuario()
  const veterinarianId = usuario?.veterinarioId ?? ''
  const [tab, setTab] = useState<Tab>('hoje')
  const [search, setSearch] = useState('')
  const now = useMemo(() => new Date(), [])
  const today = useMemo(() => startOfDay(now), [now])
  const tomorrow = useMemo(() => addDays(today, 1), [today])
  const weekEnd = useMemo(() => addDays(today, 7), [today])

  const rows = useMemo(() => {
    return banco.consultas
      .filter((item) => item.veterinarioId === veterinarianId)
      .sort((a, b) => a.dataHora.localeCompare(b.dataHora))
      .map((item, index) => {
        const pet = banco.pets.find((p) => p.id === item.petId)
        const tutor = banco.tutores.find((t) => t.id === item.tutorId)
        const city = banco.cidades.find((c) => c.id === item.cidadeId)
        const planId = banco.assinaturas.find(
          (a) => a.petId === item.petId && a.status === 'ativa',
        )?.planoId
        const plan = banco.planos.find((p) => p.id === planId)
        const hasRecord = banco.prontuarios.some(
          (record) => record.consultaId === item.id,
        )
        const date = new Date(item.dataHora)
        const active = consultaAtiva(item.status)
        const inProgress =
          active &&
          sameDay(item.dataHora, today) &&
          date.getTime() <= now.getTime()
        const pendingRecord =
          item.status === 'realizada' &&
          sameDay(item.dataHora, today) &&
          !hasRecord

        return {
          item,
          petName: pet?.nome ?? 'Pet',
          petBreed: pet?.raca ?? '—',
          tutorName: tutor?.nome ?? 'Tutor',
          cityName: city?.nome ?? '',
          planName: plan?.nome,
          allergy: pet?.observacoes?.toLowerCase().includes('alerg')
            ? pet.observacoes
            : undefined,
          address:
            item.endereco ||
            (city ? `${city.nome} - ${city.uf}` : 'Endereço não informado'),
          inProgress,
          done: item.status === 'realizada',
          pendingRecord: pendingRecord || (inProgress && !hasRecord),
          index,
        } satisfies Row
      })
  }, [banco, veterinarianId, now, today])

  const todayActive = rows.filter(
    (row) =>
      sameDay(row.item.dataHora, today) && consultaAtiva(row.item.status),
  )
  const inProgressRows = todayActive.filter((row) => row.inProgress)
  const todoToday = todayActive.filter((row) => !row.inProgress)
  const doneToday = rows.filter(
    (row) => sameDay(row.item.dataHora, today) && row.done,
  )
  const pendingRecords = rows.filter(
    (row) =>
      row.pendingRecord ||
      (row.done &&
        sameDay(row.item.dataHora, today) &&
        !banco.prontuarios.some((record) => record.consultaId === row.item.id)),
  )

  const nextTodo = todoToday[0]
  const currentProgress = inProgressRows[0]

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase()
    return rows.filter((row) => {
      const date = new Date(row.item.dataHora)
      const matchSearch =
        !query ||
        row.petName.toLowerCase().includes(query) ||
        row.tutorName.toLowerCase().includes(query)

      if (!matchSearch) return false
      if (tab === 'hoje') return sameDay(row.item.dataHora, today)
      if (tab === 'amanha') return sameDay(row.item.dataHora, tomorrow)
      if (tab === 'semana')
        return (
          date >= today && date < weekEnd && row.item.status !== 'cancelada'
        )
      if (tab === 'atrasados')
        return (
          consultaAtiva(row.item.status) &&
          date < today &&
          !sameDay(row.item.dataHora, today)
        )
      return true
    })
  }, [rows, search, tab, today, tomorrow, weekEnd])

  const grouped =
    tab === 'hoje'
      ? [
          {
            id: 'andamento',
            title: 'Em andamento',
            items: visible.filter((row) => row.inProgress),
          },
          {
            id: 'realizar',
            title: `A realizar hoje — ${todoToday.filter((row) => visible.includes(row)).length}`,
            items: visible.filter(
              (row) => consultaAtiva(row.item.status) && !row.inProgress,
            ),
          },
          {
            id: 'concluidos',
            title: 'Concluídos',
            items: visible.filter((row) => row.done),
          },
        ].filter((group) => group.items.length > 0)
      : [
          {
            id: 'lista',
            title:
              tab === 'amanha'
                ? 'Amanhã'
                : tab === 'semana'
                  ? 'Semana'
                  : 'Atrasados',
            items: visible,
          },
        ].filter((group) => group.items.length > 0)

  const routeRows = [...todayActive, ...doneToday].sort((a, b) =>
    a.item.dataHora.localeCompare(b.item.dataHora),
  )

  const tabs: Array<{ id: Tab; label: string }> = [
    { id: 'hoje', label: 'Hoje' },
    { id: 'amanha', label: 'Amanhã' },
    { id: 'semana', label: 'Semana' },
    { id: 'atrasados', label: 'Atrasados' },
  ]

  return (
    <div
      className="grid gap-4"
      style={{ animation: 'tt-surgir 0.6s ease both' }}
    >
      <PageHeader
        title="Atendimentos"
        description={`${dayLabel(today)} · ${todoToday.length} a realizar e ${inProgressRows.length} em andamento`}
        actions={
          <>
            <Button
              radius="xl"
              size="sm"
              variant="light"
              color="violet"
              leftSection={<LuRoute size={15} />}
              onClick={() =>
                feedback('', 'Rota do dia disponível no protótipo em breve.')
              }
            >
              Rota do dia
            </Button>
            <Button
              radius="xl"
              size="sm"
              variant="gradient"
              gradient={{ from: '#7434d6', to: '#a855f7', deg: 135 }}
              leftSection={<FiPlus size={15} />}
              onClick={() =>
                feedback('', 'Atendimento avulso disponível em breve.')
              }
            >
              Atendimento avulso
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-4 gap-3 max-md:grid-cols-2 max-sm:grid-cols-1">
        <MetricCard
          label="A realizar hoje"
          value={String(todoToday.length)}
          detail={
            nextTodo
              ? `próximo às ${hora(nextTodo.item.dataHora)}`
              : 'sem próximos'
          }
          icon={<FiClock size={16} />}
        />
        <MetricCard
          label="Em andamento"
          value={String(inProgressRows.length)}
          detail={
            currentProgress
              ? `${currentProgress.petName} · desde ${hora(currentProgress.item.dataHora)}`
              : 'nenhum agora'
          }
          icon={<FiPlay size={14} />}
        />
        <MetricCard
          label="Concluídos hoje"
          value={String(doneToday.length)}
          detail={
            <Text span size="xs" c="teal">
              no horário
            </Text>
          }
          icon={<FiCheck size={16} />}
        />
        <MetricCard
          label="Prontuários pendentes"
          value={String(
            Math.max(pendingRecords.length, doneToday.length ? 1 : 0),
          )}
          detail={
            <Text span size="xs" c="red">
              falta finalizar
            </Text>
          }
          icon={<FiFileText size={16} />}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-row items-center justify-between gap-3 max-sm:flex-col max-sm:items-stretch">
            <Group gap="xs" wrap="nowrap" className="shrink-0">
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
                  {item.label}
                </Button>
              ))}
            </Group>
            <TextInput
              value={search}
              onChange={(event) => setSearch(event.currentTarget.value)}
              placeholder="Buscar pet ou tutor"
              radius="xl"
              leftSection={<FiSearch size={16} />}
              className="w-[240px] shrink-0 max-sm:w-full"
            />
          </div>

          {grouped.length === 0 ? (
            <Text size="sm" c="dimmed" ta="center" py={48}>
              Nenhuma consulta neste filtro.
            </Text>
          ) : (
            <div className="mt-5 grid gap-6">
              {grouped.map((group) => (
                <div key={group.id}>
                  <Text
                    size="xs"
                    fw={600}
                    c="#94a3b8"
                    tt="uppercase"
                    style={{ letterSpacing: '0.08em' }}
                    mb="sm"
                  >
                    {group.title}
                  </Text>
                  <div className="divide-y divide-slate-100 rounded-2xl border border-slate-100">
                    {group.items.map((row) => (
                      <AppointmentRow
                        key={row.item.id}
                        row={row}
                        onPrimary={() =>
                          router.push(
                            `/veterinarian/appointments/${row.item.id}`,
                          )
                        }
                        onSecondary={() => {
                          if (row.inProgress) {
                            router.push(
                              `/veterinarian/appointments/${row.item.id}`,
                            )
                            return
                          }
                          feedback(
                            '',
                            row.done
                              ? 'Prontuário disponível no detalhe.'
                              : 'Rota disponível no protótipo em breve.',
                          )
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid gap-4 content-start">
          <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
            <Text size="sm" fw={600} c="#475569">
              Rota de hoje
            </Text>
            <div className="relative mt-4 grid gap-0">
              {routeRows.length === 0 ? (
                <Text size="sm" c="dimmed">
                  Sem visitas hoje.
                </Text>
              ) : (
                routeRows.map((row, index) => {
                  const done = row.done
                  const current = row.inProgress
                  return (
                    <div key={row.item.id} className="relative flex gap-3 pb-4">
                      {index < routeRows.length - 1 && (
                        <div className="absolute top-3 left-[7px] h-full w-px bg-slate-200" />
                      )}
                      <div
                        className={cx(
                          'relative z-10 mt-1 h-3.5 w-3.5 shrink-0 rounded-full border-2',
                          done && 'border-slate-300 bg-slate-300',
                          current && 'border-[#7434d6] bg-[#7434d6]',
                          !done && !current && 'border-slate-300 bg-white',
                        )}
                      />
                      <div className="min-w-0">
                        <Text
                          size="sm"
                          fw={500}
                          c={done ? '#94a3b8' : '#475569'}
                          td={done ? 'line-through' : undefined}
                        >
                          {hora(row.item.dataHora)} · {row.petName}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {row.item.tipo || row.item.motivo}
                          {current ? ' · agora' : ''}
                        </Text>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
            <Text size="sm" fw={600} c="#475569">
              Prontuários para finalizar
            </Text>
            <div className="mt-4 grid gap-3">
              {(pendingRecords.length > 0
                ? pendingRecords
                : doneToday.slice(0, 2)
              ).map((row, index) => (
                <div
                  key={`pending-${row.item.id}`}
                  className="flex items-center gap-3"
                >
                  <div
                    className={cx(
                      'grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-semibold',
                      petTone(index),
                    )}
                  >
                    {initials(row.petName)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <Text size="sm" fw={500} c="#475569">
                      {row.petName}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {row.item.tipo || row.item.motivo}
                    </Text>
                  </div>
                  <Button
                    radius="xl"
                    size="compact-sm"
                    variant="light"
                    color="violet"
                    onClick={() =>
                      router.push(`/veterinarian/appointments/${row.item.id}`)
                    }
                  >
                    {index === 0 ? 'Finalizar' : 'Assinar'}
                  </Button>
                </div>
              ))}
              {pendingRecords.length === 0 && doneToday.length === 0 && (
                <Text size="sm" c="dimmed">
                  Nenhum prontuário pendente.
                </Text>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MetricCard({
  label,
  value,
  detail,
  icon,
}: {
  label: string
  value: string
  detail: ReactNode
  icon: ReactNode
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white px-4 py-4 shadow-sm">
      <Group justify="space-between" align="flex-start">
        <Text size="sm" c="dimmed">
          {label}
        </Text>
        <Text c="#94a3b8" className="leading-none">
          {icon}
        </Text>
      </Group>
      <Text size="xl" fw={600} c="#334155" mt={6}>
        {value}
      </Text>
      <Text size="xs" c="dimmed" mt={2}>
        {detail}
      </Text>
    </div>
  )
}

function AppointmentRow({
  row,
  onPrimary,
  onSecondary,
}: {
  row: Row
  onPrimary: () => void
  onSecondary: () => void
}) {
  const primaryLabel = row.inProgress
    ? 'Continuar'
    : row.done
      ? 'Abrir'
      : 'Iniciar'
  const secondaryLabel = row.inProgress
    ? 'Prontuário'
    : row.done
      ? 'Prontuário'
      : 'Rota'

  return (
    <div className="grid gap-3 px-4 py-4 lg:grid-cols-[64px_minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)_140px] lg:items-center">
      <Text size="sm" fw={700} c="#334155">
        {hora(row.item.dataHora)}
      </Text>

      <div className="flex min-w-0 items-start gap-3">
        <div
          className={cx(
            'grid h-10 w-10 shrink-0 place-items-center rounded-full text-xs font-semibold',
            petTone(row.index),
          )}
        >
          {initials(row.petName)}
        </div>
        <div className="min-w-0">
          <Text size="sm" fw={600} c="#334155">
            {row.petName}
          </Text>
          <Text size="xs" c="dimmed">
            {row.petBreed} · {row.tutorName}
          </Text>
          <Group gap={6} mt={6} wrap="wrap">
            {row.allergy && (
              <Badge
                radius="sm"
                variant="light"
                color="red"
                tt="none"
                size="xs"
              >
                {row.allergy}
              </Badge>
            )}
            {row.planName && (
              <Badge
                radius="sm"
                variant="light"
                color="violet"
                tt="none"
                size="xs"
              >
                {row.planName}
              </Badge>
            )}
          </Group>
        </div>
      </div>

      <Group gap={6} wrap="nowrap">
        <FiFileText size={14} className="shrink-0 text-slate-400" />
        <Text size="sm" c="#64748b" lineClamp={2}>
          {row.item.tipo || row.item.motivo}
          {row.item.motivo && row.item.tipo && row.item.tipo !== row.item.motivo
            ? ` · ${row.item.motivo}`
            : ''}
        </Text>
      </Group>

      <Group gap={6} wrap="nowrap" align="flex-start">
        <FiMapPin size={14} className="mt-0.5 shrink-0 text-slate-400" />
        <Text size="sm" c="#94a3b8" lineClamp={2}>
          {row.address}
        </Text>
      </Group>

      <div className="grid gap-2">
        <Button
          radius="md"
          size="compact-sm"
          variant="gradient"
          gradient={{ from: '#7434d6', to: '#a855f7', deg: 135 }}
          leftSection={<FiPlay size={12} />}
          onClick={onPrimary}
        >
          {primaryLabel}
        </Button>
        <Button
          radius="xl"
          size="compact-sm"
          variant="light"
          color="gray"
          onClick={onSecondary}
        >
          {secondaryLabel}
        </Button>
      </div>
    </div>
  )
}
