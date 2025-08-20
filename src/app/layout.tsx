import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Tatami Labs - Deep Conversation Journeys with Japan\'s Masters',
  description: 'Connect with Japan\'s ultimate masters through profound dialogue experiences.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
