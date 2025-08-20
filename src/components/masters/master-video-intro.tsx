'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'

interface MasterVideoIntroProps {
  videoUrl: string
  masterName: string
}

export function MasterVideoIntro({ videoUrl, masterName }: MasterVideoIntroProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handlePlayPause = async () => {
    if (!videoRef.current) return

    try {
      if (isPlaying) {
        videoRef.current.pause()
        setIsPlaying(false)
      } else {
        setIsLoading(true)
        await videoRef.current.play()
        setIsPlaying(true)
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Video play error:', error)
      setIsLoading(false)
    }
  }

  const handleVideoEnd = () => {
    setIsPlaying(false)
  }

  const handleVideoLoadStart = () => {
    setIsLoading(true)
  }

  const handleVideoCanPlay = () => {
    setIsLoading(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-light mb-4">
          Meet {masterName}
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Watch this personal introduction to understand their philosophy and approach to their craft.
        </p>
      </div>

      <div className="relative aspect-video rounded-lg overflow-hidden bg-black group">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          onEnded={handleVideoEnd}
          onLoadStart={handleVideoLoadStart}
          onCanPlay={handleVideoCanPlay}
          onError={() => setIsLoading(false)}
          preload="metadata"
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* 播放控制覆盖层 */}
        {!isPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-colors duration-300"
          >
            <Button
              size="lg"
              onClick={handlePlayPause}
              disabled={isLoading}
              className="rounded-full w-20 h-20 bg-white/90 hover:bg-white text-black hover:text-black"
            >
              {isLoading ? (
                <Icons.spinner className="h-8 w-8 animate-spin" />
              ) : (
                <Icons.play className="h-8 w-8 ml-1" />
              )}
            </Button>
          </motion.div>
        )}

        {/* 播放时的控制条 */}
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6"
          >
            <div className="flex items-center justify-between text-white">
              <div>
                <h3 className="font-medium">{masterName}</h3>
                <p className="text-sm opacity-80">Personal Introduction</p>
              </div>
              
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePlayPause}
                  className="text-white hover:bg-white/20"
                >
                  <Icons.pause className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* 加载指示器 */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <Icons.spinner className="h-8 w-8 animate-spin text-white" />
          </div>
        )}
      </div>

      {/* 视频描述 */}
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          This introduction video provides insights into {masterName}&apos;s background, 
          philosophy, and what makes their approach unique.
        </p>
      </div>
    </motion.div>
  )
}