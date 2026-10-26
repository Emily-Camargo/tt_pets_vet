'use client'

import { Card } from '@grazziotin/react-components-next/ui'
import { Badge, Button, Group, Text, Title } from '@mantine/core'
import Grid from '@mui/material/Grid'
import Link from 'next/link'

import { moeda } from '@/core/functions/format'
import type { Banco, Usuario } from '@/core/interfaces/types'

import { CardMetric } from './card-metric'
import { CardShortcut } from './card-shortcut'
import { firstName } from '../utils/functions'

export function AdminHome({ bank, user }: { bank: Banco; user: Usuario }) {
  const active = bank.veterinarios.filter((item) => item.ativo)
  const revenue = bank.assinaturas
    .filter((item) => item.status === 'ativa')
    .reduce((total, item) => {
      const plan = bank.planos.find((current) => current.id === item.planoId)
      return total + (plan?.precoMensal ?? 0)
    }, 0)
  const activePlans = bank.planos.filter((item) => item.ativo).length

  return (
    <div className="space-y-4">
      <Title order={2}>Olá, {firstName(user.nome)}</Title>
      <Text c="dimmed" size="sm">
        Admin da plataforma · Veterinários, cidades e planos.
      </Text>
      <Group>
        <Button component={Link} href="/admin/veterinarians" color="#7434d6">
          Cadastrar veterinário
        </Button>
      </Group>
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
          <CardMetric label="Veterinários ativos" value={String(active.length)} detail={`${bank.veterinarios.length - active.length} inativos`} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
          <CardMetric label="Receita dos planos" value={moeda(revenue)} detail="Soma das assinaturas ativas" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
          <CardMetric label="Planos ativos" value={String(activePlans)} detail={`${bank.planos.length} cadastrados`} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
          <CardMetric label="Tutores e pets" value={`${bank.tutores.length} · ${bank.pets.length}`} detail="contas de exemplo" />
        </Grid>
      </Grid>
      <Card title="Veterinários" titleColor="#7434d6" borderRadius="16px">
        <div className="space-y-2 p-4">
          {bank.veterinarios.map((vet) => (
            <Group key={vet.id} justify="space-between">
              <Text size="sm">{vet.nome}</Text>
              <Badge color={vet.ativo ? 'teal' : 'yellow'}>{vet.ativo ? 'Ativo' : 'Inativo'}</Badge>
            </Group>
          ))}
        </div>
      </Card>
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <CardShortcut href="/admin/veterinarians" label="Veterinários" />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <CardShortcut href="/admin/cities" label="Cidades" />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <CardShortcut href="/admin/plans" label="Planos" />
        </Grid>
      </Grid>
    </div>
  )
}
