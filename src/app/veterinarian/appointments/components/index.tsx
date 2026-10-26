'use client'

import { Stack } from '@mantine/core'

import { EmptyState } from '@/core/components/empty-state'
import { Screen } from '@/core/components/screen'
import { useUsuario } from '@/core/hooks/use-session'
import { consultaAtiva } from '@/service/mock/rules'

import { CardCare } from './card-care'

export function Appointments() {
  const { banco, usuario } = useUsuario()
  const items = banco.consultas
    .filter((item) => item.veterinarioId === usuario?.veterinarioId)
    .filter((item) => consultaAtiva(item.status))
    .sort((a, b) => a.dataHora.localeCompare(b.dataHora))

  return (
    <Screen
      title="Atendimentos"
      description="Abra a consulta para conversar com a IA e registrar prontuário, receita e vacina."
    >
      {items.length === 0 ? (
        <EmptyState text="Nenhuma consulta em aberto." />
      ) : (
        <Stack gap="sm">
          {items.map((item) => (
            <CardCare
              key={item.id}
              id={item.id}
              petName={banco.pets.find((pet) => pet.id === item.petId)?.nome}
              tutorName={banco.tutores.find((tutor) => tutor.id === item.tutorId)?.nome}
              when={item.dataHora}
              reason={item.motivo}
              status={item.status}
            />
          ))}
        </Stack>
      )}
    </Screen>
  )
}
