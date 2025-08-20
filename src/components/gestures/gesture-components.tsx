'use client'

import React, { useRef, useState, useEffect } from 'react'
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useBreakpoint } from '@/lib/responsive'

// 手势配置类型
interface GestureConfig {
  swipeThreshold?: number
  velocityThreshold?: number
  restoreAnimation?: boolean
  hapticFeedback?: boolean
}

// 滑动手势组件
interface SwipeGestureProps {
  children: React.ReactNode
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  config?: GestureConfig
  className?: string
  disabled?: boolean
}

export function SwipeGesture({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  config = {},
  className,
  disabled = false
}: SwipeGestureProps) {
  const { isMobile } = useBreakpoint()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const {
    swipeThreshold = 100,
    velocityThreshold = 500,
    restoreAnimation = true,
    hapticFeedback = true
  } = config

  const triggerHaptic = () => {
    if (hapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate(10)
    }
  }

  const handleDragEnd = (event: any, info: PanInfo) => {
    if (disabled || !isMobile) return

    const { offset, velocity } = info
    const isSignificantMove = Math.abs(offset.x) > swipeThreshold || Math.abs(offset.y) > swipeThreshold
    const isSignificantVelocity = Math.abs(velocity.x) > velocityThreshold || Math.abs(velocity.y) > velocityThreshold

    if (isSignificantMove || isSignificantVelocity) {
      triggerHaptic()

      // 确定主要滑动方向
      const isHorizontal = Math.abs(offset.x) > Math.abs(offset.y)
      
      if (isHorizontal) {
        if (offset.x > 0 && onSwipeRight) {
          onSwipeRight()
        } else if (offset.x < 0 && onSwipeLeft) {
          onSwipeLeft()
        }
      } else {
        if (offset.y > 0 && onSwipeDown) {
          onSwipeDown()
        } else if (offset.y < 0 && onSwipeUp) {
          onSwipeUp()
        }
      }
    }

    // 恢复位置
    if (restoreAnimation) {
      x.set(0)
      y.set(0)
    }
  }

  if (!isMobile) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      drag={!disabled}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      style={{ x, y }}
      whileDrag={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    >
      {children}
    </motion.div>
  )
}

// 拉动刷新组件
interface PullToRefreshProps {
  children: React.ReactNode
  onRefresh: () => Promise<void>
  threshold?: number
  className?: string
}

export function PullToRefresh({ 
  children, 
  onRefresh, 
  threshold = 100,
  className 
}: PullToRefreshProps) {
  const { isMobile } = useBreakpoint()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isAtTop, setIsAtTop] = useState(true)
  const y = useMotionValue(0)
  const pullProgress = useTransform(y, [0, threshold], [0, 1])

  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY === 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleDragEnd = async (event: any, info: PanInfo) => {
    if (!isMobile || !isAtTop || isRefreshing) return

    if (info.offset.y > threshold) {
      setIsRefreshing(true)
      
      // 触发触觉反馈
      if ('vibrate' in navigator) {
        navigator.vibrate(20)
      }

      try {
        await onRefresh()
      } finally {
        setIsRefreshing(false)
        y.set(0)
      }
    } else {
      y.set(0)
    }
  }

  if (!isMobile) {
    return <div className={className}>{children}</div>
  }

  return (
    <div className={cn('relative', className)}>
      {/* 刷新指示器 */}
      <motion.div
        className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full flex items-center justify-center h-16 w-16"
        style={{
          y: useTransform(y, [0, threshold], [-64, 0]),
          opacity: pullProgress
        }}
      >
        <motion.div
          className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
          animate={isRefreshing ? { rotate: 360 } : { rotate: 0 }}
          transition={isRefreshing ? { 
            duration: 1, 
            repeat: Infinity, 
            ease: "linear" 
          } : { duration: 0.2 }}
          style={{
            scale: pullProgress
          }}
        />
      </motion.div>

      <motion.div
        drag={isAtTop && !isRefreshing ? "y" : false}
        dragConstraints={{ top: 0, bottom: threshold }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        style={{ y }}
      >
        {children}
      </motion.div>
    </div>
  )
}

