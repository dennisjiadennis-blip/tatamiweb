'use client'

import { useEffect } from 'react'
import { useCurrentLocale } from '@/i18n/hooks'

export function CinematicIntro() {
  const locale = useCurrentLocale()

  useEffect(() => {
    // === CINEMATIC INTRO SCRIPT ===
    const splashScreen = document.getElementById('splash-screen')
    const splashVideo = document.getElementById('splash-video') as HTMLVideoElement
    const splashText = document.querySelector('.splash-text') as HTMLElement
    
    if (!splashScreen || !splashVideo || !splashText) return

    // Check if the intro has already been shown in this session
    if (sessionStorage.getItem('introShown')) {
      // If yes, hide the splash screen immediately
      splashScreen.style.display = 'none'
      return
    }

    // Available video files
    const videoFiles = [
      '大笑.mp4',
      '微笑.mp4', 
      '悲伤.mp4',
      '惊讶.mp4',
      '惊讶2.mp4',
      '惊讶3.mp4',
      '感动.mp4'
    ]

    // Randomly select a video
    const randomVideo = videoFiles[Math.floor(Math.random() * videoFiles.length)]
    
    // Set the video source
    splashVideo.src = `/videos/${randomVideo}`
    splashVideo.style.display = 'block'

    // Update text based on locale
    const texts = {
      en: 'The Journey to Weave a Story',
      'zh-TW': '編織故事的旅程',
      ja: '物語を紡ぐ旅'
    }
    
    splashText.textContent = texts[locale as keyof typeof texts] || texts.en

    // Set a flag in session storage so it doesn't run again
    sessionStorage.setItem('introShown', 'true')

    // Function to hide splash screen
    const hideSplashScreen = () => {
      splashScreen.classList.add('hidden')
      setTimeout(() => {
        splashScreen.style.display = 'none'
      }, 1000) // Wait for fade-out transition
    }

    // Auto-hide after 6 seconds
    const autoHideTimeout = setTimeout(hideSplashScreen, 6000)

    // Add skip button click handler
    const skipButton = document.getElementById('skip-intro-btn')
    if (skipButton) {
      skipButton.addEventListener('click', () => {
        clearTimeout(autoHideTimeout)
        hideSplashScreen()
      })
    }

    // Cleanup function
    return () => {
      clearTimeout(autoHideTimeout)
      if (skipButton) {
        skipButton.removeEventListener('click', hideSplashScreen)
      }
    }
  }, [locale])

  return null // This component doesn't render anything
}