import {
  Box,
  Drawer,
  List,
} from '@mui/material'
import React from 'react'
import MenuSidebar from './menu-sidebar'
import logoConsulta from '/public/assets/logoConsulta.png'
import { useDimension } from '../../../../hooks'
import { useAuth } from '../../../../contexts/AuthContext'
import { getMenuItems } from '@/app/TT-Pets/menu-legado'
import { 
  Pets
} from '@mui/icons-material'

export interface NavbarComponentProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const SidebarComponent = ({ open, setOpen }: NavbarComponentProps) => {
  const isMobile = useDimension(800)
  const { user } = useAuth()
  const [openIndex, setOpenIndex] = React.useState<number | null>(null)

  const handleClick = (aplicacao: number) => {
    setOpenIndex(openIndex === aplicacao ? null : aplicacao)
  }

  const menuItems = user ? getMenuItems(user.idPerfil) : []

  return (
    <Drawer
      open={open}
      transitionDuration={{ enter: 400, exit: 400 }}
      onClose={() => setOpen(false)}
      variant="temporary"
      sx={{
        width: isMobile ? 150 : 200,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: isMobile ? 280 : 320,
          borderRadius: '0px 20px 20px 0px',
          boxSizing: 'border-box',
          background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 50%, #1D4ED8 100%)',
          position: 'relative',
          boxShadow: '4px 0 20px rgba(37, 99, 235, 0.3)',
        },
      }}
    >
      <div className={`flex flex-col items-center justify-center ${isMobile ? 'pt-4 pb-3' : 'pt-6 pb-4'} border-b border-white/20`}>
        <div className={isMobile ? 'mb-2' : 'mb-3'}>
          <img 
            src={logoConsulta} 
            width={isMobile ? 180 : 220} 
            height={isMobile ? 50 : 60}
            alt="TT Pets"
            className="object-contain"
          />
        </div>
        <div className={`flex items-center space-x-2 text-white/80 ${isMobile ? 'text-[10px]' : 'text-xs'}`}>
          <Pets fontSize="small" />
          <span>{isMobile ? 'Petshop' : 'Petshop e clínica veterinária'}</span>
        </div>
      </div>

      <Box
        sx={{
          width: isMobile ? 280 : 320,
          overflow: 'auto',
          position: 'relative',
          paddingTop: isMobile ? 1.5 : 2,
          paddingBottom: isMobile ? 1.5 : 2,
        }}
      >
        <List component="nav" aria-labelledby="nested-list-subheader">
          {menuItems.map((v) => {
            const IconComponent = v.icon;
            return (
              <MenuSidebar
                key={v.seqAplicacao}              
                setOpen={setOpen}                
                open={openIndex === v.seqAplicacao}
                onClick={() => handleClick(v.seqAplicacao)}
                seqAplicacao={v.seqAplicacao}    
                label={v.label}
                route={v.route}
                icon={<IconComponent className="!text-white" />}
              />
            );
          })}
        </List>
      </Box>

      <div className={`absolute bottom-0 left-0 right-0 ${isMobile ? 'p-3' : 'p-4'} border-t border-white/20 bg-black/10`}>
        <div className={`text-center text-white/70 ${isMobile ? 'text-[10px]' : 'text-xs'}`}>
          <div className={`flex items-center justify-center space-x-1 ${isMobile ? 'mb-0.5' : 'mb-1'}`}>
            <Pets fontSize="small" />
            <span>{isMobile ? 'v2.0' : 'TT Pets v2.0'}</span>
          </div>
          <div className="flex items-center justify-center space-x-1">
            <div className={`${isMobile ? 'w-1.5 h-1.5' : 'w-2 h-2'} bg-green-400 rounded-full animate-pulse`}></div>
            <span>{isMobile ? 'Online' : 'Sistema Operacional'}</span>
          </div>
        </div>
      </div>
    </Drawer>
  )
}

export default SidebarComponent