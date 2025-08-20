'use client'

import React, { useRef, useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useBreakpoint } from '@/lib/responsive'
import { 
  useSmartVideoLoader, 
  useVideoAnalytics, 
  useVideoBufferOptimization,
  VideoQualityConfig,
  SmartVideoQualitySelector,
  VideoStreamOptimizer
} from '@/lib/video-optimization'
import { useNetworkStatus } from '@/lib/mobile-performance'
import { Icons } from '@/components/ui/icons'

interface OptimizedVideoPlayerProps {
  src: string
  poster?: string
  className?: string
  controls?: boolean
  autoPlay?: boolean
  loop?: boolean
  muted?: boolean
  playsInline?: boolean
  preload?: boolean
  onPlay?: () => void
  onPause?: () => void
  onEnded?: () => void
  onError?: (error: string) => void
  enableQualitySelector?: boolean
  enableAnalytics?: boolean
  customControls?: boolean
}

export function OptimizedVideoPlayer({
  src,
  poster,
  className,
  controls = true,
  autoPlay = false,
  loop = false,
  muted = true,
  playsInline = true,
  preload = true,
  onPlay,
  onPause,
  onEnded,
  onError,
  enableQualitySelector = true,
  enableAnalytics = true,
  customControls = true
}: OptimizedVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [showControls, setShowControls] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showQualityMenu, setShowQualityMenu] = useState(false)
  
  const { isMobile } = useBreakpoint()
  const { isSlowConnection } = useNetworkStatus()
  
  const {
    videoElement,
    isLoading,
    error,
    currentQuality,
    availableQualities,
    switchQuality
  } = useSmartVideoLoader(src, {
    autoQuality: true,
    preload: preload && !isSlowConnection,
    priority: 'medium'
  })

  const analytics = useVideoAnalytics(videoRef)
  const { bufferHealth, isBuffering } = useVideoBufferOptimization(videoRef)

  // 控制条自动隐藏
  useEffect(() => {
    if (!customControls) return

    let hideTimeout: NodeJS.Timeout

    const handleMouseMove = () => {
      setShowControls(true)
      clearTimeout(hideTimeout)
      
      if (isPlaying && !isMobile) {
        hideTimeout = setTimeout(() => {
          setShowControls(false)
        }, 3000)
      }
    }

    const handleMouseLeave = () => {
      if (isPlaying && !isMobile) {
        setShowControls(false)
      }
    }

    const container = videoRef.current?.parentElement
    if (container) {
      container.addEventListener('mousemove', handleMouseMove)
      container.addEventListener('mouseleave', handleMouseLeave)
    }

    return () => {
      clearTimeout(hideTimeout)
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove)
        container.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [isPlaying, isMobile, customControls])

  // 视频事件处理
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handlePlay = () => {
      setIsPlaying(true)
      onPlay?.()
    }

    const handlePause = () => {
      setIsPlaying(false)
      onPause?.()
    }

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)
    }

    const handleDurationChange = () => {
      setDuration(video.duration)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      onEnded?.()
    }

    const handleError = () => {
      const errorMessage = video.error?.message || 'Video playback error'
      onError?.(errorMessage)
    }

    const handleVolumeChange = () => {
      setVolume(video.volume)
    }

    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('durationchange', handleDurationChange)
    video.addEventListener('ended', handleEnded)
    video.addEventListener('error', handleError)
    video.addEventListener('volumechange', handleVolumeChange)

    return () => {
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('durationchange', handleDurationChange)
      video.removeEventListener('ended', handleEnded)
      video.removeEventListener('error', handleError)
      video.removeEventListener('volumechange', handleVolumeChange)
    }
  }, [onPlay, onPause, onEnded, onError])

  // 播放控制
  const togglePlay = useCallback(() => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
  }, [isPlaying])

  const seekTo = useCallback((time: number) => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = time
  }, [])

  const changeVolume = useCallback((newVolume: number) => {
    const video = videoRef.current
    if (!video) return

    video.volume = Math.max(0, Math.min(1, newVolume))
  }, [])

  const toggleMute = useCallback(() => {
    const video = videoRef.current
    if (!video) return

    video.muted = !video.muted
  }, [])

  const toggleFullscreen = useCallback(async () => {
    const container = videoRef.current?.parentElement
    if (!container) return

    try {
      if (isFullscreen) {
        await document.exitFullscreen()
      } else {
        await container.requestFullscreen()
      }
      setIsFullscreen(!isFullscreen)
    } catch (error) {
      console.error('Fullscreen error:', error)
    }
  }, [isFullscreen])

  const handleQualityChange = useCallback((quality: VideoQualityConfig) => {
    switchQuality(quality)
    setShowQualityMenu(false)
  }, [switchQuality])

  // 键盘控制
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!videoRef.current) return

      switch (e.code) {
        case 'Space':
          e.preventDefault()
          togglePlay()
          break
        case 'ArrowLeft':
          e.preventDefault()
          seekTo(Math.max(0, currentTime - 10))
          break
        case 'ArrowRight':
          e.preventDefault()
          seekTo(Math.min(duration, currentTime + 10))
          break
        case 'ArrowUp':
          e.preventDefault()
          changeVolume(volume + 0.1)
          break
        case 'ArrowDown':
          e.preventDefault()
          changeVolume(volume - 0.1)
          break
        case 'KeyM':
          e.preventDefault()
          toggleMute()
          break
        case 'KeyF':
          e.preventDefault()
          toggleFullscreen()
          break
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [togglePlay, seekTo, currentTime, duration, changeVolume, volume, toggleMute, toggleFullscreen])

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  if (error) {
    return (
      <div className={cn('relative bg-muted rounded-lg overflow-hidden', className)}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-2">
            <Icons.alertCircle className="w-8 h-8 mx-auto text-destructive" />
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('relative bg-black rounded-lg overflow-hidden group', className)}>
      {/* 视频元素 */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        poster={poster}
        controls={!customControls && controls}
        autoPlay={autoPlay && !isSlowConnection}
        loop={loop}
        muted={muted}
        playsInline={playsInline}
        preload={preload ? (isSlowConnection ? 'metadata' : 'auto') : 'none'}
        src={src}
      />

      {/* 加载指示器 */}
      <AnimatePresence>
        {(isLoading || isBuffering) && (
          <motion.div
            className="absolute inset-0 bg-black/50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-center space-y-2">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-white text-sm">
                {isLoading ? '加载中...' : '缓冲中...'}
              </p>
              {bufferHealth > 0 && (
                <p className="text-white/70 text-xs">
                  缓冲: {bufferHealth.toFixed(1)}s
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 播放按钮 */}
      <AnimatePresence>
        {!isPlaying && !isLoading && (
          <motion.button
            className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 transition-colors"
            onClick={togglePlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
              <Icons.play className="w-8 h-8 text-black ml-1" />
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* 自定义控制条 */}
      {customControls && (
        <AnimatePresence>
          {showControls && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              {/* 进度条 */}
              <div className="mb-4">
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={(e) => seekTo(Number(e.target.value))}
                  className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              {/* 控制按钮 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={togglePlay}
                    className="text-white hover:text-white/80 transition-colors"
                  >
                    {isPlaying ? (
                      <Icons.pause className="w-5 h-5" />
                    ) : (
                      <Icons.play className="w-5 h-5" />
                    )}
                  </button>

                  <div className="text-white text-sm">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </div>

                  {/* 音量控制 */}
                  <div className="flex items-center space-x-2">
                    <button onClick={toggleMute} className="text-white hover:text-white/80">
                      {volume === 0 ? (
                        <Icons.volumeOff className="w-5 h-5" />
                      ) : (
                        <Icons.volume className="w-5 h-5" />
                      )}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={(e) => changeVolume(Number(e.target.value))}
                      className="w-16 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {/* 质量选择器 */}
                  {enableQualitySelector && (
                    <div className="relative">
                      <button
                        onClick={() => setShowQualityMenu(!showQualityMenu)}
                        className="text-white hover:text-white/80 transition-colors text-sm"
                      >
                        {currentQuality?.resolution || 'Auto'}
                      </button>
                      
                      <AnimatePresence>
                        {showQualityMenu && (
                          <motion.div
                            className="absolute bottom-8 right-0 bg-black/90 rounded-lg py-2 min-w-20"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                          >
                            {availableQualities.map((quality) => (
                              <button
                                key={quality.resolution}
                                onClick={() => handleQualityChange(quality)}
                                className={cn(
                                  'block w-full px-3 py-1 text-left text-sm transition-colors',
                                  quality.resolution === currentQuality?.resolution
                                    ? 'text-primary bg-primary/20'
                                    : 'text-white hover:bg-white/10'
                                )}
                              >
                                {quality.resolution}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* 全屏按钮 */}
                  <button
                    onClick={toggleFullscreen}
                    className="text-white hover:text-white/80 transition-colors"
                  >
                    {isFullscreen ? (
                      <Icons.minimize className="w-5 h-5" />
                    ) : (
                      <Icons.maximize className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* 性能信息（开发环境） */}
      {enableAnalytics && process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 left-2 bg-black/80 text-white text-xs p-2 rounded">
          <div>Quality: {currentQuality?.resolution}</div>
          <div>Buffer: {bufferHealth.toFixed(1)}s</div>
          <div>Watch Time: {analytics.watchTime.toFixed(1)}s</div>
          <div>Buffer Events: {analytics.bufferEvents}</div>
        </div>
      )}

      {/* 网络状态警告 */}
      {isSlowConnection && (
        <div className="absolute top-2 right-2 bg-yellow-500/90 text-black text-xs px-2 py-1 rounded">
          慢网络模式
        </div>
      )}
    </div>
  )
}

// 视频预览组件
interface VideoThumbnailProps {
  src: string
  poster: string
  alt: string
  className?: string
  onClick?: () => void
  showPlayButton?: boolean
  duration?: number
}

export function VideoThumbnail({
  src,
  poster,
  alt,
  className,
  onClick,
  showPlayButton = true,
  duration
}: VideoThumbnailProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [previewVideo, setPreviewVideo] = useState<HTMLVideoElement | null>(null)
  const { isSlowConnection } = useNetworkStatus()

  useEffect(() => {
    if (isHovered && !isSlowConnection && !previewVideo) {
      const video = document.createElement('video')
      video.src = src
      video.muted = true
      video.preload = 'metadata'
      video.currentTime = 3 // 预览3秒位置的画面
      
      video.addEventListener('loadeddata', () => {
        setPreviewVideo(video)
      })
    }
  }, [isHovered, isSlowConnection, src, previewVideo])

  return (
    <motion.div
      className={cn('relative cursor-pointer rounded-lg overflow-hidden group', className)}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="aspect-video relative">
        <img
          src={poster}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {previewVideo && isHovered && (
          <video
            className="absolute inset-0 w-full h-full object-cover"
            muted
            autoPlay
            loop
            src={src}
          />
        )}

        {/* 播放按钮 */}
        {showPlayButton && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
            <motion.div
              className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Icons.play className="w-6 h-6 text-black ml-1" />
            </motion.div>
          </div>
        )}

        {/* 时长显示 */}
        {duration && (
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
            {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}
          </div>
        )}
      </div>
    </motion.div>
  )
}