import {
  Route,
  Routes,
  useLocation,
  BrowserRouter as Router,
  Navigate,
} from 'react-router-dom'
import { lazy, Suspense } from 'react'
import CustomLoaders from './src/components/Loader'
import { ProtectedRoute } from './src/components/ProtectedRoute'

const Navbar = lazy(() => import('./src/components/navbar'))

function TelaLegado() {
  return null
}

const Acessar = TelaLegado
const Home = TelaLegado
const EmBreve = TelaLegado

function App() {
  const location = useLocation()

  const hideNavbarRoutes = ['/acessar']

  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname)

  const routes = [
    {
      path: '/acessar',
      element: <Acessar />,
    },
    {
      path: '/home',
      element: <ProtectedRoute><Home /></ProtectedRoute>,
    },
    {
      path: '/pacientes',
      element: <ProtectedRoute><EmBreve /></ProtectedRoute>,
    },
    {
      path: '/agenda',
      element: <ProtectedRoute><EmBreve /></ProtectedRoute>,
    },
    {
      path: '/consultas',
      element: <ProtectedRoute><EmBreve /></ProtectedRoute>,
    },
    {
      path: '/minhas-consultas',
      element: <ProtectedRoute><EmBreve /></ProtectedRoute>,
    },
    {
      path: '/atendimentos',
      element: <ProtectedRoute><EmBreve /></ProtectedRoute>,
    },
    {
      path: '/prontuario-atendimento/:idPaciente/:idConsulta',
      element: <ProtectedRoute><EmBreve /></ProtectedRoute>,
    },
    {
      path: '/perfil',
      element: <ProtectedRoute><EmBreve /></ProtectedRoute>,
    },
    {
      path: '/prescricoes',
      element: <ProtectedRoute><EmBreve /></ProtectedRoute>,
    },
    {
      path: '/prontuarios',
      element: <ProtectedRoute><EmBreve /></ProtectedRoute>,
    },
    {
      path: '/relatorios',
      element: <ProtectedRoute><EmBreve /></ProtectedRoute>,
    },
  ]

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <Suspense fallback={<CustomLoaders open />}>
        <Routes>
          {routes.map((v) => (
            <Route
              key={v.path}
              path={v.path}
              element={v.element}
            />
          ))}
          <Route path="/" element={<Navigate to="/acessar" />} />
        </Routes>
      </Suspense>
    </>
  )
}

export default function AppRouter() {
  return (
    <Router>
      <App />
    </Router>
  )
}
