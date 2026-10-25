'use client'

import { useState } from 'react'

import { Aviso, Botao, Campo, Cartao, Modal, Ok, Pagina, Selo, Texto, Vazio } from '@/components/ui'
import { cnpj } from '@/domain/formatacao'
import { nomeCidade } from '@/mocks/regras'
import { useUsuario } from '@/hooks/banco'
import { alternarClinica, salvarClinica } from '@/mocks/acoes'

export function Clinicas() {
  const { banco } = useUsuario()
  const [aberto, setAberto] = useState(false)
  const [id, setId] = useState<string>()
  const [nome, setNome] = useState('')
  const [documento, setDocumento] = useState('')
  const [cidades, setCidades] = useState<string[]>([])
  const [ativa, setAtiva] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [ok, setOk] = useState<string | null>(null)

  function abrir(clinicaId?: string) {
    const clinica = banco.clinicas.find((item) => item.id === clinicaId)
    setId(clinica?.id)
    setNome(clinica?.nome ?? '')
    setDocumento(clinica ? cnpj(clinica.cnpj) : '')
    setCidades(clinica?.cidadeIds ?? [])
    setAtiva(clinica?.ativa ?? true)
    setErro(null)
    setAberto(true)
  }

  return (
    <Pagina
      titulo="Clínicas"
      descricao="Cada clínica só enxerga os próprios veterinários, planos e agenda."
      acao={<Botao onClick={() => abrir()}>Nova clínica</Botao>}
    >
      <Ok texto={ok} />
      <Aviso texto={!aberto ? erro : null} />
      {banco.clinicas.length === 0 ? (
        <Vazio texto="Nenhuma clínica cadastrada." />
      ) : (
        <div className="grid gap-3">
          {banco.clinicas.map((clinica) => (
            <Cartao key={clinica.id}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-extrabold text-slate-900">{clinica.nome}</h2>
                    <Selo tom={clinica.ativa ? 'ok' : 'alerta'}>
                      {clinica.ativa ? 'Ativa' : 'Inativa'}
                    </Selo>
                  </div>
                  <p className="text-sm text-slate-500">{cnpj(clinica.cnpj)}</p>
                  <p className="text-sm text-slate-500">
                    {clinica.cidadeIds.map((cidadeId) => nomeCidade(banco, cidadeId)).join(', ')}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Botao variante="outline" onClick={() => abrir(clinica.id)}>
                    Editar
                  </Botao>
                  <Botao
                    variante="perigo"
                    onClick={() => {
                      alternarClinica(clinica.id)
                      setOk(clinica.ativa ? 'Clínica inativada.' : 'Clínica ativada.')
                    }}
                  >
                    {clinica.ativa ? 'Inativar' : 'Ativar'}
                  </Botao>
                </div>
              </div>
            </Cartao>
          ))}
        </div>
      )}
      <Modal aberto={aberto} titulo={id ? 'Editar clínica' : 'Nova clínica'} onFechar={() => setAberto(false)}>
        <form
          className="space-y-4"
          onSubmit={(evento) => {
            evento.preventDefault()
            const falha = salvarClinica({
              id,
              nome,
              cnpj: documento,
              cidadeIds: cidades,
              ativa,
            })
            setErro(falha)
            if (!falha) {
              setOk('Clínica salva.')
              setAberto(false)
            }
          }}
        >
          <Aviso texto={erro} />
          <Campo label="Nome">
            <Texto value={nome} required onChange={(evento) => setNome(evento.target.value)} />
          </Campo>
          <Campo label="CNPJ">
            <Texto
              value={documento}
              required
              onChange={(evento) => setDocumento(cnpj(evento.target.value))}
            />
          </Campo>
          <fieldset className="space-y-2">
            <legend className="text-sm font-semibold text-slate-700">Cidades atendidas</legend>
            {banco.cidades.map((cidade) => (
              <label key={cidade.id} className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={cidades.includes(cidade.id)}
                  onChange={(evento) => {
                    setCidades((atual) =>
                      evento.target.checked
                        ? [...atual, cidade.id]
                        : atual.filter((item) => item !== cidade.id),
                    )
                  }}
                />
                {cidade.nome} - {cidade.uf}
              </label>
            ))}
          </fieldset>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={ativa}
              onChange={(evento) => setAtiva(evento.target.checked)}
            />
            Clínica ativa
          </label>
          <Botao type="submit">Salvar</Botao>
        </form>
      </Modal>
    </Pagina>
  )
}
