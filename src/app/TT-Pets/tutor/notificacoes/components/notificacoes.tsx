'use client'

import { Botao, Cartao, Pagina, Vazio } from '@/components/ui'
import { dataHora } from '@/domain/formatacao'
import { useUsuario } from '@/hooks/banco'
import { marcarNotificacoes } from '@/mocks/acoes'

export function NotificacoesTutor() {
  const { banco, usuario } = useUsuario()
  const tutorId = usuario?.tutorId ?? ''
  const itens = banco.notificacoes
    .filter((item) => item.tutorId === tutorId)
    .sort((a, b) => b.criadaEm.localeCompare(a.criadaEm))

  return (
    <Pagina
      titulo="Notificações"
      descricao="Lembretes de vacina e mudanças nas consultas."
      acao={
        <Botao variante="outline" onClick={() => marcarNotificacoes(tutorId)}>
          Marcar todas como lidas
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
                <div>
                  <h2 className="font-extrabold">{item.titulo}</h2>
                  <p className="text-sm text-slate-600">{item.texto}</p>
                  <p className="mt-1 text-xs text-slate-400">{dataHora(item.criadaEm)}</p>
                </div>
                {!item.lida && (
                  <Botao variante="outline" onClick={() => marcarNotificacoes(tutorId, item.id)}>
                    Lida
                  </Botao>
                )}
              </div>
            </Cartao>
          ))}
        </div>
      )}
    </Pagina>
  )
}
