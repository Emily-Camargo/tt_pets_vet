'use client'

import { AppBar, IconButton, Toolbar } from '@mui/material'
import Link from 'next/link'
import { useState } from 'react'
import { HiOutlineMenu } from 'react-icons/hi'

import { destino, rotuloPerfil } from '@/domain/formatacao'
import { useUsuario } from '@/hooks/banco'

import { SinoNotificacoes } from './notificacoes'
import ContaComponent from './usuario'

export interface NavbarComponentProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

function iniciais(nome?: string) {
  if (!nome) return 'TT'
  return nome
    .split(' ')
    .slice(0, 2)
    .map((parte) => parte[0])
    .join('')
    .toUpperCase()
}

const NavbarComponent = ({ open, setOpen }: NavbarComponentProps) => {
  const { usuario } = useUsuario()
  const [anchorConta, setAnchorConta] = useState<HTMLElement | null>(null)
  const href = usuario ? destino(usuario.perfil) : '/TT-Pets/login'

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: '#fff',
          color: '#0f172a',
          borderBottom: '1px solid #e8edf3',
          backgroundImage: 'linear-gradient(90deg, #ffffff 0%, #f8f4fd 100%)',
          boxShadow: '0 4px 16px rgba(116, 52, 214, 0.08)',
        }}
      >
        <Toolbar sx={{ minHeight: '64px !important', height: 64, px: 2, gap: 0.5 }}>
          <IconButton
            edge="start"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setOpen(!open)}
            sx={{ color: '#5b4b78' }}
          >
            <HiOutlineMenu size={24} />
          </IconButton>
          <Link
            href={href}
            className="ml-1 flex items-center gap-2 text-lg font-semibold text-[#7434d6]"
          >
            <span className="text-xl" aria-hidden>
              🐾
            </span>
            TT Pets Vet
          </Link>
          <div className="flex-1" />
          <SinoNotificacoes />
          <button
            type="button"
            className="flex items-center gap-2 rounded-full py-1 pr-1 pl-2 hover:bg-white/80"
            aria-haspopup="true"
            aria-label="Conta"
            onClick={(evento) => setAnchorConta(evento.currentTarget)}
          >
            <span className="hidden text-right sm:block">
              <span className="block text-sm font-medium text-slate-700">{usuario?.nome}</span>
              <span className="block text-xs text-slate-400">
                {usuario ? rotuloPerfil(usuario.perfil) : ''}
              </span>
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#7434d6] text-xs font-medium text-white">
              {iniciais(usuario?.nome)}
            </span>
          </button>
          <ContaComponent anchorEl={anchorConta} setAnchorEl={setAnchorConta} />
        </Toolbar>
      </AppBar>
      <div className="h-16" />
    </>
  )
}

export default NavbarComponent
