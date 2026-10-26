'use client'

import { Dialog } from '@grazziotin/react-components-next/ui'
import { DeleteOutlined, DoneAll, NotificationsNone } from '@mui/icons-material'
import { Badge, IconButton, Popover } from '@mui/material'
import { Button } from '@mantine/core'
import { useState } from 'react'

import { dataHora } from '@/core/functions/format'
import { useUsuario } from '@/core/hooks/use-session'
import type { Notificacao } from '@/core/interfaces/types'
import { excluirNotificacao, marcarNotificacoes } from '@/service/mock/actions'

export function NotificationBell() {
  const { banco, usuario } = useUsuario()
  const tutorId = usuario?.tutorId ?? ''
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  const [opened, setOpened] = useState<Notificacao | null>(null)
  const items = banco.notificacoes
    .filter((item) => item.tutorId === tutorId)
    .sort((a, b) => b.criadaEm.localeCompare(a.criadaEm))
  const unread = items.filter((item) => !item.lida).length

  function openItem(item: Notificacao) {
    if (tutorId && !item.lida) marcarNotificacoes(tutorId, item.id)
    setOpened(item)
    setAnchor(null)
  }

  function remove(id: string) {
    if (!tutorId) return
    excluirNotificacao(tutorId, id)
    if (opened?.id === id) setOpened(null)
  }

  return (
    <>
      <IconButton aria-label="Notificações" onClick={(event) => setAnchor(event.currentTarget)}>
        <Badge badgeContent={unread} color="secondary" invisible={unread === 0}>
          <NotificationsNone />
        </Badge>
      </IconButton>
      <Popover
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <div className="flex w-[360px] max-w-[calc(100vw-24px)] items-center justify-between border-b px-4 py-3">
          <p className="text-sm font-semibold">Notificações</p>
          <Button
            size="xs"
            variant="subtle"
            color="#7434d6"
            disabled={!tutorId || unread === 0}
            leftSection={<DoneAll sx={{ fontSize: 16 }} />}
            onClick={() => marcarNotificacoes(tutorId)}
          >
            Ler todas
          </Button>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {items.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-slate-400">Nenhuma notificação.</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className={`flex items-start ${item.lida ? '' : 'bg-[#f6f1fc]'}`}>
                <button type="button" className="min-w-0 flex-1 px-4 py-3 text-left" onClick={() => openItem(item)}>
                  <span className="block truncate text-sm font-medium">{item.titulo}</span>
                  <span className="block truncate text-xs text-slate-500">{item.texto}</span>
                  <span className="mt-1 block text-[11px] text-slate-400">{dataHora(item.criadaEm)}</span>
                </button>
                <IconButton aria-label="Excluir notificação" onClick={() => remove(item.id)}>
                  <DeleteOutlined sx={{ fontSize: 18 }} />
                </IconButton>
              </div>
            ))
          )}
        </div>
      </Popover>
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
            <p className="text-sm text-slate-600">{opened.texto}</p>
            <p className="text-xs text-slate-400">{dataHora(opened.criadaEm)}</p>
          </div>
        )}
      </Dialog>
    </>
  )
}
