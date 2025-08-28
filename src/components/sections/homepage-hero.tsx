'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface HomepageHeroProps {
  locale: string
  country?: string
  className?: string
}

export function HomepageHero({ locale, country, className }: HomepageHeroProps) {
  const [currentPhase, setCurrentPhase] = useState<'loading' | 'video' | 'brand'>('loading')
  const [isComplete, setIsComplete] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const timelineRef = useRef<NodeJS.Timeout | null>(null)

  // 直接设置视频数据，避免翻译错误
  const videoData = {
    videoFile: '微笑.mp4',
    tagline: locale === 'zh-TW' ? '留下故事的旅程' : 
             locale === 'ja' ? '物語を残す旅' : 
             'The Journey to Leave a Story'
  }

  useEffect(() => {
    // 启动时序控制
    startTimeline()

    return () => {
      if (timelineRef.current) {
        clearTimeout(timelineRef.current)
      }
    }
  }, [])

  const startTimeline = () => {
    // Phase 1: 炭灰色屏幕 (0-2s)
    setCurrentPhase('loading')
    
    timelineRef.current = setTimeout(() => {
      // Phase 2: 视频淡入播放 (2s-5s，播放3秒)
      setCurrentPhase('video')
      
      timelineRef.current = setTimeout(() => {
        // Phase 3: Tatami logo淡入 (5s+)
        setCurrentPhase('brand')
        
        // 不再自动完成，保持logo显示
      }, 3000) // 3秒视频播放
    }, 2000) // 2秒炭灰色屏幕
  }

  const handleVideoEnd = () => {
    // 视频结束后不做任何操作，让视频停留在最后一帧
    // 等待定时器自动切换到brand阶段
  }

  const handleSkip = () => {
    setIsComplete(true)
    if (timelineRef.current) {
      clearTimeout(timelineRef.current)
    }
  }

  if (isComplete) {
    return null
  }

  return (
    <div className={cn('homepage-timeline', className)}>
      <AnimatePresence mode="wait">
        {/* Phase 1: 炭灰色屏幕 */}
        {currentPhase === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 bg-gray-800 flex items-center justify-center"
            style={{ backgroundColor: '#4A4A4A' }} /* 炭灰色 */
          >
            {/* 移除加载动画，保持纯色屏幕 */}
          </motion.div>
        )}

        {/* Phase 2: Video - 播放3秒后停留在最后一帧 */}
        {(currentPhase === 'video' || currentPhase === 'brand') && videoData && (
          <motion.div
            key="video"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <video
              ref={videoRef}
              className="homepage-video"
              autoPlay
              muted
              playsInline
              onEnded={handleVideoEnd}
              style={{ opacity: 1 }}
              preload="auto"
            >
              <source src={`/videos/faces/${videoData.videoFile}`} type="video/mp4" />
            </video>
          </motion.div>
        )}

        {/* 移除tagline阶段，直接从video跳转到brand */}

        {/* Phase 3: Tatami Logo 叠加在视频上 */}
        {currentPhase === 'brand' && (
          <motion.div
            key="brand"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 flex flex-col items-center justify-center z-10"
            style={{ background: 'rgba(0, 0, 0, 0.4)' }} /* 半透明黑色叠加 */
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-center space-y-8 max-w-4xl mx-auto px-6"
            >
              <h1 className="font-serif font-normal text-5xl md:text-7xl lg:text-8xl text-white tracking-wide leading-none drop-shadow-2xl">
                Tatami Labs
              </h1>
              <div className="w-24 h-px bg-white/60 mx-auto"></div>
              <p className="font-serif text-lg md:text-xl lg:text-2xl text-white/95 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-lg">
                {locale === 'zh-TW' ? '留下故事的旅程' : 
                 locale === 'ja' ? '物語を残す旅' : 
                 'The Journey to Leave a Story'}
              </p>
              
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                onClick={handleSkip}
                className="bg-white text-black hover:bg-gray-100 font-serif text-lg px-8 py-4 mt-8 rounded-sm border-none transition-colors duration-300 shadow-lg"
              >
                {locale === 'zh-TW' ? '開始旅程' : 
                 locale === 'ja' ? '旅を始める' : 
                 'Enter the Journey'}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skip button */}
      {!isComplete && currentPhase !== 'brand' && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          onClick={handleSkip}
          className="absolute top-8 right-8 z-60 text-white/70 hover:text-white font-serif text-sm transition-colors duration-200"
        >
          Skip →
        </motion.button>
      )}

      {/* Progress indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-60">
        <div className="flex space-x-2">
          {['loading', 'video', 'brand'].map((phase, index) => (
            <div
              key={phase}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                ['loading', 'video', 'brand'].indexOf(currentPhase) >= index
                  ? 'bg-white/80'
                  : 'bg-white/30'
              )}
            />
          ))}
        </div>
      </div>
    </div>
  )
}