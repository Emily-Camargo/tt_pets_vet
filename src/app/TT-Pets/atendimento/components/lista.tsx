'use client'

import Link from 'next/link'

import { Botao, Cartao, Pagina, Selo, Vazio } from '@/components/ui'
import { dataHora, rotuloStatus } from '@/domain/formatacao'
import { useUsuario } from '@/hooks/banco'
import { consultaAtiva } from '@/mocks/regras'

export function ListaAtendimentos() {
  const { banco, usuario } = useUsuario()
  const base = '/TT-Pets/veterinario/atendimentos'
  const consultas = banco.consultas
    .filter((item) => item.veterinarioId === usuario?.veterinarioId)
    .filter((item) => consultaAtiva(item.status))
    .sort((a, b) => a.dataHora.localeCompare(b.dataHora))

  return (
    <Pagina
      titulo="Atendimentos"
      descricao="Abra a consulta para conversar com a IA e registrar prontuário, receita e vacina."
    >
      {consultas.length === 0 ? (
        <Vazio texto="Nenhuma consulta em aberto." />
      ) : (
        <div className="grid gap-3">
          {consultas.map((consulta) => {
            const pet = banco.pets.find((item) => item.id === consulta.petId)
            const tutor = banco.tutores.find((item) => item.id === consulta.tutorId)
            return (
              <Cartao key={consulta.id}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-semibold">{pet?.nome}</h2>
                      <Selo>{rotuloStatus(consulta.status)}</Selo>
                    </div>
                    <p className="text-sm text-slate-500">
                      {dataHora(consulta.dataHora)} · {tutor?.nome} · {consulta.motivo}
                    </p>
                  </div>
                  <Link href={`${base}/${consulta.id}`}>
                    <Botao>Abrir atendimento</Botao>
                  </Link>
                </div>
              </Cartao>
            )
          })}
        </div>
      )}
    </Pagina>
  )
}
