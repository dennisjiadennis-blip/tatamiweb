'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useCurrentLocale, useTranslations } from '@/i18n/hooks'
import { cn } from '@/lib/utils'

interface StickyCTABarProps {
  price?: string
  currency?: string
  buttonText?: string
  onButtonClick?: () => void
  showAfterScroll?: number // Show after scrolling this many pixels
  className?: string
  showPrice?: boolean
  variant?: 'default' | 'booking' | 'purchase'
}

export function StickyCTABar({
  price = "¥50,000",
  currency = "¥",
  buttonText,
  onButtonClick,
  showAfterScroll = 500,
  className,
  showPrice = true,
  variant = 'default'
}: StickyCTABarProps) {
  const [isVisible, setIsVisible] = useState(false)
  const locale = useCurrentLocale()
  const t = useTranslations()

  // Default button text based on locale and variant
  const getDefaultButtonText = () => {
    if (buttonText) return buttonText
    
    switch (variant) {
      case 'booking':
        return locale === 'ja' ? '予約する' : 
               locale === 'zh-TW' ? '立即預約' : 
               'Book Now'
      case 'purchase':
        return locale === 'ja' ? '購入する' : 
               locale === 'zh-TW' ? '立即購買' : 
               'Purchase Now'
      default:
        return locale === 'ja' ? '詳細を見る' : 
               locale === 'zh-TW' ? '查看詳情' : 
               'Learn More'
    }
  }

  // Handle scroll to show/hide CTA bar
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      setIsVisible(scrollTop > showAfterScroll)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [showAfterScroll])

  return (
    <motion.div
      className={cn('sticky-cta-bar', isVisible && 'visible', className)}
      initial={{ y: '100%' }}
      animate={{ y: isVisible ? '0%' : '100%' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Price Section */}
      {showPrice && (
        <div className="cta-price-section">
          <div className="cta-price">
            {price}
          </div>
          {variant === 'booking' && (
            <div className="text-sm text-muted-foreground">
              {locale === 'ja' ? '1回のセッション' : 
               locale === 'zh-TW' ? '單次體驗' : 
               'Per session'}
            </div>
          )}
        </div>
      )}

      {/* CTA Button */}
      <button
        className="cta-button"
        onClick={onButtonClick}
        aria-label={getDefaultButtonText()}
      >
        {getDefaultButtonText()}
      </button>
    </motion.div>
  )
}

// Preset variants for common use cases
export function BookingCTABar({ 
  price, 
  onBookingClick,
  ...props 
}: Omit<StickyCTABarProps, 'variant' | 'buttonText' | 'onButtonClick'> & {
  onBookingClick?: () => void
}) {
  return (
    <StickyCTABar
      {...props}
      price={price}
      variant="booking"
      onButtonClick={onBookingClick}
    />
  )
}

export function PurchaseCTABar({ 
  price, 
  onPurchaseClick,
  ...props 
}: Omit<StickyCTABarProps, 'variant' | 'buttonText' | 'onButtonClick'> & {
  onPurchaseClick?: () => void
}) {
  return (
    <StickyCTABar
      {...props}
      price={price}
      variant="purchase"
      onButtonClick={onPurchaseClick}
    />
  )
}