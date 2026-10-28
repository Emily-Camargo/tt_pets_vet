'use client'

import {
  CheckCircleOutlined,
  HourglassEmpty,
  Vaccines as VaccineIcon,
  WarningAmber,
} from '@mui/icons-material'
import { useMemo, useState } from 'react'

import { Metric } from '@/app/home/components/frame'
import { ageLabel, petEmoji } from '@/app/tutor/pets/utils/functions'
import { cx, dataCurta } from '@/core/functions/format'
import { feedback } from '@/core/functions/feedback'
import { useUsuario } from '@/core/hooks/use-session'

import { VaccineForm } from './vaccine-form'
import {
  appliedCount,
  dateStamp,
  dueInDays,
  formatChip,
  nextDoseSummary,
  overdueCount,
  protocolCoverage,
  remainingLabel,
  statusLabel,
  statusTone,
  upcomingDoses,
  vaccineStatus,
} from '../utils/functions'

export function Vaccines() {
  const { banco, usuario } = useUsuario()
  const tutorId = usuario?.tutorId ?? ''
  const tutor = banco.tutores.find((item) => item.id === tutorId)
  const pets = banco.pets.filter((item) => item.tutorId === tutorId)
  const [petId, setPetId] = useState(pets[0]?.id ?? '')
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState('Todas')

  const pet = pets.find((item) => item.id === petId)
  const vaccines = banco.vacinas.filter((item) => item.petId === petId)
  const nextDose = nextDoseSummary(vaccines)
  const coverage = protocolCoverage(vaccines)
  const upcoming = upcomingDoses(vaccines).slice(0, 4)
  const cityName =
    banco.cidades.find(
      (item) =>
        item.id ===
        banco.assinaturas.find(
          (sub) => sub.petId === petId && sub.status === 'ativa',
        )?.cidadeId,
    )?.nome ?? 'Passo Fundo'

  const rows = useMemo(() => {
    return vaccines.filter((item) => {
      if (filter === 'Todas') return true
      return statusLabel(vaccineStatus(item)) === filter
    })
  }, [vaccines, filter])

  if (!pet) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500">
        Cadastre um pet para ver a carteira de vacinação.
      </div>
    )
  }

  return (
    <div
      className="space-y-4"
      style={{ animation: 'tt-surgir 0.6s ease both' }}
    >
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-marca uppercase">
            Tutor
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
            Carteira de vacinação
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Doses aplicadas, próximas doses e lembretes de cada pet.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() =>
              feedback('', 'PDF disponível no protótipo em breve.')
            }
            className="rounded-full border border-marca bg-white px-4 py-2.5 text-sm font-medium text-marca hover:bg-marca-clara"
          >
            ↓ Baixar PDF
          </button>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-full bg-marca px-4 py-2.5 text-sm font-medium text-white hover:bg-marca-forte"
          >
            + Agendar vacina
          </button>
        </div>
      </header>

      <div className="flex flex-wrap gap-2">
        {pets.map((item) => {
          const alert = dueInDays(
            banco.vacinas.filter((vaccine) => vaccine.petId === item.id),
            30,
          )
          const active = item.id === petId
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setPetId(item.id)}
              className={cx(
                'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition',
                active
                  ? 'border-marca bg-[#f6f1fc] text-marca'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300',
              )}
            >
              <span>{petEmoji(item.especie)}</span>
              {item.nome}
              {alert > 0 && (
                <span className="grid h-5 min-w-5 place-items-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-white">
                  {alert}
                </span>
              )}
            </button>
          )
        })}
      </div>

      <section className="rounded-3xl bg-linear-to-r from-[#7434d6] to-[#8b5cf6] px-5 py-5 text-white sm:px-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center overflow-hidden rounded-full bg-white/15 text-3xl">
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
              <p className="text-[11px] font-semibold tracking-[0.16em] text-white/80 uppercase">
                Carteira de vacinação
              </p>
              <h2 className="mt-1 text-2xl font-semibold">{pet.nome}</h2>
              <p className="mt-1 text-sm text-white/85">
                {pet.raca} · {pet.sexo} · {ageLabel(pet.nascimento)} ·{' '}
                {pet.peso} kg · {formatChip(pet.microchip)}
              </p>
            </div>
          </div>
          <div className="text-sm text-white/90 lg:text-right">
            <p>Tutora {tutor?.nome ?? usuario?.nome}</p>
            <p className="text-white/75">Clínica TT Pets · {cityName}</p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Metric
          icon={<CheckCircleOutlined sx={{ fontSize: 18 }} />}
          tone="bg-emerald-50 text-emerald-600"
          label="Doses aplicadas"
          value={String(appliedCount(vaccines))}
          detail="registradas na carteira"
        />
        <Metric
          icon={<VaccineIcon sx={{ fontSize: 18 }} />}
          tone="bg-sky-50 text-sky-600"
          label="Próxima dose"
          value={nextDose.value}
          detail={nextDose.detail}
        />
        <Metric
          icon={<HourglassEmpty sx={{ fontSize: 18 }} />}
          tone="bg-amber-50 text-amber-600"
          label="A vencer em 30 dias"
          value={String(dueInDays(vaccines, 30))}
          detail="reforços próximos"
        />
        <Metric
          icon={<WarningAmber sx={{ fontSize: 18 }} />}
          tone="bg-rose-50 text-rose-500"
          label="Atrasadas"
          value={String(overdueCount(vaccines))}
          detail="precisam de atenção"
        />
      </div>

      <div className="grid w-full gap-4 lg:gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-semibold text-slate-900">
              Histórico de vacinas
            </h3>
            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              className="rounded-full border border-slate-200 px-3 py-1.5 text-sm outline-none"
            >
              <option>Todas</option>
              <option>Em dia</option>
              <option>Concluída</option>
              <option>Recomendada</option>
              <option>Atrasada</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs tracking-wide text-slate-400 uppercase">
                  <th className="py-3 pr-3 font-semibold">Vacina</th>
                  <th className="py-3 pr-3 font-semibold">Dose</th>
                  <th className="py-3 pr-3 font-semibold">Aplicada em</th>
                  <th className="py-3 pr-3 font-semibold">Próxima</th>
                  <th className="py-3 pr-3 font-semibold">Veterinário</th>
                  <th className="py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((item) => {
                  const status = vaccineStatus(item)
                  const vet = banco.veterinarios.find(
                    (current) => current.id === item.veterinarioId,
                  )
                  return (
                    <tr key={item.id} className="border-b border-slate-50">
                      <td className="py-3 pr-3">
                        <p className="font-semibold text-slate-800">
                          {item.nome}
                        </p>
                        <p className="text-xs text-slate-400">
                          {item.lote ? `Lote ${item.lote}` : 'Sem lote'}
                        </p>
                      </td>
                      <td className="py-3 pr-3 text-slate-600">
                        {item.dose ?? '—'}
                      </td>
                      <td className="py-3 pr-3 text-slate-600">
                        {item.aplicadaEm ? dataCurta(item.aplicadaEm) : '—'}
                      </td>
                      <td className="py-3 pr-3 text-slate-600">
                        {item.proximaDose ? dataCurta(item.proximaDose) : '—'}
                      </td>
                      <td className="py-3 pr-3 text-slate-600">
                        {vet?.nome ?? '—'}
                      </td>
                      <td className="py-3">
                        <span
                          className={cx(
                            'rounded-full px-2.5 py-1 text-[11px] font-medium',
                            statusTone(status),
                          )}
                        >
                          {statusLabel(status)}
                        </span>
                      </td>
                    </tr>
                  )
                })}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      Nenhuma vacina neste filtro.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <div className="space-y-4">
          <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">Próximas doses</h3>
              <span className="text-sm font-medium text-marca">Lembretes</span>
            </div>
            {upcoming.length === 0 ? (
              <p className="text-sm text-slate-400">Nenhuma dose marcada.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {upcoming.map((item) => {
                  const stamp = dateStamp(item.proximaDose!)
                  return (
                    <li key={item.id} className="flex items-center gap-3 py-3">
                      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-marca-clara text-center leading-tight">
                        <span className="text-[10px] font-semibold tracking-wide text-marca">
                          {stamp.month}
                        </span>
                        <span className="text-sm font-semibold text-slate-800">
                          {stamp.day}
                        </span>
                      </span>
                      <span>
                        <span className="block text-sm font-semibold text-slate-800">
                          {item.nome}
                        </span>
                        <span className="block text-xs text-slate-400">
                          {remainingLabel(item.days)}
                        </span>
                      </span>
                    </li>
                  )
                })}
              </ul>
            )}
          </section>

          <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
            <h3 className="font-semibold text-slate-900">
              Cobertura do protocolo
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              {coverage.covered} de {coverage.recommended} vacinas recomendadas
            </p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-marca"
                style={{ width: `${coverage.percent}%` }}
              />
            </div>
            <p className="mt-3 text-xs text-slate-400">
              Complete as doses recomendadas para manter a proteção em dia.
            </p>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="mt-4 w-full rounded-full border border-marca px-4 py-2.5 text-sm font-medium text-marca hover:bg-marca-clara"
            >
              Agendar visita para vacinar
            </button>
          </section>
        </div>
      </div>

      <p className="pt-2 text-center text-xs text-slate-400">
        Protótipo com dados de exemplo.
      </p>

      <VaccineForm
        open={open}
        petId={petId}
        tutorId={tutorId}
        onClose={() => setOpen(false)}
      />
    </div>
  )
}
