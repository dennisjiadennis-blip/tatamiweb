'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import { cn } from '@/lib/utils'
import { useBreakpoint } from '@/lib/responsive'
import { useCurrentLocale } from '@/i18n/hooks'
import { useAuth } from '@/lib/hooks/use-auth'

interface MobileNavigationProps {
  className?: string
}

export function MobileNavigation({ className }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('home')
  const { isMobile } = useBreakpoint()
  const locale = useCurrentLocale()
  const { isAuthenticated, redirectToSignIn } = useAuth()

  // 监听路由变化关闭菜单
  useEffect(() => {
    const handleRouteChange = () => {
      setIsOpen(false)
    }

    // 监听 popstate 事件
    window.addEventListener('popstate', handleRouteChange)
    return () => window.removeEventListener('popstate', handleRouteChange)
  }, [])

  // 阻止背景滚动
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const navigationItems = [
    {
      id: 'home',
      label: locale === 'ja' ? 'ホーム' : locale === 'zh-TW' ? '首頁' : 'Home',
      href: `/${locale}`,
      icon: Icons.menu
    },
    {
      id: 'masters',
      label: locale === 'ja' ? '達人' : locale === 'zh-TW' ? '大師' : 'Masters',
      href: `/${locale}/masters`,
      icon: Icons.user
    },
    {
      id: 'community',
      label: locale === 'ja' ? 'コミュニティ' : locale === 'zh-TW' ? '社群' : 'Community',
      href: `/${locale}/community`,
      icon: Icons.heart
    },
    {
      id: 'content',
      label: locale === 'ja' ? 'コンテンツ' : locale === 'zh-TW' ? '內容' : 'Content',
      href: `/${locale}/content`,
      icon: Icons.share
    }
  ]

  const userMenuItems = [
    {
      id: 'profile',
      label: locale === 'ja' ? 'プロフィール' : locale === 'zh-TW' ? '個人檔案' : 'Profile',
      href: `/${locale}/profile`,
      icon: Icons.user
    },
    {
      id: 'philosophy',
      label: locale === 'ja' ? '理念' : locale === 'zh-TW' ? '理念' : 'Philosophy',
      href: `/${locale}/philosophy`,
      icon: Icons.heart
    },
    {
      id: 'settings',
      label: locale === 'ja' ? '設定' : locale === 'zh-TW' ? '設定' : 'Settings',
      href: `/${locale}/profile?tab=settings`,
      icon: Icons.settings
    }
  ]

  if (!isMobile) return null

  return (
    <>
      {/* 汉堡菜单按钮 */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          'fixed top-4 right-4 z-50 p-3 bg-background/80 backdrop-blur-sm border rounded-full shadow-lg',
          'hover:bg-background/90 transition-all duration-200',
          className
        )}
        aria-label="Open menu"
      >
        <Icons.menu className="w-6 h-6" />
      </button>

      {/* 移动端菜单覆盖层 */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* 背景遮罩 */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
            />

            {/* 侧边菜单 */}
            <motion.div
              className="fixed right-0 top-0 bottom-0 z-50 w-80 max-w-[90vw] bg-background border-l shadow-2xl"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="flex flex-col h-full">
                {/* 头部 */}
                <div className="flex items-center justify-between p-6 border-b">
                  <h2 className="text-xl font-light">
                    {locale === 'ja' ? 'メニュー' : locale === 'zh-TW' ? '選單' : 'Menu'}
                  </h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-muted rounded-full transition-colors"
                    aria-label="Close menu"
                  >
                    <Icons.close className="w-5 h-5" />
                  </button>
                </div>

                {/* 主导航 */}
                <div className="flex-1 overflow-y-auto">
                  <div className="p-6 space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wide">
                      {locale === 'ja' ? 'ナビゲーション' : locale === 'zh-TW' ? '導航' : 'Navigation'}
                    </h3>
                    
                    {navigationItems.map((item, index) => (
                      <motion.a
                        key={item.id}
                        href={item.href}
                        className={cn(
                          'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors',
                          'hover:bg-muted active:bg-muted/80',
                          activeTab === item.id && 'bg-primary/10 text-primary'
                        )}
                        onClick={() => {
                          setActiveTab(item.id)
                          setIsOpen(false)
                        }}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </motion.a>
                    ))}
                  </div>

                  {/* 用户相关菜单 */}
                  {isAuthenticated ? (
                    <div className="p-6 space-y-2 border-t">
                      <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wide">
                        {locale === 'ja' ? 'アカウント' : locale === 'zh-TW' ? '帳戶' : 'Account'}
                      </h3>
                      
                      {userMenuItems.map((item, index) => (
                        <motion.a
                          key={item.id}
                          href={item.href}
                          className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors hover:bg-muted active:bg-muted/80"
                          onClick={() => setIsOpen(false)}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: (navigationItems.length + index) * 0.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.label}</span>
                        </motion.a>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 border-t">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-3"
                      >
                        <Button
                          className="w-full"
                          onClick={() => {
                            redirectToSignIn()
                            setIsOpen(false)
                          }}
                        >
                          {locale === 'ja' ? 'ログイン' : locale === 'zh-TW' ? '登入' : 'Sign In'}
                        </Button>
                        
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => {
                            window.location.href = `/${locale}/auth/signin?mode=signup`
                            setIsOpen(false)
                          }}
                        >
                          {locale === 'ja' ? '新規登録' : locale === 'zh-TW' ? '註冊' : 'Sign Up'}
                        </Button>
                      </motion.div>
                    </div>
                  )}
                </div>

                {/* 底部信息 */}
                <div className="p-6 border-t bg-muted/30">
                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">
                      {locale === 'ja' ? 'Tatami Labs で深い対話を' : 
                       locale === 'zh-TW' ? '在 Tatami Labs 進行深度對話' : 
                       'Deep conversations at Tatami Labs'}
                    </p>
                    <div className="flex justify-center space-x-4">
                      <button className="p-2 hover:bg-muted rounded-full transition-colors">
                        <Icons.share className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-muted rounded-full transition-colors">
                        <Icons.heart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 底部固定导航栏 */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-background/95 backdrop-blur-sm border-t">
        <div className="flex items-center justify-around py-2">
          {navigationItems.slice(0, 4).map((item) => (
            <a
              key={item.id}
              href={item.href}
              className={cn(
                'flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors',
                'hover:bg-muted active:bg-muted/80',
                activeTab === item.id && 'text-primary'
              )}
              onClick={() => setActiveTab(item.id)}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </a>
          ))}
        </div>
      </div>
    </>
  )
}

// 移动端页面容器，为底部导航栏预留空间
interface MobilePageContainerProps {
  children: React.ReactNode
  className?: string
}

export function MobilePageContainer({ children, className }: MobilePageContainerProps) {
  const { isMobile } = useBreakpoint()

  return (
    <div className={cn(
      isMobile && 'pb-20', // 为底部导航栏预留空间
      className
    )}>
      {children}
    </div>
  )
}