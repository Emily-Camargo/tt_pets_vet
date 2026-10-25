'use client'

import { Cartao, Pagina, Vazio } from '@/components/ui'
import { useUsuario } from '@/hooks/banco'

export function Carteira() {
  const { banco, usuario } = useUsuario()
  const consultas = banco.consultas.filter(
    (item) => item.veterinarioId === usuario?.veterinarioId && item.status !== 'cancelada',
  )
  const tutorIds = [...new Set(consultas.map((item) => item.tutorId))]

  return (
    <Pagina
      titulo="Carteira de clientes"
      descricao="Tutores e pets que você atendeu."
    >
      {tutorIds.length === 0 ? (
        <Vazio texto="Nenhum cliente atendido ainda." />
      ) : (
        <div className="grid gap-3">
          {tutorIds.map((tutorId) => {
            const tutor = banco.tutores.find((item) => item.id === tutorId)
            const petsIds = [
              ...new Set(
                consultas.filter((item) => item.tutorId === tutorId).map((item) => item.petId),
              ),
            ]
            return (
              <Cartao key={tutorId}>
                <h2 className="font-semibold">{tutor?.nome}</h2>
                <p className="text-sm text-slate-500">{tutor?.email}</p>
                <ul className="mt-3 space-y-2">
                  {petsIds.map((petId) => {
                    const pet = banco.pets.find((item) => item.id === petId)
                    const planoId = banco.assinaturas.find(
                      (item) => item.petId === petId && item.status === 'ativa',
                    )?.planoId
                    const plano = banco.planos.find((item) => item.id === planoId)
                    return (
                      <li key={petId} className="rounded-2xl bg-slate-50 px-3 py-2 text-sm">
                        <span className="font-bold">{pet?.nome}</span> · {pet?.especie} ·{' '}
                        {pet?.raca}
                        {plano ? ` · ${plano.nome}` : ''}
                      </li>
                    )
                  })}
                </ul>
              </Cartao>
            )
          })}
        </div>
      )}
    </Pagina>
  )
}
