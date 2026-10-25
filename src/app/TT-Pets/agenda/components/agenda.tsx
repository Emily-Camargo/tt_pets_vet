'use client'

import { useState } from 'react'

import { SeletorHorario } from '@/app/TT-Pets/agenda/components/seletor'
import {
  Aviso,
  Botao,
  Campo,
  Cartao,
  Modal,
  Ok,
  Pagina,
  Selecao,
  Selo,
  Texto,
  Vazio,
} from '@/components/ui'
import { dataHora, rotuloStatus } from '@/domain/formatacao'
import { useUsuario } from '@/hooks/banco'
import { excluirBloqueio, mudarConsulta, salvarBloqueio } from '@/mocks/acoes'
import { consultaAtiva } from '@/mocks/regras'

export function Agenda({ escopo }: { escopo: 'clinica' | 'veterinario' }) {
  const { banco, usuario } = useUsuario()
  const clinicaId = usuario?.clinicaId ?? ''
  const vets = banco.veterinarios.filter((item) => item.clinicaId === clinicaId)
  const [vetFiltro, setVetFiltro] = useState(
    escopo === 'veterinario' ? usuario?.veterinarioId ?? '' : '',
  )
  const [inicio, setInicio] = useState('')
  const [fim, setFim] = useState('')
  const [motivoBloqueio, setMotivoBloqueio] = useState('')
  const [remarcarId, setRemarcarId] = useState<string | null>(null)
  const [horario, setHorario] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [ok, setOk] = useState<string | null>(null)

  const veterinarioId = escopo === 'veterinario' ? usuario?.veterinarioId ?? '' : vetFiltro
  const consultas = banco.consultas
    .filter((item) => item.clinicaId === clinicaId)
    .filter((item) => !veterinarioId || item.veterinarioId === veterinarioId)
    .sort((a, b) => a.dataHora.localeCompare(b.dataHora))
  const bloqueios = banco.bloqueios.filter(
    (item) =>
      item.clinicaId === clinicaId &&
      (!veterinarioId || item.veterinarioId === veterinarioId),
  )
  const consulta = consultas.find((item) => item.id === remarcarId)
  const ator = {
    perfil: usuario?.perfil ?? 'gestor',
    clinicaId,
    veterinarioId: usuario?.veterinarioId,
    tutorId: usuario?.tutorId,
  }

  return (
    <Pagina
      titulo="Agenda"
      descricao="Confirme, remarque, cancele e bloqueie horários."
    >
      <Ok texto={ok} />
      <Aviso texto={erro} />
      {escopo === 'clinica' && (
        <Campo label="Veterinário">
          <Selecao value={vetFiltro} onChange={(evento) => setVetFiltro(evento.target.value)}>
            <option value="">Todos</option>
            {vets.map((vet) => (
              <option key={vet.id} value={vet.id}>
                {vet.nome}
              </option>
            ))}
          </Selecao>
        </Campo>
      )}

      <Cartao>
        <h2 className="font-extrabold">Novo bloqueio</h2>
        <form
          className="mt-3 grid gap-3 md:grid-cols-4"
          onSubmit={(evento) => {
            evento.preventDefault()
            const alvo = veterinarioId || vets[0]?.id
            if (!alvo) {
              setErro('Cadastre um veterinário antes de bloquear a agenda.')
              return
            }
            const falha = salvarBloqueio({
              veterinarioId: alvo,
              clinicaId,
              inicio,
              fim,
              motivo: motivoBloqueio,
            })
            setErro(falha)
            if (!falha) {
              setOk('Horário bloqueado.')
              setMotivoBloqueio('')
            }
          }}
        >
          <Campo label="Início">
            <Texto type="datetime-local" value={inicio} onChange={(evento) => setInicio(evento.target.value)} />
          </Campo>
          <Campo label="Fim">
            <Texto type="datetime-local" value={fim} onChange={(evento) => setFim(evento.target.value)} />
          </Campo>
          <Campo label="Motivo">
            <Texto value={motivoBloqueio} onChange={(evento) => setMotivoBloqueio(evento.target.value)} />
          </Campo>
          <div className="flex items-end">
            <Botao type="submit">Bloquear</Botao>
          </div>
        </form>
        <div className="mt-4 space-y-2">
          {bloqueios.map((item) => {
            const vet = vets.find((vetItem) => vetItem.id === item.veterinarioId)
            return (
              <div key={item.id} className="flex items-center justify-between text-sm">
                <span>
                  {vet?.nome}: {dataHora(item.inicio)} até {dataHora(item.fim)} · {item.motivo}
                </span>
                <Botao variante="fantasma" onClick={() => excluirBloqueio(item.id, clinicaId)}>
                  Remover
                </Botao>
              </div>
            )
          })}
        </div>
      </Cartao>

      {consultas.length === 0 ? (
        <Vazio texto="Nenhuma consulta nesta agenda." />
      ) : (
        <div className="grid gap-3">
          {consultas.map((item) => {
            const pet = banco.pets.find((petItem) => petItem.id === item.petId)
            const tutor = banco.tutores.find((tutorItem) => tutorItem.id === item.tutorId)
            const vet = vets.find((vetItem) => vetItem.id === item.veterinarioId)
            const aberta = consultaAtiva(item.status)
            return (
              <Cartao key={item.id}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-extrabold">
                        {dataHora(item.dataHora)} · {pet?.nome}
                      </h2>
                      <Selo>{rotuloStatus(item.status)}</Selo>
                    </div>
                    <p className="text-sm text-slate-500">
                      {tutor?.nome} · {vet?.nome} · {item.motivo}
                    </p>
                  </div>
                  {aberta && (
                    <div className="flex flex-wrap gap-2">
                      <Botao
                        variante="outline"
                        onClick={() => {
                          const falha = mudarConsulta({
                            consultaId: item.id,
                            status: 'confirmada',
                            ator,
                          })
                          setErro(falha)
                          setOk(falha ? null : 'Consulta confirmada.')
                        }}
                      >
                        Confirmar
                      </Botao>
                      <Botao variante="outline" onClick={() => setRemarcarId(item.id)}>
                        Remarcar
                      </Botao>
                      <Botao
                        variante="perigo"
                        onClick={() => {
                          const falha = mudarConsulta({
                            consultaId: item.id,
                            status: 'cancelada',
                            ator,
                          })
                          setErro(falha)
                          setOk(falha ? null : 'Consulta cancelada.')
                        }}
                      >
                        Cancelar
                      </Botao>
                    </div>
                  )}
                </div>
              </Cartao>
            )
          })}
        </div>
      )}

      <Modal aberto={Boolean(consulta)} titulo="Remarcar" onFechar={() => setRemarcarId(null)}>
        {consulta && (
          <form
            className="space-y-4"
            onSubmit={(evento) => {
              evento.preventDefault()
              const falha = mudarConsulta({
                consultaId: consulta.id,
                status: 'remarcada',
                dataHora: horario,
                ator,
              })
              setErro(falha)
              if (!falha) {
                setOk('Consulta remarcada.')
                setRemarcarId(null)
              }
            }}
          >
            <Campo label="Novo horário">
              <SeletorHorario
                veterinarioId={consulta.veterinarioId}
                ignorarConsultaId={consulta.id}
                valor={horario}
                onChange={setHorario}
              />
            </Campo>
            <Botao type="submit">Salvar</Botao>
          </form>
        )}
      </Modal>
    </Pagina>
  )
}
