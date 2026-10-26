'use client'

import { useUsuario } from '@/core/hooks/use-session'

import { AdminHome } from './admin-home'
import { TutorHome } from './tutor-home'
import { VeterinarianHome } from './veterinarian-home'

export function Home() {
  const { banco, usuario } = useUsuario()
  if (!usuario) return null
  if (usuario.perfil === 'admin') return <AdminHome bank={banco} user={usuario} />
  if (usuario.perfil === 'veterinario') return <VeterinarianHome bank={banco} user={usuario} />
  return <TutorHome bank={banco} user={usuario} />
}
