'use client'

import { useState } from 'react'

import { Aviso, Botao, Campo, Cartao, Modal, Ok, Pagina, Texto, Vazio } from '@/components/ui'
import { useUsuario } from '@/hooks/banco'
import { excluirCidade, salvarCidade } from '@/mocks/acoes'

export function Cidades() {
  const { banco } = useUsuario()
  const [aberto, setAberto] = useState(false)
  const [id, setId] = useState<string>()
  const [nome, setNome] = useState('')
  const [uf, setUf] = useState('RS')
  const [erro, setErro] = useState<string | null>(null)
  const [ok, setOk] = useState<string | null>(null)

  function abrir(cidade?: { id: string; nome: string; uf: string }) {
    setId(cidade?.id)
    setNome(cidade?.nome ?? '')
    setUf(cidade?.uf ?? 'RS')
    setErro(null)
    setAberto(true)
  }

  return (
    <Pagina
      titulo="Cidades atendidas"
      descricao="O tutor só vê planos da cidade que escolher."
      acao={<Botao onClick={() => abrir()}>Nova cidade</Botao>}
    >
      <Ok texto={ok} />
      {banco.cidades.length === 0 ? (
        <Vazio texto="Nenhuma cidade cadastrada." />
      ) : (
        <div className="grid gap-3">
          {banco.cidades.map((cidade) => (
            <Cartao key={cidade.id}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-extrabold text-slate-900">
                    {cidade.nome} - {cidade.uf}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {banco.clinicas.filter((item) => item.cidadeIds.includes(cidade.id)).length}{' '}
                    clínicas vinculadas
                  </p>
                </div>
                <div className="flex gap-2">
                  <Botao variante="outline" onClick={() => abrir(cidade)}>
                    Editar
                  </Botao>
                  <Botao
                    variante="perigo"
                    onClick={() => {
                      const falha = excluirCidade(cidade.id)
                      setOk(falha ? null : 'Cidade removida.')
                      setErro(falha)
                    }}
                  >
                    Excluir
                  </Botao>
                </div>
              </div>
            </Cartao>
          ))}
        </div>
      )}
      <Aviso texto={erro && !aberto ? erro : null} />
      <Modal aberto={aberto} titulo={id ? 'Editar cidade' : 'Nova cidade'} onFechar={() => setAberto(false)}>
        <form
          className="space-y-4"
          onSubmit={(evento) => {
            evento.preventDefault()
            const falha = salvarCidade({ id, nome, uf })
            setErro(falha)
            if (!falha) {
              setOk('Cidade salva.')
              setAberto(false)
            }
          }}
        >
          <Aviso texto={erro} />
          <Campo label="Nome">
            <Texto value={nome} onChange={(evento) => setNome(evento.target.value)} required />
          </Campo>
          <Campo label="UF">
            <Texto
              value={uf}
              maxLength={2}
              onChange={(evento) => setUf(evento.target.value.toUpperCase())}
              required
            />
          </Campo>
          <Botao type="submit">Salvar</Botao>
        </form>
      </Modal>
    </Pagina>
  )
}
