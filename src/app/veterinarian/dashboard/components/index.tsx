'use client'

import { ResponsiveBar } from '@nivo/bar'
import { ResponsiveLine } from '@nivo/line'
import { ResponsivePie } from '@nivo/pie'
import { useMemo, useState, type ReactNode } from 'react'

import { cx, moeda } from '@/core/functions/format'
import { feedback } from '@/core/functions/feedback'
import { useUsuario } from '@/core/hooks/use-session'

import { buildFinance, receiptLabel, receiptTone } from '../utils/functions'

const BRAND = '#7434d6'
const BRAND_SOFT = '#c4a6f2'

export function Dashboard() {
  const { banco, usuario } = useUsuario()
  const veterinarianId = usuario?.veterinarioId ?? ''
  const finance = useMemo(
    () => buildFinance(banco, veterinarianId),
    [banco, veterinarianId],
  )
  const [showAll, setShowAll] = useState(false)
  const receipts = showAll ? finance.receipts : finance.receipts.slice(0, 6)

  const lineData = [
    {
      id: 'Receita total',
      data: finance.monthly.map((item) => ({
        x: item.mes,
        y: item.Planos + item.Avulsos,
      })),
    },
  ]

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
            Financeiro
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Receitas de planos e atendimentos avulsos.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700"
          >
            {finance.monthLabel} ›
          </button>
          <button
            type="button"
            onClick={() =>
              feedback('', 'Exportação disponível no protótipo em breve.')
            }
            className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:border-slate-300"
          >
            ↓ Exportar
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Metric
          label="Receita do mês"
          value={moeda(finance.receitaMes)}
          detail={
            <span className="text-emerald-600">
              +{finance.crescimento}% sobre o mês anterior
            </span>
          }
        />
        <Metric
          label="Recorrente (planos)"
          value={moeda(finance.recorrente)}
          detail={`${finance.assinaturas} assinaturas`}
        />
        <Metric
          label="Avulsos"
          value={moeda(finance.avulsos)}
          detail={`${finance.atendimentosAvulsos} atendimentos`}
        />
        <Metric
          label="Inadimplência"
          value={moeda(finance.inadimplencia)}
          detail={
            <span className="text-rose-600">
              {finance.clientesAtrasados} clientes
            </span>
          }
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-slate-900">
              Recebimentos
            </h2>
            <button
              type="button"
              onClick={() => setShowAll((value) => !value)}
              className="text-sm font-medium text-marca hover:underline"
            >
              {showAll ? 'Ver menos' : 'Ver todos'}
            </button>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs tracking-wide text-slate-400 uppercase">
                  <th className="pb-3 font-medium">Cliente</th>
                  <th className="pb-3 font-medium">Vencimento</th>
                  <th className="pb-3 font-medium">Valor</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {receipts.map((row) => (
                  <tr key={row.id} className="border-b border-slate-50">
                    <td className="py-3.5 pr-3">
                      <p className="font-semibold text-slate-800">
                        {row.cliente}
                      </p>
                      <p className="text-xs text-slate-400">{row.detalhe}</p>
                    </td>
                    <td className="py-3.5 pr-3 text-slate-600">
                      {row.vencimento}
                    </td>
                    <td className="py-3.5 pr-3 font-medium text-slate-800">
                      {moeda(row.valor)}
                    </td>
                    <td className="py-3.5">
                      <span
                        className={cx(
                          'rounded-full px-2.5 py-1 text-xs font-medium',
                          receiptTone(row.status),
                        )}
                      >
                        {receiptLabel(row.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="space-y-4">
          <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">
              Receita por mês
            </h2>
            <div className="mt-2 h-56">
              <ResponsiveBar
                data={finance.monthly}
                keys={['Planos', 'Avulsos']}
                indexBy="mes"
                margin={{ top: 16, right: 16, bottom: 40, left: 48 }}
                padding={0.45}
                groupMode="stacked"
                colors={[BRAND, BRAND_SOFT]}
                borderRadius={6}
                enableLabel={false}
                axisBottom={{ tickSize: 0, tickPadding: 8 }}
                axisLeft={{
                  tickSize: 0,
                  tickPadding: 8,
                  format: (value) => `R$ ${Math.round(Number(value) / 1000)}k`,
                }}
                theme={{
                  axis: { ticks: { text: { fill: '#94a3b8', fontSize: 11 } } },
                  grid: { line: { stroke: '#f1f5f9' } },
                }}
                legends={[
                  {
                    dataFrom: 'keys',
                    anchor: 'bottom',
                    direction: 'row',
                    translateY: 36,
                    itemWidth: 80,
                    itemHeight: 14,
                    symbolSize: 10,
                    symbolShape: 'circle',
                  },
                ]}
              />
            </div>
          </section>

          <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">
              Por cidade
            </h2>
            <ul className="mt-3 divide-y divide-slate-100">
              {finance.byCity.map((city) => (
                <li
                  key={city.id}
                  className="flex items-center justify-between py-3 text-sm"
                >
                  <span className="font-medium text-slate-800">
                    {city.label}
                  </span>
                  <span className="font-semibold text-slate-900">
                    {moeda(city.value)}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm lg:col-span-2">
          <h2 className="text-base font-semibold text-slate-900">
            Evolução da receita
          </h2>
          <div className="mt-2 h-64">
            <ResponsiveLine
              data={lineData}
              margin={{ top: 20, right: 24, bottom: 40, left: 52 }}
              xScale={{ type: 'point' }}
              yScale={{ type: 'linear', min: 0, max: 'auto' }}
              curve="monotoneX"
              colors={[BRAND]}
              lineWidth={3}
              enableArea
              areaOpacity={0.12}
              pointSize={8}
              pointColor="#fff"
              pointBorderWidth={2}
              pointBorderColor={BRAND}
              axisBottom={{ tickSize: 0, tickPadding: 10 }}
              axisLeft={{
                tickSize: 0,
                tickPadding: 8,
                format: (value) => `R$ ${Math.round(Number(value) / 1000)}k`,
              }}
              enableGridX={false}
              theme={{
                axis: { ticks: { text: { fill: '#94a3b8', fontSize: 11 } } },
                grid: { line: { stroke: '#f1f5f9' } },
              }}
              useMesh
            />
          </div>
        </section>

        <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">
            Status dos recebimentos
          </h2>
          <div className="mt-2 h-64">
            <ResponsivePie
              data={finance.statusMix}
              margin={{ top: 20, right: 20, bottom: 40, left: 20 }}
              innerRadius={0.62}
              padAngle={2}
              cornerRadius={4}
              colors={[BRAND, '#94a3b8', '#f59e0b']}
              enableArcLinkLabels={false}
              arcLabelsSkipAngle={12}
              arcLabelsTextColor="#fff"
              legends={[
                {
                  anchor: 'bottom',
                  direction: 'row',
                  translateY: 28,
                  itemWidth: 80,
                  itemHeight: 14,
                  symbolSize: 10,
                  symbolShape: 'circle',
                },
              ]}
            />
          </div>
        </section>
      </div>

      {finance.byPlan.length > 0 && (
        <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">
            MRR por plano
          </h2>
          <div className="mt-2 h-56">
            <ResponsiveBar
              data={finance.byPlan}
              keys={['value']}
              indexBy="label"
              margin={{ top: 16, right: 16, bottom: 48, left: 56 }}
              padding={0.4}
              colors={[BRAND]}
              borderRadius={8}
              enableLabel={false}
              axisBottom={{ tickSize: 0, tickPadding: 8, tickRotation: -15 }}
              axisLeft={{
                tickSize: 0,
                tickPadding: 8,
                format: (value) => moeda(Number(value)),
              }}
              theme={{
                axis: { ticks: { text: { fill: '#94a3b8', fontSize: 11 } } },
                grid: { line: { stroke: '#f1f5f9' } },
              }}
            />
          </div>
        </section>
      )}
    </div>
  )
}

function Metric({
  label,
  value,
  detail,
}: {
  label: string
  value: string
  detail: ReactNode
}) {
  return (
    <article className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
        {value}
      </p>
      <p className="mt-1 text-xs text-slate-400">{detail}</p>
    </article>
  )
}
