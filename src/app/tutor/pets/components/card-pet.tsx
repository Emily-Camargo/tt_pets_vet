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
    <div className="flex h-full flex-col rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex gap-3">
        <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-full bg-[#f6f1fc] text-2xl">
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
        <div className="min-w-0">
          <Title order={4} fw={600} c="#475569">
            {pet.nome}
          </Title>
          <Text size="sm" c="#94a3b8" mt={2}>
            {pet.especie} · {pet.raca} · {pet.sexo} · {neuteredLabel(pet)}
          </Text>
          <Group gap="xs" mt={10}>
            <Badge className={vaccine.tone} variant="light" radius="xl" size="sm">
              {vaccine.label}
            </Badge>
            <Badge className={visit.tone} variant="light" radius="xl" size="sm">
              {visit.label}
            </Badge>
          </Group>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
        <Stat label="Idade" value={ageLabel(pet.nascimento)} />
        <Stat label="Peso" value={`${pet.peso} kg`} />
        <Stat label="Microchip" value={pet.microchip ?? 'Não informado'} />
        <Stat label="Última consulta" value={lastVisitLabel(appointments)} />
      </div>

      <Group gap="xs" mt="auto" pt={20} grow preventGrowOverflow={false}>
        <Button
          component={Link}
          href="/tutor/appointments"
          radius="xl"
          size="compact-sm"
          variant="gradient"
          gradient={{ from: '#7434d6', to: '#ec4899', deg: 135 }}
        >
          Agendar
        </Button>
        <Button
          component={Link}
          href="/tutor/vaccines"
          radius="xl"
          size="compact-sm"
          variant="light"
          color="violet"
        >
          Vacinas
        </Button>
        <Button
          component={Link}
          href="/tutor/history"
          radius="xl"
          size="compact-sm"
          variant="light"
          color="gray"
        >
          Histórico
        </Button>
        <Button
          radius="xl"
          size="compact-sm"
          variant="default"
          onClick={onEdit}
        >
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
        fw={500}
        tt="uppercase"
        c="#94a3b8"
        style={{ letterSpacing: '0.05em' }}
      >
        {label}
      </Text>
      <Text size="sm" fw={600} c="#475569" mt={4} lineClamp={1}>
        {value}
      </Text>
    </div>
  )
}
