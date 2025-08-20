'use client'

import { useEffect } from 'react'
import { useCurrentLocale } from '@/i18n/hooks'

export function LangUpdater() {
  const locale = useCurrentLocale()

  useEffect(() => {
    // Update the html lang attribute dynamically
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale
    }
  }, [locale])

  return null
}