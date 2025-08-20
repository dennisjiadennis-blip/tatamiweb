'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useCurrentLocale } from '@/i18n/hooks'

export function useAuth() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const locale = useCurrentLocale()
  const [isLoading, setIsLoading] = useState(false)

  const isAuthenticated = status === 'authenticated'
  const isLoading_ = status === 'loading' || isLoading

  // Google 登录
  const signInWithGoogle = async (callbackUrl?: string) => {
    setIsLoading(true)
    try {
      await signIn('google', {
        callbackUrl: callbackUrl || `/${locale}`,
      })
    } catch (error) {
      console.error('Google sign in error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Magic Link 登录
  const signInWithEmail = async (email: string, callbackUrl?: string) => {
    setIsLoading(true)
    try {
      const result = await signIn('email', {
        email,
        callbackUrl: callbackUrl || `/${locale}`,
        redirect: false,
      })
      
      if (result?.ok) {
        router.push(`/${locale}/auth/verify-request?email=${encodeURIComponent(email)}`)
      }
      
      return result
    } catch (error) {
      console.error('Email sign in error:', error)
      return { error: 'Sign in failed' }
    } finally {
      setIsLoading(false)
    }
  }

  // 登出
  const handleSignOut = async (callbackUrl?: string) => {
    setIsLoading(true)
    try {
      await signOut({
        callbackUrl: callbackUrl || `/${locale}`,
      })
    } catch (error) {
      console.error('Sign out error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // 获取用户信息
  const user = session?.user ? {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    image: session.user.image,
    referralCode: session.user.referralCode,
    locale: session.user.locale || locale,
  } : null

  // 检查权限
  const hasPermission = (requiredRole?: string) => {
    if (!isAuthenticated) return false
    // 如果需要特定角色，可以在这里添加逻辑
    return true
  }

  // 重定向到登录页
  const redirectToSignIn = (callbackUrl?: string) => {
    const url = `/${locale}/auth/signin${
      callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ''
    }`
    router.push(url)
  }

  return {
    // 状态
    user,
    isAuthenticated,
    isLoading: isLoading_,
    session,
    status,

    // 方法
    signInWithGoogle,
    signInWithEmail,
    signOut: handleSignOut,
    redirectToSignIn,
    hasPermission,
  }
}

// 用户资料管理Hook
export function useUserProfile() {
  const { user, isAuthenticated } = useAuth()
  const [isUpdating, setIsUpdating] = useState(false)

  const updateProfile = async (data: { name?: string; locale?: string }) => {
    if (!isAuthenticated) {
      throw new Error('Not authenticated')
    }

    setIsUpdating(true)
    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error.message)
      }

      return result.data
    } catch (error) {
      console.error('Update profile error:', error)
      throw error
    } finally {
      setIsUpdating(false)
    }
  }

  const getProfile = async () => {
    if (!isAuthenticated) {
      throw new Error('Not authenticated')
    }

    try {
      const response = await fetch('/api/users/profile')
      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error.message)
      }

      return result.data
    } catch (error) {
      console.error('Get profile error:', error)
      throw error
    }
  }

  return {
    user,
    isUpdating,
    updateProfile,
    getProfile,
  }
}

// 兴趣管理Hook
export function useInterests() {
  const { isAuthenticated } = useAuth()
  const [isExpressing, setIsExpressing] = useState(false)

  const expressInterest = async (masterId: string, message?: string) => {
    if (!isAuthenticated) {
      throw new Error('Not authenticated')
    }

    setIsExpressing(true)
    try {
      const response = await fetch('/api/interests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ masterId, message }),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error.message)
      }

      return result.data
    } catch (error) {
      console.error('Express interest error:', error)
      throw error
    } finally {
      setIsExpressing(false)
    }
  }

  const getInterests = async () => {
    if (!isAuthenticated) {
      throw new Error('Not authenticated')
    }

    try {
      const response = await fetch('/api/interests')
      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error.message)
      }

      return result.data
    } catch (error) {
      console.error('Get interests error:', error)
      throw error
    }
  }

  return {
    isExpressing,
    expressInterest,
    getInterests,
  }
}