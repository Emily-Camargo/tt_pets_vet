'use client'

import { Center, Loader } from '@mantine/core'
import { useRouter } from 'next/navigation'
import { useEffect, type ReactNode } from 'react'

import { destino } from '@/core/functions/format'
import { useUsuario } from '@/core/hooks/use-session'
import type { Perfil } from '@/core/interfaces/types'

import { AppNavbar } from './navbar'

export function Guard({
  profiles,
  children,
}: {
  profiles: Perfil[]
  children: ReactNode
}) {
  const { usuario, pronto } = useUsuario()
  const router = useRouter()

  useEffect(() => {
    if (!pronto) return
    if (!usuario) router.replace('/login')
    else if (!profiles.includes(usuario.perfil)) router.replace(destino(usuario.perfil))
  }, [pronto, usuario, profiles, router])

  if (!pronto || !usuario || !profiles.includes(usuario.perfil)) {
    return (
      <Center mih="100vh">
        <Loader color="#7434d6" />
      </Center>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AppNavbar />
      <main className="mx-auto w-full max-w-6xl px-4 py-6">{children}</main>
    </div>
  )
}
