'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useHomepageVideo } from '@/i18n/hooks'
import { HOMEPAGE_TIMELINE } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface HomepageHeroProps {
  locale: string
  country?: string
  className?: string
}

export function HomepageHero({ locale, country, className }: HomepageHeroProps) {
  const [currentPhase, setCurrentPhase] = useState<'loading' | 'video' | 'tagline' | 'brand'>('loading')
  const [isComplete, setIsComplete] = useState(false)
  const [videoData, setVideoData] = useState<any>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const timelineRef = useRef<NodeJS.Timeout | null>(null)
  
  const { getSmartVideoSelection } = useHomepageVideo()

  useEffect(() => {
    // 获取智能选择的视频
    const selectedVideo = getSmartVideoSelection(country)
    setVideoData(selectedVideo)

    // 启动时序控制
    startTimeline()

    return () => {
      if (timelineRef.current) {
        clearTimeout(timelineRef.current)
      }
    }
  }, [country])

  const startTimeline = () => {
    // Phase 1: Loading (0-1s)
    setCurrentPhase('loading')
    
    timelineRef.current = setTimeout(() => {
      // Phase 2: Video fade in and play (1s-11s)
      setCurrentPhase('video')
      
      timelineRef.current = setTimeout(() => {
        // Phase 3: Tagline (11s-13s)
        setCurrentPhase('tagline')
        
        timelineRef.current = setTimeout(() => {
          // Phase 4: Brand and completion (13s+)
          setCurrentPhase('brand')
          
          timelineRef.current = setTimeout(() => {
            setIsComplete(true)
          }, 2000)
        }, 2000) // 2s for tagline
      }, 10000) // 10s for video
    }, 1000) // 1s for loading
  }

  const handleVideoEnd = () => {
    if (currentPhase === 'video') {
      setCurrentPhase('tagline')
    }
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
        {/* Phase 1: Loading */}
        {currentPhase === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-pure-black flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-2 h-2 bg-white rounded-full animate-pulse"
            />
          </motion.div>
        )}

        {/* Phase 2: Video */}
        {currentPhase === 'video' && videoData && (
          <motion.div
            key="video"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
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
            >
              <source src={`/videos/faces/${videoData.videoFile}`} type="video/mp4" />
            </video>
          </motion.div>
        )}

        {/* Phase 3: Tagline */}
        {currentPhase === 'tagline' && videoData && (
          <motion.div
            key="tagline"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-pure-black flex items-center justify-center"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="homepage-tagline max-w-4xl px-6"
            >
              {videoData.tagline}
            </motion.h1>
          </motion.div>
        )}

        {/* Phase 4: Brand */}
        {currentPhase === 'brand' && (
          <motion.div
            key="brand"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-black flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="text-center space-y-12 max-w-4xl mx-auto px-6"
            >
              <h1 className="font-serif font-normal text-5xl md:text-7xl lg:text-8xl text-white tracking-wide leading-none">
                Tatami Labs
              </h1>
              <div className="w-24 h-px bg-white/40 mx-auto"></div>
              <p className="font-serif text-lg md:text-xl lg:text-2xl text-white/90 max-w-2xl mx-auto font-light leading-relaxed">
                {locale === 'zh-TW' ? '匠心解密之旅' : 
                 locale === 'ja' ? '物語を紡ぐ旅' : 
                 'The Journey to Weave a Story'}
              </p>
              
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                onClick={handleSkip}
                className="bg-white text-black hover:bg-gray-100 font-serif text-lg px-8 py-4 mt-8 rounded-none border-none transition-colors duration-300"
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
          {['loading', 'video', 'tagline', 'brand'].map((phase, index) => (
            <div
              key={phase}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                ['loading', 'video', 'tagline', 'brand'].indexOf(currentPhase) >= index
                  ? 'bg-white'
                  : 'bg-white/30'
              )}
            />
          ))}
        </div>
      </div>
    </div>
  )
}