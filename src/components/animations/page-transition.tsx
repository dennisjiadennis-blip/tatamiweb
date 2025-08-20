'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

interface PageTransitionProps {
  children: ReactNode
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1
  },
  out: {
    opacity: 0,
    y: -20,
    scale: 1.02
  }
}

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5
}

// 不同页面类型的动画变体
const getPageVariants = (pathname: string) => {
  // 首页特殊动画
  if (pathname === '/' || pathname.match(/^\/[^\/]*\/?$/)) {
    return {
      initial: {
        opacity: 0,
        scale: 0.95,
        filter: 'blur(10px)'
      },
      in: {
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)'
      },
      out: {
        opacity: 0,
        scale: 1.05,
        filter: 'blur(5px)'
      }
    }
  }

  // 达人页面滑入动画
  if (pathname.includes('/masters')) {
    return {
      initial: {
        opacity: 0,
        x: 100,
        rotateY: 5
      },
      in: {
        opacity: 1,
        x: 0,
        rotateY: 0
      },
      out: {
        opacity: 0,
        x: -100,
        rotateY: -5
      }
    }
  }

  // 会员中心淡入淡出
  if (pathname.includes('/profile')) {
    return {
      initial: {
        opacity: 0,
        y: 30,
        scale: 0.97
      },
      in: {
        opacity: 1,
        y: 0,
        scale: 1
      },
      out: {
        opacity: 0,
        y: -30,
        scale: 1.03
      }
    }
  }

  // 社区页面弹跳效果
  if (pathname.includes('/community')) {
    return {
      initial: {
        opacity: 0,
        scale: 0.9,
        y: 50
      },
      in: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
          type: 'spring',
          damping: 25,
          stiffness: 200
        }
      },
      out: {
        opacity: 0,
        scale: 0.95,
        y: -20
      }
    }
  }

  // 默认动画
  return pageVariants
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const variants = getPageVariants(pathname)
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={variants}
        transition={pageTransition}
        style={{
          width: '100%',
          minHeight: '100vh'
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

// 子页面布局组件
interface SectionAnimationProps {
  children: ReactNode
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right'
  duration?: number
}

export function SectionAnimation({ 
  children, 
  delay = 0, 
  direction = 'up',
  duration = 0.6 
}: SectionAnimationProps) {
  const getDirectionVariants = () => {
    const directions = {
      up: { y: 50, x: 0 },
      down: { y: -50, x: 0 },
      left: { y: 0, x: 50 },
      right: { y: 0, x: -50 }
    }
    
    return {
      initial: {
        opacity: 0,
        ...directions[direction]
      },
      animate: {
        opacity: 1,
        x: 0,
        y: 0
      }
    }
  }

  return (
    <motion.div
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-100px" }}
      variants={getDirectionVariants()}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.25, 0, 1]
      }}
    >
      {children}
    </motion.div>
  )
}

// 交错动画容器
interface StaggerContainerProps {
  children: ReactNode
  staggerDelay?: number
  className?: string
}

export function StaggerContainer({ 
  children, 
  staggerDelay = 0.1,
  className 
}: StaggerContainerProps) {
  return (
    <motion.div
      className={className}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      variants={{
        initial: {},
        animate: {
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
    >
      {children}
    </motion.div>
  )
}

// 交错动画子项
interface StaggerItemProps {
  children: ReactNode
  className?: string
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  return (
    <motion.div
      className={className}
      variants={{
        initial: {
          opacity: 0,
          y: 20,
          scale: 0.95
        },
        animate: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            duration: 0.5,
            ease: [0.25, 0.25, 0, 1]
          }
        }
      }}
    >
      {children}
    </motion.div>
  )
}