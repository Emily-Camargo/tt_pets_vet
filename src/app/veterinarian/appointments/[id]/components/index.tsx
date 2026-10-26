'use client'

import { Card, Input } from '@grazziotin/react-components-next/ui'
import { Button, Text, Textarea } from '@mantine/core'
import Grid from '@mui/material/Grid'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { feedback } from '@/core/functions/feedback'
import { dataHora } from '@/core/functions/format'
import { useUsuario } from '@/core/hooks/use-session'
import {
  concluirConsulta,
  enviarChat,
  salvarProntuario,
  salvarReceita,
  salvarVacina,
} from '@/service/mock/actions'
import type { Sugestao } from '@/service/mock/chat'

export function AppointmentDetail({ appointmentId }: { appointmentId: string }) {
  const { banco, usuario } = useUsuario()
  const router = useRouter()
  const appointment = banco.consultas.find((item) => item.id === appointmentId)
  const [text, setText] = useState('')
  const [suggestions, setSuggestions] = useState<Sugestao[]>([])
  const [record, setRecord] = useState(
    banco.prontuarios.find((item) => item.consultaId === appointmentId)?.texto ?? '',
  )
  const [prescription, setPrescription] = useState('')
  const [vaccine, setVaccine] = useState('V10')
  const [appliedOn, setAppliedOn] = useState(new Date().toISOString().slice(0, 10))
  const [nextDose, setNextDose] = useState('')

  if (!appointment || !usuario) return <Text>Consulta não encontrada.</Text>
  if (appointment.veterinarioId !== usuario.veterinarioId) {
    return <Text>Consulta de outro veterinário.</Text>
  }

  const vetId = appointment.veterinarioId
  const pet = banco.pets.find((item) => item.id === appointment.petId)
  const tutor = banco.tutores.find((item) => item.id === appointment.tutorId)
  const messages = banco.mensagens.filter((item) => item.consultaId === appointmentId)
  const closed = appointment.status === 'realizada' || appointment.status === 'cancelada'

  function applySuggestion(suggestion: Sugestao) {
    if (suggestion.tipo === 'prontuario') setRecord(suggestion.conteudo)
    if (suggestion.tipo === 'receita') setPrescription(suggestion.conteudo)
    if (suggestion.tipo === 'vacina' && suggestion.vacina) {
      setVaccine(suggestion.vacina.nome)
      const next = new Date()
      next.setDate(next.getDate() + suggestion.vacina.proximaDoseDias)
      setNextDose(next.toISOString().slice(0, 10))
    }
    feedback(null, 'Sugestão colocada no formulário. Revise e salve.')
  }

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, lg: 7 }}>
        <Card title={pet?.nome ?? 'Pet'} titleColor="#7434d6" borderRadius="16px">
          <div className="p-4">
            <Text size="sm" c="dimmed">
              {pet?.especie} · {pet?.raca} · tutor {tutor?.nome}
            </Text>
            <Text size="sm" mt={8}>
              {dataHora(appointment.dataHora)} · {appointment.motivo}
            </Text>
          </div>
        </Card>
        <Card title="Chat de apoio" titleColor="#7434d6" borderRadius="16px">
          <div className="space-y-3 p-4">
            <Text size="sm" c="dimmed">
              Demonstração local. Não chama um modelo externo.
            </Text>
            <div className="max-h-80 space-y-2 overflow-y-auto">
              {messages.map((message) => (
                <p
                  key={message.id}
                  className={
                    message.autor === 'ia'
                      ? 'rounded-2xl bg-[#f6f1fc] p-3 text-sm'
                      : 'rounded-2xl bg-slate-100 p-3 text-sm'
                  }
                >
                  <span className="font-semibold">{message.autor === 'ia' ? 'Apoio' : 'Você'}: </span>
                  {message.texto}
                </p>
              ))}
            </div>
            {suggestions.map((suggestion) => (
              <div key={suggestion.titulo} className="rounded-2xl border border-[#e4d4f7] p-3">
                <Text fw={600} c="#5f28b8" size="sm">
                  {suggestion.titulo}
                </Text>
                <Text size="sm">{suggestion.conteudo}</Text>
                <Button mt="xs" variant="outline" color="#7434d6" onClick={() => applySuggestion(suggestion)}>
                  Usar no formulário
                </Button>
              </div>
            ))}
            <form
              className="flex gap-2"
              onSubmit={(event) => {
                event.preventDefault()
                const response = enviarChat(appointmentId, text, vetId)
                if (typeof response === 'string') {
                  feedback(response, '')
                  return
                }
                setSuggestions(response)
                setText('')
              }}
            >
              <Input
                value={text}
                placeholder="Ex.: coceira, vômito, vacina, retorno"
                onChange={(event) => setText(event.target.value)}
              />
              <Button type="submit" color="#7434d6" disabled={closed}>
                Enviar
              </Button>
            </form>
          </div>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, lg: 5 }}>
        <Card title="Prontuário" titleColor="#7434d6" borderRadius="16px">
          <form
            className="space-y-3 p-4"
            onSubmit={(event) => {
              event.preventDefault()
              feedback(salvarProntuario(appointmentId, record, vetId), 'Prontuário salvo.')
            }}
          >
            <Textarea value={record} minRows={4} onChange={(event) => setRecord(event.target.value)} />
            <Button type="submit" color="#7434d6" disabled={closed}>
              Salvar prontuário
            </Button>
          </form>
        </Card>
        <Card title="Receita" titleColor="#7434d6" borderRadius="16px">
          <form
            className="space-y-3 p-4"
            onSubmit={(event) => {
              event.preventDefault()
              const error = salvarReceita(appointmentId, prescription, vetId)
              feedback(error, 'Receita registrada.')
              if (!error) setPrescription('')
            }}
          >
            <Textarea
              value={prescription}
              minRows={3}
              onChange={(event) => setPrescription(event.target.value)}
            />
            <Button type="submit" color="#7434d6" disabled={closed}>
              Registrar receita
            </Button>
          </form>
        </Card>
        <Card title="Vacina aplicada" titleColor="#7434d6" borderRadius="16px">
          <form
            className="space-y-3 p-4"
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
            }}
          >
            <Input label="Vacina" value={vaccine} onChange={(event) => setVaccine(event.target.value)} />
            <Input
              label="Data"
              type="date"
              value={appliedOn}
              onChange={(event) => setAppliedOn(event.target.value)}
            />
            <Input
              label="Próxima dose"
              type="date"
              value={nextDose}
              onChange={(event) => setNextDose(event.target.value)}
            />
            <Button type="submit" color="#7434d6" disabled={closed}>
              Lançar vacina
            </Button>
          </form>
        </Card>
        <Button
          fullWidth
          color="#7434d6"
          disabled={closed}
          onClick={() => {
            const error = concluirConsulta(appointmentId, vetId)
            feedback(error, 'Atendimento concluído.')
            if (!error) router.push('/veterinarian/appointments')
          }}
        >
          Concluir atendimento
        </Button>
      </Grid>
    </Grid>
  )
}
