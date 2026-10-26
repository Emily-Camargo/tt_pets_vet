'use client'

import { Button, Stack } from '@mantine/core'
import { useState } from 'react'

import { EmptyState } from '@/core/components/empty-state'
import { Screen } from '@/core/components/screen'
import { feedback } from '@/core/functions/feedback'
import { useUsuario } from '@/core/hooks/use-session'
import { excluirCidade } from '@/service/mock/actions'

import type { CityForm } from '../utils/interfaces'
import { CardCity } from './card-city'
import { CityForm as CityDialog } from './city-form'

const EMPTY: CityForm = { name: '', state: 'RS' }

export function Cities() {
  const { banco } = useUsuario()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<CityForm>(EMPTY)

  function openForm(city?: { id: string; nome: string; uf: string }) {
    setForm(city ? { id: city.id, name: city.nome, state: city.uf } : EMPTY)
    setOpen(true)
  }

  return (
    <Screen
      title="Cidades atendidas"
      description="O tutor só vê planos da cidade que escolher."
      action={
        <Button color="#7434d6" onClick={() => openForm()}>
          Nova cidade
        </Button>
      }
    >
      {banco.cidades.length === 0 ? (
        <EmptyState text="Nenhuma cidade cadastrada." />
      ) : (
        <Stack gap="sm">
          {banco.cidades.map((city) => (
            <CardCity
              key={city.id}
              title={`${city.nome} - ${city.uf}`}
              detail={`${banco.veterinarios.filter((item) => item.cidadeIds.includes(city.id)).length} veterinários vinculados`}
              onEdit={() => openForm(city)}
              onDelete={() => feedback(excluirCidade(city.id), 'Cidade removida.')}
            />
          ))}
        </Stack>
      )}
      {open && <CityDialog open={open} initial={form} onClose={() => setOpen(false)} />}
    </Screen>
  )
}
