'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

type SupportedLocale = 'en' | 'zh-TW' | 'ja'

const LANGUAGE_STORAGE_KEY = 'tatami_preferred_language'
const DEFAULT_LOCALE: SupportedLocale = 'en'

export function useLanguagePreference(currentLocale: string) {
  const [preferredLocale, setPreferredLocale] = useState<SupportedLocale>(currentLocale as SupportedLocale)
  const router = useRouter()
  const pathname = usePathname()

  // 从localStorage加载用户偏好
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY) as SupportedLocale
      if (stored && stored !== currentLocale) {
        setPreferredLocale(stored)
        // 自动重定向到用户偏好语言
        const newPath = pathname.replace(`/${currentLocale}`, `/${stored}`)
        router.push(newPath)
      }
    }
  }, [])

  // 保存语言偏好到localStorage
  const saveLanguagePreference = (locale: SupportedLocale) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, locale)
      setPreferredLocale(locale)
    }
  }

  // 切换语言
  const switchLanguage = (newLocale: SupportedLocale) => {
    saveLanguagePreference(newLocale)
    const newPath = pathname.replace(`/${currentLocale}`, `/${newLocale}`)
    router.push(newPath)
  }

  // 获取存储的语言偏好
  const getStoredLanguage = (): SupportedLocale => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem(LANGUAGE_STORAGE_KEY) as SupportedLocale) || DEFAULT_LOCALE
    }
    return DEFAULT_LOCALE
  }

  return {
    preferredLocale,
    switchLanguage,
    saveLanguagePreference,
    getStoredLanguage,
    supportedLocales: ['en', 'zh-TW', 'ja'] as SupportedLocale[]
  }
}