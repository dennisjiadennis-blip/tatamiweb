import type { Metadata } from 'next'
import { Oswald, Lora } from 'next/font/google'
import './globals.css'

// Hitchcock/Saul Bass inspired fonts
const oswald = Oswald({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
  weight: ['400', '500', '600', '700']
})

const lora = Lora({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
  weight: ['400', '500', '600', '700']
})

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
    <html lang="en" suppressHydrationWarning className={`${oswald.variable} ${lora.variable}`}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="antialiased">
        {/* === CINEMATIC INTRO SEQUENCE === */}
        <div id="splash-screen">
          <video id="splash-video" autoPlay muted loop playsInline style={{ display: 'none' }}>
            Your browser does not support the video tag.
          </video>
          <button id="skip-intro-btn" className="skip-intro-button">
            Skip
          </button>
          <div className="splash-text-container">
            <h1 className="splash-text">The Journey to Weave a Story</h1>
          </div>
        </div>
        {/* === END INTRO SEQUENCE === */}
        
        {children}
      </body>
    </html>
  )
}
