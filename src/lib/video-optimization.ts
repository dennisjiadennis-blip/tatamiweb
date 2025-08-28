'use client'

import { useEffect, useState, useCallback } from 'react'
import { logger } from '@/lib/logger'
import { MobileDetection, useNetworkStatus } from './mobile-performance'

// 视频质量配置
export interface VideoQualityConfig {
  resolution: string
  bitrate: number
  fps: number
  format: string
  size: number // 预估大小 MB
}

// 视频格式支持检测
export class VideoFormatDetector {
  private static supportCache = new Map<string, boolean>()

  static async checkSupport(format: string): Promise<boolean> {
    if (this.supportCache.has(format)) {
      return this.supportCache.get(format)!
    }

    const video = document.createElement('video')
    const canPlay = video.canPlayType(format)
    const isSupported = canPlay === 'probably' || canPlay === 'maybe'
    
    this.supportCache.set(format, isSupported)
    return isSupported
  }

  static async getOptimalFormat(): Promise<string> {
    const formats = [
      'video/webm; codecs="vp9,opus"',
      'video/webm; codecs="vp8,vorbis"',
      'video/mp4; codecs="avc1.42E01E,mp4a.40.2"',
      'video/mp4; codecs="hvc1.1.6.L93.B0"', // HEVC/H.265
      'video/ogg; codecs="theora,vorbis"'
    ]

    for (const format of formats) {
      if (await this.checkSupport(format)) {
        return format.split(';')[0].replace('video/', '')
      }
    }

    return 'mp4' // 默认回退
  }
}

// 智能视频质量选择器
export class SmartVideoQualitySelector {
  private static instance: SmartVideoQualitySelector
  private qualityConfigs: VideoQualityConfig[] = [
    { resolution: '4K', bitrate: 15000, fps: 30, format: 'mp4', size: 50 },
    { resolution: '1080p', bitrate: 8000, fps: 30, format: 'mp4', size: 25 },
    { resolution: '720p', bitrate: 4000, fps: 30, format: 'mp4', size: 12 },
    { resolution: '480p', bitrate: 2000, fps: 30, format: 'mp4', size: 6 },
    { resolution: '360p', bitrate: 1000, fps: 30, format: 'mp4', size: 3 },
    { resolution: '240p', bitrate: 500, fps: 30, format: 'mp4', size: 1.5 }
  ]

  static getInstance(): SmartVideoQualitySelector {
    if (!SmartVideoQualitySelector.instance) {
      SmartVideoQualitySelector.instance = new SmartVideoQualitySelector()
    }
    return SmartVideoQualitySelector.instance
  }

  selectOptimalQuality(
    connectionType: string,
    devicePixelRatio: number,
    screenWidth: number,
    isSlowConnection: boolean,
    batteryLevel?: number
  ): VideoQualityConfig {
    let targetQuality = this.qualityConfigs[1] // 默认 1080p

    // 基于网络连接选择
    switch (connectionType) {
      case 'slow-2g':
      case '2g':
        targetQuality = this.qualityConfigs[5] // 240p
        break
      case '3g':
        targetQuality = this.qualityConfigs[4] // 360p
        break
      case '4g':
        targetQuality = this.qualityConfigs[3] // 480p
        break
      default:
        targetQuality = this.qualityConfigs[2] // 720p
        break
    }

    // 基于屏幕尺寸调整
    if (screenWidth >= 2560) {
      targetQuality = this.qualityConfigs[0] // 4K
    } else if (screenWidth >= 1920) {
      targetQuality = this.qualityConfigs[1] // 1080p
    } else if (screenWidth >= 1280) {
      targetQuality = this.qualityConfigs[2] // 720p
    } else if (screenWidth >= 800) {
      targetQuality = this.qualityConfigs[3] // 480p
    }

    // 移动设备优化
    if (MobileDetection.isMobile()) {
      const mobileIndex = Math.min(
        this.qualityConfigs.findIndex(config => config.resolution === targetQuality.resolution) + 1,
        this.qualityConfigs.length - 1
      )
      targetQuality = this.qualityConfigs[mobileIndex]
    }

    // 低电量优化
    if (batteryLevel && batteryLevel < 0.2) {
      const lowBatteryIndex = Math.min(
        this.qualityConfigs.findIndex(config => config.resolution === targetQuality.resolution) + 2,
        this.qualityConfigs.length - 1
      )
      targetQuality = this.qualityConfigs[lowBatteryIndex]
    }

    // 慢网络强制降级
    if (isSlowConnection) {
      targetQuality = this.qualityConfigs[Math.max(4, this.qualityConfigs.length - 1)]
    }

    return targetQuality
  }

