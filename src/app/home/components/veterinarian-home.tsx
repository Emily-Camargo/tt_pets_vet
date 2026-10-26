'use client'

import { Card } from '@grazziotin/react-components-next/ui'
import { Button, Group, Text, Title } from '@mantine/core'
import Grid from '@mui/material/Grid'
import Link from 'next/link'

import {
  hora,
  moeda,
  rotuloPerfil,
  rotuloStatus,
} from '@/core/functions/format'
import type { Banco, Usuario } from '@/core/interfaces/types'
import { consultaAtiva, resumo } from '@/service/mock/rules'

import { CardMetric } from './card-metric'
import { CardShortcut } from './card-shortcut'
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
  const careHref = next
    ? `/veterinarian/appointments/${next.id}`
    : '/veterinarian/appointments'

  return (
    <div className="space-y-4">
      <Title order={2}>Olá, {firstName(user.nome)}</Title>
      <Text c="dimmed" size="sm">
        {rotuloPerfil(user.perfil)} · Sua agenda de visitas, seus pacientes e
        seus resultados.
      </Text>
      <Group>
        <Button component={Link} href="/veterinarian/schedule" color="#7434d6">
          Abrir minha agenda
        </Button>
        <Button
          component={Link}
          href={careHref}
          variant="outline"
          color="#7434d6"
        >
          Iniciar atendimento
        </Button>
      </Group>
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
          <CardMetric
            label="Visitas hoje"
            value={String(todayItems.length)}
            detail={`${done} concluídas · ${todayItems.length - done} pendentes`}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
          <CardMetric
            label="Faturamento dos planos"
            value={moeda(data.mrr)}
            detail={`${data.assinaturas} assinaturas ativas`}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
          <CardMetric
            label="Atendimentos no mês"
            value={String(data.realizadasMes)}
            detail={`${data.agendadas} em aberto`}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
          <CardMetric
            label="Próxima visita"
            value={
              next && nextPet
                ? `${hora(next.dataHora)} · ${nextPet.nome}`
                : 'Nenhuma'
            }
            detail={next ? rotuloStatus(next.status) : 'Sem visita marcada'}
          />
        </Grid>
      </Grid>
      <Card title="Próximas visitas" titleColor="#7434d6" borderRadius="16px">
        <div className="space-y-2 p-4">
          {upcoming.length === 0 && (
            <Text c="dimmed">Nenhuma visita por perto.</Text>
          )}
          {upcoming.slice(0, 4).map((item) => {
            const pet = bank.pets.find((petItem) => petItem.id === item.petId)
            const tutor = bank.tutores.find(
              (tutorItem) => tutorItem.id === item.tutorId,
            )
            return (
              <Text key={item.id} size="sm">
                {hora(item.dataHora)} · {pet?.nome} · {tutor?.nome} ·{' '}
                {rotuloStatus(item.status)}
              </Text>
            )
          })}
        </div>
      </Card>
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
          <CardShortcut href="/veterinarian/schedule" label="Minha agenda" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
          <CardShortcut href={careHref} label="Atendimento com IA" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
          <CardShortcut href="/veterinarian/clients" label="Meus clientes" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
          <CardShortcut
            href="/veterinarian/dashboard"
            label="Meus resultados"
          />
        </Grid>
      </Grid>
    </div>
  )
}
