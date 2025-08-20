'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Icons } from '@/components/ui/icons'
import { useCurrentLocale, useTranslations } from '@/i18n/hooks'

export function GuestFriendlyMenu() {
  const [userState, setUserState] = useState<'loading' | 'guest' | 'user'>('guest')
  const [userData, setUserData] = useState<any>(null)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const locale = useCurrentLocale()
  const t = useTranslations()

  // 不再使用NextAuth的钩子，而是直接静默检查会话
  useEffect(() => {
    // 延迟检查，让页面先加载
    const timer = setTimeout(() => {
      checkUserStatus()
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  const checkUserStatus = async () => {
    // 静默检查，不触发NextAuth的错误日志
    try {
      const response = await fetch('/api/auth/session', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        // 不使用缓存，避免stale数据
        cache: 'no-cache'
      })

      if (response.ok && response.status === 200) {
        const data = await response.json()
        if (data && data.user) {
          setUserData(data.user)
          setUserState('user')
        } else {
          setUserState('guest')
        }
      } else {
        // 401或其他状态码，用户未登录
        setUserState('guest')
      }
    } catch {
      // 网络错误等，默认为游客状态
      setUserState('guest')
    }
  }

  const handleSignIn = () => {
    window.location.href = `/${locale}/auth/signin`
  }

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      const response = await fetch('/api/auth/signout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        setUserData(null)
        setUserState('guest')
        // 刷新页面以清除所有状态
        window.location.href = `/${locale}`
      }
    } catch (error) {
      console.error('Sign out error:', error)
    } finally {
      setIsSigningOut(false)
    }
  }

  // 游客状态 - 显示登录按钮
  if (userState === 'guest') {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleSignIn}
        className="font-light"
        style={{
          fontFamily: 'var(--font-family-heading)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          fontSize: '0.85rem'
        }}
      >
        {t('navigation.signIn')}
      </Button>
    )
  }

  // 加载中状态 - 不显示任何内容，避免闪烁
  if (userState === 'loading' || !userData) {
    return null
  }

  // 用户已登录状态
  const userInitials = userData.name 
    ? userData.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
    : userData.email?.[0]?.toUpperCase() || 'U'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-10 w-10 rounded-full p-0 hover:bg-muted/50"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={userData.image || undefined} alt={userData.name || 'User'} />
            <AvatarFallback className="text-xs">
              {userInitials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <div className="flex items-center justify-start gap-2 p-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={userData.image || undefined} alt={userData.name || 'User'} />
            <AvatarFallback className="text-xs">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {userData.name || 'User'}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {userData.email}
            </p>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <a
            href={`/${locale}/profile`}
            className="w-full cursor-pointer"
          >
            <Icons.user className="mr-2 h-4 w-4" />
            {t('navigation.profile')}
          </a>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <a
            href={`/${locale}/settings`}
            className="w-full cursor-pointer"
          >
            <Icons.settings className="mr-2 h-4 w-4" />
            Settings
          </a>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="cursor-pointer"
        >
          {isSigningOut ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.logout className="mr-2 h-4 w-4" />
          )}
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}