  getAllQualities(): VideoQualityConfig[] {
    return [...this.qualityConfigs]
  }
}

// 视频预加载管理器
export class VideoPreloadManager {
  private static instance: VideoPreloadManager
  private preloadedVideos = new Map<string, HTMLVideoElement>()
  private preloadQueue: string[] = []
  private maxPreloadedVideos = 3
  private isPreloading = false

  static getInstance(): VideoPreloadManager {
    if (!VideoPreloadManager.instance) {
      VideoPreloadManager.instance = new VideoPreloadManager()
    }
    return VideoPreloadManager.instance
  }

  async preloadVideo(
    src: string, 
    quality: VideoQualityConfig,
    priority: 'high' | 'medium' | 'low' = 'medium'
  ): Promise<HTMLVideoElement> {
    // 检查是否已经预加载
    if (this.preloadedVideos.has(src)) {
      return this.preloadedVideos.get(src)!
    }

    // 检查网络条件
    const connection = (navigator as Navigator & {
      connection?: {
        saveData?: boolean
        effectiveType?: string
      }
    }).connection
    if (connection && connection.saveData) {
      throw new Error('Data saver mode enabled, skipping preload')
    }

    const video = document.createElement('video')
    video.preload = 'metadata'
    video.muted = true
    video.playsInline = true

    // 根据优先级决定预加载策略
    switch (priority) {
      case 'high':
        video.preload = 'auto'
        break
      case 'medium':
        video.preload = 'metadata'
        break
      case 'low':
        video.preload = 'none'
        break
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Video preload timeout'))
      }, 10000)

      video.addEventListener('canplaythrough', () => {
        clearTimeout(timeout)
        this.addToCache(src, video)
        resolve(video)
      }, { once: true })

      video.addEventListener('error', () => {
        clearTimeout(timeout)
        reject(new Error('Video preload failed'))
      }, { once: true })

      video.src = src
    })
  }

  private addToCache(src: string, video: HTMLVideoElement) {
    // 管理缓存大小
    if (this.preloadedVideos.size >= this.maxPreloadedVideos) {
      const firstKey = this.preloadedVideos.keys().next().value
      const firstVideo = this.preloadedVideos.get(firstKey)
      if (firstVideo) {
        firstVideo.src = ''
        firstVideo.remove()
      }
      this.preloadedVideos.delete(firstKey)
    }

    this.preloadedVideos.set(src, video)
  }

  getPreloadedVideo(src: string): HTMLVideoElement | null {
    return this.preloadedVideos.get(src) || null
  }

  clearCache() {
    this.preloadedVideos.forEach(video => {
      video.src = ''
      video.remove()
    })
    this.preloadedVideos.clear()
  }

  setMaxPreloadedVideos(max: number) {
    this.maxPreloadedVideos = max
  }
}

// 视频流优化器
export class VideoStreamOptimizer {
  private static instance: VideoStreamOptimizer
  private adaptiveBitrate = true
  private qualityLevels: VideoQualityConfig[] = []
  private currentQualityIndex = 0

  static getInstance(): VideoStreamOptimizer {
    if (!VideoStreamOptimizer.instance) {
      VideoStreamOptimizer.instance = new VideoStreamOptimizer()
    }
    return VideoStreamOptimizer.instance
  }

