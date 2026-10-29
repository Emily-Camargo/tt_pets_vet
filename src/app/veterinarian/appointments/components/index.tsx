'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

import { initials, petTone } from '@/app/tutor/appointments/utils/functions'
import { ageLabel } from '@/app/tutor/pets/utils/functions'
import { cx, dataHora, hora, telefone } from '@/core/functions/format'
import { useUsuario } from '@/core/hooks/use-session'
import { consultaAtiva } from '@/service/mock/rules'

type Tab = 'hoje' | 'proximos' | 'todos'

export function Appointments() {
  const router = useRouter()
  const { banco, usuario } = useUsuario()
  const veterinarianId = usuario?.veterinarioId ?? ''
  const [tab, setTab] = useState<Tab>('hoje')

  const items = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)

    return banco.consultas
      .filter(
        (item) =>
          item.veterinarioId === veterinarianId && consultaAtiva(item.status),
      )
      .sort((a, b) => a.dataHora.localeCompare(b.dataHora))
      .map((item) => {
        const date = new Date(item.dataHora)
        const isToday = date >= today && date < tomorrow
        const pet = banco.pets.find((p) => p.id === item.petId)
        const tutor = banco.tutores.find((t) => t.id === item.tutorId)
        const city = banco.cidades.find((c) => c.id === item.cidadeId)
        const planId = banco.assinaturas.find(
          (a) => a.petId === item.petId && a.status === 'ativa',
        )?.planoId
        const plan = banco.planos.find((p) => p.id === planId)
        return { item, pet, tutor, city, plan, isToday }
      })
  }, [banco, veterinarianId])

  const visible = items.filter((row) => {
    if (tab === 'hoje') return row.isToday
    if (tab === 'proximos') return !row.isToday
    return true
  })

  const todayCount = items.filter((row) => row.isToday).length

  return (
    <div
      className="space-y-4"
      style={{ animation: 'tt-surgir 0.6s ease both' }}
    >
      <header>
        <p className="text-xs font-semibold tracking-[0.16em] text-marca uppercase">
          Veterinário
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
          Atendimentos
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Escolha a visita e inicie o atendimento com prontuário, receita e
          assistente de IA.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        {(
          [
            ['hoje', `Hoje (${todayCount})`],
            ['proximos', 'Próximos'],
            ['todos', `Todos (${items.length})`],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cx(
              'rounded-full px-4 py-2 text-sm font-medium transition',
              tab === id
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-slate-200 bg-white py-14 text-center text-sm text-slate-400">
          Nenhuma consulta para iniciar neste filtro.
        </p>
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {visible.map(({ item, pet, tutor, city, plan, isToday }, index) => (
            <article
              key={item.id}
              className="flex flex-col justify-between rounded-3xl border border-slate-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <span
                  className={cx(
                    'inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-bold',
                    petTone(index),
                  )}
                >
                  {initials(pet?.nome ?? 'P')}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold text-slate-900">
                      {pet?.nome ?? 'Pet'}
                    </h2>
                    {isToday && (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                        Hoje
                      </span>
                    )}
                    {plan && (
                      <span className="rounded-full bg-[#f6f1fc] px-2 py-0.5 text-[11px] font-semibold text-marca">
                        {plan.nome}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-slate-500">
                    {pet?.raca} · {pet ? ageLabel(pet.nascimento) : '—'} ·{' '}
                    {tutor?.nome}
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    <span className="font-semibold text-marca">
                      {hora(item.dataHora)}
                    </span>{' '}
                    · {item.motivo}
                    {city ? ` · ${city.nome}` : ''}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {dataHora(item.dataHora)}
                    {tutor?.telefone ? ` · ${telefone(tutor.telefone)}` : ''}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  router.push(`/veterinarian/appointments/${item.id}`)
                }
                className="mt-5 w-full rounded-full bg-marca px-4 py-2.5 text-sm font-medium text-white hover:bg-marca-forte"
              >
                Iniciar atendimento
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
