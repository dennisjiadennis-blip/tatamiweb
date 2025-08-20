import { type Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { headers } from 'next/headers'

import { HomepageHero } from '@/components/sections/homepage-hero'
import { HomepageCTA } from '@/components/sections/homepage-cta'

interface HomePageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// 生成页面元数据
export async function generateMetadata({ 
  params 
}: HomePageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'homepage' })
  
  return {
    title: t('title'),
    description: t('description'),
  }
}

export default async function HomePage({ params, searchParams }: HomePageProps) {
  const { locale } = await params
  const resolvedSearchParams = await searchParams
  const t = await getTranslations({ locale, namespace: 'homepage' })
  
  // 获取地理位置信息
  const headersList = await headers()
  const country = headersList.get('x-geo-country') || resolvedSearchParams.geo as string

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

  return (
    <div className="min-h-screen">
      {/* Hero Section - The Opening Scene of a Film */}
      <section className="hero-section">
        {/* Subtle background texture overlay could be added here */}
        <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-transparent via-zinc-900 to-transparent"></div>
        
        <div className="relative z-10">
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
            onClick={() => {
              // Scroll to next section or navigate to masters page
              const mastersUrl = `/${locale}/masters`
              window.location.href = mastersUrl
            }}
          >
            {getLocalizedText('cta')}
          </button>
        </div>
        
        {/* Subtle grain texture overlay */}
        <div className="absolute inset-0 opacity-[0.015] mix-blend-multiply" 
             style={{
               backgroundImage: 'radial-gradient(circle at 50% 50%, transparent 40%, rgba(255,255,255,0.1) 50%)',
               filter: 'contrast(1.2)'
             }}>
        </div>
      </section>
    </div>
  )
}