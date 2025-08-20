'use client'

import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion'
import { ReactNode, useState, useRef, useEffect } from 'react'
import { Icons } from '@/components/ui/icons'

// 按钮点击波纹效果
interface RippleButtonProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  disabled?: boolean
}

export function RippleButton({ 
  children, 
  className = '',
  onClick,
  disabled = false
}: RippleButtonProps) {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return
    
    const rect = buttonRef.current?.getBoundingClientRect()
    if (rect) {
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const newRipple = { id: Date.now(), x, y }
      
      setRipples(prev => [...prev, newRipple])
      
      // 移除波纹效果
      setTimeout(() => {
        setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id))
      }, 600)
    }
    
    onClick?.()
  }

  return (
    <motion.button
      ref={buttonRef}
      className={`relative overflow-hidden ${className}`}
      onClick={handleClick}
      disabled={disabled}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {children}
      
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          className="absolute bg-white/30 rounded-full pointer-events-none"
          style={{
            left: ripple.x - 25,
            top: ripple.y - 25,
            width: 50,
            height: 50
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      ))}
    </motion.button>
  )
}

// 悬停工具提示
interface HoverTooltipProps {
  children: ReactNode
  content: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
}

export function HoverTooltip({ 
  children, 
  content, 
  position = 'top',
  className = ''
}: HoverTooltipProps) {
  const [isVisible, setIsVisible] = useState(false)

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  }

  return (
    <div 
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className={`absolute z-50 px-2 py-1 text-xs text-white bg-gray-900 rounded whitespace-nowrap ${positionClasses[position]}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            {content}
            {/* 箭头 */}
            <div className={`absolute w-1 h-1 bg-gray-900 transform rotate-45 ${
              position === 'top' ? 'top-full left-1/2 -translate-x-1/2 -mt-0.5' :
              position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 -mb-0.5' :
              position === 'left' ? 'left-full top-1/2 -translate-y-1/2 -ml-0.5' :
              'right-full top-1/2 -translate-y-1/2 -mr-0.5'
            }`} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// 点赞心形动画
interface LikeHeartProps {
  isLiked: boolean
  onToggle: () => void
  className?: string
}

export function LikeHeart({ isLiked, onToggle, className = '' }: LikeHeartProps) {
  const [particles, setParticles] = useState<Array<{ id: number; angle: number }>>([])

  const handleClick = () => {
    onToggle()
    
    if (!isLiked) {
      // 创建粒子效果
      const newParticles = Array.from({ length: 6 }, (_, i) => ({
        id: Date.now() + i,
        angle: (i * 60) + Math.random() * 30
      }))
      
      setParticles(newParticles)
      
      setTimeout(() => {
        setParticles([])
      }, 1000)
    }
  }

  return (
    <div className={`relative ${className}`}>
      <motion.button
        onClick={handleClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <motion.div
          animate={{
            scale: isLiked ? [1, 1.3, 1] : 1,
            rotate: isLiked ? [0, -10, 10, 0] : 0
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Icons.heart 
            className={`w-6 h-6 transition-colors ${
              isLiked ? 'text-red-500 fill-red-500' : 'text-gray-400'
            }`}
          />
        </motion.div>
      </motion.button>

      {/* 粒子效果 */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-red-500 rounded-full"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)'
          }}
          initial={{ scale: 0, x: 0, y: 0 }}
          animate={{
            scale: [0, 1, 0],
            x: Math.cos(particle.angle * Math.PI / 180) * 30,
            y: Math.sin(particle.angle * Math.PI / 180) * 30
          }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      ))}
    </div>
  )
}

// 滑动删除
interface SwipeToDeleteProps {
  children: ReactNode
  onDelete: () => void
  threshold?: number
  className?: string
}

export function SwipeToDelete({ 
  children, 
  onDelete, 
  threshold = 100,
  className = ''
}: SwipeToDeleteProps) {
  const x = useMotionValue(0)
  const opacity = useTransform(x, [-threshold, 0], [0.5, 1])
  const deleteOpacity = useTransform(x, [-threshold, -threshold/2], [1, 0])

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        className="absolute inset-0 bg-red-500 flex items-center justify-end pr-4"
        style={{ opacity: deleteOpacity }}
      >
        <Icons.close className="w-5 h-5 text-white" />
      </motion.div>
      
      <motion.div
        drag="x"
        dragConstraints={{ left: -threshold, right: 0 }}
        dragElastic={0.2}
        style={{ x, opacity }}
        onDragEnd={(_, info) => {
          if (info.offset.x < -threshold) {
            onDelete()
          }
        }}
        className="bg-background"
      >
        {children}
      </motion.div>
    </div>
  )
}

// 拖拽重排序
interface DragReorderProps {
  items: Array<{ id: string; content: ReactNode }>
  onReorder: (items: Array<{ id: string; content: ReactNode }>) => void
  className?: string
}

export function DragReorder({ items, onReorder, className = '' }: DragReorderProps) {
  const [draggedItem, setDraggedItem] = useState<string | null>(null)

  return (
    <div className={`space-y-2 ${className}`}>
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          draggable
          onDragStart={() => setDraggedItem(item.id)}
          onDragEnd={() => setDraggedItem(null)}
          whileHover={{ scale: 1.02 }}
          whileDrag={{ scale: 1.05, rotate: 2 }}
          className={`p-3 bg-card rounded-lg cursor-move ${
            draggedItem === item.id ? 'shadow-lg z-10' : ''
          }`}
          layout
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {item.content}
        </motion.div>
      ))}
    </div>
  )
}

// 长按菜单
interface LongPressMenuProps {
  children: ReactNode
  menuItems: Array<{ label: string; icon?: ReactNode; onClick: () => void }>
  className?: string
}

export function LongPressMenu({ children, menuItems, className = '' }: LongPressMenuProps) {
  const [isMenuVisible, setIsMenuVisible] = useState(false)
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 })
  const longPressTimer = useRef<NodeJS.Timeout>()

  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMenuPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })

    longPressTimer.current = setTimeout(() => {
      setIsMenuVisible(true)
    }, 500)
  }

  const handleMouseUp = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
    }
  }

  const handleMenuItemClick = (onClick: () => void) => {
    onClick()
    setIsMenuVisible(false)
  }

  return (
    <div 
      className={`relative ${className}`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {children}
      
      <AnimatePresence>
        {isMenuVisible && (
          <>
            {/* 背景遮罩 */}
            <motion.div
              className="fixed inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuVisible(false)}
            />
            
            {/* 菜单 */}
            <motion.div
              className="absolute z-50 bg-background border rounded-lg shadow-lg py-1 min-w-32"
              style={{
                left: menuPosition.x,
                top: menuPosition.y
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              {menuItems.map((item, index) => (
                <motion.button
                  key={index}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center space-x-2"
                  onClick={() => handleMenuItemClick(item.onClick)}
                  whileHover={{ backgroundColor: 'var(--muted)' }}
                >
                  {item.icon && <span>{item.icon}</span>}
                  <span>{item.label}</span>
                </motion.button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

// 滚动视差触发器
interface ScrollTriggerProps {
  children: ReactNode
  triggerPoint?: number
  className?: string
}

export function ScrollTrigger({ 
  children, 
  triggerPoint = 0.3,
  className = ''
}: ScrollTriggerProps) {
  const [isTriggered, setIsTriggered] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= triggerPoint) {
          setIsTriggered(true)
        }
      },
      { threshold: triggerPoint }
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => observer.disconnect()
  }, [triggerPoint])

  return (
    <motion.div
      ref={elementRef}
      className={className}
      initial={{ opacity: 0, y: 50 }}
      animate={isTriggered ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}