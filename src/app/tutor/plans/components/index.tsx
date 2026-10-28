'use client'

import { Dialog, InputSelect } from '@grazziotin/react-components-next/ui'
import { Button, Text, Title } from '@mantine/core'
import Grid from '@mui/material/Grid'
import { useState } from 'react'

import { feedback } from '@/core/functions/feedback'
import { moeda, visitas } from '@/core/functions/format'
import { useUsuario } from '@/core/hooks/use-session'
import { contratarPlano } from '@/service/mock/actions'
import { nomeVeterinario, planosDaCidade } from '@/service/mock/rules'

import { CardPlan } from './card-plan'

export function PlanShowcase() {
  const { banco, usuario } = useUsuario()
  const tutorId = usuario?.tutorId ?? ''
  const pets = banco.pets.filter((item) => item.tutorId === tutorId)
  const [cityId, setCityId] = useState(banco.cidades[0]?.id ?? 'cidade-pf')
  const [planId, setPlanId] = useState<string | null>(null)
  const [petId, setPetId] = useState(pets[0]?.id ?? '')
  const plans = planosDaCidade(banco, cityId)
  const plan = plans.find((item) => item.id === planId)
  const city = banco.cidades.find((item) => item.id === cityId) ?? null
  const pet = pets.find((item) => item.id === petId) ?? null

  return (
    <div className="flex w-full flex-col">
      <Title order={2}>Planos de atendimento domiciliar</Title>
      <Text c="dimmed" mt={8}>
        Escolha a cidade para ver os planos disponíveis
      </Text>
      <div className="mt-6 w-full max-w-xs">
        <InputSelect
          options={banco.cidades}
          value={city}
          optionLabel={(item) => `${item.nome} - ${item.uf}`}
          onChange={(_, value) => setCityId(value?.id ?? '')}
          input={{ label: 'Cidade' }}
        />
      </div>
      <div className="mt-8 w-full">
        <Grid container spacing={2}>
          {plans.map((item) => (
            <Grid key={item.id} size={{ xs: 12, md: 6, xl: 3 }}>
              <CardPlan
                plan={item}
                vetName={nomeVeterinario(banco, item.veterinarioId)}
                price={moeda(item.precoMensal)}
                visits={visitas(item.visitasMes)}
                onHire={() => {
                  setPlanId(item.id)
                  setPetId(pets[0]?.id ?? '')
                }}
              />
            </Grid>
          ))}
        </Grid>
      </div>
      {plans.length === 0 && (
        <Text c="dimmed" mt="xl" size="sm">
          Nenhum plano ativo nesta cidade.
        </Text>
      )}
      <Dialog
        open={Boolean(plan)}
        title={plan ? `Contratar ${plan.nome}` : 'Contratar'}
        onClose={() => setPlanId(null)}
        maxWidth="sm"
      >
        {plan && (
          <form
            className="flex flex-col gap-3"
            onSubmit={(event) => {
              event.preventDefault()
              const error = contratarPlano({ petId, planoId: plan.id, tutorId })
              feedback(
                error,
                `${plan.nome} contratado. O pagamento foi simulado.`,
              )
              if (!error) setPlanId(null)
            }}
          >
            <Text size="sm" c="dimmed">
              {moeda(plan.precoMensal)} por mês ·{' '}
              {nomeVeterinario(banco, plan.veterinarioId)}
            </Text>
            {pets.length === 0 ? (
              <Text size="sm" c="dimmed">
                Cadastre um pet antes de contratar.
              </Text>
            ) : (
              <InputSelect
                options={pets}
                value={pet}
                optionLabel={(item) => item.nome}
                onChange={(_, value) => setPetId(value?.id ?? '')}
                input={{ label: 'Pet' }}
              />
            )}
            <div className="flex gap-2">
              <Button
                variant="outline"
                color="gray"
                onClick={() => setPlanId(null)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                color="#7434d6"
                disabled={pets.length === 0}
              >
                Pagar agora
              </Button>
            </div>
          </form>
        )}
      </Dialog>
    </div>
  )
}
