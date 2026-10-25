import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

const USER_STORAGE_KEY = 'tt_pets_user'
const TOKEN_STORAGE_KEY = 'access_token'

export interface UsuarioAuth {
  idUsuario: number
  nome: string
  email: string
  idPerfil: number
  perfil: string
  telefone?: string
  avatar?: string | null
}

interface AuthContextValue {
  user: UsuarioAuth | null
  isLoading: boolean
  login: (user: UsuarioAuth, token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UsuarioAuth | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY)
    const raw = localStorage.getItem(USER_STORAGE_KEY)

    if (token && raw) {
      try {
        setUser(JSON.parse(raw) as UsuarioAuth)
      } catch {
        localStorage.removeItem(USER_STORAGE_KEY)
        localStorage.removeItem(TOKEN_STORAGE_KEY)
      }
    }

    setIsLoading(false)
  }, [])

  const login = useCallback((nextUser: UsuarioAuth, token: string) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, token)
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser))
    setUser(nextUser)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    localStorage.removeItem(USER_STORAGE_KEY)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, isLoading, login, logout }),
    [user, isLoading, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }

  return context
}
