'use client'

import { useCurrentLocale } from '@/i18n/hooks'
import { HomepageHero } from '@/components/sections/homepage-hero'

export default function HomePage() {
  const locale = useCurrentLocale()

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <HomepageHero 
        locale={locale}
        className="absolute inset-0"
      />
    </div>
  )
}