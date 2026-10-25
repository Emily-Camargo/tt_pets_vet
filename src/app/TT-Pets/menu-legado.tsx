import { Pets } from '@mui/icons-material'

export function getMenuItems(_perfil?: number) {
  return [
    {
      seqAplicacao: 1,
      label: 'TT Pets',
      icon: Pets,
      route: '/TT-Pets/login',
    },
  ]
}
