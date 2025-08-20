'use client'

import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import { useCurrentLocale, useTranslations } from '@/i18n/hooks'

const errorMessages = {
  Configuration: 'auth.error.configuration',
  AccessDenied: 'auth.error.access-denied',
  Verification: 'auth.error.verification',
  OAuthSignin: 'auth.error.oauth-signin',
  OAuthCallback: 'auth.error.oauth-callback',
  OAuthCreateAccount: 'auth.error.oauth-create-account',
  EmailCreateAccount: 'auth.error.email-create-account',
  Callback: 'auth.error.callback',
  OAuthAccountNotLinked: 'auth.error.oauth-account-not-linked',
  EmailSignin: 'auth.error.email-signin',
  CredentialsSignin: 'auth.error.credentials-signin',
  SessionRequired: 'auth.error.session-required',
  default: 'auth.error.default',
}

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const t = useTranslations()
  const locale = useCurrentLocale()

  const errorKey = (error && errorMessages[error as keyof typeof errorMessages]) || errorMessages.default

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-destructive/20">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-destructive/10 rounded-full p-3">
                <Icons.alertCircle className="h-8 w-8 text-destructive" />
              </div>
            </div>
            
            <CardTitle className="text-2xl font-light">
              {t('auth.error.title')}
            </CardTitle>
            
            <CardDescription className="text-muted-foreground">
              {t(errorKey)}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* 错误详情 */}
            {error && (
              <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">{t('auth.error.details.title')}</strong>
                </p>
                <p className="text-sm font-mono text-destructive mt-1">{error}</p>
              </div>
            )}

            {/* 解决建议 */}
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <p className="text-sm text-foreground font-medium">
                {t('auth.error.suggestions.title')}
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• {t('auth.error.suggestions.refresh')}</li>
                <li>• {t('auth.error.suggestions.browser')}</li>
                <li>• {t('auth.error.suggestions.cookies')}</li>
                <li>• {t('auth.error.suggestions.try-again')}</li>
              </ul>
            </div>

            {/* 操作按钮 */}
            <div className="space-y-2">
              <Button
                size="lg"
                className="w-full"
                onClick={() => window.location.href = `/${locale}/auth/signin`}
              >
                {t('auth.error.try-again')}
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => window.location.href = `/${locale}`}
              >
                {t('auth.back-home')}
              </Button>
            </div>

            {/* 联系支持 */}
            <div className="text-center pt-4 border-t border-muted">
              <p className="text-sm text-muted-foreground">
                {t('auth.error.support.text')}{' '}
                <a
                  href={`/${locale}/contact`}
                  className="underline underline-offset-4 hover:text-primary"
                >
                  {t('auth.error.support.link')}
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}