'use client'

import { useState, useEffect } from 'react'
import { useCurrentLocale } from '@/i18n/hooks'

export default function HomePage() {
  const locale = useCurrentLocale()

  // Get localized text based on specifications
  const getLocalizedText = (key: string) => {
    const texts = {
      title: {
        en: 'The Journey to Weave a Story',
        'zh-TW': '編織故事的旅程', 
        ja: '物語を紡ぐ旅'
      },
      subtitle: {
        en: 'Connecting global minds with Japan\'s ultimate masters through deep conversation journeys.',
        'zh-TW': '透過深度對話旅程，連接全球思想與日本終極大師。',
        ja: '深い対話の旅を通じて、世界の心と日本の究極の名匠をつなぐ。'
      },
      cta: {
        en: 'Enter the Journey',
        'zh-TW': '開始旅程',
        ja: '旅を始める'
      }
    }
    return texts[key as keyof typeof texts]?.[locale as keyof typeof texts.title] || texts[key as keyof typeof texts]?.en
  }

  const handleCTAClick = () => {
    const mastersUrl = `/${locale}/masters`
    window.location.href = mastersUrl
  }

  return (
    <div className="homepage-container">
      {/* Hero Section - The Opening Scene of a Film */}
      <section className="hero-section">
        {/* Subtle background texture overlay */}
        <div className="hero-gradient-overlay"></div>
        
        <div className="hero-content">
          {/* Main Headline - Typography is the Hero */}
          <h1 className="hero-title">
            {getLocalizedText('title')}
          </h1>
          
          {/* Sub-headline - Much smaller, beneath main headline */}
          <p className="hero-subtitle">
            {getLocalizedText('subtitle')}
          </p>
          
          {/* Single Call to Action - Minimalist Button */}
          <button 
            className="hero-cta"
            onClick={handleCTAClick}
          >
            {getLocalizedText('cta')}
          </button>
        </div>
        
        {/* Subtle grain texture overlay */}
        <div className="hero-texture-overlay"></div>
      </section>
    </div>
  )
}