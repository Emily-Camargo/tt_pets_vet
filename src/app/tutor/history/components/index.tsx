'use client'

import { useMemo, useState } from 'react'

import { initials, petTone } from '@/app/tutor/appointments/utils/functions'
import { cx, dataCurta } from '@/core/functions/format'
import { feedback } from '@/core/functions/feedback'
import { useUsuario } from '@/core/hooks/use-session'

import {
  activePrescriptions,
  buildTimeline,
  kindLabel,
  kindTone,
  progressDays,
  timelineDate,
  type HistoryKind,
} from '../utils/functions'

const FILTERS: Array<{ id: 'all' | HistoryKind; label: string }> = [
  { id: 'all', label: 'Tudo' },
  { id: 'consulta', label: 'Consultas' },
  { id: 'receita', label: 'Receitas' },
  { id: 'vacina', label: 'Vacinas' },
  { id: 'exame', label: 'Exames' },
]

export function History() {
  const { banco, usuario } = useUsuario()
  const tutorId = usuario?.tutorId ?? ''
  const pets = banco.pets.filter((item) => item.tutorId === tutorId)
  const [petId, setPetId] = useState('all')
  const [filter, setFilter] = useState<'all' | HistoryKind>('all')

  const petIds =
    petId === 'all'
      ? pets.map((item) => item.id)
      : pets.filter((item) => item.id === petId).map((item) => item.id)

  const timeline = useMemo(() => buildTimeline(banco, petIds), [banco, petIds])
  const visible = timeline.filter(
    (item) => filter === 'all' || item.kind === filter,
  )
  const actives = activePrescriptions(banco, petIds)

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
            Histórico e receitas
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Tudo o que foi feito em cada atendimento, com as receitas para
            baixar.
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            feedback('', 'Exportação disponível no protótipo em breve.')
          }
          className="rounded-full border border-marca bg-white px-4 py-2.5 text-sm font-medium text-marca hover:bg-marca-clara"
        >
          ↓ Exportar histórico
        </button>
      </header>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setPetId('all')}
          className={cx(
            'rounded-full border px-4 py-2 text-sm font-medium transition',
            petId === 'all'
              ? 'border-marca bg-marca text-white'
              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300',
          )}
        >
          Todos os pets
        </button>
        {pets.map((pet, index) => (
          <button
            key={pet.id}
            type="button"
            onClick={() => setPetId(pet.id)}
            className={cx(
              'inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition',
              petId === pet.id
                ? 'border-marca bg-[#f6f1fc] text-marca'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300',
            )}
          >
            <span
              className={cx(
                'grid h-6 w-6 place-items-center rounded-full text-[10px] font-bold',
                petTone(index),
              )}
            >
              {initials(pet.nome)}
            </span>
            {pet.nome}
          </button>
        ))}
      </div>

      <div className="grid w-full gap-4 lg:gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-wrap gap-2">
            {FILTERS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilter(item.id)}
                className={cx(
                  'rounded-full px-3 py-1.5 text-sm font-medium transition',
                  filter === item.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
                )}
              >
                {item.label}
              </button>
            ))}
          </div>

          {visible.length === 0 ? (
            <p className="py-10 text-center text-sm text-slate-400">
              Nenhum registro neste filtro.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {visible.map((entry) => {
                const pet = pets.find((item) => item.id === entry.petId)
                const petIndex = Math.max(
                  0,
                  pets.findIndex((item) => item.id === entry.petId),
                )
                return (
                  <li key={entry.id} className="flex gap-4 py-5">
                    <div className="w-24 shrink-0 text-sm font-medium text-slate-500">
                      {timelineDate(entry.when)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={cx(
                            'grid h-8 w-8 place-items-center rounded-lg text-[10px] font-bold',
                            petTone(petIndex),
                          )}
                        >
                          {initials(pet?.nome ?? 'P')}
                        </span>
                        <h3 className="font-semibold text-slate-900">
                          {entry.title}
                        </h3>
                        <span
                          className={cx(
                            'rounded-full px-2.5 py-1 text-[11px] font-medium',
                            kindTone(entry.kind),
                          )}
                        >
                          {kindLabel(entry.kind)}
                        </span>
                      </div>
                      {(entry.vetName || pet) && (
                        <p className="mt-1 text-sm text-slate-500">
                          {entry.vetName ?? 'Veterinário'} · em domicílio
                        </p>
                      )}
                      {entry.summary && (
                        <p className="mt-2 text-sm text-slate-600">
                          {entry.summary}
                        </p>
                      )}
                      {entry.prescriptions &&
                        entry.prescriptions.length > 0 && (
                          <div className="mt-3 space-y-2 rounded-2xl bg-slate-50 p-3">
                            {entry.prescriptions.map((item) => (
                              <div
                                key={`${entry.id}-${item.nome}`}
                                className="flex items-center gap-2 text-sm text-slate-700"
                              >
                                <span>💊</span>
                                <span>
                                  {item.nome}
                                  {item.uso ? ` · ${item.uso}` : ''}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      {entry.examName && (
                        <div className="mt-3 rounded-2xl bg-slate-50 p-3 text-sm text-slate-700">
                          📄 {entry.examName}
                          {entry.examResult ? ` · ${entry.examResult}` : ''}
                        </div>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        <aside className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Receitas ativas</h2>
            <button
              type="button"
              onClick={() => setFilter('receita')}
              className="text-sm font-medium text-marca"
            >
              Todas
            </button>
          </div>

          {actives.length === 0 ? (
            <p className="text-sm text-slate-400">Nenhuma receita em uso.</p>
          ) : (
            <div className="space-y-4">
              {actives.flatMap((receita) => {
                const pet = pets.find((item) => item.id === receita.petId)
                const progress = progressDays(receita)
                const items =
                  receita.itens && receita.itens.length > 0
                    ? receita.itens
                    : [{ nome: receita.texto, uso: '' }]
                return items.map((item) => (
                  <div
                    key={`${receita.id}-${item.nome}`}
                    className="rounded-2xl border border-slate-100 p-4"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-slate-900">
                        {item.nome}
                      </h3>
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                        Em uso
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">
                      {pet?.nome}
                      {item.uso ? ` · ${item.uso}` : ''}
                    </p>
                    {progress.total > 0 && (
                      <>
                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-marca"
                            style={{ width: `${progress.percent}%` }}
                          />
                        </div>
                        <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                          <span>
                            Dia {progress.current} de {progress.total}
                          </span>
                          <span>
                            {receita.fim
                              ? `até ${dataCurta(receita.fim).slice(0, 5)}`
                              : ''}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                ))
              })}
            </div>
          )}

          <button
            type="button"
            onClick={() =>
              feedback('', 'PDF disponível no protótipo em breve.')
            }
            className="mt-5 w-full rounded-full border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            ↓ Baixar receita (PDF)
          </button>
        </aside>
      </div>

      <p className="pt-2 text-center text-xs text-slate-400">
        Protótipo com dados de exemplo.
      </p>
    </div>
  )
}
