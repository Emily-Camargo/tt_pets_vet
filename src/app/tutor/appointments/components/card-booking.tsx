'use client'

import { Badge, Button, Group, Text } from '@mantine/core'

import { cx } from '@/core/functions/format'
import type { Consulta } from '@/core/interfaces/types'

import {
  dateStamp,
  initials,
  petTone,
  statusUi,
  whenLabel,
} from '../utils/functions'

export function CardBooking({
  appointment,
  petName,
  vetName,
  petIndex,
  mode,
  onReschedule,
  onCancel,
  onReceipt,
}: {
  appointment: Consulta
  petName: string
  vetName: string
  petIndex: number
  mode: 'upcoming' | 'done' | 'canceled'
  onReschedule?: () => void
  onCancel?: () => void
  onReceipt?: () => void
}) {
  const stamp = dateStamp(appointment.dataHora)
  const status = statusUi(appointment.status)

  return (
    <div className="flex flex-col gap-3 border-b border-slate-100 py-4 last:border-b-0 lg:flex-row lg:items-center lg:gap-4 xl:gap-6">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-slate-100 bg-white text-center leading-tight">
          <Text size="xs" fw={600} c="#7434d6">
            {stamp.month}
          </Text>
          <Text size="lg" fw={600}>
            {stamp.day}
          </Text>
        </div>

        <div
          className={cx(
            'grid h-10 w-10 shrink-0 place-items-center rounded-full text-xs font-bold',
            petTone(petIndex),
          )}
        >
          {initials(petName)}
        </div>

        <div className="min-w-0">
          <Text fw={600}>{appointment.tipo ?? appointment.motivo}</Text>
          <Text size="sm" c="dimmed" truncate>
            {petName} · {vetName}
          </Text>
        </div>
      </div>

      <div className="grid min-w-0 flex-1 gap-2 text-sm text-slate-600 sm:grid-cols-2 lg:max-w-xl">
        <Text size="sm" truncate>
          🕒 {whenLabel(appointment.dataHora)}
        </Text>
        <Text size="sm" truncate>
          📍 {appointment.endereco ?? 'Endereço não informado'}
        </Text>
      </div>

      <Group gap="xs" className="shrink-0 lg:justify-end">
        <Badge className={status.tone} variant="light" radius="xl">
          {status.label}
        </Badge>
        {mode === 'upcoming' && (
          <>
            <Button
              radius="xl"
              variant="default"
              size="compact-sm"
              onClick={onReschedule}
            >
              Reagendar
            </Button>
            <Button
              radius="xl"
              variant="default"
              size="compact-sm"
              aria-label="Mais opções"
              onClick={onCancel}
              px="xs"
            >
              ···
            </Button>
          </>
        )}
        {mode === 'done' && (
          <Button
            radius="xl"
            variant="default"
            size="compact-sm"
            onClick={onReceipt}
          >
            Ver receita
          </Button>
        )}
      </Group>
    </div>
  )
}
