'use client'

import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <SessionProvider 
      refetchInterval={0} // 完全禁用自动刷新
      refetchOnWindowFocus={false} // 禁用窗口聚焦时刷新
      refetchWhenOffline={false} // 离线时不刷新
      basePath="/api/auth" // 明确指定API路径
      session={undefined} // 不预加载session
    >
      {children}
    </SessionProvider>
  )
}