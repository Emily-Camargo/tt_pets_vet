'use client'

import { Button, Text } from '@mantine/core'

import { cn } from '@/core/functions/format'
import type { Plano } from '@/core/interfaces/types'

import { planArt } from '../utils/functions'

export function CardPlan({
  plan,
  vetName,
  price,
  visits,
  onHire,
}: {
  plan: Plano
  vetName: string
  price: string
  visits: string
  onHire: () => void
}) {
  const art = planArt(plan.nome)

  return (
    <article
      className={cn(
        'relative flex h-full flex-col rounded-[28px] border border-slate-200 bg-white p-6 text-center shadow-sm',
        plan.destaque &&
          'z-10 border-2 border-[#7434d6] bg-gradient-to-b from-[#f6f1fc] to-white',
      )}
    >
      {plan.destaque && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#7434d6] px-3 py-1 text-xs text-white">
          Mais vendido
        </span>
      )}
      <div
        className={cn(
          'mx-auto flex h-16 w-16 items-center justify-center rounded-full text-3xl',
          art.background,
        )}
      >
        {art.emoji}
      </div>
      <Text fw={600} size="xl" mt="md">
        {plan.nome}
      </Text>
      <Text size="sm" c="#7434d6" fw={600}>
        {plan.subtitulo}
      </Text>
      <Text size="xs" c="dimmed">
        {vetName}
      </Text>
      <Text fw={600} size="xl" c="#7434d6" mt="md">
        {price}
        <Text span c="dimmed" size="sm">
          /mês
        </Text>
      </Text>
      <Text size="sm" c="dimmed">
        {visits}
      </Text>
      <Button mt="md" color="#7434d6" onClick={onHire}>
        Contratar
      </Button>
      <div className="mt-5 border-t border-slate-100 pt-4 text-left">
        <Text size="sm" fw={700} c="#7434d6">
          Serviços inclusos
        </Text>
        <ul className="mt-3 space-y-2">
          {plan.servicos.map((service) => (
            <li
              key={service.nome}
              className={cn(
                'flex gap-2 text-sm',
                service.incluso ? 'text-slate-700' : 'text-slate-300',
              )}
            >
              <span>{service.incluso ? '✓' : '×'}</span>
              {service.nome}
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}
