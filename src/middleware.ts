import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from './i18n/config'

// 创建国际化中间件 - 简化配置
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'
})

export default function middleware(request: any) {
  // 简化中间件 - 仅处理国际化
  return intlMiddleware(request)
}

export const config = {
  // 匹配所有路径，除了API路由、静态文件等
  matcher: [
    // 匹配所有路径
    '/((?!api|_next|_vercel|.*\\..*).*)',
    // 匹配根路径
    '/',
    // 匹配国际化路径
    '/(en|zh-TW|ja)/:path*'
  ]
}