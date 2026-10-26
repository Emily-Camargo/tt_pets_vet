'use client'

import { Dialog, Input } from '@grazziotin/react-components-next/ui'
import { Button } from '@mantine/core'
import { useState } from 'react'

import { feedback } from '@/core/functions/feedback'
import { salvarVacina } from '@/service/mock/actions'

export function VaccineForm({
  open,
  petId,
  tutorId,
  onClose,
}: {
  open: boolean
  petId: string
  tutorId: string
  onClose: () => void
}) {
  const [name, setName] = useState('')
  const [appliedOn, setAppliedOn] = useState('')
  const [nextDose, setNextDose] = useState('')

  return (
    <Dialog open={open} title="Registrar vacina" onClose={onClose} maxWidth="sm">
      <form
        className="flex flex-col gap-3"
        onSubmit={(event) => {
          event.preventDefault()
          const error = salvarVacina({
            petId,
            nome: name,
            aplicadaEm: appliedOn,
            proximaDose: nextDose,
            tutorId,
          })
          feedback(error, 'Vacina registrada.')
          if (!error) onClose()
        }}
      >
        <Input label="Vacina" value={name} required onChange={(event) => setName(event.target.value)} />
        <Input
          label="Aplicada em"
          type="date"
          value={appliedOn}
          required
          onChange={(event) => setAppliedOn(event.target.value)}
        />
        <Input
          label="Próxima dose"
          type="date"
          value={nextDose}
          required
          onChange={(event) => setNextDose(event.target.value)}
        />
        <Button type="submit" color="#7434d6">
          Salvar
        </Button>
      </form>
    </Dialog>
  )
}
