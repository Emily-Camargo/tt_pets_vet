'use client'

import { useMemo, useState, type FormEvent } from 'react'

import { cx } from '@/core/functions/format'
import { feedback } from '@/core/functions/feedback'
import type { Banco } from '@/core/interfaces/types'
import { agendarConsulta } from '@/service/mock/actions'
import {
  diasAgendaveis,
  horariosDoDia,
  motivoBloqueioAgendamento,
  veterinariosDisponiveis,
} from '@/service/mock/rules'

import { dayKey, dayLabel, visitsUsedThisMonth } from '../utils/functions'

const fieldClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-marca focus:ring-2 focus:ring-marca-anel'

const TYPES = ['Consulta em domicílio', 'Retorno', 'Vacinação']

export function BookingForm({
  bank,
  tutorId,
  onClose,
}: {
  bank: Banco
  tutorId: string
  onClose: () => void
}) {
  const pets = bank.pets.filter((item) => item.tutorId === tutorId)
  const tutor = bank.tutores.find((item) => item.id === tutorId)
  const days = useMemo(() => diasAgendaveis(7), [])

  const [petId, setPetId] = useState(pets[0]?.id ?? '')
  const [type, setType] = useState(TYPES[0])
  const [veterinarianId, setVeterinarianId] = useState('')
  const [day, setDay] = useState(dayKey(days[0] ?? new Date()))
  const [slot, setSlot] = useState('')
  const [address, setAddress] = useState(tutor?.endereco ?? '')
  const [reason, setReason] = useState('')

  const subscription = bank.assinaturas.find(
    (item) => item.petId === petId && item.status === 'ativa',
  )
  const plan = bank.planos.find((item) => item.id === subscription?.planoId)
  const block = petId
    ? motivoBloqueioAgendamento(bank, petId)
    : 'Cadastre um pet.'
  const vets = subscription
    ? veterinariosDisponiveis(bank, subscription.cidadeId)
    : []
  const activeVetId = veterinarianId || vets[0]?.id || ''
  const slots = activeVetId ? horariosDoDia(bank, activeVetId, day) : []
  const used = petId ? visitsUsedThisMonth(bank, petId) : 0
  const limit = plan?.visitasMes

  function save(event: FormEvent) {
    event.preventDefault()
    const error = agendarConsulta({
      petId,
      veterinarioId: veterinarianId || undefined,
      dataHora: slot,
      motivo: reason || type,
      tipo: type,
      endereco: address,
    })
    feedback(error, 'Consulta agendada.')
    if (!error) onClose()
  }

  return (
    <aside className="h-fit w-full rounded-3xl border border-slate-100 bg-white p-5 shadow-sm xl:sticky xl:top-20">
      <div className="mb-1 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Nova consulta
          </h2>
          <p className="mt-1 text-sm font-medium text-marca">
            {limit == null
              ? 'Visitas ilimitadas'
              : `${used} de ${limit} visitas no mês`}
          </p>
        </div>
        <button
          type="button"
          aria-label="Fechar"
          onClick={onClose}
          className="grid h-8 w-8 place-items-center rounded-full text-slate-400 hover:bg-slate-50"
        >
          ×
        </button>
      </div>

      <form className="mt-4 flex flex-col gap-4" onSubmit={save}>
        {block && (
          <p className="rounded-2xl bg-rose-50 px-3 py-2 text-sm text-rose-600">
            {block}
          </p>
        )}

        <div>
          <p className="mb-2 text-sm font-medium text-slate-700">Pet</p>
          <div className="flex flex-wrap gap-2">
            {pets.map((pet) => (
              <button
                key={pet.id}
                type="button"
                onClick={() => {
                  setPetId(pet.id)
                  setVeterinarianId('')
                  setSlot('')
                }}
                className={cx(
                  'rounded-full border px-3 py-1.5 text-sm font-medium transition',
                  petId === pet.id
                    ? 'border-marca bg-[#f6f1fc] text-marca'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300',
                )}
              >
                {pet.nome}
              </button>
            ))}
          </div>
        </div>

        <label className="text-sm font-medium text-slate-700">
          <span className="mb-1.5 block">Tipo</span>
          <select
            value={type}
            onChange={(event) => setType(event.target.value)}
            className={fieldClass}
          >
            {TYPES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <span className="mt-1 block text-xs text-slate-400">
            Incluso no plano
          </span>
        </label>

        <label className="text-sm font-medium text-slate-700">
          <span className="mb-1.5 block">Veterinário</span>
          <select
            value={veterinarianId}
            onChange={(event) => {
              setVeterinarianId(event.target.value)
              setSlot('')
            }}
            className={fieldClass}
          >
            <option value="">Qualquer disponível</option>
            {vets.map((vet) => (
              <option key={vet.id} value={vet.id}>
                {vet.nome}
              </option>
            ))}
          </select>
        </label>

        <div>
          <p className="mb-2 text-sm font-medium text-slate-700">Dia</p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {days.map((item) => {
              const key = dayKey(item)
              const label = dayLabel(item)
              const active = key === day
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setDay(key)
                    setSlot('')
                  }}
                  className={cx(
                    'min-w-14 rounded-2xl border px-2 py-2 text-center transition',
                    active
                      ? 'border-marca bg-marca text-white'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300',
                  )}
                >
                  <span className="block text-[10px] font-semibold tracking-wide">
                    {label.weekday}
                  </span>
                  <span className="block text-sm font-semibold">
                    {label.day}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-slate-700">Horário</p>
          <div className="grid grid-cols-3 gap-2">
            {slots.map((item) => (
              <button
                key={item.iso}
                type="button"
                disabled={!item.livre}
                onClick={() => setSlot(item.iso)}
                className={cx(
                  'rounded-xl border px-2 py-2 text-sm font-medium transition',
                  !item.livre &&
                    'cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300',
                  item.livre &&
                    slot === item.iso &&
                    'border-marca bg-[#f6f1fc] text-marca',
                  item.livre &&
                    slot !== item.iso &&
                    'border-slate-200 text-slate-700 hover:border-slate-300',
                )}
              >
                {item.label}
              </button>
            ))}
            {slots.length === 0 && (
              <p className="col-span-3 text-sm text-slate-400">
                Sem horários neste dia.
              </p>
            )}
          </div>
        </div>

        <label className="text-sm font-medium text-slate-700">
          <span className="mb-1.5 block">Endereço da visita</span>
          <input
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            className={fieldClass}
            placeholder="Rua, número e cidade"
          />
        </label>

        <label className="text-sm font-medium text-slate-700">
          <span className="mb-1.5 block">Motivo</span>
          <textarea
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            className={`${fieldClass} min-h-24 resize-y`}
            placeholder="Conte o que o pet está sentindo."
          />
        </label>

        <button
          type="submit"
          disabled={Boolean(block) || !slot}
          className="rounded-full bg-marca px-4 py-3 text-sm font-medium text-white hover:bg-marca-forte disabled:cursor-not-allowed disabled:opacity-50"
        >
          Confirmar agendamento
        </button>
      </form>
    </aside>
  )
}
