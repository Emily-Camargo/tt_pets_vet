'use client'

import { memo } from 'react'

import { useUsuario } from '@/core/hooks/use-session'

import { VetPlans } from './components'

const VetPlansPage = () => {
  const { usuario } = useUsuario()
  if (!usuario?.veterinarioId) return null
  return <VetPlans />
}

export default memo(VetPlansPage)
