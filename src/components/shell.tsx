'use client'

import { useRouter } from 'next/navigation'
import { useEffect, type ReactNode } from 'react'

import { destino } from '@/domain/formatacao'
import type { Perfil } from '@/domain/tipos'
import { useUsuario } from '@/hooks/banco'
import Navbar from '@/components/navbar'

import { TelaCarregando } from './ui'

export function Guarda({
  perfis,
  children,
}: {
  perfis: Perfil[]
  children: ReactNode
}) {
  const { usuario, pronto } = useUsuario()
  const router = useRouter()

  useEffect(() => {
    if (!pronto) return
    if (!usuario) router.replace('/TT-Pets/login')
    else if (!perfis.includes(usuario.perfil)) router.replace(destino(usuario.perfil))
  }, [pronto, usuario, perfis, router])

  if (!pronto || !usuario || !perfis.includes(usuario.perfil)) {
    return <TelaCarregando />
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-4 py-6">{children}</main>
    </div>
  )
}
