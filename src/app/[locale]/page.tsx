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
  const commonT = useTranslations('common')
  
  const [phase, setPhase] = useState<'loading' | 'video' | 'slogan' | 'interactive'>('loading')

  useEffect(() => {
    // 1. 首屏进入，淡入视频
    const videoTimer = setTimeout(() => {
      setPhase('video')
    }, 500) // 0.5秒延迟后显示视频

    // 2. 视频播放3秒后，UI元素出现
    const uiTimer = setTimeout(() => {
      setPhase('interactive')
    }, 3500) // 0.5s + 3s

    return () => {
      clearTimeout(videoTimer)
      clearTimeout(uiTimer)
    }
  }, [])

  const handleVideoEnd = () => {
    // 3. 视频结束后，显示红色SLOGAN
    setPhase('slogan')
  }

  const handleJoinJourney = () => {
    // 4. 用户点击蓝色按钮 → 进入产品介绍页
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
              className="absolute top-8 left-8 text-white text-2xl font-bold"
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
                className="text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-white px-8 py-3 text-lg font-medium"
              >
                {commonT('joinOurJourney')}
              </Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {/* 3. 视频结束后出现红色 SLOGAN */}
        {phase === 'slogan' && (
          <motion.h1
            key="slogan"
            className="absolute text-center text-red-500 font-bold uppercase tracking-wide slogan-red-text"
            style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {commonT('journeySlogan')}
          </motion.h1>
        )}
      </AnimatePresence>
    </div>
  )
}