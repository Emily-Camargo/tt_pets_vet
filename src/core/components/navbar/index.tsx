'use client'

import { IconButton } from '@mui/material'
import Link from 'next/link'
import { useState } from 'react'
import { HiOutlineMenu } from 'react-icons/hi'

import { destino, rotuloPerfil } from '@/core/functions/format'
import { useUsuario } from '@/core/hooks/use-session'

import { AccountMenu } from './account-menu'
import { NotificationBell } from './notification-bell'
import { SideMenu } from './side-menu'

function initials(name?: string) {
  if (!name) return 'TT'
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

export function AppNavbar() {
  const { usuario } = useUsuario()
  const [open, setOpen] = useState(false)
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  const href = usuario ? destino(usuario.perfil) : '/login'

  return (
    <>
      <header className="fixed top-0 right-0 left-0 z-40 flex h-16 items-center gap-2 border-b border-slate-200 bg-white px-4">
        <IconButton
          edge="start"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          onClick={() => setOpen((current) => !current)}
          sx={{ color: '#5b4b78' }}
        >
          <HiOutlineMenu size={24} />
        </IconButton>
        <Link href={href} className="ml-1 flex items-center gap-2 text-lg font-semibold text-[#7434d6]">
          <span aria-hidden>🐾</span>
          TT Pets Vet
        </Link>
        <div className="flex-1" />
        <NotificationBell />
        <button
          type="button"
          className="flex items-center gap-2 rounded-full py-1 pr-1 pl-2 hover:bg-slate-50"
          aria-label="Conta"
          onClick={(event) => setAnchor(event.currentTarget)}
        >
          <span className="hidden text-right sm:block">
            <span className="block text-sm font-medium text-slate-700">{usuario?.nome}</span>
            <span className="block text-xs text-slate-400">
              {usuario ? rotuloPerfil(usuario.perfil) : ''}
            </span>
          </span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#7434d6] text-xs font-medium text-white">
            {initials(usuario?.nome)}
          </span>
        </button>
        <AccountMenu anchorEl={anchor} setAnchorEl={setAnchor} />
      </header>
      <div className="h-16" />
      <SideMenu open={open} setOpen={setOpen} />
    </>
  )
}
