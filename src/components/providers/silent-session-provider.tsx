'use client'

import { SessionProvider } from 'next-auth/react'
import { ReactNode, useEffect } from 'react'

interface AuthProviderProps {
  children: ReactNode
}

export function SilentAuthProvider({ children }: AuthProviderProps) {
  useEffect(() => {
    // Override console.error to filter out NextAuth client errors
    const originalError = console.error
    console.error = (...args: any[]) => {
      // Filter out NextAuth client fetch errors
      const errorString = args.join(' ')
      if (
        errorString.includes('CLIENT_FETCH_ERROR') ||
        errorString.includes('next-auth') && errorString.includes('Not authenticated') ||
        errorString.includes('https://next-auth.js.org/errors')
      ) {
        return // Silently ignore these errors
      }
      // Call original console.error for other errors
      originalError.apply(console, args)
    }

    // Cleanup: restore original console.error when component unmounts
    return () => {
      console.error = originalError
    }
  }, [])

  return (
    <SessionProvider 
      refetchInterval={0} // Disable automatic refetch
      refetchOnWindowFocus={false} // Disable refetch on window focus
      refetchWhenOffline={false} // Disable refetch when offline
    >
      {children}
    </SessionProvider>
  )
}