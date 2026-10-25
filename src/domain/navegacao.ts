import type { Perfil } from './tipos'

export interface ItemMenu {
  href: string
  label: string
}

const INICIO: ItemMenu = { href: '/TT-Pets/home', label: 'Início' }

export function menuDo(perfil: Perfil): ItemMenu[] {
  if (perfil === 'admin') {
    return [
      INICIO,
      { href: '/TT-Pets/admin/cidades', label: 'Cidades' },
      { href: '/TT-Pets/admin/veterinarios', label: 'Veterinários' },
      { href: '/TT-Pets/admin/planos', label: 'Planos' },
    ]
  }

  if (perfil === 'veterinario') {
    return [
      INICIO,
      { href: '/TT-Pets/veterinario/dashboard', label: 'Painel' },
      { href: '/TT-Pets/veterinario/planos', label: 'Planos' },
      { href: '/TT-Pets/veterinario/agenda', label: 'Agenda' },
      { href: '/TT-Pets/veterinario/atendimentos', label: 'Atendimentos' },
      { href: '/TT-Pets/veterinario/clientes', label: 'Clientes' },
    ]
  }

  return [
    INICIO,
    { href: '/TT-Pets/tutor/planos', label: 'Planos' },
    { href: '/TT-Pets/tutor/pets', label: 'Meus pets' },
    { href: '/TT-Pets/tutor/agendamentos', label: 'Agendamentos' },
    { href: '/TT-Pets/tutor/vacinas', label: 'Vacinas' },
    { href: '/TT-Pets/tutor/historico', label: 'Histórico' },
  ]
}
