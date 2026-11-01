'use client'

import { Button, Group, Text, Title } from '@mantine/core'
import { useMemo, useState, type FormEvent } from 'react'

import { cx } from '@/core/functions/format'
import { feedback } from '@/core/functions/feedback'
import type { Banco } from '@/core/interfaces/types'
import { agendarConsulta } from '@/service/mock/actions'
import {
  diasAgendaveis,
  horariosDoDia,
  motivoBloqueioAgendamento,
  veterinariosDisponiveis,
} from '@/service/mock/rules'

import { dayKey, dayLabel, visitsUsedThisMonth } from '../utils/functions'

const fieldClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-marca focus:ring-2 focus:ring-marca-anel'

const TYPES = ['Consulta em domicílio', 'Retorno', 'Vacinação']

export function BookingForm({
  bank,
  tutorId,
  onClose,
}: {
  bank: Banco
  tutorId: string
  onClose: () => void
}) {
  const pets = bank.pets.filter((item) => item.tutorId === tutorId)
  const tutor = bank.tutores.find((item) => item.id === tutorId)
  const days = useMemo(() => diasAgendaveis(7), [])

  const [petId, setPetId] = useState(pets[0]?.id ?? '')
  const [type, setType] = useState(TYPES[0])
  const [veterinarianId, setVeterinarianId] = useState('')
  const [day, setDay] = useState(dayKey(days[0] ?? new Date()))
  const [slot, setSlot] = useState('')
  const [address, setAddress] = useState(tutor?.endereco ?? '')
  const [reason, setReason] = useState('')

  const subscription = bank.assinaturas.find(
    (item) => item.petId === petId && item.status === 'ativa',
  )
  const plan = bank.planos.find((item) => item.id === subscription?.planoId)
  const block = petId
    ? motivoBloqueioAgendamento(bank, petId)
    : 'Cadastre um pet.'
  const vets = subscription
    ? veterinariosDisponiveis(bank, subscription.cidadeId)
    : []
  const activeVetId = veterinarianId || vets[0]?.id || ''
  const slots = activeVetId ? horariosDoDia(bank, activeVetId, day) : []
  const used = petId ? visitsUsedThisMonth(bank, petId) : 0
  const limit = plan?.visitasMes

  function save(event: FormEvent) {
    event.preventDefault()
    const error = agendarConsulta({
      petId,
      veterinarioId: veterinarianId || undefined,
      dataHora: slot,
      motivo: reason || type,
      tipo: type,
      endereco: address,
    })
    feedback(error, 'Consulta agendada.')
    if (!error) onClose()
  }

  return (
    <div className="h-fit w-full rounded-3xl border border-slate-100 bg-white p-5 shadow-sm xl:sticky xl:top-20">
      <Group justify="space-between" align="flex-start" mb={4}>
        <div>
          <Title order={3}>Nova consulta</Title>
          <Text size="sm" fw={500} c="#7434d6" mt={4}>
            {limit == null
              ? 'Visitas ilimitadas'
              : `${used} de ${limit} visitas no mês`}
          </Text>
        </div>
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

      <form className="mt-4 flex flex-col gap-4" onSubmit={save}>
        {block && (
          <Text size="sm" c="red" className="rounded-2xl bg-rose-50 px-3 py-2">
            {block}
          </Text>
        )}

        <div>
          <Text size="sm" fw={500} mb={8}>
            Pet
          </Text>
          <Group gap="xs">
            {pets.map((pet) => (
              <Button
                key={pet.id}
                type="button"
                radius="xl"
                size="compact-sm"
                variant={petId === pet.id ? 'light' : 'default'}
                color={petId === pet.id ? '#7434d6' : 'gray'}
                onClick={() => {
                  setPetId(pet.id)
                  setVeterinarianId('')
                  setSlot('')
                }}
              >
                {pet.nome}
              </Button>
            ))}
          </Group>
        </div>

        <label className="text-sm font-medium text-slate-700">
          <Text size="sm" fw={500} mb={6} component="span" display="block">
            Tipo
          </Text>
          <select
            value={type}
            onChange={(event) => setType(event.target.value)}
            className={fieldClass}
          >
            {TYPES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <Text size="xs" c="dimmed" mt={4}>
            Incluso no plano
          </Text>
        </label>

        <label className="text-sm font-medium text-slate-700">
          <Text size="sm" fw={500} mb={6} component="span" display="block">
            Veterinário
          </Text>
          <select
            value={veterinarianId}
            onChange={(event) => {
              setVeterinarianId(event.target.value)
              setSlot('')
            }}
            className={fieldClass}
          >
            <option value="">Qualquer disponível</option>
            {vets.map((vet) => (
              <option key={vet.id} value={vet.id}>
                {vet.nome}
              </option>
            ))}
          </select>
        </label>

        <div>
          <Text size="sm" fw={500} mb={8}>
            Dia
          </Text>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {days.map((item) => {
              const key = dayKey(item)
              const label = dayLabel(item)
              const active = key === day
              return (
                <Button
                  key={key}
                  type="button"
                  className="min-w-14 shrink-0"
                  radius="md"
                  variant={active ? 'filled' : 'default'}
                  color={active ? '#7434d6' : 'gray'}
                  onClick={() => {
                    setDay(key)
                    setSlot('')
                  }}
                  styles={{ label: { flexDirection: 'column', gap: 0 } }}
                >
                  <Text size="xs" fw={600}>
                    {label.weekday}
                  </Text>
                  <Text size="sm" fw={600}>
                    {label.day}
                  </Text>
                </Button>
              )
            })}
          </div>
        </div>

        <div>
          <Text size="sm" fw={500} mb={8}>
            Horário
          </Text>
          <div className="grid grid-cols-3 gap-2">
            {slots.map((item) => (
              <Button
                key={item.iso}
                type="button"
                radius="md"
                disabled={!item.livre}
                variant={slot === item.iso ? 'light' : 'default'}
                color={slot === item.iso ? '#7434d6' : 'gray'}
                className={cx(
                  !item.livre &&
                    'cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300',
                )}
                onClick={() => setSlot(item.iso)}
              >
                {item.label}
              </Button>
            ))}
            {slots.length === 0 && (
              <Text size="sm" c="dimmed" className="col-span-3">
                Sem horários neste dia.
              </Text>
            )}
          </div>
        </div>

        <label className="text-sm font-medium text-slate-700">
          <Text size="sm" fw={500} mb={6} component="span" display="block">
            Endereço da visita
          </Text>
          <input
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            className={fieldClass}
            placeholder="Rua, número e cidade"
          />
        </label>

        <label className="text-sm font-medium text-slate-700">
          <Text size="sm" fw={500} mb={6} component="span" display="block">
            Motivo
          </Text>
          <textarea
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            className={`${fieldClass} min-h-24 resize-y`}
            placeholder="Conte o que o pet está sentindo."
          />
        </label>

        <Button
          type="submit"
          radius="xl"
          color="#7434d6"
          disabled={Boolean(block) || !slot}
        >
          Confirmar agendamento
        </Button>
      </form>
    </div>
  )
}
