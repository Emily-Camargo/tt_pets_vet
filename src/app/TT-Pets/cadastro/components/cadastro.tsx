'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { definirSessao } from '@/auth/sessao'
import { cpf, telefone } from '@/domain/formatacao'
import { Aviso, Botao, Campo, Texto } from '@/components/ui'
import { entrar, cadastrarTutor } from '@/mocks/acoes'

export function Cadastro() {
  const router = useRouter()
  const [nome, setNome] = useState('')
  const [documento, setDocumento] = useState('')
  const [fone, setFone] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState<string | null>(null)

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <form
        className="w-full max-w-md space-y-4 rounded-3xl border border-slate-200 bg-white p-8 shadow-xl"
        onSubmit={(evento) => {
          evento.preventDefault()
          const falha = cadastrarTutor({
            nome,
            cpf: documento,
            telefone: fone,
            email,
            senha,
          })
          if (falha) {
            setErro(falha)
            return
          }
          const acesso = entrar(email, senha)
          if (!('usuario' in acesso) || !acesso.usuario) {
            setErro('Conta criada, mas o login falhou.')
            return
          }
          definirSessao(acesso.usuario.id)
          router.replace('/TT-Pets/tutor/pets')
        }}
      >
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Criar conta de tutor</h1>
          <p className="mt-1 text-sm text-slate-500">
            Depois você cadastra os pets e escolhe um plano.
          </p>
        </div>
        <Aviso texto={erro} />
        <Campo label="Nome">
          <Texto value={nome} required onChange={(evento) => setNome(evento.target.value)} />
        </Campo>
        <Campo label="CPF">
          <Texto
            value={documento}
            required
            onChange={(evento) => setDocumento(cpf(evento.target.value))}
          />
        </Campo>
        <Campo label="Telefone">
          <Texto
            value={fone}
            required
            onChange={(evento) => setFone(telefone(evento.target.value))}
          />
        </Campo>
        <Campo label="Email">
          <Texto
            type="email"
            value={email}
            required
            onChange={(evento) => setEmail(evento.target.value)}
          />
        </Campo>
        <Campo label="Senha">
          <Texto
            type="password"
            value={senha}
            required
            minLength={6}
            onChange={(evento) => setSenha(evento.target.value)}
          />
        </Campo>
        <Botao type="submit" className="w-full">
          Cadastrar e entrar
        </Botao>
        <p className="text-center text-sm">
          <Link href="/TT-Pets/login" className="font-bold text-rose-600">
            Já tenho conta
          </Link>
        </p>
      </form>
    </div>
  )
}
