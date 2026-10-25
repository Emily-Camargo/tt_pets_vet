import { useEffect, useState } from 'react'

export function useDimension(breakpoint: number) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const update = () => setMatches(window.innerWidth <= breakpoint)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [breakpoint])

  return matches
}

export function useProximoAtendimento() {
  return {
    mensagem: 'Próximo atendimento: Luna • consulta veterinária às 14:30',
    loading: false,
    error: null as string | null,
  }
}

export function useProximaConsulta() {
  return {
    mensagem: 'Próximo horário: banho do Thor hoje às 10:00',
    loading: false,
    error: null as string | null,
  }
}

export function usePWAInstall() {
  return {
    isInstallable: false,
    installApp: async () => {},
  }
}
