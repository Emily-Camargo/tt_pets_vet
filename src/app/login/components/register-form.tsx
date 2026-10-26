'use client'

import { Input } from '@grazziotin/react-components-next/ui'
import { Button, Progress, Text, Title } from '@mantine/core'
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
    const error = cadastrarTutor({ nome: name, cpf: document, telefone: phone, email, senha: password })
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
      <Title order={3} ta="center" c="#7434d6">
        Criar conta
      </Title>
      <Progress value={step === 1 ? 46 : 100} color="#7434d6" mt="md" />
      {step === 1 ? (
        <form className="mt-8 flex flex-col gap-3" onSubmit={next}>
          <Input label="Nome completo" value={name} required onChange={(event) => setName(event.target.value)} />
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
          <Button type="submit" color="#7434d6" radius="xl">
            Próximo
          </Button>
        </form>
      ) : (
        <form className="mt-8 flex flex-col gap-3" onSubmit={finish}>
          <Text size="sm" c="dimmed">
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
          <div className="flex items-center justify-between">
            <Button variant="subtle" color="#7434d6" onClick={() => setStep(1)}>
              Voltar
            </Button>
            <Button type="submit" color="#7434d6" radius="xl">
              Criar conta
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
