'use client'

import { Input } from '@grazziotin/react-components-next/ui'
import { Button, Text, Title } from '@mantine/core'
import { useRouter } from 'next/navigation'
import { useState, type FormEvent } from 'react'

import { feedback } from '@/core/functions/feedback'
import { formatCpfCnpj, formatPhoneBr } from '@/core/functions/format'
import { definirSessao } from '@/core/session'
import { cadastrarTutor, entrar } from '@/service/mock/actions'

export function RegisterForm() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2>(1)
  const [name, setName] = useState('')
  const [document, setDocument] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')

  function next(event: FormEvent) {
    event.preventDefault()
    if (document.replace(/\D/g, '').length < 11) {
      feedback('Informe um CPF com 11 dígitos.', '')
      return
    }
    if (phone.replace(/\D/g, '').length < 10) {
      feedback('Informe um telefone com DDD.', '')
      return
    }
    setStep(2)
  }

  function finish(event: FormEvent) {
    event.preventDefault()
    if (password.length < 6) {
      feedback('A senha precisa ter ao menos 6 caracteres.', '')
      return
    }
    if (password !== confirm) {
      feedback('A confirmação da senha não confere.', '')
      return
    }
    const error = cadastrarTutor({
      nome: name,
      cpf: document,
      telefone: phone,
      email,
      senha: password,
    })
    if (error) {
      feedback(error, '')
      return
    }
    const access = entrar(email, password)
    if (!('usuario' in access) || !access.usuario) {
      feedback('Conta criada, mas o login falhou.', '')
      return
    }
    definirSessao(access.usuario.id)
    router.replace('/tutor/pets')
  }

  return (
    <div className="w-full max-w-[420px]">
      <Title order={3} ta="center" c="#7434d6" fw={700}>
        Criar conta
      </Title>

      <div className="mx-auto mt-4 flex h-1.5 w-full max-w-[220px] overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-[#7434d6] transition-all"
          style={{ width: step === 1 ? '48%' : '100%' }}
        />
      </div>

      {step === 1 ? (
        <form className="mt-8 flex flex-col gap-3" onSubmit={next}>
          <Input
            label="Nome completo"
            value={name}
            required
            onChange={(event) => setName(event.target.value)}
          />
          <Input
            label="CPF"
            type="cpf-cnpj"
            value={document}
            required
            onChange={(event) => setDocument(formatCpfCnpj(event.target.value))}
          />
          <Input
            label="E-mail"
            type="email"
            value={email}
            required
            onChange={(event) => setEmail(event.target.value)}
          />
          <Input
            label="Telefone"
            value={phone}
            required
            onChange={(event) => setPhone(formatPhoneBr(event.target.value))}
          />
          <Input
            label="Senha"
            type="password"
            isPassword
            value={password}
            required
            onChange={(event) => setPassword(event.target.value)}
          />
          <div className="mt-2 flex justify-end">
            <Button type="submit" color="#7434d6" radius="xl" px="xl">
              Próximo
            </Button>
          </div>
        </form>
      ) : (
        <form className="mt-8 flex flex-col gap-3" onSubmit={finish}>
          <Text size="sm" c="dimmed" ta="center">
            Confirme a senha para criar a conta de tutor e cadastrar seus pets.
          </Text>
          <Input
            label="Confirmar senha"
            type="password"
            isPassword
            value={confirm}
            required
            onChange={(event) => setConfirm(event.target.value)}
          />
          <Text size="xs" c="dimmed" ta="center" mt={4}>
            Ao continuar, você cria seu acesso de tutor no TT Pets Vet para
            planos, agenda e atendimento domiciliar.
          </Text>
          <div className="mt-4 flex items-center justify-between gap-3">
            <Button variant="subtle" color="#7434d6" onClick={() => setStep(1)}>
              Voltar
            </Button>
            <Button type="submit" color="#7434d6" radius="xl" px="xl">
              Criar conta
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
