'use client'

import { Dialog, Input } from '@grazziotin/react-components-next/ui'
import { Button, Checkbox, Stack } from '@mantine/core'
import { useState } from 'react'

import { feedback } from '@/core/functions/feedback'
import type { Banco, Veterinario } from '@/core/interfaces/types'
import { salvarVeterinario } from '@/service/mock/actions'
import { nomeCidade } from '@/service/mock/rules'

export function VetForm({
  open,
  bank,
  vet,
  onClose,
}: {
  open: boolean
  bank: Banco
  vet?: Veterinario
  onClose: () => void
}) {
  const access = bank.usuarios.find((item) => item.id === vet?.usuarioId)
  const [name, setName] = useState(vet?.nome ?? '')
  const [email, setEmail] = useState(access?.email ?? '')
  const [password, setPassword] = useState('')
  const [crmv, setCrmv] = useState(vet?.crmv ?? '')
  const [specialty, setSpecialty] = useState(vet?.especialidade ?? 'Clínica geral')
  const [cityIds, setCityIds] = useState<string[]>(vet?.cidadeIds ?? [])
  const [active, setActive] = useState(vet?.ativo ?? true)

  return (
    <Dialog
      open={open}
      title={vet ? 'Editar veterinário' : 'Novo veterinário'}
      onClose={onClose}
      maxWidth="sm"
    >
      <form
        className="flex flex-col gap-3"
        onSubmit={(event) => {
          event.preventDefault()
          const error = salvarVeterinario({
            id: vet?.id,
            cidadeIds: cityIds,
            nome: name,
            email,
            senha: password,
            crmv,
            especialidade: specialty,
            ativo: active,
          })
          feedback(error, 'Veterinário salvo.')
          if (!error) onClose()
        }}
      >
        <Input label="Nome" value={name} required onChange={(event) => setName(event.target.value)} />
        <Input
          label="Email de acesso"
          type="email"
          value={email}
          required
          onChange={(event) => setEmail(event.target.value)}
        />
        <Input
          label={vet ? 'Nova senha (opcional)' : 'Senha'}
          type="password"
          isPassword
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <Input label="CRMV" value={crmv} required onChange={(event) => setCrmv(event.target.value)} />
        <Input
          label="Especialidade"
          value={specialty}
          onChange={(event) => setSpecialty(event.target.value)}
        />
        <Stack gap={6}>
          {bank.cidades.map((city) => (
            <Checkbox
              key={city.id}
              label={nomeCidade(bank, city.id)}
              checked={cityIds.includes(city.id)}
              onChange={() =>
                setCityIds((current) =>
                  current.includes(city.id)
                    ? current.filter((item) => item !== city.id)
                    : [...current, city.id],
                )
              }
            />
          ))}
        </Stack>
        <Checkbox
          label="Ativo"
          checked={active}
          onChange={(event) => setActive(event.currentTarget.checked)}
        />
        <Button type="submit" color="#7434d6">
          Salvar
        </Button>
      </form>
    </Dialog>
  )
}
