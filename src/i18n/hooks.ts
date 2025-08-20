import { useTranslations, useLocale, useFormatter } from 'next-intl'
import { type Locale } from './config'

// Re-export useTranslations for compatibility
export { useTranslations } from 'next-intl'

// 获取翻译文本的Hook
export function useT() {
  return useTranslations()
}

// 获取通用翻译的Hook
export function useCommonT() {
  return useTranslations('common')
}

// 获取导航翻译的Hook
export function useNavigationT() {
  return useTranslations('navigation')
}

// 获取表单翻译的Hook
export function useFormsT() {
  return useTranslations('forms')
}

// 获取错误信息翻译的Hook
export function useErrorsT() {
  return useTranslations('errors')
}

// 获取当前语言的Hook
export function useCurrentLocale(): Locale {
  return useLocale() as Locale
}

// 获取格式化工具的Hook
export function useFormat() {
  return useFormatter()
}

// 获取本地化的日期格式化
export function useDateFormat() {
  const format = useFormat()
  const locale = useCurrentLocale()
  
  return {
    short: (date: Date) => format.dateTime(date, 'short'),
    long: (date: Date) => format.dateTime(date, 'long'),
    relative: (date: Date) => format.relativeTime(date),
    formatForLocale: (date: Date, options?: Intl.DateTimeFormatOptions) => {
      const localeMap = {
        'en': 'en-US',
        'zh-TW': 'zh-TW', 
        'ja': 'ja-JP'
      }
      return new Intl.DateTimeFormat(localeMap[locale], options).format(date)
    }
  }
}

// 获取本地化的数字格式化
export function useNumberFormat() {
  const format = useFormat()
  const locale = useCurrentLocale()
  
  return {
    decimal: (num: number, digits: number = 2) => 
      format.number(num, { maximumFractionDigits: digits }),
    percent: (num: number) => format.number(num, { style: 'percent' }),
    currency: (num: number, currency: string = 'JPY') => 
      format.number(num, { style: 'currency', currency }),
    formatForLocale: (num: number, options?: Intl.NumberFormatOptions) => {
      const localeMap = {
        'en': 'en-US',
        'zh-TW': 'zh-TW',
        'ja': 'ja-JP'
      }
      return new Intl.NumberFormat(localeMap[locale], options).format(num)
    }
  }
}

// 语言切换工具
export function useLanguageSwitcher() {
  const currentLocale = useCurrentLocale()
  
  const getLanguageUrl = (locale: Locale, currentPath: string): string => {
    // 移除当前语言前缀
    const pathWithoutLocale = currentPath.replace(/^\/[a-z]{2}(-[A-Z]{2})?/, '')
    // 添加新语言前缀
    return `/${locale}${pathWithoutLocale}`
  }
  
  const languages = [
    { code: 'en' as const, name: 'English', nativeName: 'English' },
    { code: 'zh-TW' as const, name: '繁體中文', nativeName: '繁體中文' },
    { code: 'ja' as const, name: '日本語', nativeName: '日本語' }
  ]
  
  return {
    currentLocale,
    languages,
    getLanguageUrl,
    isCurrentLanguage: (locale: Locale) => locale === currentLocale
  }
}

// 首页视频选择Hook（基于地理位置和语言）
export function useHomepageVideo() {
  const locale = useCurrentLocale()
  const t = useTranslations('homepage.taglines')
  
  // 根据语言和地理位置智能选择视频
  const getVideoByEmotion = (emotion: string, country?: string) => {
    const videoMap = {
      'joy': '大笑.mp4',
      'warmth': '微笑.mp4', 
      'contemplation': '悲伤.mp4',
      'moved': '感动.mp4',
      'revelation': '惊讶.mp4',
      'wonder': '惊讶2.mp4',
      'awe': '惊讶3.mp4'
    }
    
    return {
      videoFile: videoMap[emotion as keyof typeof videoMap],
      tagline: t(emotion as any),
      emotion
    }
  }
  
  // 基于时间和地理位置的视频权重算法
  const getSmartVideoSelection = (country?: string) => {
    const hour = new Date().getHours()
    const emotions = ['joy', 'warmth', 'contemplation', 'moved', 'revelation', 'wonder', 'awe']
    
    // 根据时间调整权重
    let weights = {
      joy: hour >= 9 && hour <= 17 ? 0.2 : 0.1, // 白天更欢乐
      warmth: 0.25, // 始终友好
      contemplation: hour >= 18 || hour <= 6 ? 0.15 : 0.05, // 晚上和早晨更深沉
      moved: 0.2,
      revelation: 0.15,
      wonder: 0.1,
      awe: 0.05
    }
    
    // 根据地理位置调整权重
    if (country === 'JP') {
      weights.contemplation += 0.1 // 日本用户更多深思视频
      weights.awe += 0.05
    } else if (['TW', 'HK', 'MO'].includes(country || '')) {
      weights.warmth += 0.1 // 中文地区更温暖
      weights.moved += 0.1
    }
    
    // 加权随机选择
    const random = Math.random()
    let cumulative = 0
    
    for (const [emotion, weight] of Object.entries(weights)) {
      cumulative += weight
      if (random <= cumulative) {
        return getVideoByEmotion(emotion, country)
      }
    }
    
    // 默认返回温暖视频
    return getVideoByEmotion('warmth', country)
  }
  
  return {
    getVideoByEmotion,
    getSmartVideoSelection
  }
}