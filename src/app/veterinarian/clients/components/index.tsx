'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

import { cx, moeda, telefone } from '@/core/functions/format'
import { feedback } from '@/core/functions/feedback'
import { useUsuario } from '@/core/hooks/use-session'

import {
  type ClientFilter,
  type ClientRow,
  buildClientRows,
  filterClients,
  initials,
  lastVisitLabel,
  matchSearch,
  paymentUi,
  petSummary,
  petTone,
  sinceLabel,
} from '../utils/functions'

const FILTERS: Array<{ id: ClientFilter; label: string }> = [
  { id: 'all', label: 'Todos' },
  { id: 'with_plan', label: 'Com plano' },
  { id: 'no_plan', label: 'Sem plano' },
  { id: 'late', label: 'Mensalidade atrasada' },
  { id: 'vaccine', label: 'Vacina vencendo' },
]

export function Clients() {
  const router = useRouter()
  const { banco, usuario } = useUsuario()
  const veterinarianId = usuario?.veterinarioId ?? ''
  const rows = useMemo(
    () => buildClientRows(banco, veterinarianId),
    [banco, veterinarianId],
  )
  const [filter, setFilter] = useState<ClientFilter>('all')
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState(rows[0]?.tutor.id)

  const visible = useMemo(
    () => filterClients(rows, filter).filter((row) => matchSearch(row, search)),
    [rows, filter, search],
  )

  const selected =
    visible.find((row) => row.tutor.id === selectedId) ?? visible[0]

  const petCount = rows.reduce((sum, row) => sum + row.pets.length, 0)

  return (
    <div
      className="space-y-4"
      style={{ animation: 'tt-surgir 0.6s ease both' }}
    >
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-marca uppercase">
            Veterinário
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
            Clientes e pets
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {rows.length} {rows.length === 1 ? 'tutor' : 'tutores'} e {petCount}{' '}
            {petCount === 1 ? 'pet' : 'pets'} na sua carteira.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() =>
              feedback('', 'Exportação disponível no protótipo em breve.')
            }
            className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:border-slate-300"
          >
            ↓ Exportar
          </button>
          <button
            type="button"
            onClick={() =>
              feedback('', 'Cadastro de cliente disponível em breve.')
            }
            className="rounded-full bg-marca px-4 py-2.5 text-sm font-medium text-white hover:bg-marca-forte"
          >
            + Novo cliente
          </button>
        </div>
      </header>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <section className="min-w-0 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
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
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar tutor ou pet"
              className="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm outline-none focus:border-marca lg:max-w-xs"
            />
          </div>

          {visible.length === 0 ? (
            <p className="py-12 text-center text-sm text-slate-400">
              Nenhum cliente neste filtro.
            </p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-xs tracking-wide text-slate-400 uppercase">
                    <th className="pb-3 font-medium">Tutor</th>
                    <th className="pb-3 font-medium">Pets</th>
                    <th className="pb-3 font-medium">Plano</th>
                    <th className="pb-3 font-medium">Cidade</th>
                    <th className="pb-3 font-medium">Última visita</th>
                    <th className="pb-3 font-medium">Pagamento</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((row) => {
                    const payment = paymentUi(row.payment)
                    const active = selected?.tutor.id === row.tutor.id
                    return (
                      <tr
                        key={row.tutor.id}
                        onClick={() => setSelectedId(row.tutor.id)}
                        className={cx(
                          'cursor-pointer border-b border-slate-50 transition',
                          active ? 'bg-[#faf7ff]' : 'hover:bg-slate-50',
                        )}
                      >
                        <td className="py-3.5 pr-3">
                          <p className="font-semibold text-slate-800">
                            {row.tutor.nome}
                          </p>
                          <p className="text-xs text-slate-400">
                            {telefone(row.tutor.telefone)}
                          </p>
                        </td>
                        <td className="py-3.5 pr-3">
                          <div className="flex -space-x-1">
                            {row.pets.map((pet, index) => (
                              <span
                                key={pet.id}
                                title={pet.nome}
                                className={cx(
                                  'inline-flex h-8 w-8 items-center justify-center rounded-lg text-[10px] font-bold ring-2 ring-white',
                                  petTone(index),
                                )}
                              >
                                {initials(pet.nome)}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3.5 pr-3 text-slate-600">
                          {row.planName}
                        </td>
                        <td className="py-3.5 pr-3 text-slate-600">
                          {row.cityName}
                        </td>
                        <td className="py-3.5 pr-3 text-slate-600">
                          {lastVisitLabel(row.lastVisit)}
                        </td>
                        <td className="py-3.5">
                          <span
                            className={cx(
                              'rounded-full px-2.5 py-1 text-xs font-medium',
                              payment.tone,
                            )}
                          >
                            {payment.label}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {selected ? (
          <ClientDetail
            row={selected}
            bank={banco}
            onRecords={() => router.push('/veterinarian/appointments')}
            onSchedule={() => router.push('/veterinarian/schedule')}
          />
        ) : (
          <aside className="rounded-3xl border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-400 shadow-sm">
            Selecione um cliente para ver os detalhes.
          </aside>
        )}
      </div>
    </div>
  )
}

function ClientDetail({
  row,
  bank,
  onRecords,
  onSchedule,
}: {
  row: ClientRow
  bank: ReturnType<typeof useUsuario>['banco']
  onRecords: () => void
  onSchedule: () => void
}) {
  const month = new Date()
    .toLocaleDateString('pt-BR', { month: 'long' })
    .toLowerCase()
  const limit = row.planVisits ?? 0

  return (
    <aside className="h-fit rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-xl font-semibold text-slate-900">
          {row.tutor.nome}
        </h2>
        <button
          type="button"
          onClick={() => feedback('', 'Edição de cliente em breve.')}
          className="text-sm font-medium text-marca hover:underline"
        >
          Editar
        </button>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
        <div>
          <dt className="text-xs text-slate-400">Telefone</dt>
          <dd className="font-medium text-slate-800">
            {telefone(row.tutor.telefone)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-slate-400">Cidade</dt>
          <dd className="font-medium text-slate-800">{row.cityName}</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-xs text-slate-400">Endereço</dt>
          <dd className="font-medium text-slate-800">
            {row.tutor.endereco ?? '—'}
          </dd>
        </div>
        <div className="col-span-2">
          <dt className="text-xs text-slate-400">Cliente desde</dt>
          <dd className="font-medium text-slate-800">
            {sinceLabel(row.since)}
          </dd>
        </div>
      </dl>

      <div className="mt-5">
        <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
          Pets
        </p>
        <ul className="mt-2 space-y-3">
          {row.pets.map((pet, index) => (
            <li key={pet.id} className="flex items-start gap-3">
              <span
                className={cx(
                  'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold',
                  petTone(index),
                )}
              >
                {initials(pet.nome)}
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  {pet.nome}
                </p>
                <p className="text-xs text-slate-400">
                  {petSummary(bank, pet)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5 rounded-2xl bg-slate-50 p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-slate-800">{row.planName}</p>
          {row.planPrice != null && (
            <p className="text-sm font-semibold text-marca">
              {moeda(row.planPrice)}/mês
            </p>
          )}
        </div>
        {row.payment !== 'avulso' && limit > 0 && (
          <>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-marca"
                style={{
                  width: `${Math.min(100, (row.visitsUsed / limit) * 100)}%`,
                }}
              />
            </div>
            <p className="mt-2 text-xs text-slate-500">
              {row.visitsUsed} de {limit} visitas usadas em {month}
            </p>
          </>
        )}
        {row.payment === 'avulso' && (
          <p className="mt-2 text-xs text-slate-500">
            Atendimentos avulsos, sem assinatura ativa.
          </p>
        )}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={onRecords}
          className="rounded-full border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 hover:border-slate-300"
        >
          Prontuários
        </button>
        <button
          type="button"
          onClick={onSchedule}
          className="rounded-full bg-marca px-3 py-2.5 text-sm font-medium text-white hover:bg-marca-forte"
        >
          Agendar
        </button>
      </div>
    </aside>
  )
}