  initializeAdaptiveStreaming(
    video: HTMLVideoElement,
    qualityLevels: VideoQualityConfig[]
  ) {
    this.qualityLevels = qualityLevels
    this.currentQualityIndex = Math.floor(qualityLevels.length / 2) // 从中等质量开始

    if (!this.adaptiveBitrate) return

    // 监控播放质量
    this.monitorPlaybackQuality(video)
  }

  private monitorPlaybackQuality(video: HTMLVideoElement) {
    let lastTime = 0
    let stalls = 0
    
    const checkQuality = () => {
      if (video.currentTime === lastTime && !video.paused && !video.ended) {
        stalls++
        
        // 如果缓冲过多，降低质量
        if (stalls > 2 && this.currentQualityIndex < this.qualityLevels.length - 1) {
          this.switchQuality(video, this.currentQualityIndex + 1)
          stalls = 0
        }
      } else {
        // 播放流畅，可以尝试提升质量
        if (stalls === 0 && this.currentQualityIndex > 0) {
          const bufferHealth = this.getBufferHealth(video)
          if (bufferHealth > 10) { // 10秒以上缓冲
            this.switchQuality(video, this.currentQualityIndex - 1)
          }
        }
        stalls = 0
      }
      
      lastTime = video.currentTime
      
      if (!video.ended) {
        setTimeout(checkQuality, 2000) // 每2秒检查一次
      }
    }

    checkQuality()
  }

  private getBufferHealth(video: HTMLVideoElement): number {
    if (video.buffered.length === 0) return 0
    
    const currentTime = video.currentTime
    const bufferedEnd = video.buffered.end(video.buffered.length - 1)
    
    return bufferedEnd - currentTime
  }

  private switchQuality(video: HTMLVideoElement, newQualityIndex: number) {
    if (newQualityIndex < 0 || newQualityIndex >= this.qualityLevels.length) return
    
    const currentTime = video.currentTime
    const wasPlaying = !video.paused
    
    this.currentQualityIndex = newQualityIndex
    const newQuality = this.qualityLevels[newQualityIndex]
    
    // 这里需要根据实际的视频源结构来切换
    // 假设视频源URL包含质量参数
    const newSrc = this.buildVideoSrc(video.src, newQuality)
    
    video.src = newSrc
    video.currentTime = currentTime
    
    if (wasPlaying) {
      video.play()
    }

    logger.info(`Video quality switched to: ${newQuality.resolution}`)
  }

  private buildVideoSrc(originalSrc: string, quality: VideoQualityConfig): string {
    // 根据实际的CDN或视频服务来构建URL
    const url = new URL(originalSrc)
    url.searchParams.set('quality', quality.resolution.toLowerCase())
    url.searchParams.set('bitrate', quality.bitrate.toString())
    return url.toString()
  }

  enableAdaptiveBitrate(enabled: boolean) {
    this.adaptiveBitrate = enabled
  }

  getCurrentQuality(): VideoQualityConfig | null {
    return this.qualityLevels[this.currentQualityIndex] || null
  }
}

// React Hooks

// 智能视频加载 Hook
export function useSmartVideoLoader(src: string, options: {
  autoQuality?: boolean
  preload?: boolean
  priority?: 'high' | 'medium' | 'low'
} = {}) {
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentQuality, setCurrentQuality] = useState<VideoQualityConfig | null>(null)
  
  const { connectionType, isSlowConnection } = useNetworkStatus()
  const qualitySelector = SmartVideoQualitySelector.getInstance()
  const preloadManager = VideoPreloadManager.getInstance()

  useEffect(() => {
    const loadVideo = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // 选择最佳质量
        if (options.autoQuality) {
          const optimalQuality = qualitySelector.selectOptimalQuality(
            connectionType,
            window.devicePixelRatio,
            window.innerWidth,
            isSlowConnection
          )
          setCurrentQuality(optimalQuality)
        }

        // 预加载视频
        if (options.preload && !isSlowConnection) {
          const video = await preloadManager.preloadVideo(
            src, 
            currentQuality || qualitySelector.getAllQualities()[2],
            options.priority
          )
          setVideoElement(video)
        }

        setIsLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load video')
        setIsLoading(false)
      }
    }

    loadVideo()
  }, [src, connectionType, isSlowConnection, options.autoQuality, options.preload, options.priority, currentQuality, preloadManager, qualitySelector])

  const switchQuality = useCallback((newQuality: VideoQualityConfig) => {
    setCurrentQuality(newQuality)
    // 重新加载视频
    setIsLoading(true)
    // 实现质量切换逻辑
  }, [])

  return {
    videoElement,
    isLoading,
    error,
    currentQuality,
    availableQualities: qualitySelector.getAllQualities(),
    switchQuality
  }
}

