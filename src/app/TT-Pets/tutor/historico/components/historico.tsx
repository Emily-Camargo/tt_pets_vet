'use client'

import { useState } from 'react'

import { Cartao, Campo, Pagina, Selecao, Vazio } from '@/components/ui'
import { dataHora } from '@/domain/formatacao'
import { useUsuario } from '@/hooks/banco'

export function HistoricoTutor() {
  const { banco, usuario } = useUsuario()
  const tutorId = usuario?.tutorId ?? ''
  const pets = banco.pets.filter((item) => item.tutorId === tutorId)
  const [petId, setPetId] = useState(pets[0]?.id ?? '')
  const consultas = banco.consultas.filter(
    (item) => item.petId === petId && item.status === 'realizada',
  )

  return (
    <Pagina
      titulo="Histórico de consultas"
      descricao="Receitas e prontuários das consultas já realizadas."
    >
      <Campo label="Pet">
        <Selecao value={petId} onChange={(evento) => setPetId(evento.target.value)}>
          {pets.map((pet) => (
            <option key={pet.id} value={pet.id}>
              {pet.nome}
            </option>
          ))}
        </Selecao>
      </Campo>
      {consultas.length === 0 ? (
        <Vazio texto="Nenhuma consulta realizada para este pet." />
      ) : (
        <div className="grid gap-4">
          {consultas.map((consulta) => {
            const vet = banco.veterinarios.find((item) => item.id === consulta.veterinarioId)
            const prontuario = banco.prontuarios.find((item) => item.consultaId === consulta.id)
            const receitas = banco.receitas.filter((item) => item.consultaId === consulta.id)
            return (
              <Cartao key={consulta.id}>
                <h2 className="font-extrabold">{consulta.motivo}</h2>
                <p className="text-sm text-slate-500">
                  {dataHora(consulta.dataHora)} · {vet?.nome}
                </p>
                <div className="mt-3 rounded-2xl bg-slate-50 p-3 text-sm">
                  <p className="font-bold text-slate-700">Prontuário</p>
                  <p className="mt-1 text-slate-600">
                    {prontuario?.texto ?? 'Sem registro.'}
                  </p>
                </div>
                <div className="mt-3 space-y-2">
                  <p className="text-sm font-bold text-slate-700">Receitas</p>
                  {receitas.length === 0 && (
                    <p className="text-sm text-slate-500">Nenhuma receita nesta consulta.</p>
                  )}
                  {receitas.map((receita) => (
                    <p key={receita.id} className="rounded-2xl bg-rose-50 p-3 text-sm text-slate-700">
                      {receita.texto}
                    </p>
                  ))}
                </div>
              </Cartao>
            )
          })}
        </div>
      )}
    </Pagina>
  )
}
