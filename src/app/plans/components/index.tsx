'use client'

import { Button, Stack } from '@mantine/core'
import { useMemo, useState } from 'react'

import { EmptyState } from '@/core/components/empty-state'
import { Screen } from '@/core/components/screen'
import { feedback } from '@/core/functions/feedback'
import { moeda, visitas } from '@/core/functions/format'
import { useUsuario } from '@/core/hooks/use-session'
import type { Plano } from '@/core/interfaces/types'
import { alternarPlano } from '@/service/mock/actions'
import { nomeCidade, nomeVeterinario } from '@/service/mock/rules'

import { CardManagedPlan } from './card-managed-plan'
import { PlanForm } from './plan-form'

export function PlanManager({ fixedVetId }: { fixedVetId?: string }) {
  const { banco } = useUsuario()
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState<Plano>()
  const plans = useMemo(
    () =>
      banco.planos.filter(
        (item) => !fixedVetId || item.veterinarioId === fixedVetId,
      ),
    [banco.planos, fixedVetId],
  )

  function openForm(plan?: Plano) {
    setCurrent(plan)
    setOpen(true)
  }

  return (
    <Screen
      title="Planos de atendimento domiciliar"
      description="O que for salvo aqui aparece na vitrine do tutor, na cidade escolhida."
      action={
        <Button color="#7434d6" onClick={() => openForm()}>
          Novo plano
        </Button>
      }
    >
      {plans.length === 0 ? (
        <EmptyState text="Nenhum plano cadastrado." />
      ) : (
        <Stack gap="sm">
          {plans.map((plan) => (
            <CardManagedPlan
              key={plan.id}
              name={plan.nome}
              highlight={plan.destaque}
              active={plan.ativo}
              detail={`${nomeVeterinario(banco, plan.veterinarioId)} · ${nomeCidade(banco, plan.cidadeId)}`}
              price={`${moeda(plan.precoMensal)} · ${visitas(plan.visitasMes)}`}
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
        </Stack>
      )}
      {open && (
        <PlanForm
          open={open}
          bank={banco}
          plan={current}
          fixedVetId={fixedVetId}
          onClose={() => setOpen(false)}
        />
      )}
    </Screen>
  )
}
