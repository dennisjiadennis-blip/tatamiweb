'use client'

import React, { useEffect, useState, useCallback, useRef } from 'react'
import { logger } from '@/lib/logger'

// 移动端性能监控工具
export class MobilePerformanceMonitor {
  private static instance: MobilePerformanceMonitor
  private metrics: Map<string, number> = new Map()
  private startTimes: Map<string, number> = new Map()

  static getInstance() {
    if (!MobilePerformanceMonitor.instance) {
      MobilePerformanceMonitor.instance = new MobilePerformanceMonitor()
    }
    return MobilePerformanceMonitor.instance
  }

  // 开始性能测量
  startMeasure(name: string) {
    this.startTimes.set(name, performance.now())
  }

  // 结束性能测量
  endMeasure(name: string) {
    const startTime = this.startTimes.get(name)
    if (startTime) {
      const duration = performance.now() - startTime
      this.metrics.set(name, duration)
      this.startTimes.delete(name)
      
      // 在开发环境输出性能数据
      if (process.env.NODE_ENV === 'development') {
        logger.info(`Mobile Performance: ${name} took ${duration.toFixed(2)}ms`)
      }
      
      return duration
    }
    return 0
  }

  // 获取所有性能指标
  getMetrics() {
    return Object.fromEntries(this.metrics)
  }

  // 清除指标
  clearMetrics() {
    this.metrics.clear()
    this.startTimes.clear()
  }
}

// 移动端设备检测工具
export const MobileDetection = {
  // 检测是否为移动设备
  isMobile: () => {
    if (typeof window === 'undefined') return false
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  },

  // 检测是否为iOS设备
  isIOS: () => {
    if (typeof window === 'undefined') return false
    return /iPad|iPhone|iPod/.test(navigator.userAgent)
  },

  // 检测是否为Android设备
  isAndroid: () => {
    if (typeof window === 'undefined') return false
    return /Android/.test(navigator.userAgent)
  },

  // 检测是否为触摸设备
  isTouchDevice: () => {
    if (typeof window === 'undefined') return false
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0
  },

  // 获取设备像素比
  getDevicePixelRatio: () => {
    if (typeof window === 'undefined') return 1
    return window.devicePixelRatio || 1
  },

  // 检测网络连接类型
  getConnectionType: () => {
    if (typeof navigator === 'undefined' || !('connection' in navigator)) return 'unknown'
    const connection = (navigator as Navigator & {
      connection?: {
        effectiveType?: string
      }
    }).connection
    return connection?.effectiveType || 'unknown'
  },

  // 检测是否为慢网络
  isSlowConnection: () => {
    const connectionType = MobileDetection.getConnectionType()
    return ['slow-2g', '2g'].includes(connectionType)
  }
}

// Bundle大小分析工具
export const BundleAnalyzer = {
  // 组件延迟加载工具
  createLazyComponent: <T extends object>(
    importFn: () => Promise<{ default: React.ComponentType<T> }>,
    fallback?: React.ReactNode
  ): React.ComponentType<T> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const LazyComponent = React.lazy(importFn as any)
    
    return (props: T) => (
      // @ts-expect-error - React types issue
      React.createElement(React.Suspense, 
        { fallback: fallback || React.createElement('div', null, 'Loading...') },
        React.createElement(LazyComponent, props)
      )
    )
  },

  // 预加载关键资源
  preloadResource: (href: string, as: string = 'script') => {
    if (typeof document === 'undefined') return

    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = href
    link.as = as
    document.head.appendChild(link)
  },

  // 延迟加载非关键资源
  loadResourceLazily: (href: string, type: 'script' | 'style' = 'script') => {
    if (typeof document === 'undefined') return Promise.resolve()

    return new Promise((resolve, reject) => {
      if (type === 'script') {
        const script = document.createElement('script')
        script.src = href
        script.onload = resolve
        script.onerror = reject
        document.body.appendChild(script)
      } else {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = href
        link.onload = resolve
        link.onerror = reject
        document.head.appendChild(link)
      }
    })
  }
}

// 内存优化工具
export const MemoryOptimizer = {
  // 防抖函数优化版
  debounce: <T extends (...args: never[]) => unknown>(
    func: T,
    wait: number,
    immediate = false
  ): T => {
    let timeout: NodeJS.Timeout | null = null
    
    return ((...args: Parameters<T>) => {
      const callNow = immediate && !timeout
      
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(() => {
        timeout = null
        if (!immediate) func(...args)
      }, wait)
      
      if (callNow) func(...args)
    }) as T
  },

  // 节流函数优化版
  throttle: <T extends (...args: never[]) => unknown>(
    func: T,
    limit: number
  ): T => {
    let inThrottle = false
    
    return ((...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }) as T
  },

  // 清理未使用的事件监听器
  cleanupEventListeners: (element: Element | Window, events: string[]) => {
    events.forEach(event => {
      const listeners = (element as any)._listeners?.[event]
      if (listeners) {
        listeners.forEach((listener: EventListener) => {
          element.removeEventListener(event, listener)
        })
      }
    })
  }
}

// React hooks for mobile performance
// React is already imported at the top of the file

// 使用防抖的hook
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// 使用节流的hook
export function useThrottle<T>(value: T, limit: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value)
  const lastRan = useRef<number>(Date.now())

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value)
        lastRan.current = Date.now()
      }
    }, limit - (Date.now() - lastRan.current))

    return () => {
      clearTimeout(handler)
    }
  }, [value, limit])

  return throttledValue
}

