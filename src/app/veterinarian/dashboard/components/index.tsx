'use client'

import { Card } from '@grazziotin/react-components-next/ui'
import { Stack, Text } from '@mantine/core'
import Grid from '@mui/material/Grid'

import { Screen } from '@/core/components/screen'
import { dataHora, moeda, rotuloStatus } from '@/core/functions/format'
import { useUsuario } from '@/core/hooks/use-session'
import { resumo } from '@/service/mock/rules'

import { CardMetric } from './card-metric'

export function Dashboard() {
  const { banco, usuario } = useUsuario()
  const data = resumo(banco, { veterinarioId: usuario?.veterinarioId ?? '' })
  const recent = [...data.consultas].sort((a, b) => b.dataHora.localeCompare(a.dataHora)).slice(0, 5)
  const bars = [
    { label: 'Em aberto', value: data.agendadas },
    { label: 'Realizadas', value: data.realizadas },
    { label: 'Canceladas', value: data.canceladas },
  ]
  const max = Math.max(...bars.map((item) => item.value), 1)

  return (
    <Screen
      title="Meu painel"
      description="Receita dos seus planos ativos e dos atendimentos que você realiza."
    >
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <CardMetric label="Receita mensal" value={moeda(data.mrr)} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <CardMetric label="Planos ativos" value={String(data.assinaturas)} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <CardMetric label="Realizadas no mês" value={String(data.realizadasMes)} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <CardMetric label="Em aberto" value={String(data.agendadas)} />
        </Grid>
      </Grid>
      <Card title="Atendimentos" titleColor="#7434d6" borderRadius="16px">
        <div className="space-y-3 p-4">
          {bars.map((bar) => (
            <div key={bar.label}>
              <div className="mb-1 flex justify-between text-sm">
                <span>{bar.label}</span>
                <span className="font-semibold">{bar.value}</span>
              </div>
              <div className="h-3 rounded-full bg-slate-100">
                <div
                  className="h-3 rounded-full bg-[#7434d6]"
                  style={{ width: `${(bar.value / max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Stack gap="sm">
        {recent.map((appointment) => {
          const pet = banco.pets.find((item) => item.id === appointment.petId)
          const vet = banco.veterinarios.find((item) => item.id === appointment.veterinarioId)
          return (
            <Card
              key={appointment.id}
              title={`${pet?.nome} · ${rotuloStatus(appointment.status)}`}
              titleColor="#7434d6"
              borderRadius="16px"
            >
              <Text size="sm" c="dimmed" p="md">
                {dataHora(appointment.dataHora)} · {vet?.nome}
              </Text>
            </Card>
          )
        })}
      </Stack>
    </Screen>
  )
}
