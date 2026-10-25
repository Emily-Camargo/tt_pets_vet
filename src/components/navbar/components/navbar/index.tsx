import React from 'react'
import { HiOutlineMenu } from 'react-icons/hi'
import { AccountCircle, } from '@mui/icons-material'
import { Box, AppBar, Toolbar, IconButton } from '@mui/material'
import ContaComponent from '../navbar/usuario'
import { useNavigate } from 'react-router-dom'
import logoConsulta from '/assets/logoConsulta.png'

export interface NavbarComponentProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const NavbarComponent = ({ open, setOpen }: NavbarComponentProps) => {
  const [anchorConta, setAnchorConta] = React.useState<null | HTMLElement>(null)
  const navigate = useNavigate();

  const handleClickConta = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorConta(event.currentTarget)
  }

  return (
    <Box>
      <AppBar position="fixed" className="!pr-0 !z-999 !shadow-lg" id="navbar">
        <Toolbar className="bg-gradient-to-r from-white via-medical-gray-50 to-medical-primary-50 !min-h-16 !h-16 border-b border-medical-gray-200">
          <IconButton
            size="large"
            edge="start"
            sx={{ 
              mr: 2,
              color: '#475569',
              '&:hover': {
                backgroundColor: 'rgba(71, 85, 105, 0.1)',
              }
            }}
            id="navbar-hamburguer"
            aria-label="open drawer"
            onClick={() => setOpen(!open)}
          >
            <HiOutlineMenu size={25} />
          </IconButton>
          
          <button
            id="navbar-logo"
            className="w-44 h-16 flex items-center justify-start hover:opacity-90 transition-opacity duration-200"
            onClick={() => navigate('/home')}
          >
            <img 
              src={logoConsulta} 
              width={250} 
              height={100}
              alt="ConsultaCerta Logo"
              className="object-contain"
            />
          </button>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <div className="hidden lg:flex flex-col items-end mr-6 text-right">
            <p className="text-medical-gray-800 font-medium text-sm">Bem-vindo de volta!</p>
            <p className="text-medical-gray-500 text-xs">
              {new Date().toLocaleDateString('pt-BR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          
          
          <IconButton
            size="large"
            edge="end"
            id="navbar-menu-user"
            aria-label="account of current user"
            aria-haspopup="true"
            sx={{ 
              color: '#475569',
              '&:hover': {
                backgroundColor: 'rgba(71, 85, 105, 0.1)',
              }
            }}
            onClick={handleClickConta}
          >
            <AccountCircle fontSize="large" />
          </IconButton>
          
          <ContaComponent
            anchorEl={anchorConta}
            setAnchorEl={setAnchorConta}
          />
        </Toolbar>
      </AppBar>
        <div className="!min-h-16 !h-16" />
    </Box>
  )
}

export default React.memo(NavbarComponent)