'use client'

import { Dialog, Input, InputSelect } from '@grazziotin/react-components-next/ui'
import { Button } from '@mantine/core'
import { useState } from 'react'

import { TimeSlot } from '@/core/components/time-slot'
import { feedback } from '@/core/functions/feedback'
import type { Banco } from '@/core/interfaces/types'
import { agendarConsulta } from '@/service/mock/actions'
import { motivoBloqueioAgendamento, veterinariosDisponiveis } from '@/service/mock/rules'

export function BookingDialog({
  open,
  bank,
  tutorId,
  onClose,
}: {
  open: boolean
  bank: Banco
  tutorId: string
  onClose: () => void
}) {
  const pets = bank.pets.filter((item) => item.tutorId === tutorId)
  const [petId, setPetId] = useState(pets[0]?.id ?? '')
  const [veterinarianId, setVeterinarianId] = useState('')
  const [slot, setSlot] = useState('')
  const [reason, setReason] = useState('')
  const subscription = bank.assinaturas.find((item) => item.petId === petId && item.status === 'ativa')
  const block = petId ? motivoBloqueioAgendamento(bank, petId) : 'Cadastre um pet.'
  const vets = subscription ? veterinariosDisponiveis(bank, subscription.cidadeId) : []
  const pet = pets.find((item) => item.id === petId) ?? null
  const vet = vets.find((item) => item.id === veterinarianId) ?? null

  return (
    <Dialog open={open} title="Nova consulta domiciliar" onClose={onClose} maxWidth="sm">
      <form
        className="flex flex-col gap-3"
        onSubmit={(event) => {
          event.preventDefault()
          const error = agendarConsulta({
            petId,
            veterinarioId: veterinarianId,
            dataHora: slot,
            motivo: reason,
          })
          feedback(error, 'Consulta agendada.')
          if (!error) onClose()
        }}
      >
        {block && (
          <Button variant="light" color="red" disabled>
            {block}
          </Button>
        )}
        <InputSelect
          options={pets}
          value={pet}
          optionLabel={(item) => item.nome}
          onChange={(_, value) => {
            setPetId(value?.id ?? '')
            setVeterinarianId('')
            setSlot('')
          }}
          input={{ label: 'Pet' }}
        />
        <InputSelect
          options={vets}
          value={vet}
          optionLabel={(item) => `${item.nome} · ${item.especialidade}`}
          onChange={(_, value) => setVeterinarianId(value?.id ?? '')}
          input={{ label: 'Veterinário' }}
        />
        <TimeSlot veterinarianId={veterinarianId} value={slot} onChange={setSlot} />
        <Input label="Motivo" value={reason} onChange={(event) => setReason(event.target.value)} />
        <Button type="submit" color="#7434d6" disabled={Boolean(block) || !slot}>
          Agendar
        </Button>
      </form>
    </Dialog>
  )
}
