'use client'

import {
  CalendarMonth,
  Event,
  History,
  Home,
  LocationOn,
  MedicalServices,
  People,
  Pets,
  Payments,
  Vaccines,
  WorkspacePremium,
} from '@mui/icons-material'
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import { Progress, Text } from '@mantine/core'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  useEffect,
  type ComponentType,
  type Dispatch,
  type SetStateAction,
} from 'react'

import { menuFor } from '@/core/functions/navigation'
import { useUsuario } from '@/core/hooks/use-session'

const ICONS: Record<string, ComponentType<{ sx?: { fontSize: number } }>> = {
  home: Home,
  cities: LocationOn,
  plans: WorkspacePremium,
  dashboard: Payments,
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
  const { usuario, banco } = useUsuario()
  const pathname = usePathname()
  const menu = usuario ? menuFor(usuario.perfil) : []
  const isTutor = usuario?.perfil === 'tutor'

  const tutorPlan = (() => {
    if (!isTutor || !usuario?.tutorId) return null
    const subscription = banco.assinaturas.find(
      (item) => item.tutorId === usuario.tutorId && item.status === 'ativa',
    )
    if (!subscription) return null
    const plan = banco.planos.find((item) => item.id === subscription.planoId)
    const city = banco.cidades.find((item) => item.id === subscription.cidadeId)
    if (!plan) return null

    const usedVisits = banco.consultas.filter((item) => {
      if (
        item.petId !== subscription.petId ||
        item.status === 'cancelada'
      ) {
        return false
      }
      const date = new Date(item.dataHora)
      const now = new Date()
      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      )
    }).length

    const limit = plan.visitasMes
    const progress =
      limit === null || limit <= 0
        ? 100
        : Math.min(100, Math.round((usedVisits / limit) * 100))

    return {
      name: plan.nome,
      city: city?.nome,
      usedVisits,
      limit,
      progress,
    }
  })()

  useEffect(() => {
    setOpen(false)
  }, [pathname, setOpen])

  return (
    <Drawer
      open={open}
      onClose={() => setOpen(false)}
      slotProps={{
        paper: {
          sx: {
            width: 260,
            borderRadius: '0 16px 16px 0',
            display: 'flex',
            flexDirection: 'column',
          },
        },
      }}
    >
      <div className="px-4 pt-4 pb-3">
        <p className="text-sm font-semibold text-[#7434d6]">TT Pets Vet</p>
        <p className="text-xs text-slate-400">Atendimento domiciliar</p>
      </div>
      <List sx={{ flex: 1 }}>
        {menu.map((item) => {
          const Icon = ICONS[item.icon] ?? Pets
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`)
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

      {isTutor && (
        <div className="mt-auto px-3 pb-4">
          {tutorPlan ? (
            <Link
              href="/tutor/plans"
              onClick={() => setOpen(false)}
              className="block rounded-2xl border border-slate-200 bg-white p-3 transition hover:border-[#e4d4f7]"
            >
              <Text size="xs" c="dimmed">
                Plano ativo
              </Text>
              <Text size="sm" fw={600} c="#334155" mt={2}>
                {tutorPlan.name}
                {tutorPlan.city ? ` · ${tutorPlan.city}` : ''}
              </Text>
              <Progress
                value={tutorPlan.progress}
                color="#7434d6"
                size="sm"
                radius="xl"
                mt={10}
              />
              <Text size="xs" c="dimmed" mt={6}>
                {tutorPlan.limit === null
                  ? 'Visitas ilimitadas no mês'
                  : `${tutorPlan.usedVisits} de ${tutorPlan.limit} visitas usadas no mês`}
              </Text>
            </Link>
          ) : (
            <Link
              href="/tutor/plans"
              onClick={() => setOpen(false)}
              className="block rounded-2xl border border-dashed border-[#e4d4f7] bg-[#faf7ff] p-3"
            >
              <Text size="xs" c="dimmed">
                Plano ativo
              </Text>
              <Text size="sm" fw={600} c="#7434d6" mt={2}>
                Escolher um plano
              </Text>
            </Link>
          )}
        </div>
      )}
    </Drawer>
  )
}
