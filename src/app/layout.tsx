import type { Metadata, Viewport } from 'next'
import { NuqsAdapter } from 'nuqs/adapters/next/app'

import Provider from '@/core/providers'
import type { ChildrenProps } from '@/core/interfaces/interface-global'

export const viewport: Viewport = {
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  width: 'device-width',
}

export const metadata: Metadata = {
  title: 'TT Pets Vet',
  description: 'Atendimento veterinário domiciliar',
}

const RootLayout = ({ children }: ChildrenProps) => {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <NuqsAdapter>
          <Provider>{children}</Provider>
        </NuqsAdapter>
      </body>
    </html>
  )
}

export default RootLayout
