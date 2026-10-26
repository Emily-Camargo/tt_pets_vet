'use client'

import { Card, InputSelect } from '@grazziotin/react-components-next/ui'
import { Stack, Text } from '@mantine/core'
import { useState } from 'react'

import { EmptyState } from '@/core/components/empty-state'
import { Screen } from '@/core/components/screen'
import { dataHora } from '@/core/functions/format'
import { useUsuario } from '@/core/hooks/use-session'

export function History() {
  const { banco, usuario } = useUsuario()
  const pets = banco.pets.filter((item) => item.tutorId === (usuario?.tutorId ?? ''))
  const [petId, setPetId] = useState(pets[0]?.id ?? '')
  const appointments = banco.consultas.filter(
    (item) => item.petId === petId && item.status === 'realizada',
  )
  const selected = pets.find((item) => item.id === petId) ?? null

  return (
    <Screen title="Histórico de consultas" description="Receitas e prontuários das consultas já realizadas.">
      <InputSelect
        options={pets}
        value={selected}
        optionLabel={(pet) => pet.nome}
        onChange={(_, pet) => setPetId(pet?.id ?? '')}
        input={{ label: 'Pet' }}
      />
      {appointments.length === 0 ? (
        <EmptyState text="Nenhuma consulta realizada para este pet." />
      ) : (
        <Stack gap="md">
          {appointments.map((appointment) => {
            const vet = banco.veterinarios.find((item) => item.id === appointment.veterinarioId)
            const record = banco.prontuarios.find((item) => item.consultaId === appointment.id)
            const prescriptions = banco.receitas.filter((item) => item.consultaId === appointment.id)
            return (
              <Card key={appointment.id} title={appointment.motivo} titleColor="#7434d6" borderRadius="16px">
                <div className="space-y-3 p-4">
                  <Text size="sm" c="dimmed">
                    {dataHora(appointment.dataHora)} · {vet?.nome}
                  </Text>
                  <div className="rounded-2xl bg-slate-50 p-3 text-sm">
                    <Text fw={700}>Prontuário</Text>
                    <Text mt={4}>{record?.texto ?? 'Sem registro.'}</Text>
                  </div>
                  <Text fw={700} size="sm">
                    Receitas
                  </Text>
                  {prescriptions.length === 0 && <Text size="sm" c="dimmed">Nenhuma receita nesta consulta.</Text>}
                  {prescriptions.map((item) => (
                    <Text key={item.id} size="sm" className="rounded-2xl bg-[#f6f1fc] p-3">
                      {item.texto}
                    </Text>
                  ))}
                </div>
              </Card>
            )
          })}
        </Stack>
      )}
    </Screen>
  )
}
