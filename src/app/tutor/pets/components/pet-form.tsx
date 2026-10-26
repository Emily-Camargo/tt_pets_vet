'use client'

import { Dialog, Input, InputSelect } from '@grazziotin/react-components-next/ui'
import { Button, FileInput } from '@mantine/core'
import { useState } from 'react'

import { feedback } from '@/core/functions/feedback'
import type { Pet } from '@/core/interfaces/types'
import { salvarPet } from '@/service/mock/actions'

import { SPECIES } from '../utils/constants'

export function PetForm({
  open,
  tutorId,
  pet,
  onClose,
}: {
  open: boolean
  tutorId: string
  pet?: Pet
  onClose: () => void
}) {
  const [name, setName] = useState(pet?.nome ?? '')
  const [species, setSpecies] = useState(pet?.especie ?? 'Cão')
  const [breed, setBreed] = useState(pet?.raca ?? '')
  const [birth, setBirth] = useState(pet?.nascimento ?? '')
  const [weight, setWeight] = useState(pet ? String(pet.peso) : '')
  const [photo, setPhoto] = useState(pet?.foto)

  return (
    <Dialog open={open} title={pet ? 'Editar pet' : 'Novo pet'} onClose={onClose} maxWidth="sm">
      <form
        className="flex flex-col gap-3"
        onSubmit={(event) => {
          event.preventDefault()
          const error = salvarPet({
            id: pet?.id,
            tutorId,
            nome: name,
            especie: species,
            raca: breed,
            nascimento: birth,
            peso: Number(weight.replace(',', '.')),
            foto: photo,
          })
          feedback(error, 'Pet salvo.')
          if (!error) onClose()
        }}
      >
        <Input label="Nome" value={name} required onChange={(event) => setName(event.target.value)} />
        <InputSelect
          options={SPECIES}
          value={species}
          optionLabel={(item) => item}
          onChange={(_, value) => setSpecies(value ?? 'Cão')}
          input={{ label: 'Espécie' }}
        />
        <Input label="Raça" value={breed} required onChange={(event) => setBreed(event.target.value)} />
        <Input
          label="Nascimento"
          type="date"
          value={birth}
          required
          onChange={(event) => setBirth(event.target.value)}
        />
        <Input
          label="Peso (kg)"
          value={weight}
          required
          onChange={(event) => setWeight(event.target.value)}
        />
        <FileInput
          label="Foto"
          accept="image/*"
          onChange={(file) => {
            if (!file) return
            if (file.size > 400_000) {
              feedback('Escolha uma foto de até 400 KB.', '')
              return
            }
            const reader = new FileReader()
            reader.onload = () => setPhoto(String(reader.result))
            reader.readAsDataURL(file)
          }}
        />
        <Button type="submit" color="#7434d6">
          Salvar
        </Button>
      </form>
    </Dialog>
  )
}
