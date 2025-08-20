import { type Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Inter } from 'next/font/google'
import { locales } from '@/i18n/config'
import '@/app/globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

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
    <html lang={locale} className={inter.className}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="antialiased">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}