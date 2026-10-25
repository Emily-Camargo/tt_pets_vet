'use client'

import { dataHora } from '@/domain/formatacao'
import { Selecao } from '@/components/ui'
import { useBanco } from '@/hooks/banco'
import { horariosDisponiveis } from '@/mocks/regras'

export function SeletorHorario({
  veterinarioId,
  ignorarConsultaId,
  valor,
  onChange,
}: {
  veterinarioId: string
  ignorarConsultaId?: string
  valor: string
  onChange: (valor: string) => void
}) {
  const banco = useBanco()
  const slots = veterinarioId
    ? horariosDisponiveis(banco, veterinarioId, ignorarConsultaId)
    : []

  return (
    <Selecao value={valor} onChange={(evento) => onChange(evento.target.value)}>
      <option value="">Escolha o horário</option>
      {slots.map((slot) => (
        <option key={slot} value={slot}>
          {dataHora(slot)}
        </option>
      ))}
    </Selecao>
  )
}
