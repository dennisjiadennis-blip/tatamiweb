'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { MobileDetection, useNetworkStatus } from './mobile-performance'

// 图片格式和配置
export interface ImageConfig {
  format: 'webp' | 'avif' | 'jpeg' | 'png'
  quality: number
  width?: number
  height?: number
  devicePixelRatio?: number
}

// 图片优化器
export class ImageOptimizer {
  private static instance: ImageOptimizer
  private supportedFormats = new Map<string, boolean>()

  static getInstance(): ImageOptimizer {
    if (!ImageOptimizer.instance) {
      ImageOptimizer.instance = new ImageOptimizer()
    }
    return ImageOptimizer.instance
  }

  async checkFormatSupport(format: string): Promise<boolean> {
    if (this.supportedFormats.has(format)) {
      return this.supportedFormats.get(format)!
    }

    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        this.supportedFormats.set(format, true)
        resolve(true)
      }
      img.onerror = () => {
        this.supportedFormats.set(format, false)
        resolve(false)
      }

      // Test images in different formats
      switch (format) {
        case 'webp':
          img.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA'
          break
        case 'avif':
          img.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAQAAAAEAAAAQcGl4aQAAAAADCAgIAAAAFmF1eEMAAAAgAAAAAQAAAAAAAAAAAGF2MUPCTmEAAA=='
          break
        case 'jpeg':
          img.src = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/AA=='
          break
        case 'png':
          img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=='
          break
        default:
          resolve(false)
      }
    })
  }

  async getBestFormat(): Promise<string> {
    // Check formats in order of preference
    const formats = ['avif', 'webp', 'jpeg']
    
    for (const format of formats) {
      if (await this.checkFormatSupport(format)) {
        return format
      }
    }
    
    return 'jpeg' // Fallback
  }

  getOptimalConfig(
    originalWidth: number,
    originalHeight: number,
    displayWidth: number,
    displayHeight: number,
    connectionType: string,
    isSlowConnection: boolean,
    devicePixelRatio: number = 1
  ): ImageConfig {
    let quality = 80
    let format: ImageConfig['format'] = 'jpeg'

    // Adjust quality based on network
    switch (connectionType) {
      case 'slow-2g':
      case '2g':
        quality = 40
        break
      case '3g':
        quality = 60
        break
      case '4g':
        quality = 75
        break
      default:
        quality = 85
        break
    }

    // Mobile optimizations
    if (MobileDetection.isMobile()) {
      quality = Math.max(quality - 10, 30)
    }

    // Slow connection override
    if (isSlowConnection) {
      quality = Math.max(quality - 20, 25)
    }

    // Calculate optimal dimensions
    const pixelRatio = Math.min(devicePixelRatio, isSlowConnection ? 1 : 2)
    const targetWidth = Math.min(displayWidth * pixelRatio, originalWidth)
    const targetHeight = Math.min(displayHeight * pixelRatio, originalHeight)

    return {
      format,
      quality,
      width: Math.round(targetWidth),
      height: Math.round(targetHeight),
      devicePixelRatio: pixelRatio
    }
  }

  buildOptimizedUrl(
    originalSrc: string, 
    config: ImageConfig,
    baseUrl?: string
  ): string {
    // This would integrate with your image CDN/service
    // Examples for popular services:
    
    if (baseUrl || originalSrc.includes('cloudinary')) {
      return this.buildCloudinaryUrl(originalSrc, config)
    }
    
    if (originalSrc.includes('imagekit')) {
      return this.buildImageKitUrl(originalSrc, config)
    }
    
    // Generic query parameter approach
    const url = new URL(originalSrc, window.location.origin)
    url.searchParams.set('f', config.format)
    url.searchParams.set('q', config.quality.toString())
    if (config.width) url.searchParams.set('w', config.width.toString())
    if (config.height) url.searchParams.set('h', config.height.toString())
    if (config.devicePixelRatio) url.searchParams.set('dpr', config.devicePixelRatio.toString())
    
    return url.toString()
  }

  private buildCloudinaryUrl(originalSrc: string, config: ImageConfig): string {
    // Cloudinary transformation URL building
    const transformations = [
      `f_${config.format}`,
      `q_${config.quality}`,
      config.width ? `w_${config.width}` : '',
      config.height ? `h_${config.height}` : '',
      config.devicePixelRatio && config.devicePixelRatio > 1 ? `dpr_${config.devicePixelRatio}` : '',
      'c_fill', // or 'c_limit' for maintaining aspect ratio
    ].filter(Boolean).join(',')
    
    return originalSrc.replace('/upload/', `/upload/${transformations}/`)
  }

  private buildImageKitUrl(originalSrc: string, config: ImageConfig): string {
    // ImageKit URL transformation
    const url = new URL(originalSrc)
    const transformations = [
      `f-${config.format}`,
      `q-${config.quality}`,
      config.width ? `w-${config.width}` : '',
      config.height ? `h-${config.height}` : '',
      config.devicePixelRatio && config.devicePixelRatio > 1 ? `dpr-${config.devicePixelRatio}` : '',
    ].filter(Boolean).join(',')
    
    url.searchParams.set('tr', transformations)
    return url.toString()
  }
}