// 视频播放统计 Hook
export function useVideoAnalytics(videoRef: React.RefObject<HTMLVideoElement>) {
  const [analytics, setAnalytics] = useState({
    watchTime: 0,
    bufferEvents: 0,
    qualitySwitches: 0,
    startTime: 0,
    endTime: 0,
    completed: false
  })

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    let startTime = 0
    let totalWatchTime = 0
    let lastCurrentTime = 0

    const handlePlay = () => {
      startTime = Date.now()
      setAnalytics(prev => ({ ...prev, startTime }))
    }

    const handlePause = () => {
      if (startTime > 0) {
        totalWatchTime += Date.now() - startTime
        setAnalytics(prev => ({ ...prev, watchTime: totalWatchTime / 1000 }))
      }
    }

    const handleWaiting = () => {
      setAnalytics(prev => ({ ...prev, bufferEvents: prev.bufferEvents + 1 }))
    }

    const handleEnded = () => {
      const endTime = Date.now()
      setAnalytics(prev => ({ 
        ...prev, 
        endTime,
        completed: true,
        watchTime: totalWatchTime / 1000
      }))
    }

    const handleTimeUpdate = () => {
      // 检测是否跳转（可能是质量切换）
      if (Math.abs(video.currentTime - lastCurrentTime) > 2) {
        setAnalytics(prev => ({ ...prev, qualitySwitches: prev.qualitySwitches + 1 }))
      }
      lastCurrentTime = video.currentTime
    }

    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('waiting', handleWaiting)
    video.addEventListener('ended', handleEnded)
    video.addEventListener('timeupdate', handleTimeUpdate)

    return () => {
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('waiting', handleWaiting)
      video.removeEventListener('ended', handleEnded)
      video.removeEventListener('timeupdate', handleTimeUpdate)
    }
  }, [videoRef])

  return analytics
}

// 视频缓冲优化 Hook
export function useVideoBufferOptimization(
  videoRef: React.RefObject<HTMLVideoElement>,
  targetBuffer: number = 30 // 目标缓冲秒数
) {
  const [bufferHealth, setBufferHealth] = useState(0)
  const [isBuffering, setIsBuffering] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const checkBuffer = () => {
      if (video.buffered.length > 0) {
        const currentTime = video.currentTime
        const bufferedEnd = video.buffered.end(video.buffered.length - 1)
        const bufferTime = bufferedEnd - currentTime
        
        setBufferHealth(bufferTime)
        setIsBuffering(bufferTime < 3) // 缓冲不足3秒时认为在缓冲

        // 自动调整预加载策略
        if (bufferTime < targetBuffer / 2) {
          video.preload = 'auto'
        } else if (bufferTime > targetBuffer) {
          video.preload = 'metadata'
        }
      }
    }

    const interval = setInterval(checkBuffer, 1000)
    
    video.addEventListener('waiting', () => setIsBuffering(true))
    video.addEventListener('canplay', () => setIsBuffering(false))

    return () => {
      clearInterval(interval)
      video.removeEventListener('waiting', () => setIsBuffering(true))
      video.removeEventListener('canplay', () => setIsBuffering(false))
    }
  }, [videoRef, targetBuffer])

  return { bufferHealth, isBuffering }
}