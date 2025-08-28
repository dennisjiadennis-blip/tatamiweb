'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCurrentLocale } from '@/i18n/hooks'
import { OptimizedVideoPlayer } from '@/components/video/optimized-video-player'
import { Icons } from '@/components/ui/icons'

export default function ProductIntroPage() {
  const locale = useCurrentLocale()
  
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [showText, setShowText] = useState(false)
  const [isVideoReady, setIsVideoReady] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isMuted, setIsMuted] = useState(() => {
    // 从localStorage读取用户偏好
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('product-intro-muted')
      return saved ? JSON.parse(saved) : true
    }
    return true
  })
  const [showControls, setShowControls] = useState(false)
  const [animationIntervalId, setAnimationIntervalId] = useState<NodeJS.Timeout | null>(null)
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [preloadProgress, setPreloadProgress] = useState(0)
  const [isPreloaded, setIsPreloaded] = useState(false)

  // 产品介绍文字内容 - 分段展示
  const introTexts = [
    {
      en: "Welcome to a new era of cultural connection",
      'zh-TW': "歡迎來到文化連結的新時代",
      ja: "文化的つながりの新時代へようこそ"
    },
    {
      en: "Where authentic experiences meet global minds",
      'zh-TW': "真實體驗與全球思維的交匯之處",
      ja: "本格的な体験とグローバルな心が出会う場所"
    },
    {
      en: "Discover Japan's most compelling masters",
      'zh-TW': "發現日本最具魅力的大師",
      ja: "日本で最も魅力的な達人を発見する"
    },
    {
      en: "Each story, a journey beyond the ordinary",
      'zh-TW': "每個故事，都是超越平凡的旅程",
      ja: "それぞれの物語は、日常を超えた旅路"
    },
    {
      en: "The Journey to Leave a Story",
      'zh-TW': "留下故事的旅程",
      ja: "物語を残す旅"
    }
  ]

  // 获取当前语言的文字
  const getCurrentText = (index: number) => {
    return introTexts[index]?.[locale as keyof typeof introTexts[0]] || introTexts[index]?.en || ''
  }

  // 文字序列动画 - 支持暂停/继续
  const startTextSequence = useCallback(() => {
    if (animationIntervalId) {
      clearInterval(animationIntervalId)
    }
    
    let currentIndex = 0
    const interval = setInterval(() => {
      if (!isPaused) {
        setCurrentTextIndex(currentIndex)
        currentIndex = (currentIndex + 1) % introTexts.length
      }
    }, 3500) // 每段文字显示3.5秒
    
    setAnimationIntervalId(interval)
  }, [isPaused, animationIntervalId])

  // 暂停/继续动画
  const toggleAnimation = useCallback(() => {
    setIsPaused(prev => !prev)
  }, [])

  // 手动切换文字
  const nextText = useCallback(() => {
    setCurrentTextIndex(prev => (prev + 1) % introTexts.length)
  }, [])

  const prevText = useCallback(() => {
    setCurrentTextIndex(prev => prev === 0 ? introTexts.length - 1 : prev - 1)
  }, [])

  // 分享功能
  const handleShare = useCallback(async () => {
    const shareData = {
      title: locale === 'ja' ? 'Tatami Labs - 物語を残す旅' :
             locale === 'zh-TW' ? 'Tatami Labs - 留下故事的旅程' :
             'Tatami Labs - The Journey to Leave a Story',
      text: getCurrentText(currentTextIndex),
      url: window.location.href
    }

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData)
      } else {
        // 回退到复制链接
        await navigator.clipboard.writeText(window.location.href)
        // 这里可以添加提示信息
        console.log('Link copied to clipboard')
      }
    } catch (err) {
      console.log('Share failed:', err)
    }
  }, [locale, currentTextIndex, getCurrentText])

  // 全屏功能
  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen()
        setIsFullscreen(true)
      } else {
        await document.exitFullscreen()
        setIsFullscreen(false)
      }
    } catch (err) {
      console.log('Fullscreen failed:', err)
    }
  }, [])

  // 监听全屏状态变化
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  // 键盘快捷键支持
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case ' ': // 空格键 - 暂停/播放
          e.preventDefault()
          toggleAnimation()
          break
        case 'ArrowLeft': // 左箭头 - 上一段文字
          e.preventDefault()
          prevText()
          break
        case 'ArrowRight': // 右箭头 - 下一段文字
          e.preventDefault()
          nextText()
          break
        case 'ArrowUp': // 上箭头 - 暂停
          e.preventDefault()
          setIsPaused(true)
          break
        case 'ArrowDown': // 下箭头 - 继续播放
          e.preventDefault()
          setIsPaused(false)
          break
        case 'm':
        case 'M': // M键 - 静音切换
          e.preventDefault()
          setIsMuted(prev => !prev)
          break
        case 'f':
        case 'F': // F键 - 全屏切换
          e.preventDefault()
          toggleFullscreen()
          break
        case 's':
        case 'S': // S键 - 分享
          e.preventDefault()
          handleShare()
          break
        case 'c':
        case 'C': // C键 - 显示/隐藏控制面板
          e.preventDefault()
          setShowControls(prev => !prev)
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [toggleAnimation, prevText, nextText, toggleFullscreen, handleShare])

  // 触摸手势处理
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    })
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    })
  }, [])

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return

    const distanceX = touchStart.x - touchEnd.x
    const distanceY = touchStart.y - touchEnd.y
    const isLeftSwipe = distanceX > 50
    const isRightSwipe = distanceX < -50
    const isUpSwipe = distanceY > 50
    const isDownSwipe = distanceY < -50

    // 水平滑动切换文字
    if (Math.abs(distanceX) > Math.abs(distanceY)) {
      if (isLeftSwipe) {
        nextText()
      } else if (isRightSwipe) {
        prevText()
      }
    }
    // 垂直滑动控制播放状态
    else if (Math.abs(distanceY) > 30) {
      if (isUpSwipe) {
        setIsPaused(true)
      } else if (isDownSwipe) {
        setIsPaused(false)
      }
    }
  }, [touchStart, touchEnd, nextText, prevText])

  // 视频加载完成后开始文字序列
  useEffect(() => {
    if (isVideoReady && !isPaused) {
      const startDelay = setTimeout(() => {
        setShowText(true)
        startTextSequence()
      }, 2000) // 视频播放2秒后开始文字

      return () => clearTimeout(startDelay)
    }
  }, [isVideoReady, isPaused, startTextSequence])

  // 清理定时器
  useEffect(() => {
    return () => {
      if (animationIntervalId) {
        clearInterval(animationIntervalId)
      }
    }
  }, [animationIntervalId])

  // 保存用户偏好设置
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('product-intro-muted', JSON.stringify(isMuted))
    }
  }, [isMuted])

  // 记录用户观看进度
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('product-intro-last-text', currentTextIndex.toString())
    }
  }, [currentTextIndex])

  // 视频预加载优化
  useEffect(() => {
    const video = document.querySelector('video') as HTMLVideoElement
    if (!video) return

    const handleProgress = () => {
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1)
        const duration = video.duration
        const progress = (bufferedEnd / duration) * 100
        setPreloadProgress(progress)
        
        // 当缓冲达到80%时认为预加载完成
        if (progress >= 80) {
          setIsPreloaded(true)
        }
      }
    }

    const handleCanPlayThrough = () => {
      setIsPreloaded(true)
      setPreloadProgress(100)
    }

    video.addEventListener('progress', handleProgress)
    video.addEventListener('canplaythrough', handleCanPlayThrough)

    return () => {
      video.removeEventListener('progress', handleProgress)
      video.removeEventListener('canplaythrough', handleCanPlayThrough)
    }
  }, [isVideoReady])

  return (
    <div 
      className="relative w-full h-screen bg-black flex items-center justify-center overflow-hidden touch-none"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      onClick={() => setShowControls(prev => !prev)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      
      {/* 16:9电影级视频容器 - 响应式优化 */}
      <div 
        className="relative border border-gray-400/20 shadow-2xl"
        style={{
          width: 'min(95vw, 100vh * 16/9)', // 确保在竖屏设备上适应
          height: 'min(95vw * 9/16, 100vh - 120px)', // 为黑边留出空间
          maxWidth: '1600px',
          maxHeight: '900px',
          backgroundColor: '#000'
        }}
      >
        
        {/* 视频背景 */}
        <OptimizedVideoPlayer
          src="/videos/faces/微笑.mp4"
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted={isMuted}
          playsInline
          controls={false}
          enableQualitySelector={false}
          enableAnalytics={false}
          customControls={false}
          preload={true}
          onCanPlay={() => setIsVideoReady(true)}
        />

        {/* 交互控制界面 */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* 主控制面板 */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 bg-black/60 backdrop-blur-md rounded-full px-6 py-3">
                {/* 上一段文字 */}
                <motion.button
                  onClick={prevText}
                  className="w-10 h-10 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icons.chevronLeft className="h-5 w-5" />
                </motion.button>

                {/* 暂停/播放 */}
                <motion.button
                  onClick={toggleAnimation}
                  className="w-12 h-12 flex items-center justify-center text-white hover:bg-white/20 rounded-full transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isPaused ? 
                    <Icons.play className="h-6 w-6 ml-1" /> : 
                    <Icons.pause className="h-6 w-6" />
                  }
                </motion.button>

                {/* 下一段文字 */}
                <motion.button
                  onClick={nextText}
                  className="w-10 h-10 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icons.chevronRight className="h-5 w-5" />
                </motion.button>

                {/* 音频切换 */}
                <motion.button
                  onClick={() => setIsMuted(prev => !prev)}
                  className="w-10 h-10 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isMuted ? 
                    <Icons.volumeX className="h-5 w-5" /> : 
                    <Icons.volume2 className="h-5 w-5" />
                  }
                </motion.button>

                {/* 分享按钮 */}
                <motion.button
                  onClick={handleShare}
                  className="w-10 h-10 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icons.share className="h-5 w-5" />
                </motion.button>

                {/* 全屏按钮 */}
                <motion.button
                  onClick={toggleFullscreen}
                  className="w-10 h-10 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isFullscreen ? 
                    <Icons.minimize className="h-5 w-5" /> : 
                    <Icons.maximize className="h-5 w-5" />
                  }
                </motion.button>
              </div>

              {/* 进度指示器 */}
              <div className="absolute top-6 left-1/2 transform -translate-x-1/2 flex items-center space-x-2">
                {introTexts.map((_, index) => (
                  <motion.div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentTextIndex ? 'bg-white' : 'bg-white/40'
                    }`}
                    animate={{ 
                      scale: index === currentTextIndex ? 1.5 : 1,
                      opacity: index === currentTextIndex ? 1 : 0.4 
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 文字叠加层 - 响应式字体和间距 */}
        <AnimatePresence>
          {showText && (
            <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-8 md:px-12 bg-gradient-to-b from-black/5 via-transparent to-black/20">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTextIndex}
                  className="text-white text-center w-full max-w-6xl"
                  initial={{ opacity: 0, y: 50, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -50, scale: 0.8 }}
                  transition={{ 
                    duration: 1.5,
                    ease: [0.22, 1, 0.36, 1],
                    type: "spring",
                    damping: 25,
                    stiffness: 100
                  }}
                  style={{
                    fontSize: 'clamp(1.8rem, 8vw, 6rem)', // 更好的响应式字体
                    lineHeight: '1.15',
                    fontWeight: '200',
                    letterSpacing: '-0.025em',
                    textShadow: `
                      0 0 30px rgba(0,0,0,0.9),
                      0 5px 15px rgba(0,0,0,0.8),
                      0 2px 5px rgba(0,0,0,0.7)
                    `,
                    fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
                    textRendering: 'optimizeLegibility'
                  }}
                >
                  {getCurrentText(currentTextIndex)}
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </AnimatePresence>

        {/* 细腻的内边框装饰 */}
        <div className="absolute inset-2 border border-white/5 pointer-events-none" />

        {/* 移动端手势提示 */}
        <div className="absolute top-4 right-4 md:hidden">
          <motion.div
            className="bg-black/60 backdrop-blur-md rounded-lg px-3 py-2 text-white/80 text-xs"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 3 }}
          >
            <div className="space-y-1">
              <div>← → {locale === 'ja' ? 'テキスト切替' : locale === 'zh-TW' ? '文字切換' : 'Switch text'}</div>
              <div>↑ ↓ {locale === 'ja' ? '再生制御' : locale === 'zh-TW' ? '播放控制' : 'Pause/Play'}</div>
              <div>{locale === 'ja' ? 'タップで操作' : locale === 'zh-TW' ? '點擊控制' : 'Tap for controls'}</div>
            </div>
          </motion.div>
        </div>

        {/* 桌面端键盘快捷键提示 */}
        <div className="absolute top-4 left-4 hidden md:block">
          <motion.div
            className="bg-black/60 backdrop-blur-md rounded-lg px-4 py-3 text-white/80 text-xs"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 4 }}
          >
            <div className="space-y-1">
              <div className="font-medium mb-2">
                {locale === 'ja' ? 'キーボードショートカット' : 
                 locale === 'zh-TW' ? '鍵盤快捷鍵' : 'Keyboard Shortcuts'}
              </div>
              <div><kbd className="bg-white/20 px-1 rounded text-xs">Space</kbd> - {locale === 'ja' ? '再生/一時停止' : locale === 'zh-TW' ? '播放/暫停' : 'Play/Pause'}</div>
              <div><kbd className="bg-white/20 px-1 rounded text-xs">← →</kbd> - {locale === 'ja' ? 'テキスト切替' : locale === 'zh-TW' ? '文字切換' : 'Switch text'}</div>
              <div><kbd className="bg-white/20 px-1 rounded text-xs">F</kbd> - {locale === 'ja' ? 'フルスクリーン' : locale === 'zh-TW' ? '全螢幕' : 'Fullscreen'}</div>
              <div><kbd className="bg-white/20 px-1 rounded text-xs">M</kbd> - {locale === 'ja' ? 'ミュート' : locale === 'zh-TW' ? '靜音' : 'Mute'}</div>
              <div><kbd className="bg-white/20 px-1 rounded text-xs">S</kbd> - {locale === 'ja' ? '共有' : locale === 'zh-TW' ? '分享' : 'Share'}</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 电影级上下黑边 - 响应式高度 */}
      <div 
        className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black to-black/80 z-10"
        style={{ height: 'max(40px, 8vh)' }}
      />
      <div 
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-black/80 z-10"
        style={{ height: 'max(40px, 8vh)' }}
      />
      
      {/* 视频加载指示器 - 增强视觉效果和进度显示 */}
      {(!isVideoReady || !isPreloaded) && (
        <motion.div 
          className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              <Icons.spinner className="h-12 w-12 animate-spin text-white/80" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white/60 text-xs font-mono">
                  {Math.round(preloadProgress)}%
                </span>
              </div>
            </div>
            
            <div className="text-center space-y-2">
              <p className="text-white/80 text-lg font-light tracking-wide">
                {locale === 'ja' ? 'ロード中...' : 
                 locale === 'zh-TW' ? '載入中...' : 
                 'Loading...'}
              </p>
              
              {/* 进度条 */}
              <div className="w-64 h-1 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-white/60 to-white/80 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${preloadProgress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
              
              <p className="text-white/40 text-xs">
                {locale === 'ja' ? 'ビデオを準備しています...' : 
                 locale === 'zh-TW' ? '準備視頻中...' : 
                 'Preparing cinematic experience...'}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}