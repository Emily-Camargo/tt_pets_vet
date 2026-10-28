'use client'

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
    <article className="flex flex-col gap-3 border-b border-slate-100 py-4 last:border-b-0 lg:flex-row lg:items-center lg:gap-4 xl:gap-6">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-slate-100 bg-white text-center leading-tight">
          <span className="text-[10px] font-semibold tracking-wide text-marca">
            {stamp.month}
          </span>
          <span className="text-lg font-semibold text-slate-900">
            {stamp.day}
          </span>
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
          <p className="font-semibold text-slate-900">
            {appointment.tipo ?? appointment.motivo}
          </p>
          <p className="truncate text-sm text-slate-500">
            {petName} · {vetName}
          </p>
        </div>
      </div>

      <div className="grid min-w-0 flex-1 gap-2 text-sm text-slate-600 sm:grid-cols-2 lg:max-w-xl">
        <p className="truncate">🕒 {whenLabel(appointment.dataHora)}</p>
        <p className="truncate">
          📍 {appointment.endereco ?? 'Endereço não informado'}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2 lg:justify-end">
        <span
          className={cx(
            'rounded-full px-2.5 py-1 text-[11px] font-medium',
            status.tone,
          )}
        >
          {status.label}
        </span>
        {mode === 'upcoming' && (
          <>
            <button
              type="button"
              onClick={onReschedule}
              className="rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Reagendar
            </button>
            <button
              type="button"
              aria-label="Mais opções"
              onClick={onCancel}
              className="grid h-8 w-8 place-items-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50"
            >
              ···
            </button>
          </>
        )}
        {mode === 'done' && (
          <button
            type="button"
            onClick={onReceipt}
            className="rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Ver receita
          </button>
        )}
      </div>
    </article>
  )
}
