import { type Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { locales } from '@/i18n/config'
import { Navigation } from '@/components/layout/navigation'
import { SilentAuthProvider } from '@/components/providers/silent-session-provider'
import { CinematicIntro } from '@/components/intro/cinematic-intro'
import { LangUpdater } from '@/components/layout/lang-updater'

interface LocaleLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ 
  params 
}: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params
  
  if (!locales.includes(locale as (typeof locales)[number])) {
    notFound()
  }

  return {
    title: 'Tatami Labs - Connect with Japanese Masters',
    description: 'Experience deep cultural exchange with traditional Japanese masters',
    keywords: 'Japanese culture, traditional crafts, cultural exchange',
  }
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params
}: LocaleLayoutProps) {
  const { locale } = await params
  
  if (!locales.includes(locale as (typeof locales)[number])) {
    notFound()
  }

  const messages = await getMessages({ locale })

  return (
    <SilentAuthProvider>
      <NextIntlClientProvider messages={messages}>
        <LangUpdater />
        <CinematicIntro />
        <Navigation />
        <main className="main-content">
          {children}
        </main>
      </NextIntlClientProvider>
    </SilentAuthProvider>
  )
}