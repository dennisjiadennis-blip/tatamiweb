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
          <>
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
            
            {/* 蓝色按钮 */}
            <motion.div
              key="join-button"
              className="absolute bottom-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Button
                onClick={handleJoinJourney}
                variant="outline"
                className="border-2 px-8 py-3 text-lg font-medium transition-all duration-300"
                style={{ 
                  color: 'var(--color-subtitle-blue)',
                  borderColor: 'var(--color-subtitle-blue)'
                }}
              >
                {locale === 'zh-TW' ? '加入我們的旅程' : 
                 locale === 'ja' ? '私たちの旅に参加' : 
                 'Join Our Journey'}
              </Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {/* 3. 视频结束后直接显示蓝色按钮，不显示红色slogan */}
        {phase === 'slogan' && (
          <motion.div
            key="journey-button"
            className="absolute bottom-20 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          >
            <Button
              onClick={handleJoinJourney}
              className="bg-transparent border-2 px-8 py-3 text-lg font-medium transition-all duration-300 hover:bg-blue-600/10 shadow-lg"
              style={{ 
                color: 'var(--color-subtitle-blue)',
                borderColor: 'var(--color-subtitle-blue)'
              }}
            >
              {locale === 'zh-TW' ? '加入旅程' : 
               locale === 'ja' ? '旅に参加' : 
               'Join the Journey'}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}