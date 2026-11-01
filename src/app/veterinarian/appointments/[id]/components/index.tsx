'use client'

import {
  Badge,
  Button,
  Group,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core'
import { useRouter } from 'next/navigation'
import { useMemo, useState, type ReactNode } from 'react'
import {
  FiActivity,
  FiArrowRight,
  FiCalendar,
  FiCheck,
  FiFileText,
  FiPlus,
  FiSave,
  FiThermometer,
  FiX,
} from 'react-icons/fi'
import { HiOutlineSparkles } from 'react-icons/hi2'
import { LuWeight } from 'react-icons/lu'
import { MdOutlineBloodtype } from 'react-icons/md'

import { initials, petTone } from '@/app/tutor/appointments/utils/functions'
import { ageLabel } from '@/app/tutor/pets/utils/functions'
import { PageHeader } from '@/core/components/page-header'
import { cx, hora } from '@/core/functions/format'
import { feedback } from '@/core/functions/feedback'
import { useUsuario } from '@/core/hooks/use-session'
import {
  concluirConsulta,
  enviarChat,
  salvarProntuario,
  salvarReceita,
  salvarVacina,
} from '@/service/mock/actions'
import type { Sugestao } from '@/service/mock/chat'

type MedRow = { id: string; nome: string; uso: string; duracao: string }

const QUICK = [
  'Resumir histórico',
  'Gerar orientação ao tutor',
  'Interações medicamentosas',
]

function newMed(partial?: Partial<MedRow>): MedRow {
  return {
    id: crypto.randomUUID(),
    nome: partial?.nome ?? '',
    uso: partial?.uso ?? '',
    duracao: partial?.duracao ?? '',
  }
}

export function AppointmentDetail({
  appointmentId,
}: {
  appointmentId: string
}) {
  const { banco, usuario } = useUsuario()
  const router = useRouter()
  const appointment = banco.consultas.find((item) => item.id === appointmentId)

  const startedAt = useMemo(() => hora(new Date().toISOString()), [])

  const existingRecord = banco.prontuarios.find(
    (item) => item.consultaId === appointmentId,
  )?.texto
  const existingRx = banco.receitas.find(
    (item) => item.consultaId === appointmentId,
  )

  const [peso, setPeso] = useState(
    appointment
      ? String(banco.pets.find((p) => p.id === appointment.petId)?.peso ?? '')
      : '',
  )
  const [temp, setTemp] = useState('38,4')
  const [fc, setFc] = useState('96')
  const [mucosas, setMucosas] = useState('Normocoradas')
  const [queixa, setQueixa] = useState(
    existingRecord?.includes('Queixa')
      ? existingRecord
      : 'Retorno de dermatite. Tutor relata coceira residual nas patas, principalmente à noite.',
  )
  const [diagnostico, setDiagnostico] = useState(
    'Dermatite atópica em melhora. Manter anti-pruriginoso e reavaliar em 30 dias.',
  )
  const [meds, setMeds] = useState<MedRow[]>(
    existingRx?.itens?.length
      ? existingRx.itens.map((item) =>
          newMed({ nome: item.nome, uso: item.uso, duracao: '30 dias' }),
        )
      : [
          newMed({
            nome: 'Apoquel 16 mg',
            uso: '1 comp. ao dia',
            duracao: '30 dias',
          }),
          newMed({
            nome: 'Pomada Dermotrat',
            uso: '2x ao dia na pata',
            duracao: '10 dias',
          }),
        ],
  )
  const [chat, setChat] = useState('')
  const [suggestions, setSuggestions] = useState<Sugestao[]>([])
  const [vaccineOpen, setVaccineOpen] = useState(false)
  const [vaccine, setVaccine] = useState('V10')
  const [appliedOn, setAppliedOn] = useState(
    new Date().toISOString().slice(0, 10),
  )
  const [nextDose, setNextDose] = useState('')

  if (!appointment || !usuario) {
    return (
      <Text size="sm" c="dimmed">
        Consulta não encontrada.
      </Text>
    )
  }
  if (appointment.veterinarioId !== usuario.veterinarioId) {
    return (
      <Text size="sm" c="dimmed">
        Consulta de outro veterinário.
      </Text>
    )
  }

  const vetId = appointment.veterinarioId
  const pet = banco.pets.find((item) => item.id === appointment.petId)
  const tutor = banco.tutores.find((item) => item.id === appointment.tutorId)
  const planId = banco.assinaturas.find(
    (item) => item.petId === appointment.petId && item.status === 'ativa',
  )?.planoId
  const plan = banco.planos.find((item) => item.id === planId)
  const messages = banco.mensagens.filter(
    (item) => item.consultaId === appointmentId,
  )
  const closed =
    appointment.status === 'realizada' || appointment.status === 'cancelada'
  const allergy = pet?.observacoes?.toLowerCase().includes('alerg')
    ? pet.observacoes
    : undefined

  const recordText = [
    `Exame físico: peso ${peso || '—'} kg; temp ${temp || '—'} °C; FC ${fc || '—'} bpm; mucosas ${mucosas || '—'}.`,
    `Queixa e anamnese: ${queixa.trim()}`,
    `Diagnóstico: ${diagnostico.trim()}`,
  ].join('\n\n')

  function applySuggestion(suggestion: Sugestao) {
    if (suggestion.tipo === 'prontuario') setDiagnostico(suggestion.conteudo)
    if (suggestion.tipo === 'receita') {
      const [nome, uso] = suggestion.conteudo
        .split('—')
        .map((part) => part.trim())
      setMeds((prev) => [
        ...prev,
        newMed({
          nome: nome || suggestion.conteudo,
          uso: uso || '',
          duracao: '30 dias',
        }),
      ])
    }
    if (suggestion.tipo === 'vacina' && suggestion.vacina) {
      setVaccine(suggestion.vacina.nome)
      const next = new Date()
      next.setDate(next.getDate() + suggestion.vacina.proximaDoseDias)
      setNextDose(next.toISOString().slice(0, 10))
      setVaccineOpen(true)
    }
    feedback(null, 'Sugestão aplicada. Revise antes de finalizar.')
  }

  function saveDraft() {
    const error = salvarProntuario(appointmentId, recordText, vetId)
    if (error) {
      feedback(error, '')
      return
    }
    const itens = meds
      .filter((item) => item.nome.trim())
      .map((item) => ({
        nome: item.nome.trim(),
        uso: [item.uso, item.duracao].filter(Boolean).join(' · '),
      }))
    if (itens.length > 0) {
      salvarReceita(appointmentId, '', vetId, itens)
    }
    feedback(null, 'Rascunho salvo.')
  }

  function finish() {
    const draftError = salvarProntuario(appointmentId, recordText, vetId)
    if (draftError) {
      feedback(draftError, '')
      return
    }
    const itens = meds
      .filter((item) => item.nome.trim())
      .map((item) => ({
        nome: item.nome.trim(),
        uso: [item.uso, item.duracao].filter(Boolean).join(' · '),
      }))
    if (itens.length > 0) {
      salvarReceita(appointmentId, '', vetId, itens)
    }
    const error = concluirConsulta(appointmentId, vetId)
    feedback(error, 'Atendimento finalizado.')
    if (!error) router.push('/veterinarian/appointments')
  }

  async function sendChat(prompt?: string) {
    const text = (prompt ?? chat).trim()
    if (!text) return
    const response = enviarChat(appointmentId, text, vetId)
    if (typeof response === 'string') {
      feedback(response, '')
      return
    }
    setSuggestions(response.sugestoes)
    setChat('')
  }

  return (
    <div
      className="grid gap-4"
      style={{ animation: 'tt-surgir 0.6s ease both' }}
    >
      <PageHeader
        eyebrow="Veterinário"
        title="Atendimento"
        description={`${pet?.nome} · ${(appointment.tipo ?? appointment.motivo).toLowerCase()} · iniciado às ${startedAt}`}
        actions={
          <>
            <Button
              radius="xl"
              size="sm"
              variant="light"
              color="violet"
              leftSection={<FiSave size={14} />}
              disabled={closed}
              onClick={saveDraft}
            >
              Salvar rascunho
            </Button>
            <Button
              radius="xl"
              size="sm"
              variant="gradient"
              gradient={{ from: '#7434d6', to: '#a855f7', deg: 135 }}
              leftSection={<FiCheck size={14} />}
              disabled={closed}
              onClick={finish}
            >
              Finalizar atendimento
            </Button>
          </>
        }
      />

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.85fr)]">
        <div className="grid gap-4">
          <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div
                className={cx(
                  'grid h-12 w-12 shrink-0 place-items-center rounded-full text-sm font-semibold',
                  petTone(0),
                )}
              >
                {initials(pet?.nome ?? 'P')}
              </div>
              <div className="min-w-0 flex-1">
                <Text size="md" fw={600} c="#334155">
                  {pet?.nome}
                </Text>
                <Text size="sm" c="dimmed" mt={2}>
                  {pet?.raca} · {pet ? ageLabel(pet.nascimento) : '—'} ·{' '}
                  {tutor?.nome}
                </Text>
                <Group gap={6} mt={8} wrap="wrap">
                  {allergy && (
                    <Badge
                      radius="sm"
                      variant="light"
                      color="orange"
                      tt="none"
                      size="sm"
                    >
                      {allergy}
                    </Badge>
                  )}
                  {plan && (
                    <Badge
                      radius="sm"
                      variant="light"
                      color="violet"
                      tt="none"
                      size="sm"
                    >
                      {plan.nome}
                    </Badge>
                  )}
                </Group>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
            <Text size="sm" fw={600} c="#64748b" mb="md">
              Exame físico
            </Text>
            <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
              <Field
                label="Peso"
                value={peso}
                onChange={setPeso}
                suffix="kg"
                icon={<LuWeight size={15} />}
                disabled={closed}
              />
              <Field
                label="Temperatura"
                value={temp}
                onChange={setTemp}
                suffix="°C"
                icon={<FiThermometer size={15} />}
                disabled={closed}
              />
              <Field
                label="Freq. cardíaca"
                value={fc}
                onChange={setFc}
                suffix="bpm"
                icon={<FiActivity size={15} />}
                disabled={closed}
              />
              <Field
                label="Mucosas"
                value={mucosas}
                onChange={setMucosas}
                icon={<MdOutlineBloodtype size={16} />}
                disabled={closed}
              />
            </div>

            <Textarea
              label="Queixa e anamnese"
              value={queixa}
              disabled={closed}
              onChange={(event) => setQueixa(event.target.value)}
              minRows={3}
              radius="md"
              mt="lg"
              styles={{
                label: { color: '#64748b', fontWeight: 600, fontSize: 13 },
              }}
            />
            <Textarea
              label="Diagnóstico"
              value={diagnostico}
              disabled={closed}
              onChange={(event) => setDiagnostico(event.target.value)}
              minRows={2}
              radius="md"
              mt="md"
              styles={{
                label: { color: '#64748b', fontWeight: 600, fontSize: 13 },
              }}
            />
          </div>

          <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
            <Group justify="space-between" align="center" mb="md">
              <Text size="sm" fw={600} c="#64748b">
                Receita
              </Text>
              <Button
                variant="subtle"
                color="#7434d6"
                size="compact-sm"
                leftSection={<FiPlus size={14} />}
                disabled={closed}
                onClick={() => setMeds((prev) => [...prev, newMed()])}
              >
                Adicionar medicamento
              </Button>
            </Group>

            <div className="grid gap-2">
              <div className="hidden grid-cols-[1.2fr_1fr_0.7fr_40px] gap-2 px-1 sm:grid">
                <Text size="xs" c="dimmed">
                  Medicamento
                </Text>
                <Text size="xs" c="dimmed">
                  Posologia
                </Text>
                <Text size="xs" c="dimmed">
                  Duração
                </Text>
                <span />
              </div>
              {meds.map((med) => (
                <div
                  key={med.id}
                  className="grid gap-2 sm:grid-cols-[1.2fr_1fr_0.7fr_40px]"
                >
                  <TextInput
                    value={med.nome}
                    disabled={closed}
                    placeholder="Medicamento"
                    radius="md"
                    onChange={(event) =>
                      setMeds((prev) =>
                        prev.map((item) =>
                          item.id === med.id
                            ? { ...item, nome: event.currentTarget.value }
                            : item,
                        ),
                      )
                    }
                  />
                  <TextInput
                    value={med.uso}
                    disabled={closed}
                    placeholder="Posologia"
                    radius="md"
                    onChange={(event) =>
                      setMeds((prev) =>
                        prev.map((item) =>
                          item.id === med.id
                            ? { ...item, uso: event.currentTarget.value }
                            : item,
                        ),
                      )
                    }
                  />
                  <TextInput
                    value={med.duracao}
                    disabled={closed}
                    placeholder="Duração"
                    radius="md"
                    onChange={(event) =>
                      setMeds((prev) =>
                        prev.map((item) =>
                          item.id === med.id
                            ? { ...item, duracao: event.currentTarget.value }
                            : item,
                        ),
                      )
                    }
                  />
                  <Button
                    variant="subtle"
                    color="gray"
                    radius="md"
                    disabled={closed}
                    onClick={() =>
                      setMeds((prev) =>
                        prev.filter((item) => item.id !== med.id),
                      )
                    }
                    aria-label="Remover"
                    className="px-0"
                  >
                    <FiX size={16} />
                  </Button>
                </div>
              ))}
            </div>

            <Group gap="xs" wrap="wrap" mt="lg">
              <Button
                radius="xl"
                size="compact-sm"
                variant="light"
                color="teal"
                leftSection={<FiFileText size={13} />}
                disabled={closed}
                onClick={() => setVaccineOpen((open) => !open)}
              >
                Registrar vacina
              </Button>
              <Button
                radius="xl"
                size="compact-sm"
                variant="light"
                color="cyan"
                leftSection={<FiCalendar size={13} />}
                disabled={closed}
                onClick={() =>
                  feedback('', 'Agendamento de retorno disponível em breve.')
                }
              >
                Agendar retorno
              </Button>
              <Button
                radius="xl"
                size="compact-sm"
                variant="light"
                color="grape"
                leftSection={<FiFileText size={13} />}
                onClick={() =>
                  feedback('', 'Pré-visualização de PDF disponível em breve.')
                }
              >
                Pré-visualizar PDF
              </Button>
            </Group>

            {vaccineOpen && (
              <form
                className="mt-4 grid gap-3 rounded-2xl bg-slate-50 p-4 sm:grid-cols-3"
                onSubmit={(event) => {
                  event.preventDefault()
                  feedback(
                    salvarVacina({
                      petId: appointment.petId,
                      nome: vaccine,
                      aplicadaEm: appliedOn,
                      proximaDose: nextDose,
                      veterinarioId: vetId,
                      consultaId: appointmentId,
                    }),
                    'Vacina lançada na carteira.',
                  )
                  setVaccineOpen(false)
                }}
              >
                <TextInput
                  value={vaccine}
                  onChange={(event) => setVaccine(event.currentTarget.value)}
                  placeholder="Vacina"
                  radius="md"
                />
                <TextInput
                  type="date"
                  value={appliedOn}
                  onChange={(event) => setAppliedOn(event.currentTarget.value)}
                  radius="md"
                />
                <TextInput
                  type="date"
                  value={nextDose}
                  onChange={(event) => setNextDose(event.currentTarget.value)}
                  radius="md"
                />
                <Button
                  type="submit"
                  radius="md"
                  variant="gradient"
                  gradient={{ from: '#7434d6', to: '#a855f7', deg: 135 }}
                  className="sm:col-span-3"
                >
                  Salvar vacina
                </Button>
              </form>
            )}
          </div>
        </div>

        <div className="flex min-h-[560px] flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm xl:sticky xl:top-4">
          <div className="border-b border-slate-100 px-5 py-4">
            <Group gap={8}>
              <HiOutlineSparkles size={16} className="text-[#7434d6]" />
              <Text size="sm" fw={600} c="#334155">
                Assistente IA
              </Text>
            </Group>
            <Text size="xs" c="dimmed" mt={4}>
              usa o histórico do {pet?.nome}
            </Text>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
            {messages.length === 0 && suggestions.length === 0 && (
              <Text size="sm" c="dimmed" className="rounded-2xl bg-slate-50 p-3">
                Pergunte sobre dose, histórico, interações ou peça um resumo do
                caso.
              </Text>
            )}
            {messages.map((message) => (
              <Text
                key={message.id}
                size="sm"
                className={cx(
                  'rounded-2xl px-3 py-2.5 whitespace-pre-wrap',
                  message.autor === 'vet'
                    ? 'ml-6 bg-[#7434d6] text-white'
                    : 'mr-2 bg-slate-100 text-slate-700',
                )}
              >
                {message.texto}
              </Text>
            ))}
            {suggestions.map((suggestion) => (
              <div
                key={`${suggestion.tipo}-${suggestion.titulo}`}
                className="rounded-2xl border border-[#e4d4f7] bg-[#faf7ff] p-3"
              >
                <Text size="sm" fw={600} c="#7434d6">
                  {suggestion.titulo}
                </Text>
                <Text size="sm" c="dimmed" mt={4}>
                  {suggestion.conteudo}
                </Text>
                <Button
                  variant="subtle"
                  color="#7434d6"
                  size="compact-xs"
                  disabled={closed}
                  onClick={() => applySuggestion(suggestion)}
                  mt={6}
                >
                  Usar no formulário
                </Button>
              </div>
            ))}
          </div>

          <div className="grid gap-3 border-t border-slate-100 px-5 py-4">
            <Group gap={6} wrap="wrap">
              {QUICK.map((label) => (
                <Button
                  key={label}
                  radius="xl"
                  size="compact-xs"
                  variant="light"
                  color="violet"
                  disabled={closed}
                  onClick={() => sendChat(label)}
                >
                  {label}
                </Button>
              ))}
            </Group>
            <form
              className="flex items-center gap-2"
              onSubmit={(event) => {
                event.preventDefault()
                sendChat()
              }}
            >
              <TextInput
                value={chat}
                disabled={closed}
                onChange={(event) => setChat(event.currentTarget.value)}
                placeholder="Pergunte sobre o caso"
                radius="xl"
                className="min-w-0 flex-1"
              />
              <Button
                type="submit"
                radius="xl"
                variant="gradient"
                gradient={{ from: '#7434d6', to: '#a855f7', deg: 135 }}
                disabled={closed}
                aria-label="Enviar"
                className="h-9 w-9 shrink-0 p-0"
              >
                <FiArrowRight size={16} />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  suffix,
  icon,
  disabled,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  suffix?: string
  icon?: ReactNode
  disabled?: boolean
}) {
  return (
    <TextInput
      label={label}
      value={value}
      disabled={disabled}
      onChange={(event) => onChange(event.currentTarget.value)}
      radius="md"
      leftSection={icon}
      rightSection={
        suffix ? (
          <Text size="xs" c="dimmed">
            {suffix}
          </Text>
        ) : undefined
      }
      styles={{
        label: { color: '#64748b', fontWeight: 500, fontSize: 12 },
        input: { minHeight: 42 },
      }}
    />
  )
}
