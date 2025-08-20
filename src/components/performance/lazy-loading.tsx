'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useBreakpoint } from '@/lib/responsive'
import { MobilePerformanceMonitor, useDebounce, useNetworkStatus } from '@/lib/mobile-performance'

// 懒加载图片组件
interface LazyImageProps {
  src: string
  alt: string
  className?: string
  placeholder?: string
  blurDataURL?: string
  quality?: number
  priority?: boolean
  onLoad?: () => void
  onError?: () => void
}

export function LazyImage({
  src,
  alt,
  className,
  placeholder,
  blurDataURL,
  quality = 80,
  priority = false,
  onLoad,
  onError
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [hasError, setHasError] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  const { isMobile } = useBreakpoint()
  const { isSlowConnection } = useNetworkStatus()
  const monitor = MobilePerformanceMonitor.getInstance()

  // 根据网络条件调整图片质量
  const optimizedQuality = isSlowConnection ? Math.min(quality, 50) : quality
  const optimizedSrc = src + `?q=${optimizedQuality}&auto=format`

  useEffect(() => {
    if (priority) {
      setIsInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: isMobile ? '100px' : '200px',
        threshold: 0.1
      }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [priority, isMobile])

  const handleLoad = useCallback(() => {
    monitor.endMeasure(`image-load-${src}`)
    setIsLoaded(true)
    onLoad?.()
  }, [src, monitor, onLoad])

  const handleError = useCallback(() => {
    setHasError(true)
    onError?.()
  }, [onError])

  useEffect(() => {
    if (isInView && !isLoaded && !hasError) {
      monitor.startMeasure(`image-load-${src}`)
    }
  }, [isInView, isLoaded, hasError, src, monitor])

  return (
    <div className={cn('relative overflow-hidden', className)} ref={imgRef}>
      {/* 占位符 */}
      <AnimatePresence>
        {!isLoaded && !hasError && (
          <motion.div
            className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {blurDataURL ? (
              <img
                src={blurDataURL}
                alt=""
                className="w-full h-full object-cover filter blur-sm scale-110"
              />
            ) : (
              <div className="w-8 h-8 border-2 border-muted-foreground/30 border-t-primary rounded-full animate-spin" />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 错误状态 */}
      {hasError && (
        <div className="absolute inset-0 bg-muted flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <div className="w-8 h-8 mx-auto mb-2 opacity-50">⚠️</div>
            <p className="text-sm">Failed to load image</p>
          </div>
        </div>
      )}

      {/* 实际图片 */}
      {isInView && (
        <motion.img
          src={optimizedSrc}
          alt={alt}
          className="w-full h-full object-cover"
          onLoad={handleLoad}
          onError={handleError}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          loading={priority ? 'eager' : 'lazy'}
        />
      )}
    </div>
  )
}

// 虚拟滚动组件
interface VirtualScrollProps<T> {
  items: T[]
  itemHeight: number
  containerHeight: number
  renderItem: (item: T, index: number) => React.ReactNode
  overscan?: number
  className?: string
}

export function VirtualScroll<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 3,
  className
}: VirtualScrollProps<T>) {
  const [scrollTop, setScrollTop] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const { isMobile } = useBreakpoint()

  const debouncedScrollTop = useDebounce(scrollTop, isMobile ? 16 : 8)

  const startIndex = Math.max(0, Math.floor(debouncedScrollTop / itemHeight) - overscan)
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((debouncedScrollTop + containerHeight) / itemHeight) + overscan
  )

  const visibleItems = items.slice(startIndex, endIndex + 1)

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }, [])

  return (
    <div
      ref={containerRef}
      className={cn('overflow-auto', className)}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: items.length * itemHeight, position: 'relative' }}>
        {visibleItems.map((item, index) => (
          <div
            key={startIndex + index}
            style={{
              position: 'absolute',
              top: (startIndex + index) * itemHeight,
              width: '100%',
              height: itemHeight
            }}
          >
            {renderItem(item, startIndex + index)}
          </div>
        ))}
      </div>
    </div>
  )
}

// 懒加载内容区域组件
interface LazyContentAreaProps {
  children: React.ReactNode
  className?: string
  threshold?: number
  delay?: number
  fallback?: React.ReactNode
  trackPerformance?: boolean
}

