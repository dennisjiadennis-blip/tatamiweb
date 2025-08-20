'use client'

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useBreakpoint } from '@/lib/responsive'
import { 
  TouchOptimizer, 
  ResourceOptimizer, 
  MobileDetection, 
  useNetworkStatus,
  useOptimizedScroll
} from '@/lib/mobile-performance'

// 移动端首屏优化组件
interface MobileFirstScreenProps {
  children: React.ReactNode
  className?: string
  criticalResources?: string[]
  deferNonCritical?: boolean
}

export function MobileFirstScreen({
  children,
  className,
  criticalResources = [],
  deferNonCritical = true
}: MobileFirstScreenProps) {
  const [isFirstScreenLoaded, setIsFirstScreenLoaded] = useState(false)
  const [nonCriticalLoaded, setNonCriticalLoaded] = useState(!deferNonCritical)
  const { isMobile } = useBreakpoint()
  const { isSlowConnection } = useNetworkStatus()

  useEffect(() => {
    // 预加载关键资源
    if (isMobile && criticalResources.length > 0) {
      Promise.all(
        criticalResources.map(resource => {
          if (resource.endsWith('.css')) {
            return ResourceOptimizer.loadResourceLazily(resource, 'style')
          } else {
            return ResourceOptimizer.loadResourceLazily(resource, 'script')
          }
        })
      ).then(() => {
        setIsFirstScreenLoaded(true)
        
        // 延迟加载非关键资源
        if (deferNonCritical && !isSlowConnection) {
          setTimeout(() => {
            setNonCriticalLoaded(true)
          }, 100)
        }
      })
    } else {
      setIsFirstScreenLoaded(true)
    }
  }, [isMobile, criticalResources, deferNonCritical, isSlowConnection])

  return (
    <div className={cn('min-h-screen', className)}>
      <AnimatePresence mode="wait">
        {!isFirstScreenLoaded ? (
          <motion.div
            key="loading"
            className="flex items-center justify-center min-h-screen bg-background"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center space-y-4">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm text-muted-foreground">正在加载...</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className={cn(!nonCriticalLoaded && 'pointer-events-none')}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// 移动端触摸优化容器
interface TouchOptimizedContainerProps {
  children: React.ReactNode
  className?: string
  enableFastClick?: boolean
  preventBounce?: boolean
  optimizeScrolling?: boolean
}

export function TouchOptimizedContainer({
  children,
  className,
  enableFastClick = true,
  preventBounce = true,
  optimizeScrolling = true
}: TouchOptimizedContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { isMobile } = useBreakpoint()

  useEffect(() => {
    if (!isMobile) return

    if (enableFastClick) {
      TouchOptimizer.optimizeClickDelay()
    }

    if (preventBounce) {
      TouchOptimizer.preventBounce()
    }

    if (optimizeScrolling && containerRef.current) {
      TouchOptimizer.allowScroll('.touch-scroll-area')
    }
  }, [isMobile, enableFastClick, preventBounce, optimizeScrolling])

  return (
    <div
      ref={containerRef}
      className={cn(
        'touch-pan-y', // 允许垂直滚动
        optimizeScrolling && 'touch-scroll-area',
        className
      )}
      style={{
        WebkitOverflowScrolling: 'touch', // iOS 平滑滚动
        overscrollBehavior: preventBounce ? 'none' : 'auto'
      }}
    >
      {children}
    </div>
  )
}

// 自适应图片质量组件
interface AdaptiveImageProps {
  src: string
  alt: string
  className?: string
  priority?: boolean
  sizes?: string
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
}

export function AdaptiveImage({
  src,
  alt,
  className,
  priority = false,
  sizes,
  placeholder = 'empty',
  blurDataURL
}: AdaptiveImageProps) {
  const [imageSrc, setImageSrc] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)
  const { isMobile } = useBreakpoint()
  const { isSlowConnection } = useNetworkStatus()

  useEffect(() => {
    const quality = ResourceOptimizer.getOptimalImageQuality()
    const devicePixelRatio = MobileDetection.getDevicePixelRatio()
    
    // 根据设备和网络条件调整图片参数
    let optimizedSrc = src
    
    if (src.includes('?')) {
      optimizedSrc += `&q=${quality}&dpr=${Math.min(devicePixelRatio, 2)}`
    } else {
      optimizedSrc += `?q=${quality}&dpr=${Math.min(devicePixelRatio, 2)}`
    }
    
    // 移动端和慢网络下使用较小尺寸
    if (isMobile || isSlowConnection) {
      optimizedSrc += '&fm=webp&auto=format'
    }
    
    setImageSrc(optimizedSrc)
  }, [src, isMobile, isSlowConnection])

  const handleLoad = useCallback(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {placeholder === 'blur' && blurDataURL && !isLoaded && (
        <img
          src={blurDataURL}
          alt=""
          className="absolute inset-0 w-full h-full object-cover filter blur-sm scale-110"
        />
      )}
      
      {!isLoaded && placeholder === 'empty' && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
      
      <motion.img
        src={imageSrc}
        alt={alt}
        className="w-full h-full object-cover"
        loading={priority ? 'eager' : 'lazy'}
        sizes={sizes}
        onLoad={handleLoad}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </div>
  )
}

// 移动端优化的滚动组件
interface OptimizedMobileScrollProps {
  children: React.ReactNode
  className?: string
  showScrollIndicator?: boolean
  onScrollEnd?: () => void
  snapToElements?: boolean
}

export function OptimizedMobileScroll({
  children,
  className,
  showScrollIndicator = true,
  onScrollEnd,
  snapToElements = false
}: OptimizedMobileScrollProps) {
  const { isMobile } = useBreakpoint()
  const { isScrolling, scrollY } = useOptimizedScroll()
  const scrollProgress = useMotionValue(0)
  const smoothProgress = useSpring(scrollProgress, { 
    stiffness: 100, 
    damping: 30,
    restDelta: 0.001 
  })

  const containerRef = useRef<HTMLDivElement>(null)

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget
    const { scrollTop, scrollHeight, clientHeight } = container
    const progress = scrollTop / (scrollHeight - clientHeight)
    
    scrollProgress.set(progress)
    
    // 检测滚动到底部
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      onScrollEnd?.()
    }
  }, [scrollProgress, onScrollEnd])

  if (!isMobile) {
    return <div className={className}>{children}</div>
  }

  return (
    <div className="relative">
      {/* 滚动指示器 */}
      {showScrollIndicator && (
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-primary/20 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: isScrolling ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="h-full bg-primary"
            style={{ scaleX: smoothProgress, transformOrigin: 'left' }}
          />
        </motion.div>
      )}
      
      <div
        ref={containerRef}
        className={cn(
          'overflow-auto overscroll-contain',
          snapToElements && 'snap-y snap-mandatory',
          className
        )}
        onScroll={handleScroll}
        style={{
          WebkitOverflowScrolling: 'touch',
          scrollBehavior: 'smooth'
        }}
      >
        {children}
      </div>
    </div>
  )
}

// 移动端网络感知组件
interface NetworkAwareComponentProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  minConnection?: 'slow-2g' | '2g' | '3g' | '4g'
  className?: string
}

