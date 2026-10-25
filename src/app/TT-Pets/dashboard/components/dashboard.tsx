'use client'

import { Cartao, Pagina } from '@/components/ui'
import { dataHora, moeda, rotuloStatus } from '@/domain/formatacao'
import { useUsuario } from '@/hooks/banco'
import { resumo } from '@/mocks/regras'

export function Dashboard({ escopo }: { escopo: 'clinica' | 'veterinario' }) {
  const { banco, usuario } = useUsuario()
  const clinicaId = usuario?.clinicaId ?? ''
  const dados = resumo(banco, {
    clinicaId,
    veterinarioId: escopo === 'veterinario' ? usuario?.veterinarioId : undefined,
  })
  const recentes = [...dados.consultas]
    .sort((a, b) => b.dataHora.localeCompare(a.dataHora))
    .slice(0, 5)
  const barras = [
    { label: 'Em aberto', valor: dados.agendadas },
    { label: 'Realizadas', valor: dados.realizadas },
    { label: 'Canceladas', valor: dados.canceladas },
  ]
  const maior = Math.max(...barras.map((item) => item.valor), 1)

  return (
    <Pagina
      titulo={escopo === 'clinica' ? 'Painel da clínica' : 'Meu painel'}
      descricao="Receita dos planos ativos e atendimentos do seu escopo."
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ['Receita mensal', moeda(dados.mrr)],
          ['Planos ativos', String(dados.assinaturas)],
          ['Realizadas no mês', String(dados.realizadasMes)],
          ['Em aberto', String(dados.agendadas)],
        ].map(([rotulo, valor]) => (
          <Cartao key={rotulo}>
            <p className="text-sm font-semibold text-slate-500">{rotulo}</p>
            <p className="mt-2 text-2xl font-extrabold text-rose-600">{valor}</p>
          </Cartao>
        ))}
      </div>
      <Cartao>
        <h2 className="font-extrabold">Atendimentos</h2>
        <div className="mt-4 space-y-3">
          {barras.map((barra) => (
            <div key={barra.label}>
              <div className="mb-1 flex justify-between text-sm">
                <span>{barra.label}</span>
                <span className="font-bold">{barra.valor}</span>
              </div>
              <div className="h-3 rounded-full bg-slate-100">
                <div
                  className="h-3 rounded-full bg-rose-500"
                  style={{ width: `${(barra.valor / maior) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Cartao>
      <div className="grid gap-3">
        {recentes.map((consulta) => {
          const pet = banco.pets.find((item) => item.id === consulta.petId)
          const vet = banco.veterinarios.find((item) => item.id === consulta.veterinarioId)
          return (
            <Cartao key={consulta.id}>
              <p className="font-bold">
                {pet?.nome} · {rotuloStatus(consulta.status)}
              </p>
              <p className="text-sm text-slate-500">
                {dataHora(consulta.dataHora)} · {vet?.nome}
              </p>
            </Cartao>
          )
        })}
      </div>
    </Pagina>
  )
}
