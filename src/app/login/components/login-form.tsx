'use client'

import { Input } from '@grazziotin/react-components-next/ui'
import { Button, Text, Title } from '@mantine/core'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { FiCheck } from 'react-icons/fi'

import { feedback } from '@/core/functions/feedback'
import { destino } from '@/core/functions/format'
import { definirSessao } from '@/core/session'
import { entrar } from '@/service/mock/actions'
import { SENHA_DEMO } from '@/service/mock/catalog'

import { LOGIN_BENEFITS } from '../utils/constants'

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [hint, setHint] = useState(false)

  function enter(accessEmail: string, accessPassword: string) {
    const result = entrar(accessEmail, accessPassword)
    if ('erro' in result && result.erro) {
      feedback(result.erro, '')
      return
    }
    if (!('usuario' in result) || !result.usuario) return
    definirSessao(result.usuario.id)
    router.replace(destino(result.usuario.perfil))
  }

  return (
    <div className="flex w-full max-w-[390px] flex-col">
      <Title order={3} ta="center" c="#7434d6" fw={700}>
        Faça seu login
      </Title>

      <form
        className="mt-8 flex flex-col gap-3"
        onSubmit={(event) => {
          event.preventDefault()
          enter(email, password)
        }}
      >
        <Input
          type="email"
          label="E-mail"
          value={email}
          required
          onChange={(event) => setEmail(event.target.value)}
        />
        <Input
          label="Senha"
          type="password"
          isPassword
          value={password}
          required
          onChange={(event) => setPassword(event.target.value)}
        />
        <Button type="submit" color="#7434d6" radius="xl" fullWidth mt={4}>
          Entrar
        </Button>
      </form>

      <Button
        variant="subtle"
        color="#7434d6"
        fullWidth
        mt="sm"
        onClick={() => setHint((current) => !current)}
      >
        Esqueceu sua senha?
      </Button>
      {hint && (
        <Text size="xs" c="dimmed" ta="center">
          Nas contas de exemplo a senha é {SENHA_DEMO}. Se você criou a sua, use
          a senha do cadastro.
        </Text>
      )}

      <Text size="sm" ta="center" mt="xs">
        Não tem conta?{' '}
        <Link href="/register" className="font-semibold text-[#7434d6]">
          Criar conta
        </Link>
      </Text>

      <div className="mt-10">
        <Text size="sm" fw={600} c="#475569" mb="sm">
          Cuidado completo do pet
        </Text>
        <ul className="space-y-2.5">
          {LOGIN_BENEFITS.map((item) => (
            <li key={item} className="flex items-start gap-2.5">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#7434d6] text-white">
                <FiCheck size={11} strokeWidth={3} />
              </span>
              <Text size="sm" c="#64748b">
                {item}
              </Text>
            </li>
          ))}
        </ul>
      </div>

      <Text size="xs" c="dimmed" ta="center" mt="xl">
        Acesso para tutores e veterinários. Consulta em domicílio, planos e
        carteira de vacinas.
      </Text>
    </div>
  )
}
