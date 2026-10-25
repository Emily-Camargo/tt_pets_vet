'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import {
  Aviso,
  Botao,
  Campo,
  Cartao,
  Ok,
  Area,
  Texto,
} from '@/components/ui'
import { dataHora } from '@/domain/formatacao'
import { useUsuario } from '@/hooks/banco'
import {
  concluirConsulta,
  enviarChat,
  salvarProntuario,
  salvarReceita,
  salvarVacina,
} from '@/mocks/acoes'
import type { Sugestao } from '@/mocks/chat'

export function DetalheAtendimento({ consultaId }: { consultaId: string }) {
  const { banco, usuario } = useUsuario()
  const router = useRouter()
  const consulta = banco.consultas.find((item) => item.id === consultaId)
  const [texto, setTexto] = useState('')
  const [sugestoes, setSugestoes] = useState<Sugestao[]>([])
  const [prontuario, setProntuario] = useState(
    banco.prontuarios.find((item) => item.consultaId === consultaId)?.texto ?? '',
  )
  const [receita, setReceita] = useState('')
  const [vacina, setVacina] = useState('V10')
  const [aplicadaEm, setAplicadaEm] = useState(new Date().toISOString().slice(0, 10))
  const [proximaDose, setProximaDose] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [ok, setOk] = useState<string | null>(null)

  if (!consulta || !usuario) return <p>Consulta não encontrada.</p>
  const daClinica = consulta.clinicaId === usuario.clinicaId
  const doVet = consulta.veterinarioId === usuario.veterinarioId
  if (usuario.perfil === 'veterinario' && !doVet) return <p>Consulta de outro veterinário.</p>
  if (usuario.perfil === 'gestor' && !daClinica) return <p>Consulta de outra clínica.</p>

  const vetId = consulta.veterinarioId
  const pet = banco.pets.find((item) => item.id === consulta.petId)
  const tutor = banco.tutores.find((item) => item.id === consulta.tutorId)
  const mensagens = banco.mensagens.filter((item) => item.consultaId === consultaId)
  const encerrada = consulta.status === 'realizada' || consulta.status === 'cancelada'

  function aplicarSugestao(sugestao: Sugestao) {
    if (sugestao.tipo === 'prontuario') setProntuario(sugestao.conteudo)
    if (sugestao.tipo === 'receita') setReceita(sugestao.conteudo)
    if (sugestao.tipo === 'vacina' && sugestao.vacina) {
      setVacina(sugestao.vacina.nome)
      const proxima = new Date()
      proxima.setDate(proxima.getDate() + sugestao.vacina.proximaDoseDias)
      setProximaDose(proxima.toISOString().slice(0, 10))
    }
    setOk('Sugestão colocada no formulário. Revise e salve.')
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-4">
        <Cartao>
          <h1 className="text-2xl font-extrabold">{pet?.nome}</h1>
          <p className="text-sm text-slate-500">
            {pet?.especie} · {pet?.raca} · tutor {tutor?.nome}
          </p>
          <p className="mt-2 text-sm text-slate-600">
            {dataHora(consulta.dataHora)} · {consulta.motivo}
          </p>
        </Cartao>
        <Ok texto={ok} />
        <Aviso texto={erro} />
        <Cartao>
          <h2 className="font-extrabold">Chat de apoio</h2>
          <p className="mb-3 text-sm text-slate-500">
            Demonstração local. Não chama um modelo externo.
          </p>
          <div className="mb-3 max-h-80 space-y-2 overflow-y-auto">
            {mensagens.map((mensagem) => (
              <p
                key={mensagem.id}
                className={
                  mensagem.autor === 'ia'
                    ? 'rounded-2xl bg-rose-50 p-3 text-sm'
                    : 'rounded-2xl bg-slate-100 p-3 text-sm'
                }
              >
                <span className="font-bold">
                  {mensagem.autor === 'ia' ? 'Apoio' : 'Você'}:{' '}
                </span>
                {mensagem.texto}
              </p>
            ))}
          </div>
          {sugestoes.map((sugestao) => (
            <div key={sugestao.titulo} className="mb-2 rounded-2xl border border-rose-100 p-3">
              <p className="text-sm font-bold text-rose-700">{sugestao.titulo}</p>
              <p className="text-sm text-slate-600">{sugestao.conteudo}</p>
              <Botao className="mt-2" variante="outline" onClick={() => aplicarSugestao(sugestao)}>
                Usar no formulário
              </Botao>
            </div>
          ))}
          <form
            className="flex gap-2"
            onSubmit={(evento) => {
              evento.preventDefault()
              const resposta = enviarChat(consultaId, texto, vetId)
              if (typeof resposta === 'string') {
                setErro(resposta)
                return
              }
              setSugestoes(resposta)
              setTexto('')
              setErro(null)
            }}
          >
            <Texto
              value={texto}
              placeholder="Ex.: coceira, vômito, vacina, retorno"
              onChange={(evento) => setTexto(evento.target.value)}
            />
            <Botao type="submit" disabled={encerrada}>
              Enviar
            </Botao>
          </form>
        </Cartao>
      </div>

      <div className="space-y-4">
        <Cartao>
          <form
            className="space-y-3"
            onSubmit={(evento) => {
              evento.preventDefault()
              const falha = salvarProntuario(consultaId, prontuario, vetId)
              setErro(falha)
              setOk(falha ? null : 'Prontuário salvo.')
            }}
          >
            <Campo label="Prontuário">
              <Area value={prontuario} onChange={(evento) => setProntuario(evento.target.value)} />
            </Campo>
            <Botao type="submit" disabled={encerrada}>
              Salvar prontuário
            </Botao>
          </form>
        </Cartao>
        <Cartao>
          <form
            className="space-y-3"
            onSubmit={(evento) => {
              evento.preventDefault()
              const falha = salvarReceita(consultaId, receita, vetId)
              setErro(falha)
              if (!falha) {
                setOk('Receita registrada.')
                setReceita('')
              }
            }}
          >
            <Campo label="Receita">
              <Area value={receita} onChange={(evento) => setReceita(evento.target.value)} />
            </Campo>
            <Botao type="submit" disabled={encerrada}>
              Registrar receita
            </Botao>
          </form>
        </Cartao>
        <Cartao>
          <form
            className="space-y-3"
            onSubmit={(evento) => {
              evento.preventDefault()
              const falha = salvarVacina({
                petId: consulta.petId,
                nome: vacina,
                aplicadaEm,
                proximaDose,
                veterinarioId: vetId,
                consultaId,
              })
              setErro(falha)
              setOk(falha ? null : 'Vacina lançada na carteira.')
            }}
          >
            <Campo label="Vacina aplicada">
              <Texto value={vacina} onChange={(evento) => setVacina(evento.target.value)} />
            </Campo>
            <Campo label="Data">
              <Texto type="date" value={aplicadaEm} onChange={(evento) => setAplicadaEm(evento.target.value)} />
            </Campo>
            <Campo label="Próxima dose">
              <Texto type="date" value={proximaDose} onChange={(evento) => setProximaDose(evento.target.value)} />
            </Campo>
            <Botao type="submit" disabled={encerrada}>
              Lançar vacina
            </Botao>
          </form>
        </Cartao>
        <Botao
          className="w-full"
          disabled={encerrada || usuario.perfil !== 'veterinario'}
          onClick={() => {
            const falha = concluirConsulta(consultaId, vetId)
            setErro(falha)
            if (!falha) router.push('/TT-Pets/veterinario/atendimentos')
          }}
        >
          Concluir atendimento
        </Botao>
        {usuario.perfil === 'gestor' && (
          <p className="text-xs text-slate-400">
            A conclusão fica com o veterinário responsável. Você pode revisar e salvar os registros.
          </p>
        )}
      </div>
    </div>
  )
}