// 移动端内存使用监控hook
export function useMemoryMonitor() {
  const [memoryInfo, setMemoryInfo] = useState<{
    usedJSHeapSize?: number
    totalJSHeapSize?: number
    jsHeapSizeLimit?: number
  } | null>(null)

  useEffect(() => {
    const updateMemoryInfo = () => {
      if ('memory' in performance) {
        setMemoryInfo((performance as Performance & {
          memory?: {
            usedJSHeapSize: number
            totalJSHeapSize: number
            jsHeapSizeLimit: number
          }
        }).memory)
      }
    }

    updateMemoryInfo()
    const interval = setInterval(updateMemoryInfo, 5000) // 每5秒更新一次

    return () => clearInterval(interval)
  }, [])

  return memoryInfo
}

// 网络状态监控hook
export function useNetworkStatus() {
  const [networkStatus, setNetworkStatus] = useState({
    online: typeof navigator !== 'undefined' ? navigator.onLine : true,
    connectionType: MobileDetection.getConnectionType(),
    isSlowConnection: MobileDetection.isSlowConnection()
  })

  useEffect(() => {
    const updateNetworkStatus = () => {
      setNetworkStatus({
        online: navigator.onLine,
        connectionType: MobileDetection.getConnectionType(),
        isSlowConnection: MobileDetection.isSlowConnection()
      })
    }

    window.addEventListener('online', updateNetworkStatus)
    window.addEventListener('offline', updateNetworkStatus)

    if ('connection' in navigator) {
      (navigator as any).connection.addEventListener('change', updateNetworkStatus)
    }

    return () => {
      window.removeEventListener('online', updateNetworkStatus)
      window.removeEventListener('offline', updateNetworkStatus)
      
      if ('connection' in navigator) {
        (navigator as any).connection.removeEventListener('change', updateNetworkStatus)
      }
    }
  }, [])

  return networkStatus
}

// 性能测量hook
export function usePerformanceMeasure(name: string) {
  const monitor = MobilePerformanceMonitor.getInstance()

  const startMeasure = useCallback(() => {
    monitor.startMeasure(name)
  }, [monitor, name])

  const endMeasure = useCallback(() => {
    return monitor.endMeasure(name)
  }, [monitor, name])

  return { startMeasure, endMeasure }
}

// 滚动性能优化hook
export function useOptimizedScroll(threshold: number = 100) {
  const [isScrolling, setIsScrolling] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const scrollTimeout = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const handleScroll = MemoryOptimizer.throttle(() => {
      setScrollY(window.scrollY)
      setIsScrolling(true)

      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current)
      }

      scrollTimeout.current = setTimeout(() => {
        setIsScrolling(false)
      }, 150)
    }, 16) // 约60fps

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current)
      }
    }
  }, [])

  return {
    isScrolling,
    scrollY,
    isNearTop: scrollY < threshold,
    isScrollingDown: scrollY > threshold
  }
}

// 移动端触摸优化工具
export const TouchOptimizer = {
  // 防止iOS橡皮筋效果
  preventBounce: () => {
    if (typeof document === 'undefined') return

    document.addEventListener('touchmove', (e) => {
      e.preventDefault()
    }, { passive: false })
  },

  // 允许特定元素滚动
  allowScroll: (selector: string) => {
    if (typeof document === 'undefined') return

    const elements = document.querySelectorAll(selector)
    elements.forEach(element => {
      element.addEventListener('touchmove', (e) => {
        e.stopPropagation()
      }, { passive: true })
    })
  },

  // 优化点击延迟
  optimizeClickDelay: () => {
    if (typeof document === 'undefined') return

    const meta = document.createElement('meta')
    meta.name = 'viewport'
    meta.content = 'width=device-width, initial-scale=1, user-scalable=no'
    document.head.appendChild(meta)

    // 添加touch-action CSS
    const style = document.createElement('style')
    style.textContent = `
      * {
        touch-action: manipulation;
      }
      .touch-pan-y {
        touch-action: pan-y;
      }
      .touch-pan-x {
        touch-action: pan-x;
      }
      .touch-none {
        touch-action: none;
      }
    `
    document.head.appendChild(style)
  }
}

// 移动端资源加载优化
export const ResourceOptimizer = {
  // 图片懒加载观察器
  createImageLazyLoader: (options?: IntersectionObserverInit) => {
    if (typeof window === 'undefined') return null

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement
          const dataSrc = img.getAttribute('data-src')
          
          if (dataSrc) {
            img.src = dataSrc
            img.removeAttribute('data-src')
            observer.unobserve(img)
          }
        }
      })
    }, {
      rootMargin: '50px',
      threshold: 0.1,
      ...options
    })

    return observer
  },

  // 预加载关键字体
  preloadFonts: (fontUrls: string[]) => {
    if (typeof document === 'undefined') return

    fontUrls.forEach(url => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = url
      link.as = 'font'
      link.type = 'font/woff2'
      link.crossOrigin = 'anonymous'
      document.head.appendChild(link)
    })
  },

  // 优化图片质量基于网络条件
  getOptimalImageQuality: () => {
    const connection = MobileDetection.getConnectionType()
    const devicePixelRatio = MobileDetection.getDevicePixelRatio()
    
    let quality = 80
    
    if (MobileDetection.isSlowConnection()) {
      quality = 50
    } else if (connection === '3g') {
      quality = 65
    } else if (devicePixelRatio > 2) {
      quality = 90
    }
    
    return quality
  }
}