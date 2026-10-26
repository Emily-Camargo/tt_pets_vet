'use client'

import {
  CalendarMonth,
  Dashboard,
  Event,
  History,
  Home,
  LocationOn,
  MedicalServices,
  People,
  Pets,
  Vaccines,
  WorkspacePremium,
} from '@mui/icons-material'
import { Drawer, List } from '@mui/material'
import { usePathname } from 'next/navigation'
import { useEffect, type ComponentType } from 'react'

import { menuDo } from '@/domain/navegacao'
import { useUsuario } from '@/hooks/banco'

import MenuSidebar from './menu-sidebar'

const ICONES: Record<string, ComponentType<{ sx?: { fontSize: number } }>> = {
  home: Home,
  cidades: LocationOn,
  planos: WorkspacePremium,
  dashboard: Dashboard,
  veterinarios: MedicalServices,
  agenda: CalendarMonth,
  atendimentos: MedicalServices,
  clientes: People,
  pets: Pets,
  agendamentos: Event,
  vacinas: Vaccines,
  historico: History,
}

export interface NavbarComponentProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const SidebarComponent = ({ open, setOpen }: NavbarComponentProps) => {
  const { usuario } = useUsuario()
  const pathname = usePathname()
  const menu = usuario ? menuDo(usuario.perfil) : []

  useEffect(() => {
    setOpen(false)
  }, [pathname, setOpen])

  return (
    <Drawer
      open={open}
      onClose={() => setOpen(false)}
      variant="temporary"
      slotProps={{
        paper: {
          sx: {
            width: 260,
            borderRadius: '0 16px 16px 0',
            boxShadow: '8px 0 24px rgba(116, 52, 214, 0.08)',
          },
        },
      }}
    >
      <div className="px-4 pt-4 pb-3">
        <p className="text-sm font-semibold text-[#7434d6]">TT Pets Vet</p>
        <p className="text-xs text-slate-400">Atendimento domiciliar</p>
      </div>
      <List component="nav" sx={{ px: 0.5 }}>
        {menu.map((item) => {
          const chave = item.href.split('/').pop() ?? ''
          const Icone = ICONES[chave] ?? Pets
          return (
            <MenuSidebar
              key={item.href}
              href={item.href}
              label={item.label}
              icon={<Icone sx={{ fontSize: 20 }} />}
              onIr={() => setOpen(false)}
            />
          )
        })}
      </List>
    </Drawer>
  )
}

export default SidebarComponent
