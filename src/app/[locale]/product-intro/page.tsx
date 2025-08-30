'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useCurrentLocale, useTranslations } from '@/i18n/hooks'
// import { OptimizedVideoPlayer } from '@/components/video/optimized-video-player'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'

// 定义动画阶段
type IntroPhase = 'initial' | 'title' | 'description' | 'coreConcept' | 'buttons'

export default function ProductIntroPage() {
  const router = useRouter()
  const locale = useCurrentLocale()
  const t = useTranslations('productIntro')

  const [currentPhase, setCurrentPhase] = useState<IntroPhase>('initial')
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [isBlurred, setIsBlurred] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const descriptionLines = t.raw('descriptionLines') as string[]
  const coreConceptText = t('coreConcept')

  // 调试输出
  console.log('ProductIntroPage state:', { currentPhase, currentLineIndex, isBlurred })
  console.log('Description lines:', descriptionLines)
  console.log('Core concept:', coreConceptText)

  // 动画时间控制常量 (单位: 毫秒) - 减慢一倍的速度
  const VIDEO_INITIAL_DELAY = 2000 // 视频播放2秒后文字出现
  const TITLE_APPEAR_DURATION = 2000 // 标题淡入持续时间
  const TITLE_HOLD_DURATION = 4000 // 标题停留时间
  const DESCRIPTION_LINE_APPEAR_DURATION = 2000 // 每行描述淡入持续时间
  const DESCRIPTION_LINE_HOLD_DURATION = 3000 // 每行描述停留时间
  const CORE_CONCEPT_APPEAR_DURATION = 2000 // 核心理念淡入持续时间
  const CORE_CONCEPT_HOLD_DURATION = 4000 // 核心理念停留时间
  const BUTTONS_APPEAR_DELAY = 1000 // 按钮淡入延迟

  useEffect(() => {
    // 清理函数，防止组件卸载时定时器仍在运行
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    console.log('useEffect triggered, currentPhase:', currentPhase)
    if (currentPhase === 'initial') {
      console.log('Starting initial phase timeout')
      // 视频播放2秒后，进入标题阶段
      timeoutRef.current = setTimeout(() => {
        console.log('Moving to title phase')
        setCurrentPhase('title')
        setIsBlurred(true) // 文字出现时虚焦
      }, VIDEO_INITIAL_DELAY)
    } else if (currentPhase === 'title') {
      // 标题停留一段时间后，进入描述阶段
      timeoutRef.current = setTimeout(() => {
        setCurrentPhase('description')
        setCurrentLineIndex(0)
      }, TITLE_APPEAR_DURATION + TITLE_HOLD_DURATION)
    } else if (currentPhase === 'description') {
      if (currentLineIndex < descriptionLines.length) {
        // 逐行显示描述
        timeoutRef.current = setTimeout(() => {
          setCurrentLineIndex(prev => prev + 1)
        }, DESCRIPTION_LINE_APPEAR_DURATION + DESCRIPTION_LINE_HOLD_DURATION) // 每行文字显示间隔已减慢一倍
      } else {
        // 描述显示完毕，进入核心理念阶段
        timeoutRef.current = setTimeout(() => {
          setCurrentPhase('coreConcept')
        }, DESCRIPTION_LINE_APPEAR_DURATION + DESCRIPTION_LINE_HOLD_DURATION)
      }
    } else if (currentPhase === 'coreConcept') {
      // 核心理念停留一段时间后，进入按钮阶段
      timeoutRef.current = setTimeout(() => {
        setCurrentPhase('buttons')
      }, CORE_CONCEPT_APPEAR_DURATION + CORE_CONCEPT_HOLD_DURATION)
    }
    // 当进入 buttons 阶段后，不再设置新的定时器，等待用户操作

  }, [currentPhase, currentLineIndex, descriptionLines.length])

  const handleContinue = () => {
    router.push(`/${locale}/masters`)
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black flex items-center justify-center cinematic-viewport">
      {/* 视频背景 */}
      <video
        className={`absolute inset-0 w-full h-full object-cover z-0 transition-filter duration-1000 ease-in-out ${isBlurred ? 'blur-[8px]' : 'opacity-70'}`}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        onError={(e) => console.error('Video failed to load:', e)}
        onLoadedData={() => console.log('Video loaded successfully')}
      >
        <source src="/videos/faces/大笑.mp4" type="video/mp4" />
        <source src="/videos/大笑.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* 匠人工作室氛围叠加 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-10" />

      {/* 16:9 电影画幅容器 - 居中显示 */}
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <div className="relative w-full aspect-video max-w-screen-xl bg-black border-t border-b border-white/20">
          {/* 电影画幅内容容器 */}
          <motion.div
            className="relative z-20 w-full h-full bg-black/60 flex flex-col items-center justify-center p-8 md:p-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
        <AnimatePresence mode="wait">
          {currentPhase === 'title' && ( // 电影开场 - 作品名称/标题
            <motion.h1
              key="intro-title"
              className="text-4xl sm:text-5xl md:text-7xl lg:text-9xl font-bold tracking-wider text-white mb-4 text-center leading-tight uppercase cinematic-title"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: TITLE_APPEAR_DURATION / 1000, ease: "easeOut" }}
            >
              {t('title')}
            </motion.h1>
          )}

          {currentPhase === 'description' && currentLineIndex < descriptionLines.length && ( // 电影开场 - 故事背景/产品介绍
            <motion.p
              key={`description-line-${currentLineIndex}`}
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-200 max-w-4xl text-center font-light leading-relaxed cinematic-description"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: DESCRIPTION_LINE_APPEAR_DURATION / 1000, ease: "easeOut" }}
            >
              {descriptionLines[currentLineIndex]}
            </motion.p>
          )}

          {currentPhase === 'coreConcept' && ( // 核心理念高光
            <motion.p
              key="core-concept"
              className="text-xl sm:text-2xl md:text-4xl lg:text-5xl text-primary-foreground font-bold italic mb-6 text-center leading-snug"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: CORE_CONCEPT_APPEAR_DURATION / 1000, ease: "easeOut" }}
              style={{ textShadow: '0 0 15px rgba(227, 66, 52, 0.7), 0 0 30px rgba(227, 66, 52, 0.5)' }} // 鲜红发光效果
            >
              {coreConceptText}
            </motion.p>
          )}

          {currentPhase === 'buttons' && ( // 按钮出现
            <motion.div
              key="intro-buttons"
              className="absolute bottom-4 sm:bottom-8 flex flex-col items-center space-y-4"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: BUTTONS_APPEAR_DELAY / 1000, duration: 0.8, ease: "easeOut" }}
            >
              <Button
                onClick={handleContinue}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                {locale === 'zh-TW' ? '繼續' : locale === 'ja' ? '続行' : 'Continue'} <Icons.arrowRight className="ml-2 h-4 sm:h-5 w-4 sm:w-5" />
              </Button>
              <motion.button
                onClick={() => router.push(`/${locale}/masters`)}
                className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm flex items-center"
              >
                {locale === 'zh-TW' ? '跳過介紹' : locale === 'ja' ? 'イントロをスキップ' : 'Skip Introduction'} <Icons.arrowRight className="ml-1 h-3 w-3" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  )
}