import { useState, useCallback } from 'react'
import { logger } from '@/lib/logger'

interface UserSettings {
  id: string
  name: string
  email: string
  bio?: string
  location?: string
  locale?: string
  preferences?: {
    emailNotifications: boolean
    pushNotifications: boolean
    marketingEmails: boolean
    eventReminders: boolean
  }
}

interface UpdateUserSettings {
  name?: string
  bio?: string
  location?: string
  locale?: string
  preferences?: Partial<UserSettings['preferences']>
}

export function useUserSettings() {
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSettings = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/user/settings')
      const result = await response.json()

      if (result.success) {
        setSettings(result.data)
      } else {
        setError(result.message || 'Failed to load settings')
      }
    } catch (err) {
      setError('Failed to load settings')
      logger.error('Error fetching user settings', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const updateSettings = useCallback(async (updates: UpdateUserSettings) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/user/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      const result = await response.json()

      if (result.success) {
        setSettings(current => current ? { ...current, ...result.data } : result.data)
        return { success: true }
      } else {
        setError(result.message || 'Failed to update settings')
        return { success: false, message: result.message }
      }
    } catch (err) {
      const errorMessage = 'Failed to update settings'
      setError(errorMessage)
      logger.error('Error updating user settings', err)
      return { success: false, message: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    settings,
    loading,
    error,
    fetchSettings,
    updateSettings,
  }
}