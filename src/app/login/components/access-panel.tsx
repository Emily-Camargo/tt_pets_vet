'use client'

import { Button, Text, Title } from '@mantine/core'
import Link from 'next/link'
import { FiCheck, FiArrowLeft } from 'react-icons/fi'
import { MdPets } from 'react-icons/md'

import { REGISTER_BENEFITS } from '../utils/constants'

function BrandMark() {
  return (
    <div className="mb-8 flex flex-col items-center gap-3">
      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15 text-white ring-1 ring-white/30">
        <MdPets size={26} />
      </div>
      <div className="text-center leading-tight">
        <Text fw={700} c="white" size="lg">
          TT Pets
        </Text>
        <Text
          size="xs"
          c="white"
          fw={600}
          tt="uppercase"
          style={{ letterSpacing: '0.18em' }}
        >
          Vet
        </Text>
      </div>
    </div>
  )
}

export function AccessPanel({ mode }: { mode: 'login' | 'register' }) {
  const register = mode === 'register'

  return (
    <aside className="relative flex min-h-screen w-1/2 flex-1 flex-col items-center justify-center bg-[#7434d6] px-8 py-16 text-center text-white max-lg:min-h-[34rem] max-lg:w-full">
      <BrandMark />

      <Title
        order={2}
        c="white"
        fw={700}
        maw={420}
        style={{ letterSpacing: '-0.02em' }}
      >
        {register
          ? 'Cadastre-se para cuidar do seu pet em casa'
          : 'Cuidado veterinário na casa do seu pet'}
      </Title>

      {register ? (
        <>
          <Text c="rgba(255,255,255,0.9)" mt="md" size="sm">
            Faça parte do TT Pets Vet
          </Text>
          <ul className="mt-8 w-full max-w-[360px] space-y-3 text-left">
            {REGISTER_BENEFITS.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-white/20 text-white">
                  <FiCheck size={12} strokeWidth={3} />
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <Button
            component={Link}
            href="/login"
            variant="outline"
            color="white"
            mt="xl"
            radius="xl"
            leftSection={<FiArrowLeft size={16} />}
            styles={{
              root: {
                borderColor: 'rgba(255,255,255,0.7)',
                color: '#fff',
                backgroundColor: 'transparent',
              },
            }}
          >
            Voltar para Login
          </Button>
          <Text
            size="xs"
            c="rgba(255,255,255,0.75)"
            mt={48}
            maw={320}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 max-lg:static max-lg:mt-10 max-lg:translate-x-0"
          >
            atendimento onde o pet está / veterinários de Passo Fundo e Marau
          </Text>
        </>
      ) : (
        <>
          <Text c="rgba(255,255,255,0.92)" mt="md" maw={380} size="sm" lh={1.6}>
            Planos mensais, consulta em domicílio, vacinas e o histórico do pet
            em um só lugar. Para tutores e veterinários.
          </Text>
          <div className="mt-8 rounded-full border border-white/55 px-5 py-2 text-sm font-medium text-white">
            Atendimento em Passo Fundo e Marau
          </div>
          <Text
            size="xs"
            c="rgba(255,255,255,0.75)"
            mt={48}
            maw={340}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 max-lg:static max-lg:mt-10 max-lg:translate-x-0"
          >
            consulta domiciliar · carteira de vacinas / planos por cidade e por
            veterinário
          </Text>
        </>
      )}
    </aside>
  )
}
