'use client'

import { Input } from '@grazziotin/react-components-next/ui'
import { Button } from '@mantine/core'
import Grid from '@mui/material/Grid'
import { useState } from 'react'

import { feedback } from '@/core/functions/feedback'
import { salvarBloqueio } from '@/service/mock/actions'

export function BlockForm({ veterinarianId }: { veterinarianId: string }) {
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [reason, setReason] = useState('')

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        if (!veterinarianId) {
          feedback('Seu acesso não está ligado a um veterinário.', '')
          return
        }
        const error = salvarBloqueio({
          veterinarioId: veterinarianId,
          inicio: start,
          fim: end,
          motivo: reason,
        })
        feedback(error, 'Horário bloqueado.')
        if (!error) setReason('')
      }}
    >
      <Grid container spacing={2} sx={{ alignItems: 'flex-end' }}>
        <Grid size={{ xs: 12, md: 3 }}>
          <Input
            label="Início"
            type="datetime-local"
            value={start}
            onChange={(event) => setStart(event.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Input
            label="Fim"
            type="datetime-local"
            value={end}
            onChange={(event) => setEnd(event.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Input label="Motivo" value={reason} onChange={(event) => setReason(event.target.value)} />
        </Grid>
        <Grid size={{ xs: 12, md: 2 }}>
          <Button type="submit" color="#7434d6" fullWidth>
            Bloquear
          </Button>
        </Grid>
      </Grid>
    </form>
  )
}
