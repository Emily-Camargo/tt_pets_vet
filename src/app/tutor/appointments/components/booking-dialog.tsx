'use client'

import {
  Button,
  Group,
  NativeSelect,
  Text,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core'
import { useMemo, useState, type FormEvent } from 'react'
import { FiX } from 'react-icons/fi'

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

const TYPES = ['Consulta em domicílio', 'Retorno', 'Vacinação']

const softInput = {
  input: {
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
  },
}

export function BookingForm({
  bank,
  tutorId,
  onClose,
  embedded = false,
}: {
  bank: Banco
  tutorId: string
  onClose: () => void
  embedded?: boolean
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

  const visitsLabel =
    limit == null ? 'Visitas ilimitadas' : `${used} de ${limit} visitas no mês`

  return (
    <div
      className={
        embedded
          ? 'w-full'
          : 'sticky top-20 h-fit w-full rounded-3xl border border-slate-100 bg-white p-5 shadow-sm'
      }
    >
      {!embedded && (
        <Group justify="space-between" align="flex-start" mb={4}>
          <div>
            <Title order={4} fw={600} c="#475569">
              Nova consulta
            </Title>
            <Text size="xs" fw={500} c="#7434d6" mt={4}>
              {visitsLabel}
            </Text>
          </div>
          <Button
            type="button"
            variant="light"
            color="gray"
            aria-label="Fechar"
            onClick={onClose}
            radius="xl"
            size="compact-sm"
            leftSection={<FiX size={14} />}
          >
            Fechar
          </Button>
        </Group>
      )}

      {embedded && (
        <Text size="xs" fw={500} c="#7434d6" mb="md">
          {visitsLabel}
        </Text>
      )}

      <form
        className={`${embedded ? '' : 'mt-4 '}flex flex-col gap-4`}
        onSubmit={save}
      >
        {block && (
          <Text
            size="sm"
            c="#be123c"
            className="rounded-2xl border border-rose-100 bg-rose-50 px-3 py-2"
          >
            {block}
          </Text>
        )}

        <div>
          <Text size="xs" fw={500} c="#94a3b8" mb={8}>
            Pet
          </Text>
          <Group gap="xs">
            {pets.map((pet) => (
              <Button
                key={pet.id}
                type="button"
                radius="xl"
                size="compact-sm"
                variant={petId === pet.id ? 'gradient' : 'light'}
                gradient={
                  petId === pet.id
                    ? { from: '#7434d6', to: '#a855f7', deg: 135 }
                    : undefined
                }
                color={petId === pet.id ? undefined : 'gray'}
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

        <NativeSelect
          label="Tipo"
          description="Incluso no plano"
          value={type}
          onChange={(event) => setType(event.currentTarget.value)}
          data={TYPES}
          radius="xl"
          styles={softInput}
        />

        <NativeSelect
          label="Veterinário"
          value={veterinarianId}
          onChange={(event) => {
            setVeterinarianId(event.currentTarget.value)
            setSlot('')
          }}
          data={[
            { value: '', label: 'Qualquer disponível' },
            ...vets.map((vet) => ({ value: vet.id, label: vet.nome })),
          ]}
          radius="xl"
          styles={softInput}
        />

        <div>
          <Text size="xs" fw={500} c="#94a3b8" mb={8}>
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
                  radius="lg"
                  variant={active ? 'gradient' : 'light'}
                  gradient={
                    active
                      ? { from: '#7434d6', to: '#a855f7', deg: 135 }
                      : undefined
                  }
                  color={active ? undefined : 'gray'}
                  onClick={() => {
                    setDay(key)
                    setSlot('')
                  }}
                  styles={{ label: { flexDirection: 'column', gap: 0 } }}
                >
                  <Text size="xs" fw={600} c={active ? 'white' : '#94a3b8'}>
                    {label.weekday}
                  </Text>
                  <Text size="sm" fw={600} c={active ? 'white' : '#475569'}>
                    {label.day}
                  </Text>
                </Button>
              )
            })}
          </div>
        </div>

        <div>
          <Text size="xs" fw={500} c="#94a3b8" mb={8}>
            Horário
          </Text>
          <div className="grid grid-cols-3 gap-2">
            {slots.map((item) => (
              <Button
                key={item.iso}
                type="button"
                radius="lg"
                disabled={!item.livre}
                variant={slot === item.iso ? 'light' : 'default'}
                color={slot === item.iso ? 'violet' : 'gray'}
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
              <Text size="sm" c="#94a3b8" className="col-span-3">
                Sem horários neste dia.
              </Text>
            )}
          </div>
        </div>

        <TextInput
          label="Endereço da visita"
          value={address}
          onChange={(event) => setAddress(event.currentTarget.value)}
          placeholder="Rua, número e cidade"
          radius="xl"
          styles={softInput}
        />

        <Textarea
          label="Motivo"
          value={reason}
          onChange={(event) => setReason(event.currentTarget.value)}
          placeholder="Conte o que o pet está sentindo."
          minRows={3}
          radius="lg"
          styles={softInput}
        />

        <Button
          type="submit"
          radius="xl"
          variant="gradient"
          gradient={{ from: '#7434d6', to: '#ec4899', deg: 135 }}
          disabled={Boolean(block) || !slot}
        >
          Confirmar agendamento
        </Button>
      </form>
    </div>
  )
}