export function NetworkAwareComponent({
  children,
  fallback,
  minConnection = '3g',
  className
}: NetworkAwareComponentProps) {
  const { connectionType, isSlowConnection } = useNetworkStatus()
  
  const connectionLevels = {
    'slow-2g': 1,
    '2g': 2,
    '3g': 3,
    '4g': 4
  }
  
  const currentLevel = connectionLevels[connectionType as keyof typeof connectionLevels] || 4
  const requiredLevel = connectionLevels[minConnection]
  
  const shouldRender = currentLevel >= requiredLevel

  return (
    <div className={className}>
      <AnimatePresence mode="wait">
        {shouldRender ? (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        ) : (
          <motion.div
            key="fallback"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center py-8"
          >
            {fallback || (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {isSlowConnection ? '网络连接较慢' : '检测到较慢的网络连接'}
                </p>
                <p className="text-xs text-muted-foreground">
                  为了更好的体验，部分内容已简化显示
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// 移动端电池感知组件
interface BatteryAwareComponentProps {
  children: React.ReactNode
  lowBatteryFallback?: React.ReactNode
  batteryThreshold?: number
  reduceAnimations?: boolean
  className?: string
}

export function BatteryAwareComponent({
  children,
  lowBatteryFallback,
  batteryThreshold = 0.2,
  reduceAnimations = true,
  className
}: BatteryAwareComponentProps) {
  const [batteryInfo, setBatteryInfo] = useState<any>(null)
  const { isMobile } = useBreakpoint()

  useEffect(() => {
    if (!isMobile || !('getBattery' in navigator)) return

    ;(navigator as any).getBattery().then((battery: any) => {
      const updateBatteryInfo = () => {
        setBatteryInfo({
          level: battery.level,
          charging: battery.charging
        })
      }

      updateBatteryInfo()
      battery.addEventListener('levelchange', updateBatteryInfo)
      battery.addEventListener('chargingchange', updateBatteryInfo)

      return () => {
        battery.removeEventListener('levelchange', updateBatteryInfo)
        battery.removeEventListener('chargingchange', updateBatteryInfo)
      }
    })
  }, [isMobile])

  const isLowBattery = batteryInfo && batteryInfo.level < batteryThreshold && !batteryInfo.charging
  
  return (
    <div 
      className={className}
      data-low-battery={isLowBattery}
      style={{
        // 低电量时减少动画
        willChange: isLowBattery && reduceAnimations ? 'auto' : undefined
      }}
    >
      {isLowBattery && lowBatteryFallback ? lowBatteryFallback : children}
    </div>
  )
}

// 移动端内存优化图片轮播
interface MobileOptimizedCarouselProps {
  images: Array<{
    src: string
    alt: string
    caption?: string
  }>
  className?: string
  autoPlay?: boolean
  interval?: number
  maxPreloadedImages?: number
}

export function MobileOptimizedCarousel({
  images,
  className,
  autoPlay = false,
  interval = 5000,
  maxPreloadedImages = 3
}: MobileOptimizedCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [preloadedIndices, setPreloadedIndices] = useState(new Set([0]))
  const { isMobile } = useBreakpoint()
  const { isSlowConnection } = useNetworkStatus()

  // 智能预加载相邻图片
  useEffect(() => {
    const preloadNext = () => {
      const nextIndices = new Set(preloadedIndices)
      
      // 预加载当前图片前后的图片
      for (let i = -1; i <= 1; i++) {
        const index = (currentIndex + i + images.length) % images.length
        nextIndices.add(index)
      }
      
      // 限制预加载数量
      if (nextIndices.size > maxPreloadedImages) {
        const sortedIndices = Array.from(nextIndices).sort((a, b) => {
          const distanceA = Math.abs(a - currentIndex)
          const distanceB = Math.abs(b - currentIndex)
          return distanceA - distanceB
        })
        
        setPreloadedIndices(new Set(sortedIndices.slice(0, maxPreloadedImages)))
      } else {
        setPreloadedIndices(nextIndices)
      }
    }

    if (!isSlowConnection) {
      preloadNext()
    }
  }, [currentIndex, images.length, maxPreloadedImages, isSlowConnection, preloadedIndices])

  // 自动播放
  useEffect(() => {
    if (!autoPlay || isSlowConnection) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, interval)

    return () => clearInterval(timer)
  }, [autoPlay, images.length, interval, isSlowConnection])

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index)
  }, [])

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }, [images.length])

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }, [images.length])

  return (
    <div className={cn('relative overflow-hidden rounded-lg', className)}>
      {/* 图片容器 */}
      <div className="relative aspect-video">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className="absolute inset-0"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <AdaptiveImage
              src={images[currentIndex].src}
              alt={images[currentIndex].alt}
              className="w-full h-full"
              priority={currentIndex === 0}
            />
            
            {images[currentIndex].caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <p className="text-white text-sm">{images[currentIndex].caption}</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 导航按钮 */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
          >
            ←
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
          >
            →
          </button>
        </>
      )}

      {/* 指示器 */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              'w-2 h-2 rounded-full transition-colors',
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            )}
          />
        ))}
      </div>

      {/* 隐藏的预加载图片 */}
      <div className="sr-only">
        {Array.from(preloadedIndices).map(index => (
          index !== currentIndex && (
            <img
              key={index}
              src={images[index].src}
              alt=""
              loading="lazy"
            />
          )
        ))}
      </div>
    </div>
  )
}