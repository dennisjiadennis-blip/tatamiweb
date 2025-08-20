'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Icons } from '@/components/ui/icons'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/lib/hooks/use-auth'
import { useCurrentLocale, useTranslations } from '@/i18n/hooks'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl')
  const t = useTranslations()
  const locale = useCurrentLocale()
  
  const { signInWithGoogle, signInWithEmail, isLoading, isAuthenticated } = useAuth()

  // 如果已登录，重定向回调页面
  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = callbackUrl || `/${locale}`
    }
  }, [isAuthenticated, callbackUrl, locale])

  const handleGoogleSignIn = async () => {
    await signInWithGoogle(callbackUrl || `/${locale}`)
  }

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsSubmitting(true)
    try {
      await signInWithEmail(email, callbackUrl || `/${locale}`)
    } catch (error) {
      console.error('Sign in error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isButtonLoading = isLoading || isSubmitting

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-muted">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-light">
              {t('auth.signin.title')}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {t('auth.signin.description')}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Google 登录按钮 */}
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={handleGoogleSignIn}
              disabled={isButtonLoading}
            >
              {isButtonLoading && !isSubmitting ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Icons.google className="mr-2 h-4 w-4" />
              )}
              {t('auth.signin.google')}
            </Button>

            {/* 分割线 */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-muted" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  {t('auth.or')}
                </span>
              </div>
            </div>

            {/* Magic Link 表单 */}
            <form onSubmit={handleEmailSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t('auth.email.label')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t('auth.email.placeholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isButtonLoading}
                />
              </div>
              
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isButtonLoading || !email}
              >
                {isSubmitting ? (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Icons.mail className="mr-2 h-4 w-4" />
                )}
                {t('auth.signin.magic-link')}
              </Button>
            </form>

            {/* 条款说明 */}
            <p className="text-xs text-center text-muted-foreground">
              {t('auth.terms.text')}{' '}
              <a
                href={`/${locale}/terms`}
                className="underline underline-offset-4 hover:text-primary"
              >
                {t('auth.terms.link')}
              </a>{' '}
              {t('auth.and')}{' '}
              <a
                href={`/${locale}/privacy`}
                className="underline underline-offset-4 hover:text-primary"
              >
                {t('auth.privacy.link')}
              </a>
            </p>
          </CardContent>
        </Card>

        {/* 返回首页链接 */}
        <div className="mt-4 text-center">
          <a
            href={`/${locale}`}
            className="text-sm text-muted-foreground hover:text-primary underline underline-offset-4"
          >
            {t('auth.back-home')}
          </a>
        </div>
      </motion.div>
    </div>
  )
}