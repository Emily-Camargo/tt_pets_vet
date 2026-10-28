'use client'

import { useState, type FormEvent } from 'react'

import { feedback } from '@/core/functions/feedback'
import { salvarVacina } from '@/service/mock/actions'

const fieldClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-marca focus:ring-2 focus:ring-marca-anel'

export function VaccineForm({
  open,
  petId,
  tutorId,
  onClose,
}: {
  open: boolean
  petId: string
  tutorId: string
  onClose: () => void
}) {
  const [name, setName] = useState('')
  const [dose, setDose] = useState('')
  const [appliedOn, setAppliedOn] = useState('')
  const [nextDose, setNextDose] = useState('')

  if (!open) return null

  function save(event: FormEvent) {
    event.preventDefault()
    const error = salvarVacina({
      petId,
      nome: name,
      dose: dose || undefined,
      aplicadaEm: appliedOn || undefined,
      proximaDose: nextDose || undefined,
      tutorId,
    })
    feedback(error, 'Vacina registrada.')
    if (!error) onClose()
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            Agendar vacina
          </h2>
          <button
            type="button"
            aria-label="Fechar"
            className="grid h-8 w-8 place-items-center rounded-full text-slate-400 hover:bg-slate-50"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <form className="flex flex-col gap-3" onSubmit={save}>
          <label className="text-sm font-medium text-slate-700">
            <span className="mb-1.5 block">Vacina</span>
            <input
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className={fieldClass}
              placeholder="Ex.: V10"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            <span className="mb-1.5 block">Dose</span>
            <input
              value={dose}
              onChange={(event) => setDose(event.target.value)}
              className={fieldClass}
              placeholder="Ex.: Anual"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            <span className="mb-1.5 block">Aplicada em</span>
            <input
              type="date"
              value={appliedOn}
              onChange={(event) => setAppliedOn(event.target.value)}
              className={fieldClass}
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            <span className="mb-1.5 block">Próxima dose</span>
            <input
              type="date"
              value={nextDose}
              onChange={(event) => setNextDose(event.target.value)}
              className={fieldClass}
            />
          </label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-full bg-marca px-4 py-2.5 text-sm font-medium text-white hover:bg-marca-forte"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
