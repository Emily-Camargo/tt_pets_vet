'use client'

import type { ReactNode } from 'react'

import { Guarda } from '@/components/shell'
import type { Perfil } from '@/domain/tipos'

const PERFIS: Perfil[] = ['veterinario']

export default function Layout({ children }: { children: ReactNode }) {
  return <Guarda perfis={PERFIS}>{children}</Guarda>
}
