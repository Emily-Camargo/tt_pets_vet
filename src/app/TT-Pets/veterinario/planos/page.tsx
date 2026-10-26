'use client'

import { GestaoPlanos } from '@/app/TT-Pets/planos/components/gestao'
import { useUsuario } from '@/hooks/banco'

export default function Page() {
  const { usuario } = useUsuario()
  if (!usuario?.veterinarioId) return null

  return <GestaoPlanos veterinarioFixo={usuario.veterinarioId} />
}
