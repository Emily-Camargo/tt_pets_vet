'use client'

import {
  CalendarMonth,
  EventAvailable,
  NotificationsNone,
  Shield,
  Vaccines,
} from '@mui/icons-material'
import Link from 'next/link'

import { cx, dataHora, hora, rotuloStatus } from '@/core/functions/format'
import type { Banco, Usuario, Vacina } from '@/core/interfaces/types'
import { consultaAtiva } from '@/service/mock/rules'

import { Hero, HomeFrame, Metric, Panel, PanelHead, Shortcut } from './frame'
import {
  ageLabel,
  daysUntil,
  firstName,
  inDays,
  whenLabel,
} from '../utils/functions'

export function TutorHome({ bank, user }: { bank: Banco; user: Usuario }) {
  const tutorId = user.tutorId ?? ''
  const pets = bank.pets.filter((item) => item.tutorId === tutorId)
  const appointments = bank.consultas
    .filter((item) => item.tutorId === tutorId && consultaAtiva(item.status))
    .sort((a, b) => a.dataHora.localeCompare(b.dataHora))
  const next = appointments[0]
  const nextPet = bank.pets.find((item) => item.id === next?.petId)
  const vaccines = bank.vacinas
    .filter((item) => pets.some((pet) => pet.id === item.petId))
    .map((item) => ({ ...item, days: daysUntil(item.proximaDose) }))
    .filter((item) => item.days <= 30)
    .sort((a, b) => a.days - b.days)
  const subscriptions = bank.assinaturas.filter(
    (item) => item.tutorId === tutorId && item.status === 'ativa',
  )
  const plans = subscriptions
    .map((item) => bank.planos.find((plan) => plan.id === item.planoId))
    .filter((item) => item !== undefined)
  const plan = plans[0]
  const cities = [
    ...new Set(
      subscriptions
        .map(
          (item) =>
            bank.cidades.find((city) => city.id === item.cidadeId)?.nome,
        )
        .filter((name): name is string => Boolean(name)),
    ),
  ]
  const alerts = bank.notificacoes
    .filter((item) => item.tutorId === tutorId && !item.lida)
    .sort((a, b) => b.criadaEm.localeCompare(a.criadaEm))
  const usedVisits = plan
    ? bank.consultas.filter((item) => {
        const subscription = subscriptions.find(
          (current) => current.planoId === plan.id,
        )
        if (
          !subscription ||
          item.petId !== subscription.petId ||
          item.status === 'cancelada'
        ) {
          return false
        }
        const date = new Date(item.dataHora)
        const now = new Date()
        return (
          date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear()
        )
      }).length
    : 0
  const care = [
    ...appointments.map((item) => ({
      id: item.id,
      when: item.dataHora,
      title: `${item.motivo} · ${bank.pets.find((pet) => pet.id === item.petId)?.nome ?? 'Pet'}`,
      detail: `${hora(item.dataHora)} · ${bank.veterinarios.find((vet) => vet.id === item.veterinarioId)?.nome ?? 'Veterinário'} · ${rotuloStatus(item.status)}`,
    })),
    ...vaccines.map((item) => ({
      id: item.id,
      when: `${item.proximaDose}T12:00:00`,
      title: `Vacina ${item.nome} · ${bank.pets.find((pet) => pet.id === item.petId)?.nome ?? 'Pet'}`,
      detail:
        item.days <= 0 ? 'Vence hoje' : `Vence ${inDays(item.proximaDose)}`,
    })),
  ]
    .sort((a, b) => a.when.localeCompare(b.when))
    .slice(0, 4)

  return (
    <HomeFrame>
      <Hero
        profile="Tutor"
        name={firstName(user.nome)}
        text="Vacinas, planos e a visita do veterinário, no ritmo do seu pet."
        mascot="dog"
        chips={[
          pets.length === 1 ? '1 pet' : `${pets.length} pets`,
          next && nextPet
            ? `${nextPet.nome} · ${dataHora(next.dataHora)}`
            : 'Sem consulta marcada',
          cities.length > 0 ? cities.join(' e ') : 'Escolha um plano',
        ]}
        primary={{ href: '/tutor/appointments', label: '+ Agendar consulta' }}
        secondary={{
          href: '/tutor/vaccines',
          label: 'Ver carteira de vacinação',
        }}
      />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          icon={<CalendarMonth sx={{ fontSize: 18 }} />}
          tone="bg-marca-anel text-marca"
          label="Próxima consulta"
          value={next ? whenLabel(next.dataHora) : 'Nenhuma'}
          detail={
            next && nextPet
              ? `${nextPet.nome} · ${bank.veterinarios.find((item) => item.id === next.veterinarioId)?.nome ?? ''}`
              : 'Agende quando quiser'
          }
        />
        <Metric
          icon={<Vaccines sx={{ fontSize: 18 }} />}
          tone="bg-rose-50 text-rose-500"
          label="Vacinas a vencer"
          value={
            vaccines[0]
              ? `${vaccines.length} ${inDays(vaccines[0].proximaDose)}`
              : 'Em dia'
          }
          detail={
            vaccines[0]
              ? `${bank.pets.find((item) => item.id === vaccines[0].petId)?.nome ?? 'Pet'} · ${vaccines[0].nome}`
              : 'Nenhuma dose próxima'
          }
        />
        <Metric
          icon={<Shield sx={{ fontSize: 18 }} />}
          tone="bg-emerald-50 text-emerald-600"
          label="Plano ativo"
          value={
            plans.length > 1
              ? `${plans.length} planos`
              : (plan?.nome ?? 'Nenhum')
          }
          detail={planDetail(plan, usedVisits)}
        />
        <Metric
          icon={<NotificationsNone sx={{ fontSize: 18 }} />}
          tone="bg-amber-50 text-amber-600"
          label="Notificações"
          value={alerts.length === 1 ? '1 nova' : `${alerts.length} novas`}
          detail={
            alerts[0] ? `Última ${timeAgo(alerts[0].criadaEm)}` : 'Tudo lido'
          }
        />
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        <Panel>
          <PanelHead title="Meus pets" href="/tutor/pets" action="Ver todos" />
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {pets.slice(0, 2).map((pet) => {
              const vaccine = bank.vacinas
                .filter((item) => item.petId === pet.id)
                .sort((a, b) => b.proximaDose.localeCompare(a.proximaDose))[0]
              const days = vaccine ? daysUntil(vaccine.proximaDose) : null
              return (
                <Link
                  key={pet.id}
                  href="/tutor/pets"
                  className="rounded-2xl border border-slate-100 px-3 py-4 text-center transition hover:border-marca-borda"
                >
                  <span
                    className={cx(
                      'mx-auto grid h-14 w-14 place-items-center rounded-full text-2xl',
                      pet.especie === 'Gato' ? 'bg-amber-50' : 'bg-marca-clara',
                    )}
                  >
                    {pet.especie === 'Gato' ? '🐱' : '🐶'}
                  </span>
                  <p className="mt-3 font-semibold text-slate-800">
                    {pet.nome}
                  </p>
                  <p className="text-xs text-slate-400">
                    {pet.raca} · {ageLabel(pet.nascimento)} · {pet.peso} kg
                  </p>
                  <PetBadge vaccine={vaccine} days={days} />
                </Link>
              )
            })}
            <Link
              href="/tutor/pets"
              className="grid place-items-center rounded-2xl border border-dashed border-marca-borda px-3 py-6 text-center text-sm font-medium text-marca"
            >
              <span className="text-2xl leading-none">+</span>
              <span>Adicionar pet</span>
            </Link>
          </div>
        </Panel>
        <Panel>
          <PanelHead
            title="Próximos cuidados"
            href="/tutor/appointments"
            action="Agenda"
          />
          {care.length === 0 ? (
            <p className="mt-4 text-sm text-slate-400">
              Nada marcado por enquanto.
            </p>
          ) : (
            <ul className="mt-2 divide-y divide-slate-100">
              {care.map((item) => {
                const stamp = dateStamp(item.when)
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
                        {item.title}
                      </span>
                      <span className="block text-xs text-slate-400">
                        {item.detail}
                      </span>
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
        </Panel>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Shortcut
          href="/tutor/appointments"
          icon={<CalendarMonth sx={{ fontSize: 18 }} />}
          tone="bg-marca-anel text-marca"
          label="Agendar consulta"
        />
        <Shortcut
          href="/tutor/vaccines"
          icon={<Vaccines sx={{ fontSize: 18 }} />}
          tone="bg-rose-50 text-rose-500"
          label="Carteira de vacinação"
        />
        <Shortcut
          href="/tutor/history"
          icon={<EventAvailable sx={{ fontSize: 18 }} />}
          tone="bg-sky-50 text-sky-600"
          label="Histórico e receitas"
        />
        <Shortcut
          href="/tutor/plans"
          icon={<Shield sx={{ fontSize: 18 }} />}
          tone="bg-emerald-50 text-emerald-600"
          label="Meu plano"
        />
      </div>
    </HomeFrame>
  )
}

function planDetail(
  plan: { visitasMes: number | null } | undefined,
  usedVisits: number,
) {
  if (!plan) return 'Contrate para agendar'
  if (plan.visitasMes === null) return 'Visitas ilimitadas'
  return `${usedVisits} de ${plan.visitasMes} visitas no mês`
}

function PetBadge({
  vaccine,
  days,
}: {
  vaccine?: Vacina
  days: number | null
}) {
  if (vaccine && days !== null && days <= 20) {
    return (
      <span className="mt-3 inline-block rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">
        {vaccine.nome} vence {inDays(vaccine.proximaDose)}
      </span>
    )
  }
  if (!vaccine) return null
  return (
    <span className="mt-3 inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
      Vacinas em dia
    </span>
  )
}

function timeAgo(iso: string) {
  const minutes = Math.max(
    1,
    Math.round((Date.now() - new Date(iso).getTime()) / 60000),
  )
  if (minutes < 60) return `há ${minutes} min`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return hours === 1 ? 'há 1 hora' : `há ${hours} h`
  const days = Math.round(hours / 24)
  return days === 1 ? 'há 1 dia' : `há ${days} dias`
}

function dateStamp(iso: string) {
  const date = new Date(iso.length === 10 ? `${iso}T12:00:00` : iso)
  const month = date
    .toLocaleDateString('pt-BR', { month: 'short' })
    .replace('.', '')
    .slice(0, 3)
    .toUpperCase()
  return { month, day: String(date.getDate()).padStart(2, '0') }
}
