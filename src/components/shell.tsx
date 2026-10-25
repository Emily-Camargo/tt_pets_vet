'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState, type ReactNode } from 'react'

import { definirSessao } from '@/auth/sessao'
import { cx, destino, rotuloPerfil } from '@/domain/formatacao'
import { menuDo } from '@/domain/navegacao'
import type { Perfil } from '@/domain/tipos'
import { useUsuario } from '@/hooks/banco'
import { restaurarBanco } from '@/mocks/store'

import { TelaCarregando } from './ui'

function Logo() {
  return (
    <Link href="/TT-Pets/login" className="flex items-center gap-2 text-lg font-extrabold text-rose-600">
      <span className="text-xl" aria-hidden>
        🐾
      </span>
      TT Pets Vet
    </Link>
  )
}

export function Guarda({
  perfis,
  children,
}: {
  perfis: Perfil[]
  children: ReactNode
}) {
  const { usuario, pronto, banco } = useUsuario()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!pronto) return
    if (!usuario) router.replace('/TT-Pets/login')
    else if (!perfis.includes(usuario.perfil)) router.replace(destino(usuario.perfil))
  }, [pronto, usuario, perfis, router])

  if (!pronto || !usuario || !perfis.includes(usuario.perfil)) {
    return <TelaCarregando />
  }

  const clinica = banco.clinicas.find((item) => item.id === usuario.clinicaId)
  const menu = menuDo(usuario.perfil)
  const naoLidas = banco.notificacoes.filter(
    (item) => item.tutorId === usuario.tutorId && !item.lida,
  ).length

  return (
    <Shell
      nome={usuario.nome}
      perfil={rotuloPerfil(usuario.perfil)}
      extra={clinica?.nome}
      menu={menu}
      pathname={pathname}
      naoLidas={usuario.perfil === 'tutor' ? naoLidas : 0}
      onSair={() => {
        definirSessao(null)
        router.replace('/TT-Pets/login')
      }}
    >
      {children}
    </Shell>
  )
}

function Shell({
  nome,
  perfil,
  extra,
  menu,
  pathname,
  naoLidas,
  onSair,
  children,
}: {
  nome: string
  perfil: string
  extra?: string
  menu: { href: string; label: string }[]
  pathname: string
  naoLidas: number
  onSair: () => void
  children: ReactNode
}) {
  const [aberto, setAberto] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
          <Logo />
          <div className="text-right text-sm text-slate-500">
            <p className="font-semibold text-slate-700">
              {nome} · {perfil}
            </p>
            {extra && <p className="text-xs">{extra}</p>}
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 pb-3">
          {menu.map((item) => {
            const ativo = pathname === item.href || pathname.startsWith(`${item.href}/`)
            const avisos = item.href.endsWith('/notificacoes') ? naoLidas : 0
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cx(
                  'whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-bold',
                  ativo ? 'bg-rose-600 text-white' : 'text-slate-600 hover:bg-rose-50',
                )}
              >
                {item.label}
                {avisos > 0 && (
                  <span className="ml-2 rounded-full bg-white px-1.5 text-xs text-rose-600">
                    {avisos}
                  </span>
                )}
              </Link>
            )
          })}
          <button
            type="button"
            className="ml-auto whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-semibold text-slate-400 hover:text-slate-700"
            onClick={() => setAberto((valor) => !valor)}
          >
            Conta
          </button>
        </nav>
        {aberto && (
          <div className="mx-auto flex max-w-6xl justify-end gap-2 px-4 pb-3">
            <button
              type="button"
              className="rounded-full px-3 py-1.5 text-sm font-semibold text-slate-500"
              onClick={() => {
                restaurarBanco()
                setAberto(false)
              }}
            >
              Restaurar exemplo
            </button>
            <button
              type="button"
              className="rounded-full bg-slate-900 px-3 py-1.5 text-sm font-bold text-white"
              onClick={onSair}
            >
              Sair
            </button>
          </div>
        )}
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-8">{children}</main>
    </div>
  )
}
