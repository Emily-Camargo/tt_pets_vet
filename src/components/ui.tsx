'use client'

import { useEffect, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'

import { cx } from '@/domain/formatacao'

export function TelaCarregando() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm font-semibold text-slate-500">
      Carregando TT Pets...
    </div>
  )
}

export function Pagina({
  titulo,
  descricao,
  acao,
  children,
}: {
  titulo: string
  descricao?: string
  acao?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            {titulo}
          </h1>
          {descricao && <p className="mt-1 text-sm text-slate-500">{descricao}</p>}
        </div>
        {acao}
      </header>
      {children}
    </div>
  )
}

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-normal text-slate-800 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100'

export function Campo({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <label className="flex flex-col gap-1 text-sm font-semibold text-slate-700">
      {label}
      {children}
    </label>
  )
}

export function Texto(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cx(inputClass, props.className)} />
}

export function Area(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cx(inputClass, 'min-h-28 resize-y', props.className)}
    />
  )
}

export function Selecao(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cx(inputClass, props.className)} />
}

export function Botao({
  variante = 'primario',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variante?: 'primario' | 'outline' | 'perigo' | 'fantasma'
}) {
  const estilos = {
    primario: 'bg-rose-600 text-white hover:bg-rose-700',
    outline: 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
    perigo: 'border border-rose-200 bg-white text-rose-700 hover:bg-rose-50',
    fantasma: 'text-slate-600 hover:bg-slate-100',
  }

  return (
    <button
      {...props}
      className={cx(
        'inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50',
        estilos[variante],
        props.className,
      )}
    />
  )
}

export function Aviso({ texto }: { texto?: string | null }) {
  if (!texto) return null
  return (
    <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
      {texto}
    </p>
  )
}

export function Ok({ texto }: { texto?: string | null }) {
  if (!texto) return null
  return (
    <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
      {texto}
    </p>
  )
}

export function Modal({
  aberto,
  titulo,
  onFechar,
  children,
}: {
  aberto: boolean
  titulo: string
  onFechar: () => void
  children: ReactNode
}) {
  useEffect(() => {
    if (!aberto) return
    function aoTeclar(evento: KeyboardEvent) {
      if (evento.key === 'Escape') onFechar()
    }
    window.addEventListener('keydown', aoTeclar)
    return () => window.removeEventListener('keydown', aoTeclar)
  }, [aberto, onFechar])

  if (!aberto) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-4 sm:items-center"
      onClick={onFechar}
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl"
        onClick={(evento) => evento.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 className="text-lg font-extrabold text-slate-900">{titulo}</h2>
          <button
            type="button"
            className="text-sm font-semibold text-slate-400"
            onClick={onFechar}
          >
            Fechar
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function Vazio({ texto }: { texto: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500">
      {texto}
    </div>
  )
}

export function Selo({
  children,
  tom = 'neutro',
}: {
  children: ReactNode
  tom?: 'neutro' | 'ok' | 'alerta' | 'rosa'
}) {
  const tons = {
    neutro: 'bg-slate-100 text-slate-600',
    ok: 'bg-emerald-50 text-emerald-700',
    alerta: 'bg-amber-50 text-amber-700',
    rosa: 'bg-rose-50 text-rose-700',
  }
  return (
    <span className={cx('rounded-full px-2.5 py-1 text-xs font-bold', tons[tom])}>
      {children}
    </span>
  )
}

export function Cartao({ children }: { children: ReactNode }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      {children}
    </article>
  )
}
