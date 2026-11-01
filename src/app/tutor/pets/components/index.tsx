'use client'

import { Button, NativeSelect, Text, TextInput } from '@mantine/core'
import { useMemo, useState } from 'react'
import { FiSearch } from 'react-icons/fi'

import { PageHeader } from '@/core/components/page-header'
import { useUsuario } from '@/core/hooks/use-session'
import type { Pet } from '@/core/interfaces/types'

import { CardPet } from './card-pet'
import { PetForm } from './pet-form'
import { SORT_OPTIONS, SPECIES } from '../utils/constants'

export function Pets() {
  const { banco, usuario } = useUsuario()
  const tutorId = usuario?.tutorId ?? ''
  const pets = banco.pets.filter((item) => item.tutorId === tutorId)
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState<Pet>()
  const [search, setSearch] = useState('')
  const [species, setSpecies] = useState('Todas')
  const [sort, setSort] = useState<(typeof SORT_OPTIONS)[number]['id']>('nome')

  const filtered = useMemo(() => {
    const list = pets.filter((pet) => {
      const matchName = pet.nome
        .toLowerCase()
        .includes(search.trim().toLowerCase())
      const matchSpecies = species === 'Todas' || pet.especie === species
      return matchName && matchSpecies
    })

    return [...list].sort((a, b) => {
      if (sort === 'peso') return b.peso - a.peso
      if (sort === 'idade') return a.nascimento.localeCompare(b.nascimento)
      return a.nome.localeCompare(b.nome)
    })
  }, [pets, search, species, sort])

  function openForm(pet?: Pet) {
    setCurrent(pet)
    setOpen(true)
  }

  function closeForm() {
    setOpen(false)
    setCurrent(undefined)
  }

  return (
    <div
      className="grid gap-4"
      style={{ animation: 'tt-surgir 0.6s ease both' }}
    >
      <PageHeader
        eyebrow="Tutor"
        title="Meus pets"
        description="Cadastre seus pets e acompanhe a saúde de cada um."
      />

      <div
        className={`grid w-full gap-4 lg:gap-6 ${open ? 'xl:grid-cols-[minmax(0,1fr)_420px]' : ''}`}
      >
        <div className="grid gap-4">
          <div className="rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm">
            <div className="flex flex-row items-center gap-3 max-md:flex-col max-md:items-stretch">
              <TextInput
                className="min-w-0 flex-1"
                placeholder="Buscar pet pelo nome"
                value={search}
                onChange={(event) => setSearch(event.currentTarget.value)}
                leftSection={<FiSearch size={15} />}
                radius="xl"
                styles={{
                  input: {
                    borderColor: '#e2e8f0',
                    backgroundColor: '#f8fafc',
                  },
                }}
              />
              <NativeSelect
                className="w-44 max-md:w-full"
                value={species}
                onChange={(event) => setSpecies(event.currentTarget.value)}
                data={[
                  { value: 'Todas', label: 'Todas as espécies' },
                  ...SPECIES.map((item) => ({ value: item, label: item })),
                ]}
                radius="xl"
                styles={{
                  input: {
                    borderColor: '#e2e8f0',
                    backgroundColor: '#f8fafc',
                  },
                }}
              />
              <NativeSelect
                className="w-44 max-md:w-full"
                value={sort}
                onChange={(event) =>
                  setSort(
                    event.currentTarget
                      .value as (typeof SORT_OPTIONS)[number]['id'],
                  )
                }
                data={SORT_OPTIONS.map((item) => ({
                  value: item.id,
                  label: item.label,
                }))}
                radius="xl"
                styles={{
                  input: {
                    borderColor: '#e2e8f0',
                    backgroundColor: '#f8fafc',
                  },
                }}
              />
              <Button
                radius="xl"
                variant="gradient"
                gradient={{ from: '#7434d6', to: '#ec4899', deg: 135 }}
                className="shrink-0 max-md:w-full"
                onClick={() => openForm()}
              >
                + Adicionar pet
              </Button>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center">
              <Text size="sm" c="#94a3b8">
                Nenhum pet encontrado.
              </Text>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4 max-lg:grid-cols-2 max-md:grid-cols-1">
              {filtered.map((pet) => (
                <CardPet
                  key={pet.id}
                  pet={pet}
                  vaccines={banco.vacinas.filter(
                    (item) => item.petId === pet.id,
                  )}
                  appointments={banco.consultas.filter(
                    (item) => item.petId === pet.id,
                  )}
                  onEdit={() => openForm(pet)}
                />
              ))}
            </div>
          )}
        </div>

        {open && (
          <PetForm
            key={current?.id ?? 'new'}
            tutorId={tutorId}
            pet={current}
            onClose={closeForm}
          />
        )}
      </div>
    </div>
  )
}
