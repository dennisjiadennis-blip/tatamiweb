'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useCurrentLocale, useTranslations } from '@/i18n/hooks'
import { OptimizedVideoPlayer } from '@/components/video/optimized-video-player'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  const locale = useCurrentLocale()
  const router = useRouter()
  // const commonT = useTranslations('common') // 临时移除，使用直接翻译
  
  const [phase, setPhase] = useState<'loading' | 'video' | 'slogan' | 'interactive'>('loading')
  
  // 调试信息
  console.log('Homepage current phase:', phase, 'locale:', locale)
  
  useEffect(() => {
    console.log('Phase changed to:', phase)
  }, [phase])

  useEffect(() => {
    console.log('Setting up timers...')
    // 1. 首屏进入，淡入视频
    const videoTimer = setTimeout(() => {
      console.log('Video timer triggered, setting phase to video')
      setPhase('video')
    }, 500) // 0.5秒延迟后显示视频

    // 2. 视频播放1.5秒后，UI元素出现（缩短等待时间）
    const uiTimer = setTimeout(() => {
      console.log('UI timer triggered, setting phase to interactive')
      setPhase('interactive')
    }, 2000) // 0.5s + 1.5s

    return () => {
      console.log('Cleaning up timers')
      clearTimeout(videoTimer)
      clearTimeout(uiTimer)
    }
  }, [])

  const handleVideoEnd = () => {
    // 3. 视频结束后，显示红色SLOGAN
    setPhase('slogan')
  }

  const handleJoinJourney = () => {
    // 4. 用户点击蓝色按钮 → 进入产品介绍页面
    console.log('Navigating to product-intro page, locale:', locale)
    router.push(`/${locale}/product-intro`)
  }

  return (
    // 1. 首屏：纯灰色/深灰色/碳灰色背景
    <div 
      className="relative w-full h-screen overflow-hidden flex items-center justify-center"
      style={{ backgroundColor: 'var(--color-charcoal)' }}
    >
      <AnimatePresence>
        {/* 2. 表情视频播放 */}
        {(phase === 'video' || phase === 'interactive') && (
          <motion.div
            key="video-container"
            className="w-1/2 h-1/2" // 占屏幕50%面积
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          >
            <OptimizedVideoPlayer
              src="/videos/faces/微笑.mp4"
              className="w-full h-full object-cover rounded-lg shadow-2xl"
              autoPlay
              muted
              playsInline
              loop={false} // 视频只播放一次
              controls={false}
              onEnded={handleVideoEnd}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {/* LOGO 与其他功能键淡入呈现 */}
        {(phase === 'interactive' || phase === 'slogan') && (
          <motion.div
            key="logo"
            className="absolute top-8 left-8 text-2xl font-bold"
            style={{ color: 'var(--color-title-red)' }} // 主标题红色
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            TATAMI LABS
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {/* 蓝色按钮 - 在视频播放期间就显示在视频下方 */}
        {(phase === 'video' || phase === 'interactive' || phase === 'slogan') && (
          <motion.div
            key="join-button"
            className="absolute bottom-16 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5, ease: "easeOut" }}
          >
            <Button
              onClick={handleJoinJourney}
              className="bg-transparent border-4 px-16 py-6 text-2xl font-bold transition-all duration-300 hover:bg-blue-600/20 shadow-2xl"
              style={{ 
                color: 'var(--color-subtitle-blue)',
                borderColor: 'var(--color-subtitle-blue)',
                textShadow: '0 0 10px rgba(96, 165, 250, 0.8)',
                borderRadius: '12px'
              }}
            >
              {locale === 'zh-TW' ? '加入旅程' : 
               locale === 'ja' ? '旅に参加' : 
               'Join the Journey'}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {/* 3. 视频结束后显示红色slogan（可选，按需要显示） */}
        {phase === 'slogan' && (
          <motion.h1
            key="slogan"
            className="absolute text-center font-bold uppercase tracking-wide"
            style={{ 
              fontSize: 'clamp(2rem, 5vw, 4rem)',
              color: 'var(--color-title-red)',
              textShadow: '0 0 30px rgba(255, 0, 0, 1), 0 0 50px rgba(255, 0, 0, 0.8), 0 0 80px rgba(255, 0, 0, 0.6)'
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {locale === 'zh-TW' ? '編織故事的旅程' : 
             locale === 'ja' ? '物語を紡ぐ旅' : 
             'The Journey to Weave a Story'}
          </motion.h1>
        )}
      </AnimatePresence>
    </div>
  )
}