export function LazyContentArea({
  children,
  className,
  threshold = 0.1,
  delay = 0,
  fallback,
  trackPerformance = false
}: LazyContentAreaProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const monitor = MobilePerformanceMonitor.getInstance()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (trackPerformance) {
            monitor.startMeasure('lazy-content-load')
          }
          
          setTimeout(() => {
            setIsVisible(true)
            setTimeout(() => {
              setIsLoaded(true)
              if (trackPerformance) {
                monitor.endMeasure('lazy-content-load')
              }
            }, 100)
          }, delay)
          
          observer.disconnect()
        }
      },
      { threshold }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [threshold, delay, trackPerformance, monitor])

  return (
    <div ref={containerRef} className={className}>
      <AnimatePresence mode="wait">
        {!isVisible ? (
          <motion.div
            key="fallback"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {fallback || (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-muted-foreground/30 border-t-primary rounded-full animate-spin" />
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: isLoaded ? 1 : 0.5, 
              y: isLoaded ? 0 : 10 
            }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// 代码分割组件包装器
interface CodeSplitComponentProps {
  loader: () => Promise<{ default: React.ComponentType<any> }>
  fallback?: React.ReactNode
  errorFallback?: React.ReactNode
  props?: any
}

export function CodeSplitComponent({
  loader,
  fallback,
  errorFallback,
  props = {}
}: CodeSplitComponentProps) {
  const [Component, setComponent] = useState<React.ComponentType<any> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    loader()
      .then(module => {
        setComponent(() => module.default)
        setIsLoading(false)
      })
      .catch(error => {
        console.error('Failed to load component:', error)
        setHasError(true)
        setIsLoading(false)
      })
  }, [loader])

  if (hasError) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        {errorFallback || '组件加载失败'}
      </div>
    )
  }

  if (isLoading || !Component) {
    return (
      <div className="flex items-center justify-center py-8">
        {fallback || (
          <div className="w-6 h-6 border-2 border-muted-foreground/30 border-t-primary rounded-full animate-spin" />
        )}
      </div>
    )
  }

  return <Component {...props} />
}

// 分页懒加载组件
interface InfiniteScrollProps<T> {
  items: T[]
  hasMore: boolean
  isLoading: boolean
  onLoadMore: () => void
  renderItem: (item: T, index: number) => React.ReactNode
  className?: string
  threshold?: number
  loader?: React.ReactNode
}

export function InfiniteScroll<T>({
  items,
  hasMore,
  isLoading,
  onLoadMore,
  renderItem,
  className,
  threshold = 200,
  loader
}: InfiniteScrollProps<T>) {
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const { isMobile } = useBreakpoint()

  useEffect(() => {
    if (!hasMore || isLoading) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onLoadMore()
        }
      },
      {
        rootMargin: `${threshold}px`,
        threshold: 0.1
      }
    )

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }

    return () => observer.disconnect()
  }, [hasMore, isLoading, onLoadMore, threshold])

  return (
    <div className={className}>
      {items.map((item, index) => (
        <div key={index}>{renderItem(item, index)}</div>
      ))}
      
      {hasMore && (
        <div ref={loadMoreRef} className="py-8 flex justify-center">
          {isLoading ? (
            loader || (
              <motion.div
                className="flex items-center space-x-2 text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-4 h-4 border-2 border-muted-foreground/30 border-t-primary rounded-full animate-spin" />
                <span className="text-sm">
                  {isMobile ? '加载中...' : '正在加载更多内容...'}
                </span>
              </motion.div>
            )
          ) : (
            <button
              onClick={onLoadMore}
              className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
            >
              加载更多
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// 性能优化的视频组件
interface LazyVideoProps {
  src: string
  poster?: string
  className?: string
  autoPlay?: boolean
  muted?: boolean
  loop?: boolean
  controls?: boolean
  preload?: 'none' | 'metadata' | 'auto'
}

export function LazyVideo({
  src,
  poster,
  className,
  autoPlay = false,
  muted = true,
  loop = false,
  controls = true,
  preload = 'metadata'
}: LazyVideoProps) {
  const [isInView, setIsInView] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const { isMobile } = useBreakpoint()
  const { isSlowConnection } = useNetworkStatus()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: isMobile ? '50px' : '100px',
        threshold: 0.1
      }
    )

    if (videoRef.current) {
      observer.observe(videoRef.current)
    }

    return () => observer.disconnect()
  }, [isMobile])

  const handleCanPlay = useCallback(() => {
    setIsLoaded(true)
  }, [])

  // 慢网络下禁用自动播放
  const shouldAutoPlay = autoPlay && !isSlowConnection && !isMobile

  return (
    <div className={cn('relative', className)} ref={videoRef}>
      {isInView && (
        <>
          {!isLoaded && (
            <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-muted-foreground/30 border-t-primary rounded-full animate-spin" />
            </div>
          )}
          
          <video
            src={src}
            poster={poster}
            className="w-full h-full"
            autoPlay={shouldAutoPlay}
            muted={muted}
            loop={loop}
            controls={controls}
            preload={isSlowConnection ? 'none' : preload}
            onCanPlay={handleCanPlay}
            playsInline
          />
        </>
      )}
    </div>
  )
}