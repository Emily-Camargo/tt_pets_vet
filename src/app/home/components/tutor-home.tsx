'use client'

import { Card } from '@grazziotin/react-components-next/ui'
import { Button, Group, Text, Title } from '@mantine/core'
import Grid from '@mui/material/Grid'
import Link from 'next/link'

import {
  dataHora,
  hora,
  rotuloPerfil,
  rotuloStatus,
} from '@/core/functions/format'
import type { Banco, Usuario } from '@/core/interfaces/types'
import { consultaAtiva } from '@/service/mock/rules'

import { CardMetric } from './card-metric'
import { CardShortcut } from './card-shortcut'
import {
  ageLabel,
  daysUntil,
  firstName,
  inDays,
  whenLabel,
} from '../utils/functions'

export function TutorHome({ bank, user }: { bank: Banco; user: Usuario }) {
  const tutorId = user.tutorId ?? ''
  const pets = bank.pets.filter((item) => item.tutorId === tutorId)
  const appointments = bank.consultas
    .filter((item) => item.tutorId === tutorId && consultaAtiva(item.status))
    .sort((a, b) => a.dataHora.localeCompare(b.dataHora))
  const next = appointments[0]
  const nextPet = bank.pets.find((item) => item.id === next?.petId)
  const vaccines = bank.vacinas
    .filter((item) => pets.some((pet) => pet.id === item.petId))
    .map((item) => ({ ...item, days: daysUntil(item.proximaDose) }))
    .filter((item) => item.days <= 30)
    .sort((a, b) => a.days - b.days)
  const subscriptions = bank.assinaturas.filter(
    (item) => item.tutorId === tutorId && item.status === 'ativa',
  )
  const plan = subscriptions
    .map((item) => bank.planos.find((current) => current.id === item.planoId))
    .find((item) => item !== undefined)
  const alerts = bank.notificacoes.filter(
    (item) => item.tutorId === tutorId && !item.lida,
  )

  return (
    <div className="space-y-4">
      <Title order={2}>Olá, {firstName(user.nome)}</Title>
      <Text c="dimmed" size="sm">
        {rotuloPerfil(user.perfil)} · Vacinas, planos e a visita do veterinário.
      </Text>
      <Group>
        <Button component={Link} href="/tutor/appointments" color="#7434d6">
          Agendar consulta
        </Button>
        <Button
          component={Link}
          href="/tutor/vaccines"
          variant="outline"
          color="#7434d6"
        >
          Ver carteira de vacinação
        </Button>
      </Group>
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
          <CardMetric
            label="Próxima consulta"
            value={next ? whenLabel(next.dataHora) : 'Nenhuma'}
            detail={
              next && nextPet
                ? `${nextPet.nome} · ${dataHora(next.dataHora)}`
                : 'Agende quando quiser'
            }
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
          <CardMetric
            label="Vacinas a vencer"
            value={
              vaccines[0]
                ? `${vaccines.length} ${inDays(vaccines[0].proximaDose)}`
                : 'Em dia'
            }
            detail={vaccines[0]?.nome ?? 'Nenhuma dose próxima'}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
          <CardMetric
            label="Plano ativo"
            value={plan?.nome ?? 'Nenhum'}
            detail={plan?.subtitulo ?? 'Contrate para agendar'}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
          <CardMetric
            label="Notificações"
            value={String(alerts.length)}
            detail="não lidas"
          />
        </Grid>
      </Grid>
      <Card title="Meus pets" titleColor="#7434d6" borderRadius="16px">
        <div className="space-y-2 p-4">
          {pets.slice(0, 3).map((pet) => (
            <Text key={pet.id} size="sm">
              {pet.nome} · {pet.raca} · {ageLabel(pet.nascimento)} · {pet.peso}{' '}
              kg
            </Text>
          ))}
          {pets.length === 0 && <Text c="dimmed">Nenhum pet cadastrado.</Text>}
        </div>
      </Card>
      <Card title="Próximos cuidados" titleColor="#7434d6" borderRadius="16px">
        <div className="space-y-2 p-4">
          {appointments.slice(0, 4).map((item) => (
            <Text key={item.id} size="sm">
              {hora(item.dataHora)} · {item.motivo} ·{' '}
              {rotuloStatus(item.status)}
            </Text>
          ))}
          {appointments.length === 0 && (
            <Text c="dimmed">Nada marcado por enquanto.</Text>
          )}
        </div>
      </Card>
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
          <CardShortcut href="/tutor/appointments" label="Agendar consulta" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
          <CardShortcut href="/tutor/vaccines" label="Carteira de vacinação" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
          <CardShortcut href="/tutor/history" label="Histórico e receitas" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
          <CardShortcut href="/tutor/plans" label="Meu plano" />
        </Grid>
      </Grid>
    </div>
  )
}
