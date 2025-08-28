'use client'

import { useEffect, ReactNode } from 'react'
import { useCurrentLocale } from '@/i18n/hooks'

// Cinematic Intro Component
const CinematicIntro = () => (
  <div id="splash-screen">
    <video id="splash-video" autoPlay muted loop playsInline>
      <source src="/videos/faces/微笑.mp4" type="video/mp4" />
      {/* Fallback - use existing video */}
    </video>
    <div className="splash-text-container">
      <h1 className="splash-text">A Story Awaits.</h1>
    </div>
    <button className="skip-intro-button" onClick={() => {
      const splash = document.getElementById('splash-screen')
      if (splash) {
        splash.classList.add('hidden')
        setTimeout(() => {
          splash.style.display = 'none'
        }, 1000)
      }
    }}>
      Skip Intro
    </button>
  </div>
)

interface LayoutProps {
  children: ReactNode
  showIntro?: boolean // Optional prop to control intro display
  className?: string
}

export default function Layout({ 
  children, 
  showIntro = true, 
  className = '' 
}: LayoutProps) {
  const locale = useCurrentLocale()

  // Centralized splash screen logic
  useEffect(() => {
    if (!showIntro) return
    
    const splashScreen = document.getElementById('splash-screen')
    if (!splashScreen) return

    // Check if intro has been shown in this session
    if (sessionStorage.getItem('introShown')) {
      splashScreen.style.display = 'none'
      return
    }
    
    // Mark intro as shown
    sessionStorage.setItem('introShown', 'true')
    
    // Auto-hide after 6 seconds
    const totalDuration = 6000
    const hideTimer = setTimeout(() => {
      splashScreen.classList.add('hidden')
    }, totalDuration)
    
    const removeTimer = setTimeout(() => {
      splashScreen.style.display = 'none'
    }, totalDuration + 1000)

    // Cleanup timers
    return () => {
      clearTimeout(hideTimer)
      clearTimeout(removeTimer)
    }
  }, [showIntro])

  return (
    <>
      {showIntro && <CinematicIntro />}
      <div className={`min-h-screen ${className}`}>
        <main>{children}</main>
      </div>
    </>
  )
}

// Export specific layout variants for different page types
export const HomeLayout = ({ children }: { children: ReactNode }) => (
  <Layout showIntro={true} className="homepage-container">
    {children}
  </Layout>
)

export const PageLayout = ({ children }: { children: ReactNode }) => (
  <Layout showIntro={false} className="page-container">
    {children}
  </Layout>
)