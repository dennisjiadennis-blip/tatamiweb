'use client'

import * as React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Globe } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from './dropdown-menu'
import { Button } from './button'
import { useLanguageSwitcher } from '@/i18n/hooks'
import { cn } from '@/lib/utils'

interface LanguageSwitcherProps {
  className?: string
  variant?: 'default' | 'compact'
}

export function LanguageSwitcher({ className, variant = 'default' }: LanguageSwitcherProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { currentLocale, languages, getLanguageUrl, isCurrentLanguage } = useLanguageSwitcher()

  const handleLanguageChange = (locale: string) => {
    const newUrl = getLanguageUrl(locale as any, pathname)
    router.push(newUrl)
  }

  const currentLanguage = languages.find(lang => lang.code === currentLocale)

  if (variant === 'compact') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 w-8 px-0 hover:bg-surface transition-colors duration-200",
              className
            )}
          >
            <Globe className="h-4 w-4" />
            <span className="sr-only">切换语言</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="min-w-[160px] bg-white rounded-xl shadow-editorial border border-gray-100 py-2 z-50"
        >
          {languages.map((language) => (
            <DropdownMenuItem
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={cn(
                "flex items-center px-4 py-2 text-sm cursor-pointer hover:bg-surface transition-colors duration-150",
                isCurrentLanguage(language.code) 
                  ? "bg-surface font-medium text-pure-red" 
                  : "text-dark-gray"
              )}
            >
              <span className="font-serif">{language.nativeName}</span>
              {isCurrentLanguage(language.code) && (
                <span className="ml-auto text-xs text-pure-red">✓</span>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "flex items-center space-x-2 px-3 py-2 hover:bg-surface transition-colors duration-200",
            className
          )}
        >
          <Globe className="h-4 w-4" />
          <span className="text-sm font-serif">{currentLanguage?.nativeName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end" 
        className="min-w-[200px] bg-white rounded-xl shadow-editorial border border-gray-100 py-2 z-50"
      >
        <DropdownMenuLabel className="text-xs font-sans text-dark-gray uppercase tracking-wide">
          选择语言 / Choose Language
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={cn(
              "flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-surface transition-colors duration-150",
              isCurrentLanguage(language.code) 
                ? "bg-surface" 
                : ""
            )}
          >
            <div className="flex flex-col">
              <span className={cn(
                "text-sm font-serif",
                isCurrentLanguage(language.code) 
                  ? "text-pure-red font-medium" 
                  : "text-dark-gray"
              )}>
                {language.nativeName}
              </span>
              <span className="text-xs text-gray-500 font-sans">
                {language.name}
              </span>
            </div>
            {isCurrentLanguage(language.code) && (
              <div className="w-2 h-2 bg-pure-red rounded-full"></div>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}