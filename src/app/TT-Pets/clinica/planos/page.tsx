'use client'

import { GestaoPlanos } from '@/app/TT-Pets/planos/components/gestao'
import { useUsuario } from '@/hooks/banco'

export default function Page() {
  const { usuario } = useUsuario()

  return <GestaoPlanos clinicaFixa={usuario?.clinicaId} />
}
