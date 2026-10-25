'use client'

import { useState } from 'react'

import { Aviso, Botao, Campo, Modal, Ok, Selecao } from '@/components/ui'
import { cx, moeda, visitas } from '@/domain/formatacao'
import { useUsuario } from '@/hooks/banco'
import { contratarPlano } from '@/mocks/acoes'
import { nomeVeterinario, planosDaCidade } from '@/mocks/regras'

function desenho(nome: string) {
  if (nome.includes('Básico')) return { emoji: '🐱', fundo: 'bg-amber-100' }
  if (nome.includes('Saúde')) return { emoji: '🐶', fundo: 'bg-sky-100' }
  if (nome.includes('Total')) return { emoji: '🐾', fundo: 'bg-marca-anel' }
  if (nome.includes('Premium')) return { emoji: '🐕', fundo: 'bg-lime-100' }
  return { emoji: '🐾', fundo: 'bg-slate-100' }
}

export function VitrinePlanos() {
  const { banco, usuario } = useUsuario()
  const tutorId = usuario?.tutorId ?? ''
  const pets = banco.pets.filter((item) => item.tutorId === tutorId)
  const [cidadeId, setCidadeId] = useState('cidade-pf')
  const [planoId, setPlanoId] = useState<string | null>(null)
  const [petId, setPetId] = useState(pets[0]?.id ?? '')
  const [erro, setErro] = useState<string | null>(null)
  const [ok, setOk] = useState<string | null>(null)
  const planos = planosDaCidade(banco, cidadeId)
  const plano = planos.find((item) => item.id === planoId)

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col items-center">
      <h1 className="text-center text-3xl font-semibold tracking-tight text-slate-900">
        Planos de atendimento domiciliar
      </h1>
      <p className="mt-2 text-center text-slate-500">
        Escolha a cidade para ver os planos disponíveis
      </p>
      <Selecao
        className="mt-6 w-auto rounded-full px-5"
        value={cidadeId}
        onChange={(evento) => setCidadeId(evento.target.value)}
      >
        {banco.cidades.map((cidade) => (
          <option key={cidade.id} value={cidade.id}>
            {cidade.nome} - {cidade.uf}
          </option>
        ))}
      </Selecao>

      <div className="mt-10 grid w-full items-stretch gap-5 md:grid-cols-2 xl:grid-cols-4">
        {planos.map((item) => {
          const arte = desenho(item.nome)
          return (
            <article
              key={item.id}
              className={cx(
                'relative flex h-full flex-col rounded-[28px] border border-slate-200 bg-white p-6 text-center shadow-sm',
                item.destaque &&
                  'z-10 border-2 border-marca bg-gradient-to-b from-marca-clara to-white shadow-md',
              )}
            >
              {item.destaque && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-marca px-3 py-1 text-xs font-medium text-white">
                  Mais vendido
                </span>
              )}
              <div
                className={cx(
                  'mx-auto flex h-16 w-16 items-center justify-center rounded-full text-3xl',
                  arte.fundo,
                )}
              >
                {arte.emoji}
              </div>
              <h2 className="mt-4 text-2xl font-semibold text-slate-900">{item.nome}</h2>
              <p className="text-sm font-semibold text-marca">{item.subtitulo}</p>
              <p className="mt-1 text-xs text-slate-400">{nomeVeterinario(banco, item.veterinarioId)}</p>
              <p className="mt-4 text-4xl font-semibold text-marca">
                {moeda(item.precoMensal)}
                <span className="text-base font-semibold text-slate-400">/mês</span>
              </p>
              <p className="mt-1 text-sm text-slate-500">{visitas(item.visitasMes)}</p>
              <Botao className="mt-5 w-full" onClick={() => {
                setPlanoId(item.id)
                setErro(null)
                setPetId(pets[0]?.id ?? '')
              }}>
                Contratar
              </Botao>
              <div className="mt-5 border-t border-slate-100 pt-4 text-left">
                <p className="text-sm font-bold text-marca">Serviços inclusos</p>
                <ul className="mt-3 space-y-2">
                  {item.servicos.map((servico) => (
                    <li
                      key={servico.nome}
                      className={cx(
                        'flex gap-2 text-sm',
                        servico.incluso ? 'text-slate-700' : 'text-slate-300',
                      )}
                    >
                      <span className={servico.incluso ? 'text-emerald-500' : 'text-slate-300'}>
                        {servico.incluso ? '✓' : '×'}
                      </span>
                      {servico.nome}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          )
        })}
      </div>
      {planos.length === 0 && (
        <p className="mt-10 text-sm text-slate-500">Nenhum plano ativo nesta cidade.</p>
      )}
      <p className="mt-10 text-center text-xs text-slate-400">
        Protótipo com dados de exemplo. Nomes, preços e serviços são cadastrados pelo veterinário.
      </p>

      <Modal
        aberto={Boolean(plano)}
        titulo={plano ? `Contratar ${plano.nome}` : 'Contratar'}
        onFechar={() => setPlanoId(null)}
      >
        {plano && (
          <form
            className="space-y-4 pt-1"
            onSubmit={(evento) => {
              evento.preventDefault()
              const falha = contratarPlano({ petId, planoId: plano.id, tutorId })
              setErro(falha)
              if (!falha) {
                setOk(`${plano.nome} contratado. O pagamento foi simulado.`)
                setPlanoId(null)
              }
            }}
          >
            <p className="text-sm text-slate-500">
              {moeda(plano.precoMensal)} por mês · {nomeVeterinario(banco, plano.veterinarioId)}
            </p>
            <Aviso texto={erro} />
            {pets.length === 0 ? (
              <p className="text-sm text-slate-500">Cadastre um pet antes de contratar.</p>
            ) : (
              <Campo label="Pet">
                <Selecao value={petId} onChange={(evento) => setPetId(evento.target.value)}>
                  {pets.map((pet) => (
                    <option key={pet.id} value={pet.id}>
                      {pet.nome}
                    </option>
                  ))}
                </Selecao>
              </Campo>
            )}
            <div className="flex gap-2">
              <Botao type="button" variante="outline" onClick={() => setPlanoId(null)}>
                Cancelar
              </Botao>
              <Botao type="submit" disabled={pets.length === 0}>
                Pagar agora
              </Botao>
            </div>
          </form>
        )}
      </Modal>
      {ok && <p className="mt-4 text-sm font-semibold text-emerald-600">{ok}</p>}
    </div>
  )
}
