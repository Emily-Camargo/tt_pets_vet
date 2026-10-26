'use client'

import { Center, Loader } from '@mantine/core'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { destino } from '@/core/functions/format'
import { useUsuario } from '@/core/hooks/use-session'

export default function HomeRedirect() {
  const { usuario, pronto } = useUsuario()
  const router = useRouter()

  useEffect(() => {
    if (!pronto) return
    router.replace(usuario ? destino(usuario.perfil) : '/login')
  }, [pronto, usuario, router])

  return (
    <Center mih="100vh">
      <Loader color="#7434d6" />
    </Center>
  )
}
