'use client'

import { Text } from '@mantine/core'
import { CalendarMonth, Groups, MedicalServices } from '@mui/icons-material'

import { hora, moeda, rotuloStatus } from '@/core/functions/format'
import type { Banco, Consulta, Usuario } from '@/core/interfaces/types'
import { consultaAtiva, resumo } from '@/service/mock/rules'

import { Bars, Hero, HomeFrame, Metric, Panel, PanelHead } from './frame'
import { firstName, sameDay, startOfDay } from '../utils/functions'

export function VeterinarianHome({
  bank,
  user,
}: {
  bank: Banco
  user: Usuario
}) {
  const veterinarianId = user.veterinarioId ?? ''
  const data = resumo(bank, { veterinarioId: veterinarianId })
  const veterinarian = bank.veterinarios.find(
    (item) => item.id === veterinarianId,
  )
  const today = new Date()
  const todayItems = data.consultas.filter(
    (item) => item.status !== 'cancelada' && sameDay(item.dataHora, today),
  )
  const done = todayItems.filter((item) => item.status === 'realizada').length
  const upcoming = data.consultas
    .filter(
      (item) =>
        consultaAtiva(item.status) &&
        new Date(item.dataHora) >= startOfDay(today),
    )
    .sort((a, b) => a.dataHora.localeCompare(b.dataHora))
  const next = upcoming[0]
  const nextPet = bank.pets.find((item) => item.id === next?.petId)
  const clients = new Set(
    data.consultas
      .filter((item) => item.status !== 'cancelada')
      .map((item) => item.tutorId),
  )
  const petsSeen = new Set(
    data.consultas
      .filter((item) => item.status !== 'cancelada')
      .map((item) => item.petId),
  )
  const cities =
    veterinarian?.cidadeIds
      .map((id) => bank.cidades.find((item) => item.id === id)?.nome)
      .filter(Boolean)
      .join(' e ') || 'Sem cidade'
  const careHref = next
    ? `/veterinarian/appointments/${next.id}`
    : '/veterinarian/appointments'
  const week = weekDays().map((day) => ({
    label: day
      .toLocaleDateString('pt-BR', { weekday: 'short' })
      .replace('.', '')
      .slice(0, 3),
    value: data.consultas.filter(
      (item) => item.status !== 'cancelada' && sameDay(item.dataHora, day),
    ).length,
  }))
  const agenda = todayItems.length > 0 ? todayItems : upcoming

  return (
    <HomeFrame>
      <Hero
        profile="Veterinário"
        name={firstName(user.nome)}
        text="Sua agenda de visitas, seus pacientes e seus resultados num lugar só."
        mascot="dog"
        chips={[
          `${todayItems.length} ${todayItems.length === 1 ? 'visita hoje' : 'visitas hoje'}`,
          next && nextPet
            ? `Próxima: ${hora(next.dataHora)} · ${nextPet.nome}`
            : 'Sem visita marcada',
          cities,
        ]}
        primary={{
          href: '/veterinarian/schedule',
          label: 'Abrir minha agenda',
        }}
        secondary={{ href: careHref, label: 'Iniciar atendimento' }}
      />
      <div className="grid grid-cols-4 gap-3 max-md:grid-cols-2 max-sm:grid-cols-1">
        <Metric
          icon={<CalendarMonth sx={{ fontSize: 18 }} />}
          tone="bg-marca-anel text-marca"
          label="Visitas hoje"
          value={`${todayItems.length} ${todayItems.length === 1 ? 'agendada' : 'agendadas'}`}
          detail={`${done} ${done === 1 ? 'concluída' : 'concluídas'} · ${todayItems.length - done} ${todayItems.length - done === 1 ? 'pendente' : 'pendentes'}`}
        />
        <Metric
          icon={<span className="text-base">💰</span>}
          tone="bg-emerald-50 text-emerald-600"
          label="Faturamento do mês"
          value={moeda(data.mrr)}
          detail={`${data.assinaturas} ${data.assinaturas === 1 ? 'assinatura ativa' : 'assinaturas ativas'}`}
        />
        <Metric
          icon={<MedicalServices sx={{ fontSize: 18 }} />}
          tone="bg-sky-50 text-sky-600"
          label="Atendimentos no mês"
          value={String(data.realizadasMes)}
          detail={`${data.agendadas} em aberto`}
        />
        <Metric
          icon={<Groups sx={{ fontSize: 18 }} />}
          tone="bg-amber-50 text-amber-600"
          label="Clientes ativos"
          value={String(clients.size)}
          detail={`${petsSeen.size} ${petsSeen.size === 1 ? 'pet atendido' : 'pets atendidos'}`}
        />
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        <Panel>
          <PanelHead
            title={
              todayItems.length > 0 ? 'Agenda de hoje' : 'Próximas visitas'
            }
            href="/veterinarian/schedule"
            action="Ver agenda completa"
          />
          {agenda.length === 0 ? (
            <Text size="sm" c="dimmed" mt="md">
              Nenhuma visita por perto.
            </Text>
          ) : (
            <div className="mt-3 divide-y divide-slate-100">
              {agenda.slice(0, 4).map((item) => (
                <AppointmentRow key={item.id} bank={bank} appointment={item} />
              ))}
            </div>
          )}
        </Panel>
        <Panel>
          <PanelHead
            title="Atendimentos na semana"
            href="/veterinarian/dashboard"
            action="Ver financeiro"
          />
          <Bars items={week} />
        </Panel>
      </div>
    </HomeFrame>
  )
}

function AppointmentRow({
  bank,
  appointment,
}: {
  bank: Banco
  appointment: Consulta
}) {
  const pet = bank.pets.find((item) => item.id === appointment.petId)
  const tutor = bank.tutores.find((item) => item.id === appointment.tutorId)
  const city = bank.cidades.find((item) => item.id === appointment.cidadeId)

  return (
    <div className="flex items-center gap-3 py-3">
      <Text size="sm" fw={600} c="#7434d6" className="w-12 shrink-0">
        {hora(appointment.dataHora)}
      </Text>
      <div className="min-w-0">
        <Text size="sm" fw={600} c="#1e293b">
          {pet?.nome} · {appointment.motivo}
        </Text>
        <Text size="xs" c="dimmed">
          {tutor?.nome}
          {city ? ` · ${city.nome}` : ''} · {rotuloStatus(appointment.status)}
        </Text>
      </div>
    </div>
  )
}

function weekDays() {
  const today = startOfDay(new Date())
  const monday = new Date(today)
  const weekday = monday.getDay()
  monday.setDate(monday.getDate() + (weekday === 0 ? -6 : 1 - weekday))
  return Array.from({ length: 6 }, (_, index) => {
    const day = new Date(monday)
    day.setDate(monday.getDate() + index)
    return day
  })
}
