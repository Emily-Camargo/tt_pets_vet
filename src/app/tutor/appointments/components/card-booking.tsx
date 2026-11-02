'use client'

import { Badge, Button, Group, Text } from '@mantine/core'
import { FiClock, FiMapPin } from 'react-icons/fi'

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
    <div className="rounded-2xl border border-slate-100 bg-[#fcfbfe] px-4 py-4 transition hover:border-[#e4d4f7] hover:bg-white">
      <div className="flex flex-row items-center gap-4 max-md:flex-col max-md:items-stretch">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <div className="grid h-14 w-12 shrink-0 place-items-center rounded-xl bg-marca-clara text-center leading-tight">
            <Text size="xs" fw={600} c="#7434d6" tt="uppercase">
              {stamp.month}
            </Text>
            <Text size="lg" fw={600} c="#475569">
              {stamp.day}
            </Text>
          </div>

          <div className="shrink-0 max-sm:hidden">
            <div
              className={cx(
                'grid h-10 w-10 place-items-center rounded-full text-xs font-semibold',
                petTone(petIndex),
              )}
            >
              {initials(petName)}
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <Text size="sm" fw={600} c="#475569" className="break-words">
              {appointment.tipo ?? appointment.motivo}
            </Text>
            <Text size="xs" c="#94a3b8" mt={2} className="break-words">
              {petName} · {vetName}
            </Text>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 max-sm:flex-col max-sm:items-start">
              <Text
                size="xs"
                c="#64748b"
                className="inline-flex items-center gap-1.5"
              >
                <FiClock size={12} className="shrink-0 text-[#a78bfa]" />
                {whenLabel(appointment.dataHora)}
              </Text>
              <Text
                size="xs"
                c="#64748b"
                className="inline-flex min-w-0 items-start gap-1.5"
              >
                <FiMapPin
                  size={12}
                  className="mt-0.5 shrink-0 text-[#f472b6]"
                />
                <span className="break-words">
                  {appointment.endereco ?? 'Endereço não informado'}
                </span>
              </Text>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2 max-md:w-full max-md:justify-between">
          <Badge color={status.color} variant="light" radius="xl" size="sm">
            {status.label}
          </Badge>
          <Group gap="xs" wrap="wrap" className="max-md:ml-auto">
            {mode === 'upcoming' && (
              <>
                <Button
                  radius="xl"
                  variant="light"
                  color="violet"
                  size="compact-sm"
                  onClick={onReschedule}
                >
                  Reagendar
                </Button>
                <Button
                  radius="xl"
                  variant="light"
                  color="red"
                  size="compact-sm"
                  onClick={onCancel}
                >
                  Cancelar
                </Button>
              </>
            )}
            {mode === 'done' && (
              <Button
                radius="xl"
                variant="light"
                color="gray"
                size="compact-sm"
                onClick={onReceipt}
              >
                Ver receita
              </Button>
            )}
          </Group>
        </div>
      </div>
    </div>
  )
}
