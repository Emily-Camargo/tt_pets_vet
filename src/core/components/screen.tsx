'use client'

import type { ReactNode } from 'react'

import { PageHeader } from './page-header'

export function Screen({
  title,
  description,
  action,
  children,
}: {
  title: string
  description?: string
  action?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="grid w-full gap-6">
      <PageHeader title={title} description={description} actions={action} />
      {children}
    </div>
  )
}
