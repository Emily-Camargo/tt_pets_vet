'use client'

import { Dialog } from '@grazziotin/react-components-next/ui'
import { Button, Group, TextInput } from '@mantine/core'
import { useEffect, useState, type FormEvent } from 'react'

import { feedback } from '@/core/functions/feedback'
import { salvarVacina } from '@/service/mock/actions'

const softInput = {
  input: {
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
  },
}

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
  const [dose, setDose] = useState('')
  const [appliedOn, setAppliedOn] = useState('')
  const [nextDose, setNextDose] = useState('')

  useEffect(() => {
    if (!open) return
    setName('')
    setDose('')
    setAppliedOn('')
    setNextDose('')
  }, [open, petId])

  function save(event: FormEvent) {
    event.preventDefault()
    const error = salvarVacina({
      petId,
      nome: name,
      dose: dose || undefined,
      aplicadaEm: appliedOn || undefined,
      proximaDose: nextDose || undefined,
      tutorId,
    })
    feedback(error, 'Vacina registrada.')
    if (!error) onClose()
  }

  return (
    <Dialog
      open={open}
      title="Agendar vacina"
      onClose={onClose}
      maxWidth="sm"
    >
      <form className="flex flex-col gap-3" onSubmit={save}>
        <TextInput
          label="Vacina"
          required
          value={name}
          onChange={(event) => setName(event.currentTarget.value)}
          placeholder="Ex.: V10"
          radius="xl"
          styles={softInput}
        />
        <TextInput
          label="Dose"
          value={dose}
          onChange={(event) => setDose(event.currentTarget.value)}
          placeholder="Ex.: Anual"
          radius="xl"
          styles={softInput}
        />
        <TextInput
          type="date"
          label="Aplicada em"
          value={appliedOn}
          onChange={(event) => setAppliedOn(event.currentTarget.value)}
          radius="xl"
          styles={softInput}
        />
        <TextInput
          type="date"
          label="Próxima dose"
          value={nextDose}
          onChange={(event) => setNextDose(event.currentTarget.value)}
          radius="xl"
          styles={softInput}
        />
        <Group grow mt="sm" gap="sm">
          <Button
            type="button"
            radius="xl"
            variant="light"
            color="gray"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            radius="xl"
            variant="gradient"
            gradient={{ from: '#7434d6', to: '#ec4899', deg: 135 }}
          >
            Salvar
          </Button>
        </Group>
      </form>
    </Dialog>
  )
}
