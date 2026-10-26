'use client'

import { useState } from 'react'

import {
  Aviso,
  Botao,
  Campo,
  Cartao,
  Modal,
  Ok,
  Pagina,
  Selo,
  Texto,
  Vazio,
} from '@/components/ui'
import { useUsuario } from '@/hooks/banco'
import { salvarVeterinario } from '@/mocks/acoes'
import { nomeCidade } from '@/mocks/regras'

export function Veterinarios() {
  const { banco } = useUsuario()
  const [aberto, setAberto] = useState(false)
  const [id, setId] = useState<string>()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [crmv, setCrmv] = useState('')
  const [especialidade, setEspecialidade] = useState('Clínica geral')
  const [cidadeIds, setCidadeIds] = useState<string[]>([])
  const [ativo, setAtivo] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [ok, setOk] = useState<string | null>(null)

  function abrir(vetId?: string) {
    const vet = banco.veterinarios.find((item) => item.id === vetId)
    const acesso = banco.usuarios.find((item) => item.id === vet?.usuarioId)
    setId(vet?.id)
    setNome(vet?.nome ?? '')
    setEmail(acesso?.email ?? '')
    setSenha('')
    setCrmv(vet?.crmv ?? '')
    setEspecialidade(vet?.especialidade ?? 'Clínica geral')
    setCidadeIds(vet?.cidadeIds ?? [])
    setAtivo(vet?.ativo ?? true)
    setErro(null)
    setAberto(true)
  }

  function alternarCidade(cidadeId: string) {
    setCidadeIds((atual) =>
      atual.includes(cidadeId)
        ? atual.filter((item) => item !== cidadeId)
        : [...atual, cidadeId],
    )
  }

  return (
    <Pagina
      titulo="Veterinários"
      descricao="Cada veterinário entra com o próprio email e cuida da própria agenda, dos planos e dos clientes."
      acao={<Botao onClick={() => abrir()}>Novo veterinário</Botao>}
    >
      <Ok texto={ok} />
      {banco.veterinarios.length === 0 ? (
        <Vazio texto="Nenhum veterinário cadastrado." />
      ) : (
        <div className="grid gap-3">
          {banco.veterinarios.map((vet) => {
            const acesso = banco.usuarios.find((item) => item.id === vet.usuarioId)
            return (
              <Cartao key={vet.id}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-semibold">{vet.nome}</h2>
                      <Selo tom={vet.ativo ? 'ok' : 'alerta'}>
                        {vet.ativo ? 'Ativo' : 'Inativo'}
                      </Selo>
                    </div>
                    <p className="text-sm text-slate-500">
                      {vet.crmv} · {vet.especialidade}
                    </p>
                    <p className="text-sm text-slate-500">{acesso?.email}</p>
                    <p className="text-sm text-slate-500">
                      {vet.cidadeIds.map((cidadeId) => nomeCidade(banco, cidadeId)).join(', ')}
                    </p>
                  </div>
                  <Botao variante="outline" onClick={() => abrir(vet.id)}>
                    Editar
                  </Botao>
                </div>
              </Cartao>
            )
          })}
        </div>
      )}
      <Modal
        aberto={aberto}
        titulo={id ? 'Editar veterinário' : 'Novo veterinário'}
        onFechar={() => setAberto(false)}
      >
        <form
          className="space-y-4"
          onSubmit={(evento) => {
            evento.preventDefault()
            const falha = salvarVeterinario({
              id,
              cidadeIds,
              nome,
              email,
              senha,
              crmv,
              especialidade,
              ativo,
            })
            setErro(falha)
            if (!falha) {
              setOk('Veterinário salvo.')
              setAberto(false)
            }
          }}
        >
          <Aviso texto={erro} />
          <Campo label="Nome">
            <Texto value={nome} required onChange={(evento) => setNome(evento.target.value)} />
          </Campo>
          <Campo label="Email de acesso">
            <Texto
              type="email"
              value={email}
              required
              onChange={(evento) => setEmail(evento.target.value)}
            />
          </Campo>
          <Campo label={id ? 'Nova senha (opcional)' : 'Senha'}>
            <Texto
              type="password"
              value={senha}
              onChange={(evento) => setSenha(evento.target.value)}
            />
          </Campo>
          <Campo label="CRMV">
            <Texto value={crmv} required onChange={(evento) => setCrmv(evento.target.value)} />
          </Campo>
          <Campo label="Especialidade">
            <Texto
              value={especialidade}
              onChange={(evento) => setEspecialidade(evento.target.value)}
            />
          </Campo>
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium text-slate-700">Cidades</legend>
            {banco.cidades.map((cidade) => (
              <label key={cidade.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={cidadeIds.includes(cidade.id)}
                  onChange={() => alternarCidade(cidade.id)}
                />
                {nomeCidade(banco, cidade.id)}
              </label>
            ))}
          </fieldset>
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input
              type="checkbox"
              checked={ativo}
              onChange={(evento) => setAtivo(evento.target.checked)}
            />
            Ativo
          </label>
          <Botao type="submit">Salvar</Botao>
        </form>
      </Modal>
    </Pagina>
  )
}
