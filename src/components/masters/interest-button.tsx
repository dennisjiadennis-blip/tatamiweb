'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import { useAuth } from '@/lib/hooks/use-auth'
import { useInterests } from '@/lib/hooks/use-auth'

interface InterestButtonProps {
  masterId: string
  masterName: string
  interestCount: number
}

export function InterestButton({ masterId, masterName, interestCount }: InterestButtonProps) {
  const [isExpressed, setIsExpressed] = useState(false)
  const [currentCount, setCurrentCount] = useState(interestCount)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const { isAuthenticated, redirectToSignIn } = useAuth()
  const { expressInterest, isExpressing } = useInterests()

  // 检查用户是否已经表达过兴趣
  useEffect(() => {
    const checkInterest = async () => {
      if (!isAuthenticated) return

      try {
        const response = await fetch('/api/interests')
        const result = await response.json()
        
        if (result.success) {
          const hasExpressed = result.data.some(
            (interest: any) => interest.masterId === masterId
          )
          setIsExpressed(hasExpressed)
        }
      } catch (error) {
        console.error('Failed to check interest:', error)
      }
    }

    checkInterest()
  }, [isAuthenticated, masterId])

  const handleExpressInterest = async () => {
    if (!isAuthenticated) {
      redirectToSignIn()
      return
    }

    if (isExpressed || isExpressing) return

    setIsLoading(true)
    try {
      const result = await expressInterest(masterId)
      
      if (result) {
        setIsExpressed(true)
        setCurrentCount(prev => prev + 1)
        setShowSuccess(true)
        
        // 隐藏成功消息
        setTimeout(() => setShowSuccess(false), 3000)
      }
    } catch (error) {
      console.error('Failed to express interest:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center space-x-4">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          size="lg"
          onClick={handleExpressInterest}
          disabled={isLoading || isExpressing}
          className={`relative ${
            isExpressed 
              ? 'bg-primary/20 text-primary border-primary hover:bg-primary/30' 
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
          }`}
          variant={isExpressed ? 'outline' : 'default'}
        >
          <AnimatePresence mode="wait">
            {isLoading || isExpressing ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center space-x-2"
              >
                <Icons.spinner className="h-4 w-4 animate-spin" />
                <span>Processing...</span>
              </motion.div>
            ) : isExpressed ? (
              <motion.div
                key="expressed"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center space-x-2"
              >
                <Icons.check className="h-4 w-4" />
                <span>Interest Expressed</span>
              </motion.div>
            ) : (
              <motion.div
                key="express"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center space-x-2"
              >
                <Icons.heart className="h-4 w-4" />
                <span>Express Interest</span>
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>

      {/* 兴趣计数 */}
      <motion.div
        className="flex items-center space-x-2 text-white/80"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Icons.heart className="h-4 w-4" />
        <motion.span
          key={currentCount}
          initial={{ scale: 1.2, color: '#ef4444' }}
          animate={{ scale: 1, color: 'currentColor' }}
          className="font-medium"
        >
          {currentCount}
        </motion.span>
        <span className="text-sm">interested</span>
      </motion.div>

      {/* 成功提示 */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.8 }}
            className="absolute top-full mt-2 left-0 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg"
          >
            <div className="flex items-center space-x-2">
              <Icons.check className="h-4 w-4" />
              <span className="text-sm">
                Thanks for expressing interest in {masterName}!
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}