// 图片预加载管理器
export class ImagePreloader {
  private static instance: ImagePreloader
  private cache = new Map<string, Promise<HTMLImageElement>>()
  private loadingQueue: string[] = []
  private maxConcurrentLoads = 3
  private currentLoads = 0

  static getInstance(): ImagePreloader {
    if (!ImagePreloader.instance) {
      ImagePreloader.instance = new ImagePreloader()
    }
    return ImagePreloader.instance
  }

  async preload(src: string, priority: 'high' | 'medium' | 'low' = 'medium'): Promise<HTMLImageElement> {
    if (this.cache.has(src)) {
      return this.cache.get(src)!
    }

    const loadPromise = this.createLoadPromise(src)
    this.cache.set(src, loadPromise)

    if (priority === 'high') {
      return loadPromise
    } else {
      this.loadingQueue.push(src)
      this.processQueue()
      return loadPromise
    }
  }

  private createLoadPromise(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      
      img.onload = () => {
        this.currentLoads--
        this.processQueue()
        resolve(img)
      }
      
      img.onerror = () => {
        this.currentLoads--
        this.processQueue()
        this.cache.delete(src)
        reject(new Error(`Failed to load image: ${src}`))
      }
      
      img.src = src
      this.currentLoads++
    })
  }

  private processQueue() {
    while (this.currentLoads < this.maxConcurrentLoads && this.loadingQueue.length > 0) {
      const src = this.loadingQueue.shift()!
      if (this.cache.has(src)) {
        this.cache.get(src)! // Start loading
      }
    }
  }

  clearCache() {
    this.cache.clear()
    this.loadingQueue.length = 0
  }

  setMaxConcurrentLoads(max: number) {
    this.maxConcurrentLoads = max
  }
}

// 图片懒加载观察器
export class LazyLoadObserver {
  private static instance: LazyLoadObserver
  private observer: IntersectionObserver | null = null
  private observedElements = new Set<HTMLImageElement>()

  static getInstance(): LazyLoadObserver {
    if (!LazyLoadObserver.instance) {
      LazyLoadObserver.instance = new LazyLoadObserver()
    }
    return LazyLoadObserver.instance
  }

  init(options?: IntersectionObserverInit) {
    if (this.observer) return

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            const dataSrc = img.getAttribute('data-src')
            
            if (dataSrc) {
              img.src = dataSrc
              img.removeAttribute('data-src')
              this.unobserve(img)
            }
          }
        })
      },
      {
        rootMargin: '50px',
        threshold: 0.1,
        ...options
      }
    )
  }

  observe(img: HTMLImageElement) {
    if (!this.observer) {
      this.init()
    }
    
    if (!this.observedElements.has(img)) {
      this.observer!.observe(img)
      this.observedElements.add(img)
    }
  }

  unobserve(img: HTMLImageElement) {
    if (this.observer && this.observedElements.has(img)) {
      this.observer.unobserve(img)
      this.observedElements.delete(img)
    }
  }

  disconnect() {
    if (this.observer) {
      this.observer.disconnect()
      this.observedElements.clear()
    }
  }
}

// React Hooks

// 智能图片加载 Hook
export function useOptimizedImage(
  src: string,
  dimensions?: { width: number; height: number }
) {
  const [optimizedSrc, setOptimizedSrc] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [originalDimensions, setOriginalDimensions] = useState<{width: number, height: number} | null>(null)
  
  const { connectionType, isSlowConnection } = useNetworkStatus()
  const optimizer = ImageOptimizer.getInstance()

  useEffect(() => {
    const optimizeImage = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Get image original dimensions if not provided
        if (!dimensions) {
          const img = new Image()
          img.src = src
          await new Promise((resolve, reject) => {
            img.onload = resolve
            img.onerror = reject
          })
          setOriginalDimensions({ width: img.naturalWidth, height: img.naturalHeight })
        }

        const targetDimensions = dimensions || originalDimensions || { width: 800, height: 600 }
        
        const config = optimizer.getOptimalConfig(
          targetDimensions.width,
          targetDimensions.height,
          targetDimensions.width,
          targetDimensions.height,
          connectionType,
          isSlowConnection,
          window.devicePixelRatio
        )

        const bestFormat = await optimizer.getBestFormat()
        config.format = bestFormat as ImageConfig['format']

        const optimizedUrl = optimizer.buildOptimizedUrl(src, config)
        setOptimizedSrc(optimizedUrl)
        setIsLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Image optimization failed')
        setOptimizedSrc(src) // Fallback to original
        setIsLoading(false)
      }
    }

    optimizeImage()
  }, [src, dimensions, connectionType, isSlowConnection, originalDimensions, optimizer])

  return { optimizedSrc, isLoading, error, originalDimensions }
}