// 双击缩放组件
interface DoubleTapZoomProps {
  children: React.ReactNode
  maxScale?: number
  className?: string
}

export function DoubleTapZoom({ 
  children, 
  maxScale = 2,
  className 
}: DoubleTapZoomProps) {
  const { isMobile } = useBreakpoint()
  const [scale, setScale] = useState(1)
  const lastTap = useRef(0)
  const tapCount = useRef(0)

  const handleTap = () => {
    if (!isMobile) return

    const now = Date.now()
    const timeDiff = now - lastTap.current

    if (timeDiff < 300 && timeDiff > 0) {
      tapCount.current += 1
      
      if (tapCount.current === 2) {
        // 双击触发缩放
        const newScale = scale === 1 ? maxScale : 1
        setScale(newScale)
        
        // 触觉反馈
        if ('vibrate' in navigator) {
          navigator.vibrate(15)
        }
        
        tapCount.current = 0
      }
    } else {
      tapCount.current = 1
    }

    lastTap.current = now
  }

  if (!isMobile) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={cn('overflow-hidden', className)}
      onTap={handleTap}
      animate={{ scale }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {children}
    </motion.div>
  )
}

// 长按菜单组件
interface LongPressMenuProps {
  children: React.ReactNode
  menuItems: Array<{
    label: string
    icon?: React.ReactNode
    onClick: () => void
    destructive?: boolean
  }>
  delay?: number
  className?: string
}

