'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface HomepageCTAProps {
  locale: string
  className?: string
}

export function HomepageCTA({ locale, className }: HomepageCTAProps) {
  // 直接使用locale参数来显示正确的语言，避免useTranslations的客户端问题
  const getButtonText = (key: string) => {
    const texts = {
      masters: {
        en: 'Explore Masters',
        'zh-TW': '探索達人',
        ja: 'マスターを探索'
      },
      philosophy: {
        en: 'Our Philosophy',
        'zh-TW': '我們的理念',
        ja: '私たちの理念'
      },
      enter: {
        en: 'Enter the Journey',
        'zh-TW': '開始旅程',
        ja: '旅を始める'
      }
    }
    return texts[key as keyof typeof texts]?.[locale as keyof typeof texts.masters] || texts[key as keyof typeof texts]?.en
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className={className}
    >
      <div className="flex flex-col sm:flex-row gap-6 justify-center">
        <a 
          href={`/${locale}/masters`}
          className="px-8 py-4 border border-black text-black hover:bg-black hover:text-white transition-colors font-serif text-lg inline-block text-center"
        >
          {getButtonText('masters')}
        </a>
        
        <a 
          href={`/${locale}/philosophy`}
          className="px-8 py-4 border border-black text-black hover:bg-black hover:text-white transition-colors font-serif text-lg inline-block text-center"
        >
          {getButtonText('philosophy')}
        </a>
      </div>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mt-6 text-sm text-gray-600 font-serif"
      >
        {getButtonText('enter')}
      </motion.p>
    </motion.div>
  )
}