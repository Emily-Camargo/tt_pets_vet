'use client'

import { useState } from 'react'

import Dialog from '@/components/dialog'
import { Botao, Cartao, Pagina, Vazio } from '@/components/ui'
import { dataHora } from '@/domain/formatacao'
import type { Notificacao } from '@/domain/tipos'
import { useUsuario } from '@/hooks/banco'
import { excluirNotificacao, marcarNotificacoes } from '@/mocks/acoes'

export function NotificacoesTutor() {
  const { banco, usuario } = useUsuario()
  const tutorId = usuario?.tutorId ?? ''
  const [aberta, setAberta] = useState<Notificacao | null>(null)
  const itens = banco.notificacoes
    .filter((item) => item.tutorId === tutorId)
    .sort((a, b) => b.criadaEm.localeCompare(a.criadaEm))

  function abrir(item: Notificacao) {
    if (!item.lida) marcarNotificacoes(tutorId, item.id)
    setAberta(item)
  }

  function excluir(id: string) {
    excluirNotificacao(tutorId, id)
    if (aberta?.id === id) setAberta(null)
  }

  return (
    <Pagina
      titulo="Notificações"
      descricao="Lembretes de vacina e mudanças nas consultas."
      acao={
        <Botao variante="outline" onClick={() => marcarNotificacoes(tutorId)}>
          Ler todas
        </Botao>
      }
    >
      {itens.length === 0 ? (
        <Vazio texto="Nenhuma notificação." />
      ) : (
        <div className="grid gap-3">
          {itens.map((item) => (
            <Cartao key={item.id}>
              <div className="flex items-start justify-between gap-3">
                <button type="button" className="min-w-0 flex-1 text-left" onClick={() => abrir(item)}>
                  <h2 className="font-semibold">{item.titulo}</h2>
                  <p className="text-sm text-slate-600">{item.texto}</p>
                  <p className="mt-1 text-xs text-slate-400">{dataHora(item.criadaEm)}</p>
                </button>
                <Botao variante="perigo" onClick={() => excluir(item.id)}>
                  Excluir
                </Botao>
              </div>
            </Cartao>
          ))}
        </div>
      )}
      <Dialog
        open={Boolean(aberta)}
        onClose={() => setAberta(null)}
        title={aberta?.titulo ?? 'Notificação'}
        actions={
          <>
            <Botao type="button" variante="perigo" onClick={() => aberta && excluir(aberta.id)}>
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
    </Pagina>
  )
}
