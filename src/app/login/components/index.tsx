'use client'

import { Center, Loader } from '@mantine/core'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { destino } from '@/core/functions/format'
import { useUsuario } from '@/core/hooks/use-session'

import { AccessPanel } from './access-panel'
import { LoginForm } from './login-form'
import { RegisterForm } from './register-form'

export function Access({ mode }: { mode: 'login' | 'register' }) {
  const router = useRouter()
  const { usuario, pronto } = useUsuario()
  const register = mode === 'register'

  useEffect(() => {
    if (mode === 'login' && pronto && usuario)
      router.replace(destino(usuario.perfil))
  }, [mode, pronto, usuario, router])

  if (mode === 'login' && !pronto) {
    return (
      <Center mih="100vh">
        <Loader color="#7434d6" />
      </Center>
    )
  }

  return (
    <div
      className={`flex min-h-screen flex-col bg-white lg:flex-row ${register ? 'lg:flex-row-reverse' : ''}`}
    >
      <section className="flex min-h-screen flex-1 flex-col items-center justify-center px-6 py-10">
        {register ? <RegisterForm /> : <LoginForm />}
      </section>
      <AccessPanel mode={mode} />
    </div>
  )
}
