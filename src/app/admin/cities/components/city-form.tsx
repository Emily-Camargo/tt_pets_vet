'use client'

import { Dialog, Input } from '@grazziotin/react-components-next/ui'
import { Button } from '@mantine/core'
import Grid from '@mui/material/Grid'
import { useState } from 'react'

import { feedback } from '@/core/functions/feedback'
import { salvarCidade } from '@/service/mock/actions'

import type { CityForm } from '../utils/interfaces'

export function CityForm({
  open,
  initial,
  onClose,
}: {
  open: boolean
  initial: CityForm
  onClose: () => void
}) {
  const [name, setName] = useState(initial.name)
  const [state, setState] = useState(initial.state)

  return (
    <Dialog
      open={open}
      title={initial.id ? 'Editar cidade' : 'Nova cidade'}
      onClose={onClose}
      maxWidth="sm"
    >
      <form
        onSubmit={(event) => {
          event.preventDefault()
          const error = salvarCidade({ id: initial.id, nome: name, uf: state })
          feedback(error, 'Cidade salva.')
          if (!error) onClose()
        }}
      >
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 8 }}>
            <Input label="Nome" value={name} required onChange={(event) => setName(event.target.value)} />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Input
              label="UF"
              value={state}
              required
              slotProps={{ htmlInput: { maxLength: 2 } }}
              onChange={(event) => setState(event.target.value.toUpperCase())}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Button type="submit" color="#7434d6">
              Salvar
            </Button>
          </Grid>
        </Grid>
      </form>
    </Dialog>
  )
}
