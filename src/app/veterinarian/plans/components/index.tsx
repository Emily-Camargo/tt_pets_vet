'use client'

import { useMemo, useState } from 'react'

import { PlanForm } from '@/app/plans/components/plan-form'
import { cx, moeda } from '@/core/functions/format'
import { feedback } from '@/core/functions/feedback'
import { useUsuario } from '@/core/hooks/use-session'
import type { Plano } from '@/core/interfaces/types'
import { alternarPlano } from '@/service/mock/actions'

import {
  cityTabs,
  featuredFirst,
  planSubscribers,
  plansForCity,
} from '../utils/functions'

export function VetPlans() {
  const { banco, usuario } = useUsuario()
  const veterinarianId = usuario?.veterinarioId ?? ''
  const tabs = useMemo(
    () => cityTabs(banco, veterinarianId),
    [banco, veterinarianId],
  )
  const [cityId, setCityId] = useState(tabs[0]?.id ?? '')
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState<Plano>()

  const activeCity = tabs.find((item) => item.id === cityId) ?? tabs[0]
  const plans = featuredFirst(
    plansForCity(banco, veterinarianId, activeCity?.id ?? ''),
  )
  const services = banco.servicosAvulsos.filter(
    (item) => item.veterinarioId === veterinarianId,
  )

  function openForm(plan?: Plano) {
    setCurrent(plan)
    setOpen(true)
  }

  return (
    <div
      className="space-y-5"
      style={{ animation: 'tt-surgir 0.6s ease both' }}
    >
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-marca uppercase">
            Veterinário
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
            Planos e cidades
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Defina onde você atende e os planos que o tutor vê em cada cidade.
          </p>
        </div>
        <button
          type="button"
          onClick={() => openForm()}
          className="rounded-full bg-marca px-4 py-2.5 text-sm font-medium text-white hover:bg-marca-forte"
        >
          + Novo plano
        </button>
      </header>

      <div className="flex flex-wrap gap-3">
        {tabs.map((tab) => {
          const active = activeCity?.id === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setCityId(tab.id)}
              className={cx(
                'min-w-[180px] rounded-2xl border px-4 py-3 text-left transition',
                active
                  ? 'border-marca bg-white shadow-sm ring-1 ring-marca'
                  : 'border-slate-200 bg-white hover:border-slate-300',
              )}
            >
              <p className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                <span className="text-marca">📍</span>
                {tab.nome}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                {tab.plans} {tab.plans === 1 ? 'plano' : 'planos'} ·{' '}
                {tab.subscribers}{' '}
                {tab.subscribers === 1 ? 'assinante' : 'assinantes'}
              </p>
            </button>
          )
        })}
        <button
          type="button"
          onClick={() =>
            feedback('', 'Inclusão de cidade disponível em breve.')
          }
          className="min-w-[180px] rounded-2xl border border-dashed border-marca/40 px-4 py-3 text-sm font-medium text-marca hover:bg-[#faf7ff]"
        >
          + Adicionar cidade
        </button>
      </div>

      {plans.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-slate-200 bg-white py-12 text-center text-sm text-slate-400">
          Nenhum plano nesta cidade.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              subscribers={planSubscribers(banco, plan.id)}
              onEdit={() => openForm(plan)}
              onToggle={() => {
                alternarPlano(plan.id)
                feedback(
                  null,
                  plan.ativo ? 'Plano inativado.' : 'Plano ativado.',
                )
              }}
            />
          ))}
        </div>
      )}

      <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-slate-900">
            Serviços avulsos
          </h2>
          <button
            type="button"
            onClick={() =>
              feedback('', 'Cadastro de serviço disponível em breve.')
            }
            className="text-sm font-medium text-marca hover:underline"
          >
            + Novo serviço
          </button>
        </div>
        {services.length === 0 ? (
          <p className="mt-4 text-sm text-slate-400">
            Nenhum serviço avulso cadastrado.
          </p>
        ) : (
          <ul className="mt-2 divide-y divide-slate-100">
            {services.map((item) => (
              <li
                key={item.id}
                className="grid grid-cols-[1fr_auto_auto] items-center gap-4 py-3.5 text-sm"
              >
                <span className="font-medium text-slate-800">{item.nome}</span>
                <span className="text-slate-400">{item.duracaoMin} min</span>
                <span className="min-w-[110px] text-right font-semibold text-slate-800">
                  {item.preco}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {open && (
        <PlanForm
          open={open}
          bank={banco}
          plan={current}
          fixedVetId={veterinarianId}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  )
}

function PlanCard({
  plan,
  subscribers,
  onEdit,
  onToggle,
}: {
  plan: Plano
  subscribers: number
  onEdit: () => void
  onToggle: () => void
}) {
  return (
    <article
      className={cx(
        'relative flex flex-col rounded-3xl border bg-white p-5 shadow-sm',
        plan.destaque ? 'border-marca ring-1 ring-marca' : 'border-slate-100',
      )}
    >
      {plan.destaque && (
        <span className="absolute -top-2.5 left-4 rounded-full bg-marca px-2.5 py-0.5 text-[11px] font-semibold text-white">
          Mais vendido
        </span>
      )}
      <h3 className="text-lg font-semibold text-slate-900">{plan.nome}</h3>
      <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
        {moeda(plan.precoMensal)}
        <span className="text-sm font-normal text-slate-400">/mês</span>
      </p>

      <ul className="mt-4 flex-1 space-y-2">
        {plan.servicos.slice(0, 5).map((service) => (
          <li
            key={service.nome}
            className={cx(
              'flex items-start gap-2 text-sm',
              service.incluso
                ? 'text-slate-700'
                : 'text-slate-300 line-through',
            )}
          >
            <span
              className={cx(
                'mt-0.5',
                service.incluso ? 'text-emerald-500' : 'text-slate-300',
              )}
            >
              {service.incluso ? '✓' : '–'}
            </span>
            <span>{service.nome}</span>
          </li>
        ))}
      </ul>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <p className="text-xs text-slate-400">
          {subscribers} {subscribers === 1 ? 'assinante' : 'assinantes'}
        </p>
        <button
          type="button"
          role="switch"
          aria-checked={plan.ativo}
          onClick={onToggle}
          className="flex items-center gap-2 text-xs font-medium text-slate-500"
        >
          {plan.ativo ? 'Ativo' : 'Inativo'}
          <span
            className={cx(
              'relative h-5 w-9 rounded-full transition',
              plan.ativo ? 'bg-marca' : 'bg-slate-200',
            )}
          >
            <span
              className={cx(
                'absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition',
                plan.ativo && 'translate-x-4',
              )}
            />
          </span>
        </button>
      </div>

      <button
        type="button"
        onClick={onEdit}
        className="mt-3 w-full rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:border-slate-300"
      >
        ✎ Editar plano
      </button>
    </article>
  )
}
