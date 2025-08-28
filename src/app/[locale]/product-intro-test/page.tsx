'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useCurrentLocale } from '@/i18n/hooks'

export default function ProductIntroTestPage() {
  const locale = useCurrentLocale()
  const [currentIndex, setCurrentIndex] = useState(0)
  
  const texts = [
    {
      en: "Welcome to a new era of cultural connection",
      'zh-TW': "歡迎來到文化連結的新時代", 
      ja: "文化的つながりの新時代へようこそ"
    },
    {
      en: "Where authentic experiences meet global minds",
      'zh-TW': "真實體驗與全球思維的交匯之處",
      ja: "本格的な体験とグローバルな心が出会う場所"
    }
  ]

  const getCurrentText = () => {
    return texts[currentIndex]?.[locale as keyof typeof texts[0]] || texts[currentIndex]?.en || ''
  }

  return (
    <div className="relative w-full h-screen bg-black flex items-center justify-center">
      {/* 16:9 容器 */}
      <div 
        className="relative border border-gray-400/30"
        style={{
          width: '90vw',
          height: 'calc(90vw * 9 / 16)',
          maxWidth: '1400px',
          maxHeight: '787px',
          backgroundColor: '#111'
        }}
      >
        {/* 简单的视频占位符 */}
        <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
          <div className="text-white/40 text-lg">Video Placeholder</div>
        </div>

        {/* 文字叠加 */}
        <div className="absolute inset-0 flex items-center justify-center px-8">
          <motion.div
            key={currentIndex}
            className="text-white text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              fontSize: 'clamp(2rem, 6vw, 4rem)',
              fontWeight: '200',
              textShadow: '0 4px 20px rgba(0,0,0,0.8)'
            }}
          >
            {getCurrentText()}
          </motion.div>
        </div>

        {/* 测试按钮 */}
        <div className="absolute bottom-4 right-4">
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % texts.length)}
            className="px-4 py-2 bg-white/20 text-white rounded hover:bg-white/30 transition-colors"
          >
            Next Text
          </button>
        </div>
      </div>

      {/* 电影级黑边 */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-black z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-black z-10" />
    </div>
  )
}