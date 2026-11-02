'use client'

import {
  Dialog,
  Input,
  InputSelect,
} from '@grazziotin/react-components-next/ui'
import { Button, Checkbox, Stack } from '@mantine/core'
import { useState } from 'react'

import { feedback } from '@/core/functions/feedback'
import type { Banco, Plano } from '@/core/interfaces/types'
import { salvarPlano } from '@/service/mock/actions'
import { CATALOGO_SERVICOS } from '@/service/mock/catalog'

export function PlanForm({
  open,
  bank,
  plan,
  fixedVetId,
  onClose,
}: {
  open: boolean
  bank: Banco
  plan?: Plano
  fixedVetId?: string
  onClose: () => void
}) {
  const vets = fixedVetId
    ? bank.veterinarios.filter((item) => item.id === fixedVetId)
    : bank.veterinarios
  const [vetId, setVetId] = useState(
    plan?.veterinarioId ?? fixedVetId ?? vets[0]?.id ?? '',
  )
  const [cityId, setCityId] = useState(plan?.cidadeId ?? '')
  const [name, setName] = useState(plan?.nome ?? '')
  const [subtitle, setSubtitle] = useState(plan?.subtitulo ?? '')
  const [price, setPrice] = useState(String(plan?.precoMensal ?? 99.9))
  const [unlimited, setUnlimited] = useState(
    plan ? plan.visitasMes === null : false,
  )
  const [visits, setVisits] = useState(String(plan?.visitasMes ?? 4))
  const [highlight, setHighlight] = useState(plan?.destaque ?? false)
  const [active, setActive] = useState(plan?.ativo ?? true)
  const [included, setIncluded] = useState<string[]>(
    plan?.servicos.filter((item) => item.incluso).map((item) => item.nome) ??
      CATALOGO_SERVICOS.slice(0, 3),
  )
  const vet = bank.veterinarios.find((item) => item.id === vetId)
  const cities = bank.cidades.filter((item) => vet?.cidadeIds.includes(item.id))
  const selectedVet = vets.find((item) => item.id === vetId) ?? null
  const selectedCity = cities.find((item) => item.id === cityId) ?? null

  return (
    <Dialog
      open={open}
      title={plan ? 'Editar plano' : 'Novo plano'}
      onClose={onClose}
      maxWidth="sm"
    >
      <form
        className="flex flex-col gap-3"
        onSubmit={(event) => {
          event.preventDefault()
          const error = salvarPlano({
            id: plan?.id,
            veterinarioId: vetId,
            cidadeId: cityId,
            nome: name,
            subtitulo: subtitle,
            precoMensal: Number(price.replace(',', '.')),
            visitasMes: unlimited ? null : Number(visits),
            destaque: highlight,
            inclusos: included,
            ativo: active,
          })
          feedback(error, 'Plano salvo.')
          if (!error) onClose()
        }}
      >
        {!fixedVetId && (
          <InputSelect
            options={vets}
            value={selectedVet}
            optionLabel={(item) => item.nome}
            onChange={(_, value) => {
              setVetId(value?.id ?? '')
              setCityId('')
            }}
            input={{ label: 'Veterinário' }}
          />
        )}
        <InputSelect
          options={cities}
          value={selectedCity}
          optionLabel={(item) => `${item.nome} - ${item.uf}`}
          onChange={(_, value) => setCityId(value?.id ?? '')}
          input={{ label: 'Cidade' }}
        />
        <Input
          label="Nome"
          value={name}
          required
          onChange={(event) => setName(event.target.value)}
        />
        <Input
          label="Subtítulo"
          value={subtitle}
          onChange={(event) => setSubtitle(event.target.value)}
        />
        <Input
          label="Preço mensal"
          value={price}
          required
          onChange={(event) => setPrice(event.target.value)}
        />
        <Checkbox
          label="Visitas ilimitadas"
          checked={unlimited}
          onChange={(event) => setUnlimited(event.currentTarget.checked)}
        />
        {!unlimited && (
          <Input
            label="Visitas por mês"
            type="number"
            value={visits}
            onChange={(event) => setVisits(event.target.value)}
          />
        )}
        <Stack gap={6}>
          {CATALOGO_SERVICOS.map((service) => (
            <Checkbox
              key={service}
              label={service}
              checked={included.includes(service)}
              onChange={(event) => {
                setIncluded((current) =>
                  event.currentTarget.checked
                    ? [...current, service]
                    : current.filter((item) => item !== service),
                )
              }}
            />
          ))}
        </Stack>
        <Checkbox
          label="Marcar como mais vendido"
          checked={highlight}
          onChange={(event) => setHighlight(event.currentTarget.checked)}
        />
        <Checkbox
          label="Plano ativo"
          checked={active}
          onChange={(event) => setActive(event.currentTarget.checked)}
        />
        <Button type="submit" color="#7434d6">
          Salvar plano
        </Button>
      </form>
    </Dialog>
  )
}
