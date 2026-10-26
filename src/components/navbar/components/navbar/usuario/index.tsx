'use client'

import { Logout, Person, RestartAlt } from '@mui/icons-material'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { useRouter } from 'next/navigation'
import { memo, useState } from 'react'

import { definirSessao } from '@/auth/sessao'
import { rotuloPerfil } from '@/domain/formatacao'
import { useUsuario } from '@/hooks/banco'
import { restaurarBanco } from '@/mocks/store'

import { PerfilDialog } from './perfil'

export interface ContaUsuarioComponentsProps {
  anchorEl: HTMLElement | null
  setAnchorEl: (valor: HTMLElement | null) => void
}

const ContaComponent = ({ anchorEl, setAnchorEl }: ContaUsuarioComponentsProps) => {
  const { usuario } = useUsuario()
  const router = useRouter()
  const [perfilAberto, setPerfilAberto] = useState(false)
  const aberto = Boolean(anchorEl)

  function fechar() {
    setAnchorEl(null)
  }

  return (
    <>
      <Menu
        anchorEl={anchorEl}
        open={aberto}
        onClose={fechar}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              minWidth: 220,
              borderRadius: '14px',
              border: '1px solid #e8edf3',
              boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)',
            },
          },
        }}
      >
        <div className="px-3 py-2">
          <p className="text-sm font-medium text-slate-800">{usuario?.nome}</p>
          <p className="text-xs text-slate-400">
            {usuario ? rotuloPerfil(usuario.perfil) : ''} · {usuario?.email}
          </p>
        </div>
        <MenuItem
          onClick={() => {
            fechar()
            setPerfilAberto(true)
          }}
          sx={{ fontSize: 14, gap: 1 }}
        >
          <Person sx={{ fontSize: 18, color: '#7434d6' }} />
          Configurações
        </MenuItem>
        <MenuItem
          onClick={() => {
            restaurarBanco()
            fechar()
          }}
          sx={{ fontSize: 14, gap: 1 }}
        >
          <RestartAlt sx={{ fontSize: 18, color: '#64748b' }} />
          Restaurar exemplo
        </MenuItem>
        <MenuItem
          onClick={() => {
            definirSessao(null)
            fechar()
            router.replace('/TT-Pets/login')
          }}
          sx={{ fontSize: 14, gap: 1, color: '#b42318' }}
        >
          <Logout sx={{ fontSize: 18 }} />
          Sair
        </MenuItem>
      </Menu>
      <PerfilDialog aberto={perfilAberto} onFechar={() => setPerfilAberto(false)} />
    </>
  )
}

export default memo(ContaComponent)
