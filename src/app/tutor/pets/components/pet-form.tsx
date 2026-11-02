'use client'

import { Button, Group, Text, Title } from '@mantine/core'
import { useState, type FormEvent, type ReactNode } from 'react'

import { cx } from '@/core/functions/format'
import { feedback } from '@/core/functions/feedback'
import type { Pet } from '@/core/interfaces/types'
import { salvarPet } from '@/service/mock/actions'

import { SEX_OPTIONS, SPECIES } from '../utils/constants'

const fieldClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-marca focus:ring-2 focus:ring-marca-anel'

export function PetForm({
  tutorId,
  pet,
  onClose,
}: {
  tutorId: string
  pet?: Pet
  onClose: () => void
}) {
  const [name, setName] = useState(pet?.nome ?? '')
  const [species, setSpecies] = useState(pet?.especie ?? 'Cão')
  const [breed, setBreed] = useState(pet?.raca ?? '')
  const [sex, setSex] = useState<'Macho' | 'Fêmea'>(pet?.sexo ?? 'Macho')
  const [neutered, setNeutered] = useState(pet?.castrado ?? true)
  const [birth, setBirth] = useState(pet?.nascimento ?? '')
  const [weight, setWeight] = useState(
    pet ? String(pet.peso).replace('.', ',') : '',
  )
  const [chip, setChip] = useState(pet?.microchip ?? '')
  const [notes, setNotes] = useState(pet?.observacoes ?? '')
  const [photo, setPhoto] = useState(pet?.foto)

  function save(event: FormEvent) {
    event.preventDefault()
    const error = salvarPet({
      id: pet?.id,
      tutorId,
      nome: name,
      especie: species,
      raca: breed,
      sexo: sex,
      castrado: neutered,
      nascimento: birth,
      peso: Number(weight.replace(',', '.')),
      microchip: chip || undefined,
      observacoes: notes || undefined,
      foto: photo,
    })
    feedback(error, 'Pet salvo.')
    if (!error) onClose()
  }

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
      <Group justify="space-between" mb="md">
        <Title order={3}>{pet ? 'Editar pet' : 'Novo pet'}</Title>
        <Button
          variant="subtle"
          color="gray"
          aria-label="Fechar"
          onClick={onClose}
          px="xs"
        >
          ×
        </Button>
      </Group>
      <form className="flex flex-col gap-3" onSubmit={save}>
        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-marca-borda bg-[#fbf8ff] px-4 py-8 text-sm font-medium text-marca">
          <Text size="xl">📷</Text>
          Adicionar foto do pet
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0]
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
          {photo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photo}
              alt=""
              className="mt-2 h-16 w-16 rounded-full object-cover"
            />
          )}
        </label>

        <Field label="Nome">
          <input
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={fieldClass}
            placeholder="Ex.: Mel"
          />
        </Field>

        <div>
          <Text size="sm" fw={500} mb={8}>
            Espécie
          </Text>
          <div className="grid grid-cols-3 gap-2">
            {SPECIES.map((item) => (
              <Choice
                key={item}
                active={species === item}
                onClick={() => setSpecies(item)}
              >
                {item}
              </Choice>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Raça">
            <input
              required
              value={breed}
              onChange={(event) => setBreed(event.target.value)}
              className={fieldClass}
              placeholder="Ex.: Poodle"
            />
          </Field>
          <Field label="Sexo">
            <select
              value={sex}
              onChange={(event) =>
                setSex(event.target.value as 'Macho' | 'Fêmea')
              }
              className={fieldClass}
            >
              {SEX_OPTIONS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Nascimento">
            <input
              required
              type="date"
              value={birth}
              onChange={(event) => setBirth(event.target.value)}
              className={fieldClass}
            />
          </Field>
          <Field label="Peso (kg)">
            <input
              required
              value={weight}
              onChange={(event) => setWeight(event.target.value)}
              className={fieldClass}
              placeholder="6,5"
            />
          </Field>
        </div>

        <div>
          <Text size="sm" fw={500} mb={8}>
            Castrado
          </Text>
          <div className="grid grid-cols-2 gap-2">
            <Choice active={neutered} onClick={() => setNeutered(true)}>
              Sim
            </Choice>
            <Choice active={!neutered} onClick={() => setNeutered(false)}>
              Não
            </Choice>
          </div>
        </div>

        <Field label="Microchip">
          <input
            value={chip}
            onChange={(event) => setChip(event.target.value)}
            className={fieldClass}
            placeholder="Opcional"
          />
        </Field>

        <Field label="Observações">
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            className={`${fieldClass} min-h-24 resize-y`}
            placeholder="Alergias, medicamentos de uso contínuo..."
          />
        </Field>

        <Group grow mt="sm">
          <Button radius="xl" variant="default" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" radius="xl" color="#7434d6">
            Salvar pet
          </Button>
        </Group>
      </form>
    </div>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      <Text size="sm" fw={500} mb={6} component="span" display="block">
        {label}
      </Text>
      {children}
    </label>
  )
}

function Choice({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <Button
      type="button"
      radius="md"
      variant={active ? 'light' : 'default'}
      color={active ? '#7434d6' : 'gray'}
      className={cx(
        active && 'border-marca bg-[#f6f1fc] text-marca',
        !active && 'border-slate-200 text-slate-600',
      )}
      onClick={onClick}
      fullWidth
    >
      {children}
    </Button>
  )
}
