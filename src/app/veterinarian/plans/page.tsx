'use client'

import { memo } from 'react'

import { PlanManager } from '@/app/plans/components'
import { useUsuario } from '@/core/hooks/use-session'

const VetPlansPage = () => {
  const { usuario } = useUsuario()
  if (!usuario?.veterinarioId) return null
  return <PlanManager fixedVetId={usuario.veterinarioId} />
}

export default memo(VetPlansPage)
