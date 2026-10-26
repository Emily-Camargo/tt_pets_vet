'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { destino } from '@/domain/formatacao'
import { useUsuario } from '@/hooks/banco'
import { TelaCarregando } from '@/components/ui'

export default function Inicio() {
  const { usuario, pronto } = useUsuario()
  const router = useRouter()

  useEffect(() => {
    if (!pronto) return
    router.replace(usuario ? destino(usuario.perfil) : '/TT-Pets/login')
  }, [pronto, usuario, router])

  return <TelaCarregando />
}