// 图片预加载 Hook
export function useImagePreloader(srcs: string[], priority: 'high' | 'medium' | 'low' = 'medium') {
  const [loadedImages, setLoadedImages] = useState<string[]>([])
  const [failedImages, setFailedImages] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  const preloader = ImagePreloader.getInstance()

  useEffect(() => {
    const preloadImages = async () => {
      setIsLoading(true)
      setLoadedImages([])
      setFailedImages([])

      const results = await Promise.allSettled(
        srcs.map(src => preloader.preload(src, priority))
      )

      const loaded: string[] = []
      const failed: string[] = []

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          loaded.push(srcs[index])
        } else {
          failed.push(srcs[index])
        }
      })

      setLoadedImages(loaded)
      setFailedImages(failed)
      setIsLoading(false)
    }

    if (srcs.length > 0) {
      preloadImages()
    }
  }, [srcs, priority, preloader])

  return { loadedImages, failedImages, isLoading }
}

// 响应式图片尺寸 Hook
export function useResponsiveImageSizes(
  baseWidth: number,
  aspectRatio: number = 16 / 9
) {
  const [sizes, setSizes] = useState<{
    mobile: { width: number; height: number }
    tablet: { width: number; height: number }
    desktop: { width: number; height: number }
  }>({
    mobile: { width: baseWidth * 0.5, height: (baseWidth * 0.5) / aspectRatio },
    tablet: { width: baseWidth * 0.75, height: (baseWidth * 0.75) / aspectRatio },
    desktop: { width: baseWidth, height: baseWidth / aspectRatio }
  })

  const { isSlowConnection } = useNetworkStatus()

  useEffect(() => {
    const calculateSizes = () => {
      const screenWidth = window.innerWidth
      let scaleFactor = 1

      if (isSlowConnection) {
        scaleFactor = 0.7 // Reduce image size for slow connections
      }

      if (screenWidth < 768) {
        // Mobile
        const width = Math.min(screenWidth * 0.9 * scaleFactor, baseWidth * 0.6)
        setSizes(prev => ({
          ...prev,
          mobile: { width, height: width / aspectRatio }
        }))
      } else if (screenWidth < 1024) {
        // Tablet
        const width = Math.min(screenWidth * 0.8 * scaleFactor, baseWidth * 0.8)
        setSizes(prev => ({
          ...prev,
          tablet: { width, height: width / aspectRatio }
        }))
      } else {
        // Desktop
        const width = baseWidth * scaleFactor
        setSizes(prev => ({
          ...prev,
          desktop: { width, height: width / aspectRatio }
        }))
      }
    }

    calculateSizes()
    window.addEventListener('resize', calculateSizes)
    
    return () => window.removeEventListener('resize', calculateSizes)
  }, [baseWidth, aspectRatio, isSlowConnection])

  return sizes
}

// 图片性能监控 Hook
export function useImagePerformanceMonitor() {
  const [metrics, setMetrics] = useState({
    totalImages: 0,
    loadedImages: 0,
    failedImages: 0,
    averageLoadTime: 0,
    totalBytes: 0
  })

  const trackImageLoad = useCallback((src: string, loadTime: number, bytes?: number) => {
    setMetrics(prev => ({
      totalImages: prev.totalImages + 1,
      loadedImages: prev.loadedImages + 1,
      failedImages: prev.failedImages,
      averageLoadTime: ((prev.averageLoadTime * prev.loadedImages) + loadTime) / (prev.loadedImages + 1),
      totalBytes: prev.totalBytes + (bytes || 0)
    }))
  }, [])

  const trackImageError = useCallback((src: string) => {
    setMetrics(prev => ({
      ...prev,
      totalImages: prev.totalImages + 1,
      failedImages: prev.failedImages + 1
    }))
  }, [])

  const resetMetrics = useCallback(() => {
    setMetrics({
      totalImages: 0,
      loadedImages: 0,
      failedImages: 0,
      averageLoadTime: 0,
      totalBytes: 0
    })
  }, [])

  return { metrics, trackImageLoad, trackImageError, resetMetrics }
}