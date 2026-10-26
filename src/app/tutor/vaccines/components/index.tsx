'use client'

import { InputSelect } from '@grazziotin/react-components-next/ui'
import { Button, Stack } from '@mantine/core'
import { useState } from 'react'

import { EmptyState } from '@/core/components/empty-state'
import { Screen } from '@/core/components/screen'
import { dataCurta } from '@/core/functions/format'
import { useUsuario } from '@/core/hooks/use-session'

import { CardVaccine } from './card-vaccine'
import { VaccineForm } from './vaccine-form'

export function Vaccines() {
  const { banco, usuario } = useUsuario()
  const tutorId = usuario?.tutorId ?? ''
  const pets = banco.pets.filter((item) => item.tutorId === tutorId)
  const [petId, setPetId] = useState(pets[0]?.id ?? '')
  const [open, setOpen] = useState(false)
  const vaccines = banco.vacinas
    .filter((item) => item.petId === petId)
    .sort((a, b) => b.aplicadaEm.localeCompare(a.aplicadaEm))
  const selected = pets.find((item) => item.id === petId) ?? null

  return (
    <Screen
      title="Carteira de vacinação"
      description="As doses aplicadas pelo veterinário e as que você registrar aparecem juntas."
      action={
        <Button color="#7434d6" onClick={() => setOpen(true)}>
          Registrar dose
        </Button>
      }
    >
      <InputSelect
        options={pets}
        value={selected}
        optionLabel={(pet) => pet.nome}
        onChange={(_, pet) => setPetId(pet?.id ?? '')}
        input={{ label: 'Pet' }}
      />
      {vaccines.length === 0 ? (
        <EmptyState text="Nenhuma vacina nesta carteira." />
      ) : (
        <Stack gap="sm">
          {vaccines.map((item) => (
            <CardVaccine
              key={item.id}
              name={item.nome}
              detail={`Aplicada em ${dataCurta(item.aplicadaEm)} · próxima dose ${dataCurta(item.proximaDose)}`}
            />
          ))}
        </Stack>
      )}
      {open && (
        <VaccineForm open={open} petId={petId} tutorId={tutorId} onClose={() => setOpen(false)} />
      )}
    </Screen>
  )
}
