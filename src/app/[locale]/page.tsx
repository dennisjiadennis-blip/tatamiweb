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

  return (
    <div className="min-h-screen">
      {/* The Glimpse - 首页核心视频体验 */}
      <HomepageHero 
        locale={locale}
        country={country}
        className="fixed inset-0 z-50"
      />
      
      {/* 后续内容 - 在视频体验结束后显示 */}
      <div className="relative z-10 min-h-screen bg-white" id="main-content">
        <section className="pt-20 pb-12">
          <div className="container mx-auto px-6 text-center">
            <div className="space-y-6 max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-light text-black tracking-wide">
                {t('title')}
              </h1>
              
              <div className="w-24 h-px bg-black/20 mx-auto"></div>
              
              <h2 className="text-2xl md:text-3xl font-serif font-light text-gray-800">
                {t('subtitle')}
              </h2>
              
              <p className="text-lg font-serif text-gray-600 max-w-2xl mx-auto leading-relaxed">
                {t('description')}
              </p>
              
              <HomepageCTA locale={locale} />
            </div>
          </div>
        </section>
        
        {/* 简介部分 */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h3 className="text-3xl font-serif font-light text-black">
                  {t('subtitle')}
                </h3>
                <p className="text-lg font-serif text-gray-600 leading-relaxed">
                  {t('description')}
                </p>
                <div className="pt-4">
                  <a 
                    href={`/${locale}/philosophy`}
                    className="inline-block px-8 py-4 border border-black text-black hover:bg-black hover:text-white transition-colors font-serif"
                  >
                    {locale === 'en' ? 'Learn Our Philosophy' : 
                     locale === 'zh-TW' ? '了解我們的理念' :
                     '私たちの理念を学ぶ'}
                  </a>
                </div>
              </div>
              
              <div className="relative">
                <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg overflow-hidden">
                  <div className="flex items-center justify-center">
                    <p className="text-gray-500 text-lg">Preview Video</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}