'use client'

import { DeleteOutlined, DoneAll, NotificationsNone } from '@mui/icons-material'
import { Badge, IconButton, Popover } from '@mui/material'
import { useState } from 'react'

import Dialog from '@/components/dialog'
import { Botao } from '@/components/ui'
import { dataHora } from '@/domain/formatacao'
import type { Notificacao } from '@/domain/tipos'
import { useUsuario } from '@/hooks/banco'
import { excluirNotificacao, marcarNotificacoes } from '@/mocks/acoes'

export function SinoNotificacoes() {
  const { banco, usuario } = useUsuario()
  const tutorId = usuario?.tutorId ?? ''
  const [ancora, setAncora] = useState<HTMLElement | null>(null)
  const [aberta, setAberta] = useState<Notificacao | null>(null)
  const itens = banco.notificacoes
    .filter((item) => item.tutorId === tutorId)
    .sort((a, b) => b.criadaEm.localeCompare(a.criadaEm))
  const naoLidas = itens.filter((item) => !item.lida).length

  function abrir(item: Notificacao) {
    if (tutorId && !item.lida) marcarNotificacoes(tutorId, item.id)
    setAberta(item)
    setAncora(null)
  }

  function excluir(id: string) {
    if (!tutorId) return
    excluirNotificacao(tutorId, id)
    if (aberta?.id === id) setAberta(null)
  }

  return (
    <>
      <IconButton
        aria-label="Notificações"
        onClick={(evento) => setAncora(evento.currentTarget)}
        sx={{ color: naoLidas > 0 ? '#7434d6' : '#64748b' }}
      >
        <Badge
          badgeContent={naoLidas}
          invisible={naoLidas === 0}
          sx={{
            '& .MuiBadge-badge': {
              backgroundColor: '#7434d6',
              color: '#fff',
              fontSize: 10,
              minWidth: 16,
              height: 16,
            },
          }}
        >
          <NotificationsNone />
        </Badge>
      </IconButton>
      <Popover
        open={Boolean(ancora)}
        anchorEl={ancora}
        onClose={() => setAncora(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              width: 360,
              maxWidth: 'calc(100vw - 24px)',
              borderRadius: '16px',
              border: '1px solid #e8edf3',
              boxShadow: '0 12px 32px rgba(116, 52, 214, 0.12)',
            },
          },
        }}
      >
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
          <p className="text-sm font-semibold text-slate-800">Notificações</p>
          <button
            type="button"
            className="inline-flex items-center gap-1 text-xs font-medium text-[#7434d6] disabled:text-slate-300"
            disabled={!tutorId || naoLidas === 0}
            onClick={() => marcarNotificacoes(tutorId)}
          >
            <DoneAll sx={{ fontSize: 16 }} />
            Ler todas
          </button>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {itens.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-slate-400">Nenhuma notificação.</p>
          ) : (
            itens.map((item) => (
              <div
                key={item.id}
                className={`flex items-start gap-2 border-b border-slate-50 px-2 py-1 ${
                  item.lida ? 'bg-white' : 'bg-[#f6f1fc]'
                }`}
              >
                <button
                  type="button"
                  className="min-w-0 flex-1 px-2 py-2 text-left"
                  onClick={() => abrir(item)}
                >
                  <span className="flex items-center gap-2">
                    {!item.lida && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#7434d6]" />}
                    <span className="truncate text-sm font-medium text-slate-800">{item.titulo}</span>
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-slate-500">{item.texto}</span>
                  <span className="mt-1 block text-[11px] text-slate-400">{dataHora(item.criadaEm)}</span>
                </button>
                <IconButton
                  size="small"
                  aria-label="Excluir notificação"
                  onClick={() => excluir(item.id)}
                  sx={{ mt: 0.5, color: '#94a3b8' }}
                >
                  <DeleteOutlined sx={{ fontSize: 18 }} />
                </IconButton>
              </div>
            ))
          )}
        </div>
      </Popover>
      <Dialog
        open={Boolean(aberta)}
        onClose={() => setAberta(null)}
        title={aberta?.titulo ?? 'Notificação'}
        maxWidth="sm"
        actions={
          <>
            <Botao
              type="button"
              variante="perigo"
              onClick={() => aberta && excluir(aberta.id)}
            >
              Excluir
            </Botao>
            <Botao type="button" variante="fantasma" onClick={() => setAberta(null)}>
              Fechar
            </Botao>
          </>
        }
      >
        {aberta && (
          <div className="space-y-3 pt-1">
            <p className="text-sm leading-6 text-slate-600">{aberta.texto}</p>
            <p className="text-xs text-slate-400">{dataHora(aberta.criadaEm)}</p>
          </div>
        )}
      </Dialog>
    </>
  )
}
