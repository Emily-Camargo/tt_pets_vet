'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { definirSessao } from '@/auth/sessao'
import { destino } from '@/domain/formatacao'
import { useUsuario } from '@/hooks/banco'
import { entrar } from '@/mocks/acoes'
import { SENHA_DEMO } from '@/mocks/catalogo'

import { Aviso, Botao, Campo, Texto, TelaCarregando } from '@/components/ui'

const CONTAS = [
  { perfil: 'Admin', email: 'admin@ttpets.com' },
  { perfil: 'Clínica Passo Fundo', email: 'gestor.passo@ttpets.com' },
  { perfil: 'Veterinário', email: 'paulo.vet@ttpets.com' },
  { perfil: 'Tutora Ana Souza', email: 'ana.tutor@ttpets.com' },
  { perfil: 'Clínica Marau', email: 'gestor.marau@ttpets.com' },
]

export function Login() {
  const router = useRouter()
  const { usuario, pronto } = useUsuario()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState(SENHA_DEMO)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    if (pronto && usuario) router.replace(destino(usuario.perfil))
  }, [pronto, usuario, router])

  if (!pronto) return <TelaCarregando />

  function acessar(emailAcesso: string, senhaAcesso: string) {
    const resultado = entrar(emailAcesso, senhaAcesso)
    if ('erro' in resultado && resultado.erro) {
      setErro(resultado.erro)
      return
    }
    if (!('usuario' in resultado) || !resultado.usuario) return
    definirSessao(resultado.usuario.id)
    router.replace(destino(resultado.usuario.perfil))
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-50 via-white to-slate-100 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
        <div className="mb-6 text-center">
          <p className="text-3xl">🐾</p>
          <h1 className="mt-2 text-3xl font-extrabold text-rose-600">TT Pets Vet</h1>
          <p className="mt-2 text-sm text-slate-500">
            Planos, agenda e atendimento domiciliar. Protótipo com dados de exemplo.
          </p>
        </div>
        <form
          className="space-y-4"
          onSubmit={(evento) => {
            evento.preventDefault()
            acessar(email, senha)
          }}
        >
          <Aviso texto={erro} />
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
              onChange={(evento) => setSenha(evento.target.value)}
            />
          </Campo>
          <Botao type="submit" className="w-full">
            Entrar
          </Botao>
        </form>
        <div className="mt-6 rounded-2xl bg-rose-50 p-4">
          <p className="text-xs font-bold text-rose-800">
            Contas de demonstração · senha {SENHA_DEMO}
          </p>
          <ul className="mt-2 space-y-1">
            {CONTAS.map((conta) => (
              <li key={conta.email}>
                <button
                  type="button"
                  className="text-left text-sm text-rose-900 hover:underline"
                  onClick={() => acessar(conta.email, SENHA_DEMO)}
                >
                  <span className="font-semibold">{conta.perfil}:</span> {conta.email}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-6 text-center text-sm text-slate-500">
          É tutor?{' '}
          <Link href="/TT-Pets/cadastro" className="font-bold text-rose-600">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  )
}
