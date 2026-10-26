'use client'

import '@mantine/core/styles.css'
import '@core/css/globals.css'
import 'react-toastify/dist/ReactToastify.css'

import { GrazziotinProviders } from '@grazziotin/react-components-next/providers'
import { createTheme } from '@mui/material/styles'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastContainer } from 'react-toastify'

import type { ChildrenProps } from '@/core/interfaces/interface-global'

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
})

const muiTheme = createTheme({
  palette: { primary: { main: '#7434d6' } },
  shape: { borderRadius: 12 },
  typography: { fontFamily: 'var(--font-family, inherit)' },
})

const Provider = ({ children }: ChildrenProps) => {
  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <QueryClientProvider client={queryClient}>
        <GrazziotinProviders muiTheme={muiTheme}>
          {children}
          <ToastContainer
            limit={3}
            draggable
            newestOnTop
            pauseOnHover
            closeOnClick
            autoClose={4500}
            pauseOnFocusLoss
            closeButton={false}
            position="top-right"
            style={{ fontSize: '14px' }}
          />
        </GrazziotinProviders>
      </QueryClientProvider>
    </AppRouterCacheProvider>
  )
}

export default Provider
