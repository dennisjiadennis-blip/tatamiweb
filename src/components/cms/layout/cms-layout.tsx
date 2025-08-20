'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Icons } from '@/components/ui/icons'
import { useSession, signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'

interface CMSLayoutProps {
  children: React.ReactNode
  title?: string
  description?: string
}

interface NavigationItem {
  title: string
  href: string
  icon: keyof typeof Icons
  badge?: string
  requiredRole?: string
  children?: NavigationItem[]
}

const navigation: NavigationItem[] = [
  {
    title: 'Dashboard',
    href: '/cms',
    icon: 'dashboard'
  },
  {
    title: 'Masters',
    href: '/cms/masters',
    icon: 'users',
    children: [
      { title: 'All Masters', href: '/cms/masters', icon: 'list' },
      { title: 'Add Master', href: '/cms/masters/create', icon: 'plus' }
    ]
  },
  {
    title: 'Content',
    href: '/cms/content',
    icon: 'fileText',
    children: [
      { title: 'All Content', href: '/cms/content', icon: 'list' },
      { title: 'Create Article', href: '/cms/content/create', icon: 'plus' },
      { title: 'Categories', href: '/cms/content/categories', icon: 'tag' }
    ]
  },
  {
    title: 'Users',
    href: '/cms/users',
    icon: 'user',
    children: [
      { title: 'All Users', href: '/cms/users', icon: 'list' },
      { title: 'Administrators', href: '/cms/users/admins', icon: 'shield' }
    ]
  },
  {
    title: 'Analytics',
    href: '/cms/analytics',
    icon: 'barChart'
  },
  {
    title: 'Settings',
    href: '/cms/settings',
    icon: 'settings',
    requiredRole: 'SUPER_ADMIN'
  }
]

export function CMSLayout({ children, title, description }: CMSLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const { data: session } = useSession()

  const toggleExpanded = (href: string) => {
    setExpandedItems(prev => 
      prev.includes(href) 
        ? prev.filter(item => item !== href)
        : [...prev, href]
    )
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 侧边栏 */}
      <motion.aside
        className={cn(
          'fixed left-0 top-0 z-50 h-screen bg-card border-r transition-all duration-300',
          sidebarOpen ? 'w-64' : 'w-16'
        )}
        animate={{ width: sidebarOpen ? 256 : 64 }}
      >
        {/* 顶部Logo */}
        <div className="flex items-center justify-between p-4 border-b">
          {sidebarOpen ? (
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center">
                <Icons.zap className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg">Tatami CMS</span>
            </div>
          ) : (
            <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center mx-auto">
              <Icons.zap className="h-4 w-4 text-primary-foreground" />
            </div>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={cn(!sidebarOpen && 'hidden')}
          >
            <Icons.menu className="h-4 w-4" />
          </Button>
        </div>

        {/* 导航菜单 */}
        <nav className="p-4 space-y-2">
          {navigation.map((item) => (
            <div key={item.href}>
              {/* 主菜单项 */}
              <div
                className={cn(
                  'flex items-center space-x-2 p-2 rounded-md cursor-pointer transition-colors',
                  'hover:bg-accent hover:text-accent-foreground'
                )}
                onClick={() => item.children ? toggleExpanded(item.href) : null}
              >
                {React.createElement(Icons[item.icon as keyof typeof Icons] as any, { className: "h-4 w-4" })}
                {sidebarOpen && (
                  <>
                    <span className="flex-1">{item.title}</span>
                    {item.children && (
                      <Icons.chevronDown
                        className={cn(
                          'h-4 w-4 transition-transform',
                          expandedItems.includes(item.href) && 'rotate-180'
                        )}
                      />
                    )}
                    {item.badge && (
                      <span className="px-2 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </div>

              {/* 子菜单 */}
              {item.children && sidebarOpen && expandedItems.includes(item.href) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="ml-6 mt-2 space-y-1"
                >
                  {item.children.map((child) => (
                    <a
                      key={child.href}
                      href={child.href}
                      className="flex items-center space-x-2 p-2 rounded-md text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      {React.createElement(Icons[child.icon as keyof typeof Icons] as any, { className: "h-3 w-3" })}
                      <span>{child.title}</span>
                    </a>
                  ))}
                </motion.div>
              )}
            </div>
          ))}
        </nav>

        {/* 用户信息 */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className={cn(
            'flex items-center space-x-2 p-2 rounded-md bg-accent/50',
            !sidebarOpen && 'justify-center'
          )}>
            <Avatar className="h-8 w-8">
              <AvatarImage src={session?.user?.image || ''} />
              <AvatarFallback>
                {session?.user?.name?.charAt(0) || 'A'}
              </AvatarFallback>
            </Avatar>
            
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {session?.user?.name || 'Admin User'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {session?.user?.email}
                </p>
              </div>
            )}
            
            {sidebarOpen && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="h-8 w-8 p-0"
              >
                <Icons.logOut className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </motion.aside>

      {/* 主内容区域 */}
      <div className={cn(
        'transition-all duration-300',
        sidebarOpen ? 'ml-64' : 'ml-16'
      )}>
        {/* 顶部栏 */}
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              {title && (
                <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
              )}
              {description && (
                <p className="text-muted-foreground">{description}</p>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              {/* 通知按钮 */}
              <Button variant="ghost" size="sm" className="relative">
                <Icons.bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-destructive rounded-full" />
              </Button>
              
              {/* 快速访问按钮 */}
              <Button variant="ghost" size="sm">
                <Icons.search className="h-4 w-4" />
              </Button>
              
              {/* 不在侧边栏时显示菜单按钮 */}
              {!sidebarOpen && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Icons.menu className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </header>

        {/* 页面内容 */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}