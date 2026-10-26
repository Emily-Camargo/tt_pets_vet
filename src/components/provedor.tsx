'use client'

import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import type { ReactNode } from 'react'

const tema = createTheme({
  palette: {
    primary: { main: '#7434d6' },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: '"Segoe UI", "Trebuchet MS", sans-serif',
  },
})

export function Provedor({ children }: { children: ReactNode }) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={tema}>{children}</ThemeProvider>
    </AppRouterCacheProvider>
  )
}
