import './App.css'
import 'material-icons'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import 'react-toastify/dist/ReactToastify.css'
import '@xyflow/react/dist/style.css'
import '@mantine/spotlight/styles.css'
import '@mantine/core/styles.css'

import AppRouter from './routes'
import PWAInstallModal from '@/components/pwa-install-modal'
import { AuthProvider } from '@/contexts/AuthContext'
import { SessionTimeoutProvider } from '@/components/session-timeout/SessionTimeoutProvider'
import ReactDOM from 'react-dom/client'
import { TourProvider } from '@reactour/tour'
import { ToastContainer } from 'react-toastify'
import { MantineProvider } from '@mantine/core'
import { ThemeProvider } from '@material-tailwind/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
    <TourProvider
      steps={[]}
      styles={{
        badge: (base) => ({ ...base, backgroundColor: '#00B2A6' }),
        maskArea: (base) => ({ ...base, rx: 2 }),
      }}
    >
      <QueryClientProvider client={queryClient}>
        <MantineProvider
          withCssVariables={false}
          deduplicateCssVariables={false}
        >
          <ThemeProvider>
            <AuthProvider>
              <SessionTimeoutProvider>
                <ToastContainer
                  position={window.innerWidth <= 720 ? 'top-right' : 'bottom-right'}
                  autoClose={3000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  limit={3}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover={false}
                  theme="colored"
                  stacked
                  closeButton
                />
                <AppRouter />
                <PWAInstallModal />
              </SessionTimeoutProvider>
            </AuthProvider>
          </ThemeProvider>
        </MantineProvider>
      </QueryClientProvider>
    </TourProvider>
  ,
)
