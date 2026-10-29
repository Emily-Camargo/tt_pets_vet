'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

import { initials, petTone } from '@/app/tutor/appointments/utils/functions'
import { ageLabel } from '@/app/tutor/pets/utils/functions'
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
    return <p className="text-sm text-slate-500">Consulta não encontrada.</p>
  }
  if (appointment.veterinarioId !== usuario.veterinarioId) {
    return (
      <p className="text-sm text-slate-500">Consulta de outro veterinário.</p>
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
  const allergy = pet?.observacoes?.toLowerCase().includes('alergia')
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
      className="space-y-4"
      style={{ animation: 'tt-surgir 0.6s ease both' }}
    >
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-marca uppercase">
            Veterinário
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
            Atendimento
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {pet?.nome} ·{' '}
            {(appointment.tipo ?? appointment.motivo).toLowerCase()} · iniciado
            às {startedAt}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={closed}
            onClick={saveDraft}
            className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:border-slate-300 disabled:opacity-50"
          >
            Salvar rascunho
          </button>
          <button
            type="button"
            disabled={closed}
            onClick={finish}
            className="rounded-full bg-marca px-4 py-2.5 text-sm font-medium text-white hover:bg-marca-forte disabled:opacity-50"
          >
            ✓ Finalizar atendimento
          </button>
        </div>
      </header>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span
                  className={cx(
                    'inline-flex h-14 w-14 items-center justify-center rounded-2xl text-base font-bold',
                    petTone(0),
                  )}
                >
                  {initials(pet?.nome ?? 'P')}
                </span>
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    {pet?.nome}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {pet?.raca} · {pet ? ageLabel(pet.nascimento) : '—'} ·
                    Tutora {tutor?.nome}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {allergy && (
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                    ⚠️ {allergy}
                  </span>
                )}
                {plan && (
                  <span className="rounded-full bg-[#f6f1fc] px-3 py-1 text-xs font-semibold text-marca">
                    {plan.nome}
                  </span>
                )}
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900">
              Exame físico
            </h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Field
                label="Peso"
                value={peso}
                onChange={setPeso}
                suffix="kg"
                disabled={closed}
              />
              <Field
                label="Temperatura"
                value={temp}
                onChange={setTemp}
                suffix="°C"
                disabled={closed}
              />
              <Field
                label="Freq. cardíaca"
                value={fc}
                onChange={setFc}
                suffix="bpm"
                disabled={closed}
              />
              <Field
                label="Mucosas"
                value={mucosas}
                onChange={setMucosas}
                disabled={closed}
              />
            </div>
            <label className="mt-4 block">
              <span className="text-xs font-medium text-slate-500">
                Queixa e anamnese
              </span>
              <textarea
                value={queixa}
                disabled={closed}
                onChange={(event) => setQueixa(event.target.value)}
                rows={3}
                className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-marca"
              />
            </label>
            <label className="mt-3 block">
              <span className="text-xs font-medium text-slate-500">
                Diagnóstico
              </span>
              <textarea
                value={diagnostico}
                disabled={closed}
                onChange={(event) => setDiagnostico(event.target.value)}
                rows={2}
                className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-marca"
              />
            </label>
          </section>

          <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-base font-semibold text-slate-900">
                Receita
              </h3>
              <button
                type="button"
                disabled={closed}
                onClick={() => setMeds((prev) => [...prev, newMed()])}
                className="text-sm font-medium text-marca hover:underline disabled:opacity-50"
              >
                + Adicionar medicamento
              </button>
            </div>
            <div className="mt-4 space-y-2">
              {meds.map((med) => (
                <div
                  key={med.id}
                  className="grid gap-2 sm:grid-cols-[1.2fr_1fr_0.7fr_auto]"
                >
                  <input
                    value={med.nome}
                    disabled={closed}
                    placeholder="Medicamento"
                    onChange={(event) =>
                      setMeds((prev) =>
                        prev.map((item) =>
                          item.id === med.id
                            ? { ...item, nome: event.target.value }
                            : item,
                        ),
                      )
                    }
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-marca"
                  />
                  <input
                    value={med.uso}
                    disabled={closed}
                    placeholder="Posologia"
                    onChange={(event) =>
                      setMeds((prev) =>
                        prev.map((item) =>
                          item.id === med.id
                            ? { ...item, uso: event.target.value }
                            : item,
                        ),
                      )
                    }
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-marca"
                  />
                  <input
                    value={med.duracao}
                    disabled={closed}
                    placeholder="Duração"
                    onChange={(event) =>
                      setMeds((prev) =>
                        prev.map((item) =>
                          item.id === med.id
                            ? { ...item, duracao: event.target.value }
                            : item,
                        ),
                      )
                    }
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-marca"
                  />
                  <button
                    type="button"
                    disabled={closed}
                    onClick={() =>
                      setMeds((prev) =>
                        prev.filter((item) => item.id !== med.id),
                      )
                    }
                    className="rounded-xl px-3 text-slate-400 hover:bg-slate-100 hover:text-rose-500 disabled:opacity-50"
                    aria-label="Remover"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                disabled={closed}
                onClick={() => setVaccineOpen((open) => !open)}
                className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:border-slate-300 disabled:opacity-50"
              >
                💉 Registrar vacina
              </button>
              <button
                type="button"
                disabled={closed}
                onClick={() =>
                  feedback('', 'Agendamento de retorno disponível em breve.')
                }
                className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:border-slate-300 disabled:opacity-50"
              >
                📅 Agendar retorno
              </button>
              <button
                type="button"
                onClick={() =>
                  feedback('', 'Pré-visualização de PDF disponível em breve.')
                }
                className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:border-slate-300"
              >
                📄 Pré-visualizar PDF
              </button>
            </div>

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
                <input
                  value={vaccine}
                  onChange={(event) => setVaccine(event.target.value)}
                  placeholder="Vacina"
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                />
                <input
                  type="date"
                  value={appliedOn}
                  onChange={(event) => setAppliedOn(event.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                />
                <input
                  type="date"
                  value={nextDose}
                  onChange={(event) => setNextDose(event.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                />
                <button
                  type="submit"
                  className="rounded-full bg-marca px-4 py-2 text-sm font-medium text-white sm:col-span-3"
                >
                  Salvar vacina
                </button>
              </form>
            )}
          </section>
        </div>

        <aside className="flex h-fit flex-col rounded-3xl border border-slate-100 bg-white shadow-sm xl:sticky xl:top-4">
          <div className="border-b border-slate-100 px-5 py-4">
            <h3 className="text-base font-semibold text-slate-900">
              ✨ Assistente IA
            </h3>
            <p className="text-xs text-slate-400">
              usa o histórico do {pet?.nome}
            </p>
          </div>

          <div className="max-h-[420px] space-y-3 overflow-y-auto px-5 py-4">
            {messages.length === 0 && (
              <p className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-500">
                Pergunte sobre dose, histórico, interações ou peça um resumo do
                caso.
              </p>
            )}
            {messages.map((message) => (
              <div
                key={message.id}
                className={cx(
                  'rounded-2xl px-3 py-2.5 text-sm whitespace-pre-wrap',
                  message.autor === 'vet'
                    ? 'ml-6 bg-marca text-white'
                    : 'mr-2 bg-slate-100 text-slate-700',
                )}
              >
                {message.texto}
              </div>
            ))}
            {suggestions.map((suggestion) => (
              <div
                key={`${suggestion.tipo}-${suggestion.titulo}`}
                className="rounded-2xl border border-[#e4d4f7] bg-[#faf7ff] p-3"
              >
                <p className="text-sm font-semibold text-marca">
                  {suggestion.titulo}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  {suggestion.conteudo}
                </p>
                <button
                  type="button"
                  disabled={closed}
                  onClick={() => applySuggestion(suggestion)}
                  className="mt-2 text-xs font-semibold text-marca hover:underline"
                >
                  Usar no formulário
                </button>
              </div>
            ))}
          </div>

          <div className="mt-auto space-y-3 border-t border-slate-100 px-5 py-4">
            <div className="flex flex-wrap gap-2">
              {QUICK.map((label) => (
                <button
                  key={label}
                  type="button"
                  disabled={closed}
                  onClick={() => sendChat(label)}
                  className="rounded-full border border-marca/30 px-2.5 py-1 text-[11px] font-medium text-marca hover:bg-[#f6f1fc] disabled:opacity-50"
                >
                  {label}
                </button>
              ))}
            </div>
            <form
              className="flex gap-2"
              onSubmit={(event) => {
                event.preventDefault()
                sendChat()
              }}
            >
              <input
                value={chat}
                disabled={closed}
                onChange={(event) => setChat(event.target.value)}
                placeholder="Pergunte sobre o caso"
                className="min-w-0 flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-marca"
              />
              <button
                type="submit"
                disabled={closed}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-marca text-white hover:bg-marca-forte disabled:opacity-50"
                aria-label="Enviar"
              >
                →
              </button>
            </form>
          </div>
        </aside>
      </div>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  suffix,
  disabled,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  suffix?: string
  disabled?: boolean
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-slate-500">{label}</span>
      <div className="relative mt-1.5">
        <input
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-marca"
        />
        {suffix && (
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-slate-400">
            {suffix}
          </span>
        )}
      </div>
    </label>
  )
}
