'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useBreakpoint } from '@/lib/responsive'
import { 
  useOptimizedImage, 
  useResponsiveImageSizes, 
  useImagePerformanceMonitor,
  LazyLoadObserver,
  ImagePreloader
} from '@/lib/image-optimization'
import { useNetworkStatus } from '@/lib/mobile-performance'

interface OptimizedImageProps {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
  aspectRatio?: number
  priority?: boolean
  lazy?: boolean
  placeholder?: 'blur' | 'skeleton' | 'none'
  blurDataURL?: string
  sizes?: string
  onLoad?: () => void
  onError?: (error: string) => void
  quality?: number
  format?: 'auto' | 'webp' | 'avif' | 'jpeg' | 'png'
  showLoadingIndicator?: boolean
  enableProgressiveLoad?: boolean
}

export function OptimizedImage({
  src,
  alt,
  className,
  width,
  height,
  aspectRatio = 16 / 9,
  priority = false,
  lazy = true,
  placeholder = 'skeleton',
  blurDataURL,
  sizes,
  onLoad,
  onError,
  quality = 80,
  format = 'auto',
  showLoadingIndicator = true,
  enableProgressiveLoad = true
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(priority)
  const [hasError, setHasError] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  
  const imgRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const { isMobile } = useBreakpoint()
  const { isSlowConnection } = useNetworkStatus()
  const { trackImageLoad, trackImageError } = useImagePerformanceMonitor()
  
  const dimensions = width && height ? { width, height } : undefined
  const { optimizedSrc, isLoading, error } = useOptimizedImage(src, dimensions)
  
  const responsiveSizes = useResponsiveImageSizes(width || 800, aspectRatio)

  // 懒加载设置
  useEffect(() => {
    if (priority || !lazy) {
      setIsInView(true)
      return
    }

    const observer = LazyLoadObserver.getInstance()
    observer.init({
      rootMargin: isMobile ? '100px' : '200px',
      threshold: 0.1
    })

    const currentContainer = containerRef.current
    if (currentContainer) {
      const intersectionObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            intersectionObserver.disconnect()
          }
        },
        {
          rootMargin: isMobile ? '100px' : '200px',
          threshold: 0.1
        }
      )

      intersectionObserver.observe(currentContainer)
      
      return () => {
        intersectionObserver.disconnect()
      }
    }
  }, [priority, lazy, isMobile])

  // 渐进式加载
  useEffect(() => {
    if (!isInView || !optimizedSrc || !enableProgressiveLoad) return

    const img = new Image()
    const startTime = performance.now()

    // 模拟加载进度
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => Math.min(prev + Math.random() * 30, 90))
    }, 100)

    img.onload = () => {
      clearInterval(progressInterval)
      setLoadingProgress(100)
      
      const loadTime = performance.now() - startTime
      trackImageLoad(src, loadTime)
      
      setTimeout(() => {
        setIsLoaded(true)
        onLoad?.()
      }, 100)
    }

    img.onerror = () => {
      clearInterval(progressInterval)
      setHasError(true)
      trackImageError(src)
      onError?.('Image failed to load')
    }

    // 预加载图片
    if (priority) {
      const preloader = ImagePreloader.getInstance()
      preloader.preload(optimizedSrc, 'high').then(() => {
        img.src = optimizedSrc
      }).catch(() => {
        img.src = optimizedSrc // Still try to load directly
      })
    } else {
      img.src = optimizedSrc
    }

    return () => {
      clearInterval(progressInterval)
    }
  }, [isInView, optimizedSrc, enableProgressiveLoad, priority, src, trackImageLoad, trackImageError, onLoad, onError])

  const handleImageLoad = useCallback(() => {
    setIsLoaded(true)
    onLoad?.()
  }, [onLoad])

  const handleImageError = useCallback(() => {
    setHasError(true)
    onError?.('Image failed to load')
  }, [onError])

  if (error && !optimizedSrc) {
    return (
      <div className={cn(
        'flex items-center justify-center bg-muted text-muted-foreground',
        className
      )}>
        <div className="text-center space-y-2">
          <div className="text-2xl">⚠️</div>
          <p className="text-sm">图片加载失败</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      ref={containerRef}
      className={cn('relative overflow-hidden', className)}
      style={{
        aspectRatio: aspectRatio ? `${aspectRatio}` : undefined,
        width: width ? `${width}px` : undefined,
        height: height ? `${height}px` : undefined,
      }}
    >
      {/* 占位符 */}
      <AnimatePresence>
        {!isLoaded && isInView && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {placeholder === 'blur' && blurDataURL ? (
              <img
                src={blurDataURL}
                alt=""
                className="w-full h-full object-cover filter blur-sm scale-110"
              />
            ) : placeholder === 'skeleton' ? (
              <div className="w-full h-full bg-gradient-to-r from-muted via-muted/50 to-muted animate-pulse">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
              </div>
            ) : null}

            {/* 加载指示器 */}
            {showLoadingIndicator && isInView && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black/50 rounded-full p-2">
                  {enableProgressiveLoad ? (
                    <div className="relative w-8 h-8">
                      <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 32 32">
                        <circle
                          cx="16"
                          cy="16"
                          r="14"
                          stroke="white"
                          strokeOpacity="0.2"
                          strokeWidth="2"
                          fill="transparent"
                        />
                        <circle
                          cx="16"
                          cy="16"
                          r="14"
                          stroke="white"
                          strokeWidth="2"
                          fill="transparent"
                          strokeDasharray={`${2 * Math.PI * 14}`}
                          strokeDashoffset={`${2 * Math.PI * 14 * (1 - loadingProgress / 100)}`}
                          className="transition-all duration-300 ease-out"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-mono">
                        {Math.round(loadingProgress)}
                      </div>
                    </div>
                  ) : (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 实际图片 */}
      {isInView && optimizedSrc && (
        <motion.img
          ref={imgRef}
          src={optimizedSrc}
          alt={alt}
          className={cn(
            'w-full h-full object-cover',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
          loading={priority ? 'eager' : 'lazy'}
          sizes={sizes}
          onLoad={handleImageLoad}
          onError={handleImageError}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      )}

      {/* 错误状态 */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="text-center text-muted-foreground">
            <div className="text-2xl mb-2">🖼️</div>
            <p className="text-sm">图片无法显示</p>
            {!isSlowConnection && (
              <button
                onClick={() => {
                  setHasError(false)
                  setIsLoaded(false)
                  setLoadingProgress(0)
                }}
                className="text-xs text-primary hover:underline mt-1"
              >
                重试
              </button>
            )}
          </div>
        </div>
      )}

      {/* 网络状态指示 */}
      {isSlowConnection && isLoading && (
        <div className="absolute top-2 right-2 bg-yellow-500/90 text-black text-xs px-2 py-1 rounded">
          慢网络
        </div>
      )}

      {/* 开发环境信息 */}
      {process.env.NODE_ENV === 'development' && isLoaded && (
        <div className="absolute bottom-0 left-0 bg-black/80 text-white text-xs p-1 max-w-full truncate">
          {width && height ? `${width}×${height}` : 'Auto'} | {format} | Q{quality}
        </div>
      )}
    </div>
  )
}

// 图片画廊组件
interface OptimizedImageGalleryProps {
  images: Array<{
    src: string
    alt: string
    caption?: string
    width?: number
    height?: number
  }>
  className?: string
  columns?: { mobile: number; tablet: number; desktop: number }
  gap?: number
  aspectRatio?: number
  lazy?: boolean
  onImageClick?: (image: any, index: number) => void
}

export function OptimizedImageGallery({
  images,
  className,
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 4,
  aspectRatio = 1,
  lazy = true,
  onImageClick
}: OptimizedImageGalleryProps) {
  const { isMobile, isTablet } = useBreakpoint()
  const [loadedCount, setLoadedCount] = useState(0)
  const [visibleImages, setVisibleImages] = useState<number[]>([])

  // 计算当前应显示的列数
  const currentColumns = isMobile 
    ? columns.mobile 
    : isTablet 
    ? columns.tablet 
    : columns.desktop

  // 渐进式显示图片
  useEffect(() => {
    const showImages = () => {
      const newVisible = []
      const batchSize = currentColumns * 2 // 每次显示两行
      
      for (let i = 0; i < Math.min(images.length, loadedCount + batchSize); i++) {
        newVisible.push(i)
      }
      
      setVisibleImages(newVisible)
    }

    showImages()
  }, [loadedCount, images.length, currentColumns])

  const handleImageLoad = useCallback((index: number) => {
    setLoadedCount(prev => Math.max(prev, index + 1))
  }, [])

  return (
    <div className={className}>
      <div 
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${currentColumns}, 1fr)`,
          gap: `${gap * 0.25}rem`
        }}
      >
        {images.map((image, index) => (
          <motion.div
            key={index}
            className="relative cursor-pointer group"
            style={{ aspectRatio }}
            onClick={() => onImageClick?.(image, index)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: visibleImages.includes(index) ? 1 : 0,
              y: visibleImages.includes(index) ? 0 : 20
            }}
            transition={{ 
              duration: 0.5, 
              delay: index * 0.1,
              ease: 'easeOut'
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <OptimizedImage
              src={image.src}
              alt={image.alt}
              className="w-full h-full rounded-lg overflow-hidden"
              aspectRatio={aspectRatio}
              lazy={lazy && !visibleImages.includes(index)}
              priority={index < currentColumns} // 首行图片优先加载
              onLoad={() => handleImageLoad(index)}
              showLoadingIndicator={false}
            />
            
            {/* 悬停效果 */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 rounded-lg" />
            
            {/* 标题 */}
            {image.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 rounded-b-lg">
                <p className="text-white text-sm truncate">{image.caption}</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* 加载更多指示器 */}
      {visibleImages.length < images.length && (
        <div className="flex justify-center mt-8">
          <motion.div
            className="flex items-center space-x-2 text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-4 h-4 border-2 border-muted-foreground/30 border-t-primary rounded-full animate-spin" />
            <span className="text-sm">加载更多图片...</span>
          </motion.div>
        </div>
      )}
    </div>
  )
}

// 自适应图片轮播
interface OptimizedImageCarouselProps {
  images: Array<{
    src: string
    alt: string
    caption?: string
  }>
  className?: string
  autoPlay?: boolean
  interval?: number
  aspectRatio?: number
  showThumbnails?: boolean
  showIndicators?: boolean
}

export function OptimizedImageCarousel({
  images,
  className,
  autoPlay = false,
  interval = 5000,
  aspectRatio = 16 / 9,
  showThumbnails = true,
  showIndicators = true
}: OptimizedImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const { isSlowConnection } = useNetworkStatus()
  const { isMobile } = useBreakpoint()

  // 自动播放
  useEffect(() => {
    if (!isPlaying || isSlowConnection) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, interval)

    return () => clearInterval(timer)
  }, [isPlaying, images.length, interval, isSlowConnection])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* 主图片 */}
      <div className="relative" style={{ aspectRatio }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className="absolute inset-0"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            <OptimizedImage
              src={images[currentIndex].src}
              alt={images[currentIndex].alt}
              className="w-full h-full rounded-lg"
              aspectRatio={aspectRatio}
              priority={true}
            />
          </motion.div>
        </AnimatePresence>

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

        {/* 播放/暂停按钮 */}
        {autoPlay && (
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="absolute bottom-2 right-2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>
        )}

        {/* 标题 */}
        {images[currentIndex].caption && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 rounded-b-lg">
            <p className="text-white text-sm">{images[currentIndex].caption}</p>
          </div>
        )}
      </div>

      {/* 指示器 */}
      {showIndicators && images.length > 1 && (
        <div className="flex justify-center space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                'w-2 h-2 rounded-full transition-colors',
                index === currentIndex ? 'bg-primary' : 'bg-muted-foreground/30'
              )}
            />
          ))}
        </div>
      )}

      {/* 缩略图 */}
      {showThumbnails && !isMobile && images.length > 1 && (
        <div className="grid grid-cols-6 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                'relative aspect-square rounded overflow-hidden border-2 transition-colors',
                index === currentIndex ? 'border-primary' : 'border-transparent hover:border-muted-foreground'
              )}
            >
              <OptimizedImage
                src={image.src}
                alt={image.alt}
                className="w-full h-full"
                aspectRatio={1}
                lazy={Math.abs(index - currentIndex) > 2}
                showLoadingIndicator={false}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}