'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import { UserMenu } from '@/components/auth/user-menu'
import { LanguageSwitcher } from '@/components/i18n/language-switcher'
import { useCurrentLocale, useTranslations } from '@/i18n/hooks'

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const locale = useCurrentLocale()
  const t = useTranslations()

  const navItems = [
    { href: `/${locale}`, label: t('navigation.home') },
    { href: `/${locale}/philosophy`, label: t('navigation.philosophy') },
    { href: `/${locale}/content`, label: t('navigation.content') },
    { href: `/${locale}/community`, label: t('navigation.community') },
  ]

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 60,
      backgroundColor: 'rgba(26, 26, 26, 0.95)',
      backdropFilter: 'blur(8px)',
      borderBottom: '1px solid rgba(244, 241, 234, 0.1)'
    }}>
      <div className="container mx-auto px-4" style={{ maxWidth: 'var(--container-width)' }}>
        <div className="flex items-center justify-between h-20">
          {/* Logo - Dramatic Typography */}
          <Link
            href={`/${locale}`}
            style={{
              fontFamily: 'var(--font-family-heading)',
              fontSize: '1.5rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              color: 'var(--color-parchment)',
              textDecoration: 'none',
              transition: 'color var(--duration-fast) var(--ease-suspense)'
            }}
            onMouseEnter={(e) => {
              const target = e.currentTarget as HTMLElement
              target.style.color = 'var(--color-vermilion)'
            }}
            onMouseLeave={(e) => {
              const target = e.currentTarget as HTMLElement
              target.style.color = 'var(--color-parchment)'
            }}
          >
            Tatami Labs
          </Link>

          {/* Desktop Navigation - Minimalist Links */}
          <div className="hidden md:flex items-center space-x-12">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  fontFamily: 'var(--font-family-heading)',
                  fontSize: '0.9rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                  color: 'var(--color-text-secondary)',
                  textDecoration: 'none',
                  transition: 'color var(--duration-fast) var(--ease-suspense)',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  const target = e.currentTarget as HTMLElement
                  target.style.color = 'var(--color-vermilion)'
                }}
                onMouseLeave={(e) => {
                  const target = e.currentTarget as HTMLElement
                  target.style.color = 'var(--color-text-secondary)'
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-6">
            <div style={{ 
              opacity: 0.8,
              transition: 'opacity var(--duration-fast) var(--ease-suspense)' 
            }}>
              <LanguageSwitcher />
            </div>
            <div style={{ 
              opacity: 0.8,
              transition: 'opacity var(--duration-fast) var(--ease-suspense)' 
            }}>
              <UserMenu />
            </div>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{
                display: 'block',
                backgroundColor: 'transparent',
                border: '1px solid var(--color-text-secondary)',
                color: 'var(--color-text-secondary)',
                padding: '0.5rem',
                cursor: 'pointer',
                transition: 'all var(--duration-fast) var(--ease-suspense)'
              }}
              onMouseEnter={(e) => {
                const target = e.currentTarget as HTMLElement
                target.style.borderColor = 'var(--color-vermilion)'
                target.style.color = 'var(--color-vermilion)'
              }}
              onMouseLeave={(e) => {
                const target = e.currentTarget as HTMLElement
                target.style.borderColor = 'var(--color-text-secondary)'
                target.style.color = 'var(--color-text-secondary)'
              }}
              className="md:hidden"
            >
              <Icons.menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mobile Menu - Dramatic Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                borderTop: '1px solid rgba(244, 241, 234, 0.1)',
                backgroundColor: 'rgba(26, 26, 26, 0.98)'
              }}
              className="md:hidden"
            >
              <div className="py-6 space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{
                      display: 'block',
                      fontFamily: 'var(--font-family-heading)',
                      fontSize: '1rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.2em',
                      color: 'var(--color-text-secondary)',
                      textDecoration: 'none',
                      padding: '0.75rem 0',
                      transition: 'color var(--duration-fast) var(--ease-suspense)'
                    }}
                    onMouseEnter={(e) => {
                      const target = e.currentTarget as HTMLElement
                      target.style.color = 'var(--color-vermilion)'
                    }}
                    onMouseLeave={(e) => {
                      const target = e.currentTarget as HTMLElement
                      target.style.color = 'var(--color-text-secondary)'
                    }}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}