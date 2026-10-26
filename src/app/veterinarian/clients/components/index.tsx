'use client'

import { Stack } from '@mantine/core'

import { EmptyState } from '@/core/components/empty-state'
import { Screen } from '@/core/components/screen'
import { useUsuario } from '@/core/hooks/use-session'

import { CardClient } from './card-client'

export function Clients() {
  const { banco, usuario } = useUsuario()
  const appointments = banco.consultas.filter(
    (item) => item.veterinarioId === usuario?.veterinarioId && item.status !== 'cancelada',
  )
  const tutorIds = [...new Set(appointments.map((item) => item.tutorId))]

  return (
    <Screen title="Carteira de clientes" description="Tutores e pets que você atendeu.">
      {tutorIds.length === 0 ? (
        <EmptyState text="Nenhum cliente atendido ainda." />
      ) : (
        <Stack gap="sm">
          {tutorIds.map((tutorId) => {
            const tutor = banco.tutores.find((item) => item.id === tutorId)
            const petIds = [
              ...new Set(
                appointments.filter((item) => item.tutorId === tutorId).map((item) => item.petId),
              ),
            ]
            return (
              <CardClient
                key={tutorId}
                name={tutor?.nome ?? 'Tutor'}
                email={tutor?.email}
                pets={petIds.map((petId) => {
                  const pet = banco.pets.find((item) => item.id === petId)
                  const planId = banco.assinaturas.find(
                    (item) => item.petId === petId && item.status === 'ativa',
                  )?.planoId
                  const plan = banco.planos.find((item) => item.id === planId)
                  return `${pet?.nome} · ${pet?.especie} · ${pet?.raca}${plan ? ` · ${plan.nome}` : ''}`
                })}
              />
            )
          })}
        </Stack>
      )}
    </Screen>
  )
}
