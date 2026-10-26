import type { Perfil } from '@/core/interfaces/types'

export interface MenuItem {
  href: string
  label: string
  icon: string
}

const HOME: MenuItem = { href: '/home', label: 'Início', icon: 'home' }

export function menuFor(profile: Perfil): MenuItem[] {
  if (profile === 'admin') {
    return [
      HOME,
      { href: '/admin/cities', label: 'Cidades', icon: 'cities' },
      { href: '/admin/veterinarians', label: 'Veterinários', icon: 'vets' },
      { href: '/admin/plans', label: 'Planos', icon: 'plans' },
    ]
  }

  if (profile === 'veterinario') {
    return [
      HOME,
      { href: '/veterinarian/dashboard', label: 'Painel', icon: 'dashboard' },
      { href: '/veterinarian/plans', label: 'Planos', icon: 'plans' },
      { href: '/veterinarian/schedule', label: 'Agenda', icon: 'schedule' },
      {
        href: '/veterinarian/appointments',
        label: 'Atendimentos',
        icon: 'care',
      },
      { href: '/veterinarian/clients', label: 'Clientes', icon: 'clients' },
    ]
  }

  return [
    HOME,
    { href: '/tutor/plans', label: 'Planos', icon: 'plans' },
    { href: '/tutor/pets', label: 'Meus pets', icon: 'pets' },
    {
      href: '/tutor/appointments',
      label: 'Agendamentos',
      icon: 'appointments',
    },
    { href: '/tutor/vaccines', label: 'Vacinas', icon: 'vaccines' },
    { href: '/tutor/history', label: 'Histórico', icon: 'history' },
  ]
}
