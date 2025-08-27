'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCurrentLocale, useCommonT } from '@/i18n/hooks'
import { OptimizedVideoPlayer } from '@/components/video/optimized-video-player'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const locale = useCurrentLocale()
  const router = useRouter()
  const commonT = useCommonT()
  
  const [showVideo, setShowVideo] = useState(false)
  const [showUI, setShowUI] = useState(false)
  const [showSlogan, setShowSlogan] = useState(false)

  useEffect(() => {
    // 1. 首屏进入，立即淡入视频
    const startVideoTimer = setTimeout(() => {
      setShowVideo(true)
    }, 500)
    
    // 2. 视频播放3秒后，LOGO与功能键淡入
    const showUITimer = setTimeout(() => {
      setShowUI(true)
    }, 3500) // 500ms (delay) + 3000ms (video play time)
    
    return () => {
      clearTimeout(startVideoTimer)
      clearTimeout(showUITimer)
    }
  }, [])

  // 3. 视频结束后，红色SLOGAN出现
  const handleVideoEnd = () => {
    setShowSlogan(true)
  }

  // 4. 点击蓝色按钮进入产品介绍页
  const handleJoinJourney = () => {
    router.push(`/${locale}/product-intro`)
  }

  // 国际化文本现在通过 commonT 获取
  // const getText = (key: string) => {
  //   const texts = {
  //     slogan: {
  //       en: 'THE JOURNEY TO LEAVE A STORY',
  //       'zh-TW': '留下故事的旅程', 
  //       ja: '物語を残す旅'
  //     },
  //     button: {
  //       en: 'JOIN OUR JOURNEY',
  //       'zh-TW': '加入我們的旅程',
  //       ja: '私たちの旅に参加する'
  //     }
  //   }
  //   return texts[key as keyof typeof texts][locale as keyof typeof texts.slogan] || texts[key as keyof typeof texts].en
  // }

  return (
    // 1. 首屏：纯灰色背景，干净无内容
    <div 
      className="relative w-full h-screen overflow-hidden"
      style={{
        backgroundColor: 'var(--color-charcoal)' // 使用设计系统中的碳灰色
      }}
    >
      
      {/* 2. 淡入表情视频，占屏幕50%面积 */}
      <AnimatePresence>
        {showVideo && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          >
            <div
              style={{
                width: '50vw', // 屏幕50%面积
                height: '50vh',
                maxWidth: '600px',
                maxHeight: '450px'
              }}
            >
              <OptimizedVideoPlayer
                src="/videos/faces/微笑.mp4"
                className="w-full h-full object-cover rounded-lg"
                autoPlay
                muted
                playsInline
                loop={false} // 视频只播放一次，不循环
                controls={false}
                enableQualitySelector={false}
                enableAnalytics={false}
                customControls={false}
                preload={true}
                onEnded={handleVideoEnd}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. 视频播放3秒后：LOGO与其他功能键淡入 + 蓝色按钮 */}
      <AnimatePresence>
        {showUI && (
          <>
            {/* LOGO */}
            <motion.div
              className="absolute top-8 left-8 z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <div className="text-white text-2xl font-bold">LOGO</div>
            </motion.div>

            {/* 其他功能键 */}
            <motion.div
              className="absolute top-8 right-8 z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            >
              <div className="flex space-x-6 text-white text-sm">
                <button className="hover:text-gray-300 transition-colors">HOME</button>
                <button className="hover:text-gray-300 transition-colors">ABOUT</button>
                <button className="hover:text-gray-300 transition-colors">CONTACT</button>
              </div>
            </motion.div>

            {/* 页面下方蓝色按钮：蓝色边框 + 蓝色文字 JOIN OUR JOURNEY */}
            <motion.div
              className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            >
              <Button
                onClick={handleJoinJourney}
                className="border-2 bg-transparent hover:bg-blue-500 hover:text-white px-8 py-3 text-lg font-medium transition-all duration-300"
                style={{
                  borderColor: '#3B82F6',
                  color: '#3B82F6'
                }}
              >
                {commonT('joinOurJourney')}
              </Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 4. 视频结束后：红色SLOGAN - THE JOURNEY TO LEAVE A STORY */}
      <AnimatePresence>
        {showSlogan && (
          <motion.div
            className="absolute bottom-32 left-1/2 transform -translate-x-1/2 text-center z-10"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <h1
              className="font-bold uppercase tracking-wide"
              style={{
                color: '#FF0000', // 鲜红/大红/亮红
                fontSize: 'clamp(2rem, 5vw, 4rem)', // 与目前设计一致的字体大小
                fontFamily: 'var(--font-family-heading)', // 使用项目定义的标题字体
                lineHeight: '1.2'
              }}
            >
              {commonT('journeySlogan')}
            </h1>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}