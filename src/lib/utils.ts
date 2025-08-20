import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // 移除特殊字符
    .replace(/[\s_-]+/g, '-') // 替换空格和下划线为连字符
    .replace(/^-+|-+$/g, '') // 移除开头和结尾的连字符
}

export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).replace(/\s+\S*$/, '') + '...'
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function getRandomFromArray<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

// 多语言工具函数
export function getLocalizedContent<T extends Record<string, any>>(
  content: T,
  locale: string,
  field: string
): string {
  const localizedField = `${field}${locale === 'en' ? '' : locale.charAt(0).toUpperCase() + locale.slice(1)}`
  return content[localizedField] || content[field] || ''
}

// 视频相关工具函数
export function getVideoThumbnail(videoUrl: string): string {
  // 这里可以实现根据视频URL生成缩略图的逻辑
  // 暂时返回一个占位符
  return videoUrl.replace(/\.(mp4|webm|mov)$/, '_thumbnail.jpg')
}

// 用户地理位置检测
export function getLocaleFromCountry(country?: string): string {
  const CHINESE_REGIONS = ['TW', 'HK', 'MO']
  
  if (country === 'JP') return 'ja'
  if (CHINESE_REGIONS.includes(country || '')) return 'zh-TW'
  return 'en' // 默认英文
}