import { notFound } from 'next/navigation'
import { getRequestConfig } from 'next-intl/server'

// 支持的语言列表
export const locales = ['en', 'zh-TW', 'ja'] as const
export type Locale = typeof locales[number]

// 默认语言
export const defaultLocale: Locale = 'en'

// 地理位置到语言的映射
export const geoLocaleMap: Record<string, Locale> = {
  'TW': 'zh-TW',
  'HK': 'zh-TW', 
  'MO': 'zh-TW',
  'JP': 'ja'
}

// 获取基于地理位置的语言
export function getLocaleFromGeo(country?: string): Locale {
  if (!country) return defaultLocale
  return geoLocaleMap[country] || defaultLocale
}

// Next-intl 配置
export default getRequestConfig(async ({ locale }) => {
  // 确保总是返回一个有效的locale
  if (!locale) {
    // 如果没有locale参数，返回默认语言配置
    return {
      locale: defaultLocale,
      messages: (await import(`./messages/${defaultLocale}.json`)).default,
      timeZone: 'Asia/Tokyo',
      now: new Date()
    }
  }
  
  // 验证传入的语言是否被支持
  const validLocale = locales.includes(locale as Locale) ? locale as Locale : defaultLocale
  if (!locales.includes(validLocale)) notFound()

  return {
    locale: validLocale,
    messages: (await import(`./messages/${validLocale}.json`)).default,
    timeZone: 'Asia/Tokyo', // 统一使用东京时区
    now: new Date(),
    formats: {
      dateTime: {
        short: {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        },
        long: {
          day: 'numeric', 
          month: 'long',
          year: 'numeric',
          weekday: 'long'
        }
      },
      number: {
        precise: {
          maximumFractionDigits: 5
        }
      },
      list: {
        enumeration: {
          style: 'long',
          type: 'conjunction'
        }
      }
    }
  }
})