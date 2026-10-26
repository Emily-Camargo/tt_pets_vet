'use client'

import { Button, Text, Title } from '@mantine/core'
import Link from 'next/link'

import { REGISTER_BENEFITS } from '../utils/constants'

export function AccessPanel({ mode }: { mode: 'login' | 'register' }) {
  const register = mode === 'register'

  return (
    <aside className="relative flex min-h-[34rem] flex-1 flex-col items-center justify-center bg-[#7434d6] px-8 py-16 text-center text-white lg:min-h-screen">
      <Title order={2} c="white">
        {register
          ? 'Cadastre-se para cuidar do seu pet em casa'
          : 'Cuidado veterinário na casa do seu pet'}
      </Title>
      {register ? (
        <ul className="mt-8 space-y-3 text-left">
          {REGISTER_BENEFITS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        <Text c="white" mt="md" maw={360}>
          Planos mensais, consulta em domicílio, vacinas e o histórico do pet em
          um só lugar.
        </Text>
      )}
      {register && (
        <Button
          component={Link}
          href="/login"
          variant="white"
          color="#7434d6"
          mt="xl"
          radius="xl"
        >
          Voltar para Login
        </Button>
      )}
    </aside>
  )
}
