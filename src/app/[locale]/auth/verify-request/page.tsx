'use client'

import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import { useCurrentLocale, useTranslations } from '@/i18n/hooks'

export default function VerifyRequestPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  const t = useTranslations()
  const locale = useCurrentLocale()

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
            <div className="flex justify-center mb-4">
              <div className="bg-primary/10 rounded-full p-3">
                <Icons.mail className="h-8 w-8 text-primary" />
              </div>
            </div>
            
            <CardTitle className="text-2xl font-light">
              {t('auth.verify.title')}
            </CardTitle>
            
            <CardDescription className="text-muted-foreground">
              {email ? (
                <>
                  {t('auth.verify.description.with-email')}{' '}
                  <span className="font-medium text-foreground">{email}</span>
                </>
              ) : (
                t('auth.verify.description.general')
              )}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* 说明步骤 */}
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start space-x-3">
                <div className="bg-primary/20 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-primary">1</span>
                </div>
                <p>{t('auth.verify.step1')}</p>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-primary/20 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-primary">2</span>
                </div>
                <p>{t('auth.verify.step2')}</p>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-primary/20 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-primary">3</span>
                </div>
                <p>{t('auth.verify.step3')}</p>
              </div>
            </div>

            {/* 提示信息 */}
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">{t('auth.verify.note.title')}</strong>
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• {t('auth.verify.note.spam')}</li>
                <li>• {t('auth.verify.note.expire')}</li>
                <li>• {t('auth.verify.note.security')}</li>
              </ul>
            </div>

            {/* 返回登录按钮 */}
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => window.location.href = `/${locale}/auth/signin`}
            >
              {t('auth.verify.back-signin')}
            </Button>
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