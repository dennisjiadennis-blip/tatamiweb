'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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

interface UserSession {
  user: {
    id?: string
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export function SilentUserMenu() {
  const [session, setSession] = useState<UserSession | null>(null)
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading')
  const [isSigningOut, setIsSigningOut] = useState(false)
  const locale = useCurrentLocale()
  const t = useTranslations()

  // 静默检查登录状态，避免错误日志
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/session', {
          credentials: 'include',
          cache: 'no-store'
        })
        
        if (response.ok) {
          const sessionData = await response.json()
          if (sessionData && sessionData.user) {
            setSession(sessionData)
            setStatus('authenticated')
          } else {
            setSession(null)
            setStatus('unauthenticated')
          }
        } else {
          setSession(null)
          setStatus('unauthenticated')
        }
      } catch (error) {
        // 静默处理错误，不在控制台输出
        setSession(null)
        setStatus('unauthenticated')
      }
    }

    checkSession()
  }, [])

  const redirectToSignIn = () => {
    window.location.href = `/${locale}/auth/signin`
  }

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      await fetch('/api/auth/signout', {
        method: 'POST',
        credentials: 'include'
      })
      setSession(null)
      setStatus('unauthenticated')
      window.location.href = `/${locale}`
    } catch (error) {
      console.error('Sign out error:', error)
    } finally {
      setIsSigningOut(false)
    }
  }

  // 加载状态显示占位符
  if (status === 'loading') {
    return (
      <Button
        variant="outline"
        size="sm"
        disabled
        className="font-light opacity-50"
      >
        <Icons.spinner className="w-4 h-4 animate-spin mr-2" />
        {t('navigation.signIn')}
      </Button>
    )
  }

  // 未登录状态
  if (status === 'unauthenticated' || !session) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={redirectToSignIn}
        className="font-light"
      >
        {t('navigation.signIn')}
      </Button>
    )
  }

  // 已登录状态
  const user = session.user
  const userInitials = user?.name 
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase()
    : user?.email?.[0]?.toUpperCase() || 'U'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-10 w-10 rounded-full p-0 hover:bg-muted/50"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.image || undefined} alt={user?.name || 'User'} />
            <AvatarFallback className="text-xs">
              {userInitials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <div className="flex items-center justify-start gap-2 p-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.image || undefined} alt={user?.name || 'User'} />
            <AvatarFallback className="text-xs">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user?.name || 'User'}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
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