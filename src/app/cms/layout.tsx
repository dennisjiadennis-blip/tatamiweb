import { Metadata } from 'next'
import { SessionProvider } from 'next-auth/react'

export const metadata: Metadata = {
  title: 'Tatami CMS',
  description: 'Content Management System for Tatami Labs',
  robots: {
    index: false,
    follow: false
  }
}

interface CMSLayoutProps {
  children: React.ReactNode
}

export default function CMSRootLayout({ children }: CMSLayoutProps) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}