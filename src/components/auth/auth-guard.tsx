'use client'

import { useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/use-auth'
import { useCurrentLocale } from '@/i18n/hooks'

interface AuthGuardProps {
  children: ReactNode
  requireAuth?: boolean
  redirectTo?: string
  fallback?: ReactNode
}

export function AuthGuard({
  children,
  requireAuth = true,
  redirectTo,
  fallback,
}: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const locale = useCurrentLocale()

  useEffect(() => {
    if (!isLoading && requireAuth && !isAuthenticated) {
      const currentPath = window.location.pathname
      const callbackUrl = encodeURIComponent(currentPath)
      const signInUrl = redirectTo || `/${locale}/auth/signin?callbackUrl=${callbackUrl}`
      router.push(signInUrl)
    }
  }, [isLoading, requireAuth, isAuthenticated, router, locale, redirectTo])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (requireAuth && !isAuthenticated) {
    return fallback || null
  }

  return <>{children}</>
}