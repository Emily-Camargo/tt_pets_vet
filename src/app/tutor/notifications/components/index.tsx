'use client'

import { Dialog } from '@grazziotin/react-components-next/ui'
import { Button, Stack, Text } from '@mantine/core'
import { useState } from 'react'

import { EmptyState } from '@/core/components/empty-state'
import { Screen } from '@/core/components/screen'
import { dataHora } from '@/core/functions/format'
import { useUsuario } from '@/core/hooks/use-session'
import type { Notificacao } from '@/core/interfaces/types'
import { excluirNotificacao, marcarNotificacoes } from '@/service/mock/actions'

import { CardNotification } from './card-notification'

export function Notifications() {
  const { banco, usuario } = useUsuario()
  const tutorId = usuario?.tutorId ?? ''
  const [opened, setOpened] = useState<Notificacao | null>(null)
  const items = banco.notificacoes
    .filter((item) => item.tutorId === tutorId)
    .sort((a, b) => b.criadaEm.localeCompare(a.criadaEm))

  function openItem(item: Notificacao) {
    if (!item.lida) marcarNotificacoes(tutorId, item.id)
    setOpened(item)
  }

  function remove(id: string) {
    excluirNotificacao(tutorId, id)
    if (opened?.id === id) setOpened(null)
  }

  return (
    <Screen
      title="Notificações"
      description="Lembretes de vacina e mudanças nas consultas."
      action={
        <Button variant="outline" color="#7434d6" onClick={() => marcarNotificacoes(tutorId)}>
          Ler todas
        </Button>
      }
    >
      {items.length === 0 ? (
        <EmptyState text="Nenhuma notificação." />
      ) : (
        <Stack gap="sm">
          {items.map((item) => (
            <CardNotification
              key={item.id}
              title={item.titulo}
              text={item.texto}
              when={dataHora(item.criadaEm)}
              onOpen={() => openItem(item)}
              onDelete={() => remove(item.id)}
            />
          ))}
        </Stack>
      )}
      <Dialog
        open={Boolean(opened)}
        onClose={() => setOpened(null)}
        title={opened?.titulo ?? 'Notificação'}
        maxWidth="sm"
        actions={
          <>
            <Button color="red" variant="light" onClick={() => opened && remove(opened.id)}>
              Excluir
            </Button>
            <Button variant="subtle" color="gray" onClick={() => setOpened(null)}>
              Fechar
            </Button>
          </>
        }
      >
        {opened && (
          <div className="space-y-2">
            <Text size="sm">{opened.texto}</Text>
            <Text size="xs" c="dimmed">
              {dataHora(opened.criadaEm)}
            </Text>
          </div>
        )}
      </Dialog>
    </Screen>
  )
}
