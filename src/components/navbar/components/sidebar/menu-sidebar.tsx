'use client'

import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { memo, type ReactNode } from 'react'

export interface MenuSidebarProps {
  href: string
  label: string
  icon: ReactNode
  avisos?: number
  onIr: () => void
}

const MenuSidebar = ({ href, label, icon, avisos = 0, onIr }: MenuSidebarProps) => {
  const pathname = usePathname()
  const ativo = pathname === href || pathname.startsWith(`${href}/`)

  return (
    <ListItemButton
      component={Link}
      href={href}
      selected={ativo}
      onClick={onIr}
      sx={{
        mx: 1,
        mb: 0.5,
        borderRadius: '12px',
        minHeight: 40,
        color: ativo ? '#7434d6' : '#475569',
        '&.Mui-selected': { backgroundColor: '#f6f1fc' },
        '&.Mui-selected:hover': { backgroundColor: '#efe4ff' },
      }}
    >
      <ListItemIcon sx={{ minWidth: 34, color: 'inherit' }}>{icon}</ListItemIcon>
      <ListItemText
        primary={label}
        slotProps={{ primary: { sx: { fontSize: 14, fontWeight: ativo ? 600 : 500 } } }}
      />
      {avisos > 0 && (
        <span className="rounded-full bg-[#7434d6] px-1.5 text-[11px] text-white">{avisos}</span>
      )}
    </ListItemButton>
  )
}

export default memo(MenuSidebar)
