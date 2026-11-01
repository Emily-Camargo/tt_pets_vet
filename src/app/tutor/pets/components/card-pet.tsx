'use client'

import { Badge, Button, Group, Text, Title } from '@mantine/core'
import Link from 'next/link'

import type { Consulta, Pet, Vacina } from '@/core/interfaces/types'

import {
  ageLabel,
  lastVisitLabel,
  neuteredLabel,
  nextAppointmentBadge,
  petEmoji,
  vaccineBadge,
} from '../utils/functions'

export function CardPet({
  pet,
  vaccines,
  appointments,
  onEdit,
}: {
  pet: Pet
  vaccines: Vacina[]
  appointments: Consulta[]
  onEdit: () => void
}) {
  const vaccine = vaccineBadge(vaccines)
  const visit = nextAppointmentBadge(appointments)

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-4">
          <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full bg-[#f6f1fc] text-3xl">
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
            <Title order={3}>{pet.nome}</Title>
            <Text size="sm" c="dimmed" mt={4}>
              {pet.especie} · {pet.raca} · {pet.sexo} · {neuteredLabel(pet)}
            </Text>
            <Group gap="xs" mt={12}>
              <Badge className={vaccine.tone} variant="light" radius="xl">
                {vaccine.label}
              </Badge>
              <Badge className={visit.tone} variant="light" radius="xl">
                {visit.label}
              </Badge>
            </Group>
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 sm:grid-cols-4">
        <Stat label="Idade" value={ageLabel(pet.nascimento)} />
        <Stat label="Peso" value={`${pet.peso} kg`} />
        <Stat label="Microchip" value={pet.microchip ?? 'Não informado'} />
        <Stat label="Última consulta" value={lastVisitLabel(appointments)} />
      </div>

      <Group gap="sm" mt={20}>
        <Button
          component={Link}
          href="/tutor/appointments"
          radius="xl"
          color="#7434d6"
        >
          Agendar consulta
        </Button>
        <Button
          component={Link}
          href="/tutor/vaccines"
          radius="xl"
          variant="default"
        >
          Carteira de vacinação
        </Button>
        <Button
          component={Link}
          href="/tutor/history"
          radius="xl"
          variant="default"
        >
          Histórico e receitas
        </Button>
        <Button radius="xl" variant="default" onClick={onEdit}>
          Editar
        </Button>
      </Group>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <Text
        size="xs"
        fw={600}
        tt="uppercase"
        c="dimmed"
        style={{ letterSpacing: '0.05em' }}
      >
        {label}
      </Text>
      <Text size="sm" fw={600} mt={4}>
        {value}
      </Text>
    </div>
  )
}
