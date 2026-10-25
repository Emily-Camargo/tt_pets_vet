import type { Perfil } from './tipos'

export interface ItemMenu {
  href: string
  label: string
}

export function menuDo(perfil: Perfil): ItemMenu[] {
  if (perfil === 'admin') {
    return [
      { href: '/TT-Pets/admin/clinicas', label: 'Clínicas' },
      { href: '/TT-Pets/admin/cidades', label: 'Cidades' },
      { href: '/TT-Pets/admin/planos', label: 'Planos' },
    ]
  }

  if (perfil === 'gestor') {
    return [
      { href: '/TT-Pets/clinica/dashboard', label: 'Painel' },
      { href: '/TT-Pets/clinica/veterinarios', label: 'Veterinários' },
      { href: '/TT-Pets/clinica/planos', label: 'Planos' },
      { href: '/TT-Pets/clinica/agenda', label: 'Agenda' },
      { href: '/TT-Pets/clinica/atendimentos', label: 'Atendimentos' },
      { href: '/TT-Pets/clinica/clientes', label: 'Clientes' },
    ]
  }

  if (perfil === 'veterinario') {
    return [
      { href: '/TT-Pets/veterinario/agenda', label: 'Agenda' },
      { href: '/TT-Pets/veterinario/atendimentos', label: 'Atendimentos' },
      { href: '/TT-Pets/veterinario/clientes', label: 'Clientes' },
      { href: '/TT-Pets/veterinario/dashboard', label: 'Painel' },
    ]
  }

  return [
    { href: '/TT-Pets/tutor/planos', label: 'Planos' },
    { href: '/TT-Pets/tutor/pets', label: 'Meus pets' },
    { href: '/TT-Pets/tutor/agendamentos', label: 'Agendamentos' },
    { href: '/TT-Pets/tutor/vacinas', label: 'Vacinas' },
    { href: '/TT-Pets/tutor/historico', label: 'Histórico' },
    { href: '/TT-Pets/tutor/notificacoes', label: 'Notificações' },
  ]
}
