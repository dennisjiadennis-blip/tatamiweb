'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from '@/i18n/hooks'
import { OptimizedVideoPlayer } from '@/components/video/optimized-video-player'

export default function ProductIntroPage() {
  const t = useTranslations('productIntro')

  const [showSubtitles, setShowSubtitles] = useState(false)
  const [currentSubtitle, setCurrentSubtitle] = useState(0)

  // 5. 产品介绍文字 - 与现有视频展示内容一致
  const productContent = useMemo(() => [
    t('descriptionLines.0'),
    t('descriptionLines.1'),
    t('descriptionLines.2'), 
    t('descriptionLines.3'),
    t('coreConcept')
  ], [t])

  useEffect(() => {
    // 4. 视频播放2秒后：字幕形式出现产品介绍文字
    const timer = setTimeout(() => {
      setShowSubtitles(true)
      startSubtitleSequence()
    }, 2000)

    return () => clearTimeout(timer)
  }, [startSubtitleSequence])

  const startSubtitleSequence = useCallback(() => {
    let delay = 0
    
    productContent.forEach((_, index) => {
      setTimeout(() => {
        setCurrentSubtitle(index)
      }, delay)
      
      // 5. 播放速度：比现在慢1.5倍
      delay += 4500 // 1.5倍慢的播放间隔
    })
  }, [productContent])

  return (
    <div className="relative w-full h-screen bg-black flex items-center justify-center">
      
      {/* 4. 16:9的边框，视频放置在边框内（类似电影屏幕） */}
      <div 
        className="relative border-2 border-gray-500"
        style={{
          width: '85vw',
          height: 'calc(85vw * 9 / 16)', // 16:9边框
          maxWidth: '1200px',
          maxHeight: '675px',
          backgroundColor: '#000'
        }}
      >
        
        {/* 视频放置在边框内 */}
        <OptimizedVideoPlayer
          src="/videos/faces/微笑.mp4"
          className={`w-full h-full object-cover transition-all duration-1000 ease-in-out ${
            showSubtitles ? 'blur-[8px]' : ''
          }`}
          autoPlay
          loop
          muted
          playsInline
          controls={false}
          enableQualitySelector={false}
          enableAnalytics={false}
          customControls={false}
          preload={true}
        />

        {/* 5. 产品介绍文字 - 字幕形式，比现在大3倍，慢1.5倍 */}
        <AnimatePresence>
          {showSubtitles && (
            <div className="absolute inset-0 flex items-center justify-center px-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSubtitle}
                  className="text-white text-center max-w-5xl"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ 
                    duration: 1.8, // 比现在慢1.5倍的过渡
                    ease: 'easeOut' 
                  }}
                  style={{
                    // 5. 字体大小：比现在大3倍
                    fontSize: 'clamp(2.4rem, 6vw, 4.8rem)', // 3倍字体大小
                    lineHeight: '1.2',
                    fontWeight: '700',
                    textShadow: '3px 3px 12px rgba(0,0,0,0.9)', // 增强阴影
                    fontFamily: 'serif'
                  }}
                >
                  {productContent[currentSubtitle]}
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* 电影院效果 - 上下黑边 */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-black z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-black z-10" />
    </div>
  )
}