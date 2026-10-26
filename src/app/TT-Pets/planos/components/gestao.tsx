'use client'

import { useMemo, useState } from 'react'

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
import { moeda, visitas } from '@/domain/formatacao'
import { useUsuario } from '@/hooks/banco'
import { alternarPlano, salvarPlano } from '@/mocks/acoes'
import { CATALOGO_SERVICOS } from '@/mocks/catalogo'
import { nomeCidade, nomeVeterinario } from '@/mocks/regras'

export function GestaoPlanos({ veterinarioFixo }: { veterinarioFixo?: string }) {
  const { banco } = useUsuario()
  const [aberto, setAberto] = useState(false)
  const [id, setId] = useState<string>()
  const [veterinarioId, setVeterinarioId] = useState(veterinarioFixo ?? '')
  const [cidadeId, setCidadeId] = useState('')
  const [nome, setNome] = useState('')
  const [subtitulo, setSubtitulo] = useState('')
  const [preco, setPreco] = useState('99.90')
  const [ilimitado, setIlimitado] = useState(false)
  const [qtdVisitas, setQtdVisitas] = useState('4')
  const [destaque, setDestaque] = useState(false)
  const [ativo, setAtivo] = useState(true)
  const [inclusos, setInclusos] = useState<string[]>([])
  const [erro, setErro] = useState<string | null>(null)
  const [ok, setOk] = useState<string | null>(null)

  const veterinarios = veterinarioFixo
    ? banco.veterinarios.filter((item) => item.id === veterinarioFixo)
    : banco.veterinarios
  const veterinario = banco.veterinarios.find((item) => item.id === veterinarioId)
  const cidades = banco.cidades.filter((item) => veterinario?.cidadeIds.includes(item.id))
  const planos = useMemo(
    () =>
      banco.planos.filter(
        (item) => !veterinarioFixo || item.veterinarioId === veterinarioFixo,
      ),
    [banco.planos, veterinarioFixo],
  )

  function abrir(planoId?: string) {
    const plano = banco.planos.find((item) => item.id === planoId)
    setId(plano?.id)
    setVeterinarioId(plano?.veterinarioId ?? veterinarioFixo ?? banco.veterinarios[0]?.id ?? '')
    setCidadeId(plano?.cidadeId ?? '')
    setNome(plano?.nome ?? '')
    setSubtitulo(plano?.subtitulo ?? '')
    setPreco(String(plano?.precoMensal ?? 99.9))
    setIlimitado(plano ? plano.visitasMes === null : false)
    setQtdVisitas(String(plano?.visitasMes ?? 4))
    setDestaque(plano?.destaque ?? false)
    setAtivo(plano?.ativo ?? true)
    setInclusos(
      plano?.servicos.filter((item) => item.incluso).map((item) => item.nome) ??
        CATALOGO_SERVICOS.slice(0, 3),
    )
    setErro(null)
    setAberto(true)
  }

  return (
    <Pagina
      titulo="Planos de atendimento domiciliar"
      descricao="O que for salvo aqui aparece na vitrine do tutor, na cidade escolhida."
      acao={<Botao onClick={() => abrir()}>Novo plano</Botao>}
    >
      <Ok texto={ok} />
      {planos.length === 0 ? (
        <Vazio texto="Nenhum plano cadastrado." />
      ) : (
        <div className="grid gap-3">
          {planos.map((plano) => (
            <Cartao key={plano.id}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-semibold text-slate-900">{plano.nome}</h2>
                    {plano.destaque && <Selo tom="rosa">Mais vendido</Selo>}
                    <Selo tom={plano.ativo ? 'ok' : 'alerta'}>
                      {plano.ativo ? 'Ativo' : 'Inativo'}
                    </Selo>
                  </div>
                  <p className="text-sm text-slate-500">
                    {nomeVeterinario(banco, plano.veterinarioId)} · {nomeCidade(banco, plano.cidadeId)}
                  </p>
                  <p className="text-sm font-bold text-marca">
                    {moeda(plano.precoMensal)} · {visitas(plano.visitasMes)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Botao variante="outline" onClick={() => abrir(plano.id)}>
                    Editar
                  </Botao>
                  <Botao
                    variante="perigo"
                    onClick={() => {
                      alternarPlano(plano.id)
                      setOk(plano.ativo ? 'Plano inativado.' : 'Plano ativado.')
                    }}
                  >
                    {plano.ativo ? 'Inativar' : 'Ativar'}
                  </Botao>
                </div>
              </div>
            </Cartao>
          ))}
        </div>
      )}
      <Modal aberto={aberto} titulo={id ? 'Editar plano' : 'Novo plano'} onFechar={() => setAberto(false)}>
        <form
          className="space-y-4"
          onSubmit={(evento) => {
            evento.preventDefault()
            const falha = salvarPlano({
              id,
              veterinarioId,
              cidadeId,
              nome,
              subtitulo,
              precoMensal: Number(preco.replace(',', '.')),
              visitasMes: ilimitado ? null : Number(qtdVisitas),
              destaque,
              inclusos,
              ativo,
            })
            setErro(falha)
            if (!falha) {
              setOk('Plano salvo.')
              setAberto(false)
            }
          }}
        >
          <Aviso texto={erro} />
          {!veterinarioFixo && (
            <Campo label="Veterinário">
              <Selecao
                value={veterinarioId}
                onChange={(evento) => {
                  setVeterinarioId(evento.target.value)
                  setCidadeId('')
                }}
              >
                <option value="">Selecione</option>
                {veterinarios.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nome}
                  </option>
                ))}
              </Selecao>
            </Campo>
          )}
          <Campo label="Cidade">
            <Selecao value={cidadeId} onChange={(evento) => setCidadeId(evento.target.value)}>
              <option value="">Selecione</option>
              {cidades.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nome} - {item.uf}
                </option>
              ))}
            </Selecao>
          </Campo>
          <Campo label="Nome">
            <Texto value={nome} required onChange={(evento) => setNome(evento.target.value)} />
          </Campo>
          <Campo label="Subtítulo">
            <Texto value={subtitulo} onChange={(evento) => setSubtitulo(evento.target.value)} />
          </Campo>
          <Campo label="Preço mensal">
            <Texto value={preco} onChange={(evento) => setPreco(evento.target.value)} required />
          </Campo>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={ilimitado}
              onChange={(evento) => setIlimitado(evento.target.checked)}
            />
            Visitas ilimitadas
          </label>
          {!ilimitado && (
            <Campo label="Visitas por mês">
              <Texto
                type="number"
                min={1}
                value={qtdVisitas}
                onChange={(evento) => setQtdVisitas(evento.target.value)}
              />
            </Campo>
          )}
          <fieldset className="space-y-2">
            <legend className="text-sm font-semibold text-slate-700">Serviços inclusos</legend>
            {CATALOGO_SERVICOS.map((servico) => (
              <label key={servico} className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={inclusos.includes(servico)}
                  onChange={(evento) => {
                    setInclusos((atual) =>
                      evento.target.checked
                        ? [...atual, servico]
                        : atual.filter((item) => item !== servico),
                    )
                  }}
                />
                {servico}
              </label>
            ))}
          </fieldset>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={destaque}
              onChange={(evento) => setDestaque(evento.target.checked)}
            />
            Marcar como mais vendido
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={ativo}
              onChange={(evento) => setAtivo(evento.target.checked)}
            />
            Plano ativo
          </label>
          <Botao type="submit">Salvar plano</Botao>
        </form>
      </Modal>
    </Pagina>
  )
}
