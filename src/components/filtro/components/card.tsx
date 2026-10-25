import { Tooltip } from '@mantine/core'
import { FiltroCardProps } from '../utils/interface'
import { FunnelIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import ButtonExcel from '../../../components/button/button-excel'
import { Suspense, useMemo } from 'react'
import { useLocation } from 'react-router-dom'

const FiltroCard = <T,>({
  csv,
  title,
  setOpen,
  pesquisa,
  excelProps,
  setPesquisa,
  renderFiltro,
}: FiltroCardProps<T>): JSX.Element => {
  const location = useLocation()

  const screenName = useMemo(() => {
    const routeNames: Record<string, string> = {
      '/home': 'Dashboard',
      '/pacientes': 'Pacientes',
      '/acessar': 'Acesso',
      '/agenda': 'Agenda Médica',
      '/consultas': 'Agendamentos de Consultas',
      '/minhas-consultas': 'Minhas Consultas',
      '/atendimentos': 'Meus Atendimentos',
      '/prescricoes': 'Prescrições Médicas',
      '/prontuarios': 'Prontuários Eletrônicos',
      '/relatorios': 'Relatórios e Dashboards',
    }
    
    return routeNames[location.pathname] || 'Página'
  }, [location.pathname])

  return (
    <div className="bg-white rounded-xl shadow-lg shadow-medical-primary-500/10 hover:shadow-xl hover:shadow-medical-primary-500/15 transition-all duration-300 mb-6 border border-medical-gray-100 backdrop-blur-sm">
      <div className="flex items-center h-16 relative overflow-hidden rounded-xl">
        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-medical-primary-400 via-medical-primary-500 to-medical-primary-600 rounded-tl-xl rounded-bl-xl" />
                <div className="absolute inset-0 bg-gradient-to-r from-medical-primary-50/20 via-transparent to-medical-secondary-50/10 rounded-xl" />
        
        <div className="relative flex-1 flex items-center justify-between px-6 py-3">
          <div className="flex items-center space-x-3">
            <div className="w-1.5 h-1.5 bg-medical-primary-500 rounded-full shadow-sm animate-pulse" />
            <h1 className="text-lg font-semibold text-medical-gray-800 tracking-tight">
              {title ?? screenName}
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            {renderFiltro && (
              <Tooltip
                withArrow
                arrowSize={6}
                color="#2563EB"
                arrowOffset={10}
                label="Abrir filtros"
                position="bottom"
                transitionProps={{ transition: 'scale', duration: 200 }}
              >
                <button
                  onClick={() => setOpen(true)}
                  className="group relative h-10 w-10 rounded-xl bg-gradient-to-br from-medical-primary-50 to-medical-primary-100 hover:from-medical-primary-100 hover:to-medical-primary-200 border border-medical-primary-200/50 hover:border-medical-primary-300 transition-all duration-300 flex items-center justify-center shadow-md shadow-medical-primary-500/10 hover:shadow-lg hover:shadow-medical-primary-500/20 hover:scale-105"
                >
                  <FunnelIcon className="h-5 w-5 text-medical-primary-600 group-hover:text-medical-primary-700 transition-all duration-300 group-hover:scale-110" />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              </Tooltip>
            )}          

            {excelProps && !csv && (
              <Suspense fallback={
                <div className="h-10 w-10 rounded-xl bg-medical-gray-100 animate-pulse shadow-md" />
              }>
                <ButtonExcel {...excelProps} />
              </Suspense>
            )}

            {setPesquisa && (
              <div className="relative group">
                <div className="relative flex items-center">
                  <MagnifyingGlassIcon className="absolute left-3 h-4 w-4 text-medical-gray-400 group-focus-within:text-medical-primary-500 transition-colors duration-200 pointer-events-none" />
                  <input
                    type="search"
                    value={pesquisa}
                    onChange={(e) => setPesquisa(e.target.value)}
                    placeholder="Pesquisar..."
                    className="pl-10 pr-4 py-2.5 w-56 text-sm text-medical-gray-700 placeholder-medical-gray-400 bg-white/80 backdrop-blur-sm border border-medical-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-primary-500/50 focus:border-medical-primary-500 transition-all duration-300 hover:bg-white hover:border-medical-gray-300 hover:shadow-md shadow-sm shadow-medical-gray-500/5 focus:shadow-lg focus:shadow-medical-primary-500/10"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-medical-primary-500/0 via-medical-primary-500/5 to-medical-secondary-500/0 opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FiltroCard
