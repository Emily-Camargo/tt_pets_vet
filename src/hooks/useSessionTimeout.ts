import { useEffect, useRef } from 'react'

interface UseSessionTimeoutProps {
  timeoutMinutes: number
  onTimeout: () => void
}

export function useSessionTimeout({
  timeoutMinutes,
  onTimeout,
}: UseSessionTimeoutProps) {
  const onTimeoutRef = useRef(onTimeout)

  useEffect(() => {
    onTimeoutRef.current = onTimeout
  }, [onTimeout])

  useEffect(() => {
    if (!localStorage.getItem('access_token')) return

    let timer = 0
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'] as const

    const arm = () => {
      window.clearTimeout(timer)
      timer = window.setTimeout(() => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('tt_pets_user')
        onTimeoutRef.current()
        window.location.href = '/acessar'
      }, timeoutMinutes * 60 * 1000)
    }

    arm()
    events.forEach((event) => window.addEventListener(event, arm))

    return () => {
      window.clearTimeout(timer)
      events.forEach((event) => window.removeEventListener(event, arm))
    }
  }, [timeoutMinutes])
}
