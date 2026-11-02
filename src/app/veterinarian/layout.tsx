'use client'

import type { ReactNode } from 'react'

import { Guard } from '@/core/components/guard'

export default function Layout({ children }: { children: ReactNode }) {
  return <Guard profiles={['veterinario']}>{children}</Guard>
}
