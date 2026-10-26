'use client'

import { Button } from '@mantine/core'
import Grid from '@mui/material/Grid'
import { useState } from 'react'

import { EmptyState } from '@/core/components/empty-state'
import { Screen } from '@/core/components/screen'
import { feedback } from '@/core/functions/feedback'
import { dataCurta } from '@/core/functions/format'
import { useUsuario } from '@/core/hooks/use-session'
import type { Pet } from '@/core/interfaces/types'
import { excluirPet } from '@/service/mock/actions'

import { CardPet } from './card-pet'
import { PetForm } from './pet-form'

export function Pets() {
  const { banco, usuario } = useUsuario()
  const tutorId = usuario?.tutorId ?? ''
  const pets = banco.pets.filter((item) => item.tutorId === tutorId)
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState<Pet>()

  function openForm(pet?: Pet) {
    setCurrent(pet)
    setOpen(true)
  }

  return (
    <Screen
      title="Meus pets"
      description="Cada consulta e cada plano ficam ligados a um pet."
      action={
        <Button color="#7434d6" onClick={() => openForm()}>
          Novo pet
        </Button>
      }
    >
      {pets.length === 0 ? (
        <EmptyState text="Você ainda não cadastrou pets." />
      ) : (
        <Grid container spacing={1.5}>
          {pets.map((pet) => {
            const subscription = banco.assinaturas.find(
              (item) => item.petId === pet.id && item.status === 'ativa',
            )
            const planName = banco.planos.find((item) => item.id === subscription?.planoId)?.nome
            return (
              <Grid key={pet.id} size={{ xs: 12, md: 6 }}>
                <CardPet
                  name={pet.nome}
                  photo={pet.foto}
                  detail={`${pet.especie} · ${pet.raca} · ${pet.peso} kg`}
                  birth={`Nascimento ${dataCurta(pet.nascimento)}`}
                  plan={planName ? `Plano ${planName}` : 'Sem plano ativo'}
                  onEdit={() => openForm(pet)}
                  onDelete={() => feedback(excluirPet(pet.id, tutorId), 'Pet removido.')}
                />
              </Grid>
            )
          })}
        </Grid>
      )}
      {open && (
        <PetForm open={open} tutorId={tutorId} pet={current} onClose={() => setOpen(false)} />
      )}
    </Screen>
  )
}
