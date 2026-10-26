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
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, type ComponentType, type Dispatch, type SetStateAction } from 'react'

import { menuFor } from '@/core/functions/navigation'
import { useUsuario } from '@/core/hooks/use-session'

const ICONS: Record<string, ComponentType<{ sx?: { fontSize: number } }>> = {
  home: Home,
  cities: LocationOn,
  plans: WorkspacePremium,
  dashboard: Dashboard,
  vets: MedicalServices,
  schedule: CalendarMonth,
  care: MedicalServices,
  clients: People,
  pets: Pets,
  appointments: Event,
  vaccines: Vaccines,
  history: History,
}

export function SideMenu({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}) {
  const { usuario } = useUsuario()
  const pathname = usePathname()
  const menu = usuario ? menuFor(usuario.perfil) : []

  useEffect(() => {
    setOpen(false)
  }, [pathname, setOpen])

  return (
    <Drawer
      open={open}
      onClose={() => setOpen(false)}
      slotProps={{
        paper: {
          sx: { width: 260, borderRadius: '0 16px 16px 0' },
        },
      }}
    >
      <div className="px-4 pt-4 pb-3">
        <p className="text-sm font-semibold text-[#7434d6]">TT Pets Vet</p>
        <p className="text-xs text-slate-400">Atendimento domiciliar</p>
      </div>
      <List>
        {menu.map((item) => {
          const Icon = ICONS[item.icon] ?? Pets
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <ListItemButton
              key={item.href}
              component={Link}
              href={item.href}
              selected={active}
              onClick={() => setOpen(false)}
              sx={{
                mx: 1,
                mb: 0.5,
                borderRadius: '12px',
                color: active ? '#7434d6' : '#475569',
                '&.Mui-selected': { backgroundColor: '#f6f1fc' },
              }}
            >
              <ListItemIcon sx={{ minWidth: 34, color: 'inherit' }}>
                <Icon sx={{ fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          )
        })}
      </List>
    </Drawer>
  )
}
