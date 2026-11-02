'use client'

import { Button } from '@mantine/core'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3">
      <p className="text-lg font-semibold">Página não encontrada</p>
      <Button component={Link} href="/login" color="#7434d6">
        Ir para o login
      </Button>
    </div>
  )
}
