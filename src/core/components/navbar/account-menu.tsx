'use client'

import { Logout, Person, RestartAlt } from '@mui/icons-material'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { rotuloPerfil } from '@/core/functions/format'
import { useUsuario } from '@/core/hooks/use-session'
import { definirSessao } from '@/core/session'
import { restaurarBanco } from '@/service/mock/store'

import { ProfileDialog } from './profile-dialog'

export function AccountMenu({
  anchorEl,
  setAnchorEl,
}: {
  anchorEl: HTMLElement | null
  setAnchorEl: (value: HTMLElement | null) => void
}) {
  const { usuario } = useUsuario()
  const router = useRouter()
  const [profileOpen, setProfileOpen] = useState(false)

  function close() {
    setAnchorEl(null)
  }

  return (
    <>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={close}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      >
        <div className="px-3 py-2">
          <p className="text-sm font-medium text-slate-800">{usuario?.nome}</p>
          <p className="text-xs text-slate-400">
            {usuario ? rotuloPerfil(usuario.perfil) : ''} · {usuario?.email}
          </p>
        </div>
        <MenuItem
          onClick={() => {
            close()
            setProfileOpen(true)
          }}
        >
          <Person sx={{ fontSize: 18, color: '#7434d6', mr: 1 }} />
          Configurações
        </MenuItem>
        <MenuItem
          onClick={() => {
            restaurarBanco()
            close()
          }}
        >
          <RestartAlt sx={{ fontSize: 18, color: '#64748b', mr: 1 }} />
          Restaurar exemplo
        </MenuItem>
        <MenuItem
          onClick={() => {
            definirSessao(null)
            close()
            router.replace('/login')
          }}
          sx={{ color: '#b42318' }}
        >
          <Logout sx={{ fontSize: 18, mr: 1 }} />
          Sair
        </MenuItem>
      </Menu>
      <ProfileDialog open={profileOpen} onClose={() => setProfileOpen(false)} />
    </>
  )
}
