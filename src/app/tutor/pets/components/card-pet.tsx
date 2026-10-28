'use client'

import Link from 'next/link'

import { cx } from '@/core/functions/format'
import type { Consulta, Pet, Vacina } from '@/core/interfaces/types'

import {
  ageLabel,
  lastVisitLabel,
  neuteredLabel,
  nextAppointmentBadge,
  petEmoji,
  vaccineBadge,
} from '../utils/functions'

export function CardPet({
  pet,
  vaccines,
  appointments,
  onEdit,
}: {
  pet: Pet
  vaccines: Vacina[]
  appointments: Consulta[]
  onEdit: () => void
}) {
  const vaccine = vaccineBadge(vaccines)
  const visit = nextAppointmentBadge(appointments)

  return (
    <article className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-4">
          <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full bg-[#f6f1fc] text-3xl">
            {pet.foto ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={pet.foto}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              petEmoji(pet.especie)
            )}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-900">{pet.nome}</h3>
            <p className="mt-1 text-sm text-slate-500">
              {pet.especie} · {pet.raca} · {pet.sexo} · {neuteredLabel(pet)}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span
                className={cx(
                  'rounded-full px-2.5 py-1 text-[11px] font-medium',
                  vaccine.tone,
                )}
              >
                {vaccine.label}
              </span>
              <span
                className={cx(
                  'rounded-full px-2.5 py-1 text-[11px] font-medium',
                  visit.tone,
                )}
              >
                {visit.label}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 sm:grid-cols-4">
        <Stat label="Idade" value={ageLabel(pet.nascimento)} />
        <Stat label="Peso" value={`${pet.peso} kg`} />
        <Stat label="Microchip" value={pet.microchip ?? 'Não informado'} />
        <Stat label="Última consulta" value={lastVisitLabel(appointments)} />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          href="/tutor/appointments"
          className="rounded-full bg-marca px-4 py-2 text-sm font-medium text-white hover:bg-marca-forte"
        >
          Agendar consulta
        </Link>
        <Link
          href="/tutor/vaccines"
          className="rounded-full border border-marca bg-white px-4 py-2 text-sm font-medium text-marca hover:bg-marca-clara"
        >
          Carteira de vacinação
        </Link>
        <Link
          href="/tutor/history"
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          Histórico e receitas
        </Link>
        <button
          type="button"
          onClick={onEdit}
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          Editar
        </button>
      </div>
    </article>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold tracking-wide text-slate-400 uppercase">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-slate-800">{value}</p>
    </div>
  )
}
