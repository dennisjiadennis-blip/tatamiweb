'use client'

import { motion, AnimatePresence, useMotionValue } from 'framer-motion'
import { ReactNode, useState, useEffect } from 'react'

// 增强的卡片悬停动画
interface AnimatedCardProps {
  children: ReactNode
  className?: string
  hoverScale?: number
  hoverRotate?: number
  glowEffect?: boolean
}

export function AnimatedCard({ 
  children, 
  className = '',
  hoverScale = 1.02,
  hoverRotate = 0,
  glowEffect = false
}: AnimatedCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className={`relative ${className}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ 
        scale: hoverScale,
        rotate: hoverRotate,
        z: 50
      }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20
      }}
      style={{
        transformStyle: 'preserve-3d'
      }}
    >
      {glowEffect && (
        <motion.div
          className="absolute inset-0 rounded-lg opacity-0 bg-gradient-to-r from-primary/20 to-secondary/20"
          animate={{
            opacity: isHovered ? 0.8 : 0,
            scale: isHovered ? 1.05 : 1
          }}
          transition={{ duration: 0.3 }}
          style={{ filter: 'blur(20px)', zIndex: -1 }}
        />
      )}
      {children}
    </motion.div>
  )
}

// 磁性按钮效果
interface MagneticButtonProps {
  children: ReactNode
  className?: string
  strength?: number
}

export function MagneticButton({ 
  children, 
  className = '',
  strength = 0.4
}: MagneticButtonProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const deltaX = (e.clientX - centerX) * strength
    const deltaY = (e.clientY - centerY) * strength
    
    setPosition({ x: deltaX, y: deltaY })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  return (
    <motion.div
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 15
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.div>
  )
}

// 文字打字机效果
interface TypewriterProps {
  text: string
  delay?: number
  speed?: number
  className?: string
}

export function Typewriter({ 
  text, 
  delay = 0, 
  speed = 0.05,
  className = ''
}: TypewriterProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
    >
      {text.split('').map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: delay + index * speed,
            duration: 0.1
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.div>
  )
}

// 波纹加载效果
interface RippleLoaderProps {
  size?: number
  color?: string
}

export function RippleLoader({ 
  size = 40, 
  color = 'currentColor' 
}: RippleLoaderProps) {
  return (
    <div 
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="absolute rounded-full border-2"
          style={{
            borderColor: color,
            borderTopColor: 'transparent'
          }}
          animate={{
            scale: [0, 1],
            opacity: [1, 0],
            rotate: 360
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: index * 0.4,
            ease: "easeInOut"
          }}
          initial={{ width: size, height: size }}
        />
      ))}
    </div>
  )
}

// 粒子背景效果
interface ParticleBackgroundProps {
  particleCount?: number
  className?: string
}

export function ParticleBackground({ 
  particleCount = 50,
  className = ''
}: ParticleBackgroundProps) {
  const particles = Array.from({ length: particleCount }, (_, i) => i)

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {particles.map((particle) => (
        <motion.div
          key={particle}
          className="absolute w-1 h-1 bg-primary/20 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: 0
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  )
}

// 数字计数动画
interface CountUpProps {
  end: number
  start?: number
  duration?: number
  decimals?: number
  suffix?: string
  prefix?: string
  className?: string
}

export function CountUp({
  end,
  start = 0,
  duration = 2,
  decimals = 0,
  suffix = '',
  prefix = '',
  className = ''
}: CountUpProps) {
  const [displayValue, setDisplayValue] = useState(start)
  const count = useMotionValue(start)

  useEffect(() => {
    const unsubscribe = count.on('change', (latest) => {
      setDisplayValue(latest)
    })
    return unsubscribe
  }, [count])

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      onViewportEnter={() => {
        count.set(end)
      }}
    >
      <motion.span
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 0.3 }}
      >
        {`${prefix}${displayValue.toFixed(decimals)}${suffix}`}
      </motion.span>
    </motion.span>
  )
}

// 路径绘制动画
interface PathDrawProps {
  d: string
  className?: string
  duration?: number
  delay?: number
}

export function PathDraw({ 
  d, 
  className = '',
  duration = 2,
  delay = 0
}: PathDrawProps) {
  return (
    <svg className={className} viewBox="0 0 100 100">
      <motion.path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          duration,
          delay,
          ease: "easeInOut"
        }}
      />
    </svg>
  )
}

// 视差滚动容器
interface ParallaxContainerProps {
  children: ReactNode
  speed?: number
  className?: string
}

export function ParallaxContainer({ 
  children, 
  speed = 0.5,
  className = ''
}: ParallaxContainerProps) {
  return (
    <motion.div
      className={className}
      initial={{ y: 0 }}
      whileInView={{ y: 0 }}
      transition={{
        duration: 0.6,
        ease: "easeOut"
      }}
      style={{
        y: useMotionValue(0)
      }}
      onViewportEnter={() => {
        // 视差效果逻辑
      }}
    >
      {children}
    </motion.div>
  )
}

// 3D 翻转卡片
interface FlipCardProps {
  front: ReactNode
  back: ReactNode
  className?: string
}

export function FlipCard({ front, back, className = '' }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div 
      className={`relative cursor-pointer ${className}`}
      style={{ perspective: '1000px' }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        {/* 正面 */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {front}
        </div>
        
        {/* 背面 */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          {back}
        </div>
      </motion.div>
    </div>
  )
}

// 浮动元素
interface FloatingElementProps {
  children: ReactNode
  duration?: number
  distance?: number
  className?: string
}

export function FloatingElement({ 
  children, 
  duration = 3,
  distance = 10,
  className = ''
}: FloatingElementProps) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [-distance, distance, -distance],
        rotate: [-1, 1, -1]
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  )
}