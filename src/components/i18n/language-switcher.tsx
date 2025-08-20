'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Icons } from '@/components/ui/icons'
import { locales } from '@/i18n/config'

const languages = {
  en: { name: 'English', flag: '🇺🇸' },
  'zh-TW': { name: '繁體中文', flag: '🇹🇼' },
  ja: { name: '日本語', flag: '🇯🇵' }
}

export function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  
  // 获取当前语言
  const currentLocale = locales.find(locale => 
    pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  ) || 'en'

  const handleLanguageChange = (newLocale: string) => {
    // 替换当前路径中的语言前缀
    let newPath = pathname
    
    // 移除当前语言前缀
    for (const locale of locales) {
      if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
        newPath = pathname.replace(`/${locale}`, '')
        break
      }
    }
    
    // 添加新语言前缀
    newPath = `/${newLocale}${newPath}`
    
    // 导航到新路径
    router.push(newPath)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <span className="text-lg">{languages[currentLocale as keyof typeof languages].flag}</span>
          <span className="hidden sm:inline-block">
            {languages[currentLocale as keyof typeof languages].name}
          </span>
          <Icons.chevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.entries(languages).map(([code, lang]) => (
          <DropdownMenuItem
            key={code}
            onClick={() => handleLanguageChange(code)}
            className={currentLocale === code ? 'bg-accent' : ''}
          >
            <span className="mr-2 text-lg">{lang.flag}</span>
            <span>{lang.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}