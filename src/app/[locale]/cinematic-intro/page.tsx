'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useCurrentLocale } from '@/i18n/hooks'

type Phase = 'initial' | 'title' | 'description' | 'concept' | 'buttons'

export default function CinematicIntroPage() {
  const router = useRouter()
  const locale = useCurrentLocale()
  
  const [currentPhase, setCurrentPhase] = useState<Phase>('initial')
  const [currentLine, setCurrentLine] = useState(0)
  const [isVideoBlurred, setIsVideoBlurred] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // 多语言内容数据
  const content = {
    title: "TATAMI LABS",
    lines: locale === 'zh-TW' ? [
      "與日本終極達人連結",
      "透過深刻的對話體驗",
      "發現數百年來",
      "奉獻與工藝背後的秘密"
    ] : locale === 'ja' ? [
      "日本の究極の達人と繋がり",
      "深い対話体験を通じて",
      "何世紀にもわたる",
      "献身と技の秘密を発見する"
    ] : [
      "Connect with Japan's ultimate masters",
      "through profound dialogue experiences.",
      "Discover the secrets behind centuries", 
      "of dedication and craft."
    ],
    concept: locale === 'zh-TW' ? "留下故事的旅程" : 
             locale === 'ja' ? "物語を残す旅" : 
             "The Journey to Leave a Story"
  }

  // 精确的电影感时序控制
  useEffect(() => {
    
    const timers = {
      initial: () => {
        // 视频播放4秒后显示标题（减慢一倍）
        setTimeoutRef(() => {
          setCurrentPhase('title')
          setIsVideoBlurred(true)
        }, 4000)
      },
      title: () => {
        // 标题显示6秒后开始描述（减慢一倍）
        setTimeoutRef(() => {
          setCurrentPhase('description')
          setCurrentLine(0)
        }, 6000)
      },
      description: () => {
        if (currentLine < content.lines.length) {
          // 每行描述间隔4秒显示（减慢一倍）
          setTimeoutRef(() => {
            setCurrentLine(currentLine + 1)
          }, 4000)
        } else {
          // 描述完成后3秒显示核心理念（减慢一倍）
          setTimeoutRef(() => {
            setCurrentPhase('concept')
          }, 3000)
        }
      },
      concept: () => {
        // 核心理念显示8秒后显示按钮（减慢一倍）
        setTimeoutRef(() => {
          setCurrentPhase('buttons')
        }, 8000)
      }
    }

    const timer = timers[currentPhase as keyof typeof timers]
    if (timer) timer()

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [currentPhase, currentLine, content.lines.length])

  const setTimeoutRef = (callback: () => void, delay: number) => {
    timeoutRef.current = setTimeout(callback, delay)
  }

  const handleContinue = () => {
    router.push(`/${locale}/masters`)
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* 视频背景 */}
      <video
        className={`absolute inset-0 w-full h-full object-cover z-0 transition-all duration-1000 ${
          isVideoBlurred ? 'blur-sm brightness-50' : 'brightness-75'
        }`}
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/videos/faces/大笑.mp4" type="video/mp4" />
        <source src="/videos/大笑.mp4" type="video/mp4" />
      </video>

      {/* 渐变叠加 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-5" />

      {/* 全屏内容容器 - 使用最简单的flex居中 */}
      <div className="fixed inset-0 z-10 flex items-center justify-center">
        <div className="text-center">
          <AnimatePresence mode="wait">
            {/* 标题阶段 */}
            {currentPhase === 'title' && (
              <motion.h1
                key="title"
                className="font-bold tracking-[0.2em] text-white drop-shadow-2xl text-center"
                style={{
                  fontSize: 'clamp(4rem, 15vw, 16rem)'
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                {content.title}
              </motion.h1>
            )}

            {/* 描述阶段 - 逐行显示 */}
            {currentPhase === 'description' && currentLine > 0 && (
              <motion.div
                key={`desc-${currentLine}`}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 1 }}
              >
                {content.lines.slice(0, currentLine).map((line, index) => (
                  <motion.p
                    key={index}
                    className="text-white mb-4 font-light leading-tight drop-shadow-lg text-center"
                    style={{
                      fontSize: 'clamp(1.5rem, 6vw, 6rem)'
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.2, duration: 0.8 }}
                  >
                    {line}
                  </motion.p>
                ))}
              </motion.div>
            )}

            {/* 核心理念阶段 */}
            {currentPhase === 'concept' && (
              <motion.p
                key="concept"
                className="font-bold text-red-400 leading-tight text-center"
                style={{
                  fontSize: 'clamp(2rem, 10vw, 10rem)',
                  textShadow: '0 0 60px rgba(239, 68, 68, 0.9), 0 0 120px rgba(239, 68, 68, 0.7)'
                }}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 1.2 }}
              >
                {content.concept}
              </motion.p>
            )}

            {/* 按钮阶段 */}
            {currentPhase === 'buttons' && (
              <motion.div
                key="buttons"
                className="space-y-8 text-center"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <button
                  onClick={handleContinue}
                  className="bg-white text-black hover:bg-gray-200 font-bold text-2xl px-16 py-6 rounded-full transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105"
                >
                  {locale === 'zh-TW' ? '繼續 →' : 
                   locale === 'ja' ? '続ける →' : 
                   'Continue →'}
                </button>
                <div>
                  <button
                    onClick={() => router.push(`/${locale}/masters`)}
                    className="text-gray-300 hover:text-white transition-colors text-xl block mx-auto"
                  >
                    {locale === 'zh-TW' ? '跳過介紹 →' : 
                     locale === 'ja' ? 'イントロをスキップ →' : 
                     'Skip Introduction →'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

    </div>
  )
}