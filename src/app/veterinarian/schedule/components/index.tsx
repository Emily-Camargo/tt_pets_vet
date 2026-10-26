'use client'

import { Card } from '@grazziotin/react-components-next/ui'
import { Stack } from '@mantine/core'
import { useState } from 'react'

import { EmptyState } from '@/core/components/empty-state'
import { Screen } from '@/core/components/screen'
import { feedback } from '@/core/functions/feedback'
import { useUsuario } from '@/core/hooks/use-session'
import { excluirBloqueio, mudarConsulta } from '@/service/mock/actions'
import { consultaAtiva } from '@/service/mock/rules'

import { BlockForm } from './block-form'
import { CardAppointment } from './card-appointment'
import { CardBlock } from './card-block'
import { RescheduleDialog } from './reschedule-dialog'

export function Schedule() {
  const { banco, usuario } = useUsuario()
  const veterinarianId = usuario?.veterinarioId ?? ''
  const [rescheduleId, setRescheduleId] = useState<string | null>(null)
  const appointments = banco.consultas
    .filter((item) => item.veterinarioId === veterinarianId)
    .sort((a, b) => a.dataHora.localeCompare(b.dataHora))
  const blocks = banco.bloqueios.filter((item) => item.veterinarioId === veterinarianId)
  const appointment = appointments.find((item) => item.id === rescheduleId)
  const actor = {
    perfil: usuario?.perfil ?? 'veterinario',
    veterinarioId: veterinarianId,
    tutorId: usuario?.tutorId,
  } as const

  function changeStatus(id: string, status: 'confirmada' | 'cancelada', success: string) {
    feedback(
      mudarConsulta({ consultaId: id, status, ator: actor }),
      success,
    )
  }

  return (
    <Screen title="Agenda" description="Confirme, remarque, cancele e bloqueie horários.">
      <Card title="Novo bloqueio" titleColor="#7434d6" borderRadius="16px">
        <div className="p-4">
          <BlockForm veterinarianId={veterinarianId} />
          <Stack mt="md" gap="xs">
            {blocks.map((item) => {
              const vet = banco.veterinarios.find((vetItem) => vetItem.id === item.veterinarioId)
              return (
                <CardBlock
                  key={item.id}
                  vetName={vet?.nome}
                  start={item.inicio}
                  end={item.fim}
                  reason={item.motivo}
                  onRemove={() => excluirBloqueio(item.id, veterinarianId)}
                />
              )
            })}
          </Stack>
        </div>
      </Card>

      {appointments.length === 0 ? (
        <EmptyState text="Nenhuma consulta nesta agenda." />
      ) : (
        <Stack gap="sm">
          {appointments.map((item) => (
            <CardAppointment
              key={item.id}
              appointment={item}
              petName={banco.pets.find((pet) => pet.id === item.petId)?.nome}
              tutorName={banco.tutores.find((tutor) => tutor.id === item.tutorId)?.nome}
              vetName={banco.veterinarios.find((vet) => vet.id === item.veterinarioId)?.nome}
              open={consultaAtiva(item.status)}
              onConfirm={() => changeStatus(item.id, 'confirmada', 'Consulta confirmada.')}
              onReschedule={() => setRescheduleId(item.id)}
              onCancel={() => changeStatus(item.id, 'cancelada', 'Consulta cancelada.')}
            />
          ))}
        </Stack>
      )}

      <RescheduleDialog
        appointment={appointment}
        actor={actor}
        onClose={() => setRescheduleId(null)}
      />
    </Screen>
  )
}
