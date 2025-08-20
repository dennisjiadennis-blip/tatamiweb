'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

// 脉冲加载动画
interface PulseLoaderProps {
  size?: 'sm' | 'md' | 'lg'
  color?: string
  className?: string
}

export function PulseLoader({ 
  size = 'md', 
  color = 'currentColor',
  className = ''
}: PulseLoaderProps) {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3', 
    lg: 'w-4 h-4'
  }

  return (
    <div className={`flex space-x-1 items-center justify-center ${className}`}>
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className={`${sizeClasses[size]} rounded-full`}
          style={{ backgroundColor: color }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: index * 0.2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  )
}

// 旋转加载器
interface SpinnerProps {
  size?: number
  thickness?: number
  color?: string
  className?: string
}

export function Spinner({ 
  size = 24, 
  thickness = 2,
  color = 'currentColor',
  className = ''
}: SpinnerProps) {
  return (
    <motion.div
      className={`inline-block ${className}`}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }}
      style={{
        width: size,
        height: size,
        border: `${thickness}px solid transparent`,
        borderTopColor: color,
        borderRadius: '50%'
      }}
    />
  )
}

// 波浪加载动画
export function WaveLoader({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-end space-x-1 ${className}`}>
      {[0, 1, 2, 3, 4].map((index) => (
        <motion.div
          key={index}
          className="w-1 bg-current"
          animate={{
            height: ["4px", "16px", "4px"]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: index * 0.1,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  )
}

// 骨架屏加载
interface SkeletonProps {
  className?: string
  width?: string | number
  height?: string | number
  rounded?: boolean
}

export function Skeleton({ 
  className = '',
  width = '100%',
  height = '1rem',
  rounded = false
}: SkeletonProps) {
  return (
    <motion.div
      className={`bg-muted ${rounded ? 'rounded-full' : 'rounded'} ${className}`}
      style={{ width, height }}
      animate={{
        opacity: [0.5, 1, 0.5]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  )
}

// 卡片骨架屏
export function CardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`p-6 space-y-4 ${className}`}>
      <Skeleton height="12px" width="60%" />
      <Skeleton height="8px" />
      <Skeleton height="8px" width="80%" />
      <div className="flex space-x-2 pt-2">
        <Skeleton width="60px" height="20px" rounded />
        <Skeleton width="40px" height="20px" rounded />
      </div>
    </div>
  )
}

// 进度条加载
interface ProgressLoaderProps {
  progress: number
  className?: string
  showText?: boolean
  color?: string
}

export function ProgressLoader({ 
  progress, 
  className = '',
  showText = true,
  color = 'currentColor'
}: ProgressLoaderProps) {
  return (
    <div className={`w-full ${className}`}>
      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{
            duration: 0.5,
            ease: "easeOut"
          }}
        />
      </div>
      {showText && (
        <motion.div
          className="text-center text-sm mt-2 text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {progress}%
        </motion.div>
      )}
    </div>
  )
}

// 内容加载容器
interface LoadingContainerProps {
  loading: boolean
  children: ReactNode
  loader?: ReactNode
  className?: string
}

export function LoadingContainer({ 
  loading, 
  children, 
  loader,
  className = ''
}: LoadingContainerProps) {
  const defaultLoader = (
    <div className="flex items-center justify-center p-8">
      <Spinner size={32} />
    </div>
  )

  return (
    <div className={`relative ${className}`}>
      <motion.div
        animate={{ opacity: loading ? 0.3 : 1 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
      
      {loading && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {loader || defaultLoader}
        </motion.div>
      )}
    </div>
  )
}

// 文字闪烁加载
interface BlinkingTextProps {
  text: string
  className?: string
}

export function BlinkingText({ text, className = '' }: BlinkingTextProps) {
  return (
    <motion.div
      className={className}
      animate={{ opacity: [1, 0.3, 1] }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {text}
    </motion.div>
  )
}

// 网格加载动画
export function GridLoader({ className = '' }: { className?: string }) {
  return (
    <div className={`grid grid-cols-3 gap-1 w-6 h-6 ${className}`}>
      {Array.from({ length: 9 }, (_, index) => (
        <motion.div
          key={index}
          className="w-1 h-1 bg-current rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 1, 0.3]
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: index * 0.1,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  )
}

// 呼吸加载动画
export function BreathingLoader({ 
  size = 40,
  color = 'currentColor',
  className = ''
}: {
  size?: number
  color?: string
  className?: string
}) {
  return (
    <motion.div
      className={`rounded-full ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: color
      }}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.6, 1, 0.6]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  )
}