export function LongPressMenu({ 
  children, 
  menuItems, 
  delay = 500,
  className 
}: LongPressMenuProps) {
  const { isMobile } = useBreakpoint()
  const [showMenu, setShowMenu] = useState(false)
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 })
  const pressTimer = useRef<NodeJS.Timeout>()
  const pressStart = useRef(0)

  const handlePressStart = (event: React.TouchEvent | React.MouseEvent) => {
    if (!isMobile) return

    pressStart.current = Date.now()
    
    // 获取触摸/点击位置
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY
    
    setMenuPosition({ x: clientX, y: clientY })

    pressTimer.current = setTimeout(() => {
      setShowMenu(true)
      
      // 触觉反馈
      if ('vibrate' in navigator) {
        navigator.vibrate(25)
      }
    }, delay)
  }

  const handlePressEnd = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current)
    }
  }

  const handleMenuItemClick = (onClick: () => void) => {
    onClick()
    setShowMenu(false)
  }

  if (!isMobile) {
    return <div className={className}>{children}</div>
  }

  return (
    <>
      <div
        className={className}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
        onTouchCancel={handlePressEnd}
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onMouseLeave={handlePressEnd}
      >
        {children}
      </div>

      {/* 菜单覆盖层 */}
      {showMenu && (
        <>
          <div 
            className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
            onClick={() => setShowMenu(false)}
          />
          
          <motion.div
            className="fixed z-50 bg-background border rounded-lg shadow-lg py-2 min-w-48"
            style={{
              left: Math.min(menuPosition.x, window.innerWidth - 200),
              top: Math.min(menuPosition.y, window.innerHeight - menuItems.length * 48)
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            {menuItems.map((item, index) => (
              <button
                key={index}
                className={cn(
                  'w-full px-4 py-3 text-left text-sm flex items-center space-x-3 hover:bg-muted transition-colors',
                  item.destructive && 'text-destructive hover:text-destructive'
                )}
                onClick={() => handleMenuItemClick(item.onClick)}
              >
                {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                <span>{item.label}</span>
              </button>
            ))}
          </motion.div>
        </>
      )}
    </>
  )
}

// 滑动选择器组件
interface SwipePickerProps {
  options: string[]
  value: string
  onValueChange: (value: string) => void
  className?: string
}

export function SwipePicker({ 
  options, 
  value, 
  onValueChange,
  className 
}: SwipePickerProps) {
  const { isMobile } = useBreakpoint()
  const currentIndex = options.indexOf(value)
  const y = useMotionValue(0)

  const handleDragEnd = (event: any, info: PanInfo) => {
    if (!isMobile) return

    const swipeThreshold = 50
    const { offset, velocity } = info

    let newIndex = currentIndex

    if (offset.y < -swipeThreshold || velocity.y < -500) {
      newIndex = Math.min(currentIndex + 1, options.length - 1)
    } else if (offset.y > swipeThreshold || velocity.y > 500) {
      newIndex = Math.max(currentIndex - 1, 0)
    }

    if (newIndex !== currentIndex) {
      onValueChange(options[newIndex])
      
      // 触觉反馈
      if ('vibrate' in navigator) {
        navigator.vibrate(10)
      }
    }

    y.set(0)
  }

  if (!isMobile) {
    return (
      <select 
        value={value} 
        onChange={(e) => onValueChange(e.target.value)}
        className={className}
      >
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    )
  }

  return (
    <div className={cn('relative h-32 overflow-hidden', className)}>
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center"
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        style={{ y }}
      >
        {options.map((option, index) => (
          <motion.div
            key={option}
            className={cn(
              'py-3 px-6 text-center transition-all duration-200',
              index === currentIndex ? 'text-primary font-medium scale-110' : 'text-muted-foreground scale-90'
            )}
            animate={{
              opacity: Math.abs(index - currentIndex) <= 1 ? 1 : 0.3,
              scale: index === currentIndex ? 1.1 : 0.9
            }}
          >
            {option}
          </motion.div>
        ))}
      </motion.div>
      
      {/* 选择指示器 */}
      <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 h-12 border-t border-b border-border/30 pointer-events-none" />
    </div>
  )
}

// 手势感应区域
interface GestureZoneProps {
  children: React.ReactNode
  onPinch?: (scale: number) => void
  onRotate?: (angle: number) => void
  className?: string
}

export function GestureZone({ 
  children, 
  onPinch, 
  onRotate,
  className 
}: GestureZoneProps) {
  const { isMobile } = useBreakpoint()
  const [touches, setTouches] = useState<Touch[]>([])
  const initialDistance = useRef(0)
  const initialAngle = useRef(0)

  const getDistance = (touch1: Touch, touch2: Touch) => {
    const dx = touch1.clientX - touch2.clientX
    const dy = touch1.clientY - touch2.clientY
    return Math.sqrt(dx * dx + dy * dy)
  }

  const getAngle = (touch1: Touch, touch2: Touch) => {
    const dx = touch1.clientX - touch2.clientX
    const dy = touch1.clientY - touch2.clientY
    return Math.atan2(dy, dx) * 180 / Math.PI
  }

  const handleTouchStart = (event: React.TouchEvent) => {
    if (!isMobile) return
    
    const touchList = Array.from(event.touches)
    setTouches(touchList)

    if (touchList.length === 2) {
      initialDistance.current = getDistance(touchList[0], touchList[1])
      initialAngle.current = getAngle(touchList[0], touchList[1])
    }
  }

  const handleTouchMove = (event: React.TouchEvent) => {
    if (!isMobile) return
    
    const touchList = Array.from(event.touches)
    
    if (touchList.length === 2 && touches.length === 2) {
      const currentDistance = getDistance(touchList[0], touchList[1])
      const currentAngle = getAngle(touchList[0], touchList[1])

      if (onPinch && initialDistance.current > 0) {
        const scale = currentDistance / initialDistance.current
        onPinch(scale)
      }

      if (onRotate) {
        const angleDiff = currentAngle - initialAngle.current
        onRotate(angleDiff)
      }
    }
  }

  if (!isMobile) {
    return <div className={className}>{children}</div>
  }

  return (
    <div
      className={className}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      {children}
    </div>
  )
}