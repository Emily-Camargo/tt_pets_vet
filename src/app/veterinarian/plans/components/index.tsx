'use client'

import {
  Badge,
  Button,
  Group,
  Switch,
  Text,
  Title,
} from '@mantine/core'
import { useMemo, useState } from 'react'

import { PlanForm } from '@/app/plans/components/plan-form'
import { PageHeader } from '@/core/components/page-header'
import { cx, moeda } from '@/core/functions/format'
import { feedback } from '@/core/functions/feedback'
import { useUsuario } from '@/core/hooks/use-session'
import type { Plano } from '@/core/interfaces/types'
import { alternarPlano } from '@/service/mock/actions'

import {
  cityTabs,
  featuredFirst,
  planSubscribers,
  plansForCity,
} from '../utils/functions'

export function VetPlans() {
  const { banco, usuario } = useUsuario()
  const veterinarianId = usuario?.veterinarioId ?? ''
  const tabs = useMemo(
    () => cityTabs(banco, veterinarianId),
    [banco, veterinarianId],
  )
  const [cityId, setCityId] = useState(tabs[0]?.id ?? '')
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState<Plano>()

  const activeCity = tabs.find((item) => item.id === cityId) ?? tabs[0]
  const plans = featuredFirst(
    plansForCity(banco, veterinarianId, activeCity?.id ?? ''),
  )
  const services = banco.servicosAvulsos.filter(
    (item) => item.veterinarioId === veterinarianId,
  )

  function openForm(plan?: Plano) {
    setCurrent(plan)
    setOpen(true)
  }

  return (
    <div
      className="grid gap-4"
      style={{ animation: 'tt-surgir 0.6s ease both' }}
    >
      <PageHeader
        eyebrow="Veterinário"
        title="Planos e cidades"
        description="Defina onde você atende e os planos que o tutor vê em cada cidade."
        actions={
          <Button radius="xl" color="#7434d6" onClick={() => openForm()}>
            + Novo plano
          </Button>
        }
      />

      <Group gap="sm" wrap="wrap">
        {tabs.map((tab) => {
          const active = activeCity?.id === tab.id
          return (
            <Button
              key={tab.id}
              unstyled
              onClick={() => setCityId(tab.id)}
              className={cx(
                'min-w-[180px] rounded-2xl border px-4 py-3 text-left transition',
                active
                  ? 'border-marca bg-white shadow-sm ring-1 ring-marca'
                  : 'border-slate-200 bg-white hover:border-slate-300',
              )}
            >
              <Text size="sm" fw={600} c="#1e293b">
                <Text span c="#7434d6">
                  📍{' '}
                </Text>
                {tab.nome}
              </Text>
              <Text size="xs" c="dimmed" mt={4}>
                {tab.plans} {tab.plans === 1 ? 'plano' : 'planos'} ·{' '}
                {tab.subscribers}{' '}
                {tab.subscribers === 1 ? 'assinante' : 'assinantes'}
              </Text>
            </Button>
          )
        })}
        <Button
          unstyled
          onClick={() =>
            feedback('', 'Inclusão de cidade disponível em breve.')
          }
          className="min-w-[180px] rounded-2xl border border-dashed border-marca/40 px-4 py-3 text-sm font-medium text-marca hover:bg-[#faf7ff]"
        >
          + Adicionar cidade
        </Button>
      </Group>

      {plans.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white py-12 text-center shadow-sm">
          <Text size="sm" c="dimmed">
            Nenhum plano nesta cidade.
          </Text>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-3 max-md:grid-cols-2 max-sm:grid-cols-1">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              subscribers={planSubscribers(banco, plan.id)}
              onEdit={() => openForm(plan)}
              onToggle={() => {
                alternarPlano(plan.id)
                feedback(
                  null,
                  plan.ativo ? 'Plano inativado.' : 'Plano ativado.',
                )
              }}
            />
          ))}
        </div>
      )}

      <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
        <Group justify="space-between" align="center">
          <Title order={4}>Serviços avulsos</Title>
          <Button
            variant="subtle"
            color="#7434d6"
            size="compact-sm"
            onClick={() =>
              feedback('', 'Cadastro de serviço disponível em breve.')
            }
          >
            + Novo serviço
          </Button>
        </Group>
        {services.length === 0 ? (
          <Text size="sm" c="dimmed" mt="md">
            Nenhum serviço avulso cadastrado.
          </Text>
        ) : (
          <div className="mt-2 divide-y divide-slate-100">
            {services.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-[1fr_auto_auto] items-center gap-4 py-3.5"
              >
                <Text size="sm" fw={500} c="#1e293b">
                  {item.nome}
                </Text>
                <Text size="sm" c="dimmed">
                  {item.duracaoMin} min
                </Text>
                <Text
                  size="sm"
                  fw={600}
                  c="#1e293b"
                  className="min-w-[110px] text-right"
                >
                  {item.preco}
                </Text>
              </div>
            ))}
          </div>
        )}
      </div>

      {open && (
        <PlanForm
          open={open}
          bank={banco}
          plan={current}
          fixedVetId={veterinarianId}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  )
}

function PlanCard({
  plan,
  subscribers,
  onEdit,
  onToggle,
}: {
  plan: Plano
  subscribers: number
  onEdit: () => void
  onToggle: () => void
}) {
  return (
    <div
      className={cx(
        'relative flex flex-col rounded-3xl border bg-white p-5 shadow-sm',
        plan.destaque ? 'border-marca ring-1 ring-marca' : 'border-slate-100',
      )}
    >
      {plan.destaque && (
        <Badge
          radius="xl"
          color="#7434d6"
          className="absolute -top-2.5 left-4"
        >
          Mais vendido
        </Badge>
      )}
      <Title order={4}>{plan.nome}</Title>
      <Text size="xl" fw={600} c="#0f172a" mt={4}>
        {moeda(plan.precoMensal)}
        <Text span size="sm" fw={400} c="dimmed">
          /mês
        </Text>
      </Text>

      <div className="mt-4 flex-1 space-y-2">
        {plan.servicos.slice(0, 5).map((service) => (
          <Group key={service.nome} gap="xs" align="flex-start" wrap="nowrap">
            <Text
              size="sm"
              c={service.incluso ? 'teal' : 'dimmed'}
              className={!service.incluso ? 'line-through' : undefined}
            >
              {service.incluso ? '✓' : '–'}
            </Text>
            <Text
              size="sm"
              c={service.incluso ? '#334155' : 'dimmed'}
              className={!service.incluso ? 'line-through' : undefined}
            >
              {service.nome}
            </Text>
          </Group>
        ))}
      </div>

      <Group
        justify="space-between"
        align="center"
        wrap="nowrap"
        className="mt-5 border-t border-slate-100 pt-4"
      >
        <Text size="xs" c="dimmed">
          {subscribers} {subscribers === 1 ? 'assinante' : 'assinantes'}
        </Text>
        <Group gap="xs" wrap="nowrap">
          <Text size="xs" c="dimmed">
            {plan.ativo ? 'Ativo' : 'Inativo'}
          </Text>
          <Switch
            checked={plan.ativo}
            onChange={onToggle}
            color="#7434d6"
            aria-label={plan.ativo ? 'Desativar plano' : 'Ativar plano'}
          />
        </Group>
      </Group>

      <Button radius="xl" variant="default" fullWidth mt="sm" onClick={onEdit}>
        ✎ Editar plano
      </Button>
    </div>
  )
}
