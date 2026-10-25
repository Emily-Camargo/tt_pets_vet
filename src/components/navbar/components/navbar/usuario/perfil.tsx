'use client'

import { useEffect, useState } from 'react'

import Dialog from '@/components/dialog'
import { Aviso, Botao, Campo, Ok, Texto } from '@/components/ui'
import { telefone } from '@/domain/formatacao'
import { useUsuario } from '@/hooks/banco'
import { salvarPerfil } from '@/mocks/acoes'

export function PerfilDialog({
  aberto,
  onFechar,
}: {
  aberto: boolean
  onFechar: () => void
}) {
  const { usuario, banco } = useUsuario()
  const tutor = banco.tutores.find((item) => item.id === usuario?.tutorId)
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [fone, setFone] = useState('')
  const [senhaAtual, setSenhaAtual] = useState('')
  const [senhaNova, setSenhaNova] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [ok, setOk] = useState<string | null>(null)

  useEffect(() => {
    if (!aberto || !usuario) return
    setNome(usuario.nome)
    setEmail(usuario.email)
    setFone(tutor ? telefone(tutor.telefone) : '')
    setSenhaAtual('')
    setSenhaNova('')
    setErro(null)
    setOk(null)
  }, [aberto, usuario, tutor])

  return (
    <Dialog
      open={aberto}
      onClose={onFechar}
      title="Configurações do perfil"
      maxWidth="sm"
      actions={
        <>
          <Botao type="button" variante="fantasma" onClick={onFechar}>
            Fechar
          </Botao>
          <Botao
            type="submit"
            form="form-perfil"
          >
            Salvar
          </Botao>
        </>
      }
    >
      <form
        id="form-perfil"
        className="space-y-3 pt-1"
        onSubmit={(evento) => {
          evento.preventDefault()
          if (!usuario) return
          const falha = salvarPerfil(usuario.id, {
            nome,
            email,
            telefone: tutor ? fone : undefined,
            senhaAtual,
            senhaNova,
          })
          setErro(falha)
          setOk(falha ? null : 'Perfil atualizado.')
          if (!falha) {
            setSenhaAtual('')
            setSenhaNova('')
          }
        }}
      >
        <Aviso texto={erro} />
        <Ok texto={ok} />
        <Campo label="Nome">
          <Texto value={nome} required onChange={(evento) => setNome(evento.target.value)} />
        </Campo>
        <Campo label="E-mail">
          <Texto
            type="email"
            value={email}
            required
            onChange={(evento) => setEmail(evento.target.value)}
          />
        </Campo>
        {tutor && (
          <Campo label="Telefone">
            <Texto
              value={fone}
              required
              onChange={(evento) => setFone(telefone(evento.target.value))}
            />
          </Campo>
        )}
        <Campo label="Senha atual">
          <Texto
            type="password"
            value={senhaAtual}
            autoComplete="current-password"
            onChange={(evento) => setSenhaAtual(evento.target.value)}
          />
        </Campo>
        <Campo label="Nova senha">
          <Texto
            type="password"
            value={senhaNova}
            autoComplete="new-password"
            minLength={senhaNova ? 6 : undefined}
            onChange={(evento) => setSenhaNova(evento.target.value)}
          />
        </Campo>
        <p className="text-xs text-slate-400">
          Preencha a senha atual só se quiser trocar a senha.
        </p>
      </form>
    </Dialog>
  )
}
