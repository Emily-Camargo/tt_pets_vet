'use client'

import { Button, Stack } from '@mantine/core'
import { useState } from 'react'

import { EmptyState } from '@/core/components/empty-state'
import { Screen } from '@/core/components/screen'
import { useUsuario } from '@/core/hooks/use-session'
import type { Veterinario } from '@/core/interfaces/types'
import { nomeCidade } from '@/service/mock/rules'

import { CardVet } from './card-vet'
import { VetForm } from './vet-form'

export function Veterinarians() {
  const { banco } = useUsuario()
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState<Veterinario>()

  function openForm(vet?: Veterinario) {
    setCurrent(vet)
    setOpen(true)
  }

  return (
    <Screen
      title="Veterinários"
      description="Cada veterinário entra com o próprio email e cuida da própria agenda, dos planos e dos clientes."
      action={
        <Button color="#7434d6" onClick={() => openForm()}>
          Novo veterinário
        </Button>
      }
    >
      {banco.veterinarios.length === 0 ? (
        <EmptyState text="Nenhum veterinário cadastrado." />
      ) : (
        <Stack gap="sm">
          {banco.veterinarios.map((vet) => {
            const access = banco.usuarios.find((item) => item.id === vet.usuarioId)
            return (
              <CardVet
                key={vet.id}
                name={vet.nome}
                active={vet.ativo}
                detail={`${vet.crmv} · ${vet.especialidade}`}
                email={access?.email}
                cities={vet.cidadeIds.map((id) => nomeCidade(banco, id)).join(', ')}
                onEdit={() => openForm(vet)}
              />
            )
          })}
        </Stack>
      )}
      {open && <VetForm open={open} bank={banco} vet={current} onClose={() => setOpen(false)} />}
    </Screen>
  )
}
