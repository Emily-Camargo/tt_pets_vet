import { memo } from 'react'
import { useNavigate } from 'react-router-dom'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { 
  Logout,
  Person
} from '@mui/icons-material'
import { ContaUsuarioComponentsProps } from '../../utils/interface'
import { useAuth } from '../../../../../contexts/AuthContext'

const ContaComponent = ({
  anchorEl,
  setAnchorEl,
}: ContaUsuarioComponentsProps) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const open = Boolean(anchorEl)

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleMenuClick = (action: string) => {
    setAnchorEl(null)
    
    switch (action) {
      case 'profile':
        navigate('/perfil')
        break
      case 'logout':
        handleLogout()
        break
      default:
        break
    }
  }

  async function handleLogout() {
    setAnchorEl(null)
    logout()
    window.location.href = '/acessar'
  }

  const getRoleName = (idPerfil: number) => {
    switch (idPerfil) {
      case 1:
        return 'Administrador';
      case 2:
        return 'Recepcionista';
      case 3:
        return 'Veterinário';
      case 4:
        return 'Tutor';
      default:
        return 'Usuário';
    }
  }

  const userData = user ? {
    name: user.nome,
    email: user.email,
    role: getRoleName(user.idPerfil),
    avatar: user.avatar
  } : {
    name: 'Usuário',
    email: 'usuario@ttpets.com',
    role: 'Usuário',
    avatar: null
  }

  return (
    <Menu
      anchorEl={anchorEl}
      id="account-menu"
      open={open}
      onClose={handleClose}
      slotProps={{
        paper: {
          className: "min-w-[280px] mt-2 rounded-lg border border-gray-200 shadow-lg"
        },
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {userData.avatar ? (
              <img src={userData.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
            ) : (
              userData.name.split(' ').map(n => n[0]).join('')
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-xs">
              {userData.name}
            </h3>
            <p className="text-gray-600 text-xs">
              {userData.role}
            </p>
            <p className="text-gray-400 text-xs">
              {userData.email}
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200"></div>

      <MenuItem 
        onClick={() => handleMenuClick('profile')}
        className="py-3 hover:bg-gray-50"
      >
        <Person className="text-blue-600 mr-3" fontSize="small" />
        <span className="text-gray-700 text-sm pt-1">Meu Perfil</span>
      </MenuItem>

      <div className="border-t border-gray-200 my-1"></div>

      <MenuItem 
        onClick={() => handleMenuClick('logout')}
        className="py-3 hover:bg-red-50"
      >
        <Logout className="text-red-500 mr-3" fontSize="small" />
        <span className="text-red-500 text-sm">Sair</span>
      </MenuItem>
    </Menu>
  )
}

export default memo(ContaComponent)