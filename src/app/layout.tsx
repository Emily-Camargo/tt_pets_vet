import type { Metadata } from 'next'

import { Provedor } from '@/components/provedor'

import './globals.css'

export const metadata: Metadata = {
  title: 'TT Pets Vet',
  description: 'Protótipo de atendimento veterinário domiciliar',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <Provedor>{children}</Provedor>
      </body>
    </html>
  )
}
