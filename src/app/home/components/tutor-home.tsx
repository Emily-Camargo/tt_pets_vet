'use client'

import { Text } from '@mantine/core'
import Link from 'next/link'

import { cx, dataHora, hora, rotuloStatus } from '@/core/functions/format'
import type { Banco, Usuario, Vacina } from '@/core/interfaces/types'
import { consultaAtiva } from '@/service/mock/rules'

import { Hero, HomeFrame, Panel, PanelHead } from './frame'
import { ageLabel, daysUntil, firstName, inDays } from '../utils/functions'

export function TutorHome({ bank, user }: { bank: Banco; user: Usuario }) {
  const tutorId = user.tutorId ?? ''
  const pets = bank.pets.filter((item) => item.tutorId === tutorId)
  const appointments = bank.consultas
    .filter((item) => item.tutorId === tutorId && consultaAtiva(item.status))
    .sort((a, b) => a.dataHora.localeCompare(b.dataHora))
  const next = appointments[0]
  const nextPet = bank.pets.find((item) => item.id === next?.petId)
  const vaccines = bank.vacinas
    .filter(
      (item) => pets.some((pet) => pet.id === item.petId) && item.proximaDose,
    )
    .map((item) => ({ ...item, days: daysUntil(item.proximaDose!) }))
    .filter((item) => item.days <= 30)
    .sort((a, b) => a.days - b.days)
  const subscriptions = bank.assinaturas.filter(
    (item) => item.tutorId === tutorId && item.status === 'ativa',
  )
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
        item.days <= 0 ? 'Vence hoje' : `Vence ${inDays(item.proximaDose!)}`,
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

      <div className="grid gap-3 lg:grid-cols-2">
        <Panel>
          <PanelHead title="Meus pets" href="/tutor/pets" action="Ver todos" />
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {pets.slice(0, 2).map((pet) => {
              const vaccine = bank.vacinas
                .filter((item) => item.petId === pet.id && item.proximaDose)
                .sort((a, b) => b.proximaDose!.localeCompare(a.proximaDose!))[0]
              const days = vaccine?.proximaDose
                ? daysUntil(vaccine.proximaDose)
                : null
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
                  <Text size="sm" fw={600} c="#475569" mt="sm">
                    {pet.nome}
                  </Text>
                  <Text size="xs" c="#94a3b8">
                    {pet.raca} · {ageLabel(pet.nascimento)} · {pet.peso} kg
                  </Text>
                  <PetBadge vaccine={vaccine} days={days} />
                </Link>
              )
            })}
            <Link
              href="/tutor/pets"
              className="grid place-items-center rounded-2xl border border-dashed border-marca-borda bg-[#faf7ff] px-3 py-6 text-center transition hover:bg-marca-clara"
            >
              <Text size="xl" c="#7434d6" lh={1}>
                +
              </Text>
              <Text size="sm" fw={500} c="#7434d6" mt={6}>
                Adicionar pet
              </Text>
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
            <Text size="sm" c="#94a3b8" mt="md">
              Nada marcado por enquanto.
            </Text>
          ) : (
            <div className="mt-3 divide-y divide-slate-100">
              {care.map((item) => {
                const stamp = dateStamp(item.when)
                return (
                  <div key={item.id} className="flex items-center gap-3 py-3">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-marca-clara text-center leading-tight">
                      <Text size="xs" fw={600} c="#7434d6" tt="uppercase">
                        {stamp.month}
                      </Text>
                      <Text size="sm" fw={600} c="#475569">
                        {stamp.day}
                      </Text>
                    </div>
                    <div className="min-w-0">
                      <Text size="sm" fw={600} c="#475569">
                        {item.title}
                      </Text>
                      <Text size="xs" c="#94a3b8">
                        {item.detail}
                      </Text>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </Panel>
      </div>
    </HomeFrame>
  )
}

function PetBadge({
  vaccine,
  days,
}: {
  vaccine?: Vacina
  days: number | null
}) {
  if (vaccine?.proximaDose && days !== null && days <= 20) {
    return (
      <Text
        component="span"
        size="xs"
        fw={500}
        c="#b45309"
        mt="sm"
        className="inline-block rounded-full bg-amber-50 px-2 py-0.5"
      >
        {vaccine.nome} vence {inDays(vaccine.proximaDose)}
      </Text>
    )
  }
  if (!vaccine) return null
  return (
    <Text
      component="span"
      size="xs"
      fw={500}
      c="#047857"
      mt="sm"
      className="inline-block rounded-full bg-emerald-50 px-2 py-0.5"
    >
      Vacinas em dia
    </Text>
  )
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
