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
import { agendarConsulta, mudarConsulta } from '@/mocks/acoes'
import {
  motivoBloqueioAgendamento,
  veterinariosDisponiveis,
} from '@/mocks/regras'

export function AgendamentosTutor() {
  const { banco, usuario } = useUsuario()
  const tutorId = usuario?.tutorId ?? ''
  const pets = banco.pets.filter((item) => item.tutorId === tutorId)
  const consultas = banco.consultas
    .filter((item) => item.tutorId === tutorId)
    .sort((a, b) => b.dataHora.localeCompare(a.dataHora))
  const [aberto, setAberto] = useState(false)
  const [remarcarId, setRemarcarId] = useState<string | null>(null)
  const [petId, setPetId] = useState(pets[0]?.id ?? '')
  const [veterinarioId, setVeterinarioId] = useState('')
  const [horario, setHorario] = useState('')
  const [motivo, setMotivo] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [ok, setOk] = useState<string | null>(null)

  const assinatura = banco.assinaturas.find(
    (item) => item.petId === petId && item.status === 'ativa',
  )
  const bloqueio = petId ? motivoBloqueioAgendamento(banco, petId) : 'Cadastre um pet.'
  const veterinarios = assinatura
    ? veterinariosDisponiveis(banco, assinatura.cidadeId)
    : []
  const consultaRemarcar = consultas.find((item) => item.id === remarcarId)
  const ator = { perfil: 'tutor' as const, tutorId }

  return (
    <Pagina
      titulo="Agendamentos"
      descricao="A consulta domiciliar só abre se o pet tiver plano ativo na cidade."
      acao={
        <Botao
          onClick={() => {
            setAberto(true)
            setErro(null)
            setPetId(pets[0]?.id ?? '')
          }}
        >
          Nova consulta
        </Botao>
      }
    >
      <Ok texto={ok} />
      {consultas.length === 0 ? (
        <Vazio texto="Nenhuma consulta ainda." />
      ) : (
        <div className="grid gap-3">
          {consultas.map((consulta) => {
            const pet = banco.pets.find((item) => item.id === consulta.petId)
            const vet = banco.veterinarios.find((item) => item.id === consulta.veterinarioId)
            const aberta = consulta.status !== 'cancelada' && consulta.status !== 'realizada'
            return (
              <Cartao key={consulta.id}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-semibold">{pet?.nome}</h2>
                      <Selo tom={consulta.status === 'cancelada' ? 'alerta' : 'rosa'}>
                        {rotuloStatus(consulta.status)}
                      </Selo>
                    </div>
                    <p className="text-sm text-slate-500">
                      {dataHora(consulta.dataHora)} · {vet?.nome}
                    </p>
                    <p className="text-sm text-slate-500">{consulta.motivo}</p>
                  </div>
                  {aberta && (
                    <div className="flex gap-2">
                      <Botao variante="outline" onClick={() => setRemarcarId(consulta.id)}>
                        Remarcar
                      </Botao>
                      <Botao
                        variante="perigo"
                        onClick={() => {
                          const falha = mudarConsulta({
                            consultaId: consulta.id,
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

      <Modal aberto={aberto} titulo="Nova consulta domiciliar" onFechar={() => setAberto(false)}>
        <form
          className="space-y-4"
          onSubmit={(evento) => {
            evento.preventDefault()
            const falha = agendarConsulta({ petId, veterinarioId, dataHora: horario, motivo })
            setErro(falha)
            if (!falha) {
              setOk('Consulta agendada.')
              setAberto(false)
            }
          }}
        >
          <Aviso texto={erro ?? bloqueio} />
          <Campo label="Pet">
            <Selecao
              value={petId}
              onChange={(evento) => {
                setPetId(evento.target.value)
                setVeterinarioId('')
                setHorario('')
              }}
            >
              {pets.map((pet) => (
                <option key={pet.id} value={pet.id}>
                  {pet.nome}
                </option>
              ))}
            </Selecao>
          </Campo>
          <Campo label="Veterinário">
            <Selecao
              value={veterinarioId}
              onChange={(evento) => setVeterinarioId(evento.target.value)}
            >
              <option value="">Selecione</option>
              {veterinarios.map((vet) => (
                <option key={vet.id} value={vet.id}>
                  {vet.nome} · {vet.especialidade}
                </option>
              ))}
            </Selecao>
          </Campo>
          <Campo label="Horário">
            <SeletorHorario
              veterinarioId={veterinarioId}
              valor={horario}
              onChange={setHorario}
            />
          </Campo>
          <Campo label="Motivo">
            <Texto value={motivo} onChange={(evento) => setMotivo(evento.target.value)} />
          </Campo>
          <Botao type="submit" disabled={Boolean(bloqueio) || !horario}>
            Agendar
          </Botao>
        </form>
      </Modal>

      <Modal
        aberto={Boolean(consultaRemarcar)}
        titulo="Remarcar consulta"
        onFechar={() => setRemarcarId(null)}
      >
        {consultaRemarcar && (
          <form
            className="space-y-4"
            onSubmit={(evento) => {
              evento.preventDefault()
              const falha = mudarConsulta({
                consultaId: consultaRemarcar.id,
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
            <Aviso texto={erro} />
            <Campo label="Novo horário">
              <SeletorHorario
                veterinarioId={consultaRemarcar.veterinarioId}
                ignorarConsultaId={consultaRemarcar.id}
                valor={horario}
                onChange={setHorario}
              />
            </Campo>
            <Botao type="submit" disabled={!horario}>
              Confirmar remarcação
            </Botao>
          </form>
        )}
      </Modal>
    </Pagina>
  )
}
