'use client'

import { Dialog, Input } from '@grazziotin/react-components-next/ui'
import { Button } from '@mantine/core'
import { useEffect, useState } from 'react'
import { feedback } from '@/core/functions/feedback'
import { formatPhoneBr } from '@/core/functions/format'
import { useUsuario } from '@/core/hooks/use-session'
import { salvarPerfil } from '@/service/mock/actions'

export function ProfileDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { usuario, banco } = useUsuario()
  const tutor = banco.tutores.find((item) => item.id === usuario?.tutorId)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [nextPassword, setNextPassword] = useState('')

  useEffect(() => {
    if (!open || !usuario) return
    setName(usuario.nome)
    setEmail(usuario.email)
    setPhone(tutor ? formatPhoneBr(tutor.telefone) : '')
    setCurrentPassword('')
    setNextPassword('')
  }, [open, usuario, tutor])

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Configurações do perfil"
      maxWidth="sm"
      actions={
        <>
          <Button variant="subtle" color="gray" onClick={onClose}>
            Fechar
          </Button>
          <Button color="#7434d6" type="submit" form="profile-form">
            Salvar
          </Button>
        </>
      }
    >
      <form
        id="profile-form"
        className="flex flex-col gap-3 pt-1"
        onSubmit={(event) => {
          event.preventDefault()
          if (!usuario) return
          const error = salvarPerfil(usuario.id, {
            nome: name,
            email,
            telefone: tutor ? phone : undefined,
            senhaAtual: currentPassword,
            senhaNova: nextPassword,
          })
          feedback(error, 'Perfil atualizado.')
          if (!error) {
            setCurrentPassword('')
            setNextPassword('')
          }
        }}
      >
        <Input label="Nome" value={name} required onChange={(event) => setName(event.target.value)} />
        <Input
          label="E-mail"
          type="email"
          value={email}
          required
          onChange={(event) => setEmail(event.target.value)}
        />
        {tutor && (
          <Input
            label="Telefone"
            value={phone}
            required
            onChange={(event) => setPhone(formatPhoneBr(event.target.value))}
          />
        )}
        <Input
          label="Senha atual"
          type="password"
          isPassword
          value={currentPassword}
          onChange={(event) => setCurrentPassword(event.target.value)}
        />
        <Input
          label="Nova senha"
          type="password"
          isPassword
          value={nextPassword}
          onChange={(event) => setNextPassword(event.target.value)}
        />
      </form>
    </Dialog>
  )
}
