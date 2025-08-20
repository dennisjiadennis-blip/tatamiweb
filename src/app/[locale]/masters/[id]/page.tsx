'use client'

import { useState, useEffect, use } from 'react'
import { notFound } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Icons } from '@/components/ui/icons'
import { MasterVideoIntro } from '@/components/masters/master-video-intro'
import { InterestButton } from '@/components/masters/interest-button'
import { useCurrentLocale, useTranslations } from '@/i18n/hooks'
import { useAuth } from '@/lib/hooks/use-auth'

interface Master {
  id: string
  name: string
  nameEn?: string
  nameJa?: string
  title: string
  titleEn?: string
  titleJa?: string
  description?: string
  descriptionEn?: string
  descriptionJa?: string
  bio?: string
  bioEn?: string
  bioJa?: string
  heroImage?: string
  profileVideo?: string
  galleryImages?: string[]
  location?: string
  locationEn?: string
  locationJa?: string
  tags?: string[]
  philosophy?: string
  philosophyEn?: string
  philosophyJa?: string
  expertise?: string
  expertiseEn?: string
  expertiseJa?: string
  achievements?: string
  achievementsEn?: string
  achievementsJa?: string
  hasTripProduct: boolean
  tripPrice?: number
  tripDuration?: string
  tripDescription?: string
  tripDescriptionEn?: string
  tripDescriptionJa?: string
  contactEmail?: string
  socialLinks?: any
  availableSlots?: number
  createdAt: string
  updatedAt: string
}

interface MasterPageResponse {
  master: Master
  stats: {
    interestCount: number
  }
  recentInterests: Array<{
    id: string
    createdAt: string
    user: {
      id: string
      name?: string
      avatar?: string
    }
  }>
}

export default function MasterPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [data, setData] = useState<MasterPageResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const locale = useCurrentLocale()
  const t = useTranslations()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    const fetchMaster = async () => {
      try {
        const response = await fetch(`/api/masters/${resolvedParams.id}`)
        const result = await response.json()
        
        if (result.success) {
          setData(result.data)
        } else if (response.status === 404) {
          notFound()
        } else {
          setError(result.error?.message || 'Failed to load master')
        }
      } catch (err) {
        setError('Failed to load master')
      } finally {
        setLoading(false)
      }
    }

    fetchMaster()
  }, [resolvedParams.id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  const { master, stats } = data

  // 获取本地化内容
  const getName = () => {
    switch (locale) {
      case 'ja':
        return master.nameJa || master.name
      case 'zh-TW':
        return master.name || master.nameEn  // 修复：优先显示中文名称
      default:
        return master.nameEn || master.name
    }
  }

  const getTitle = () => {
    switch (locale) {
      case 'ja':
        return master.titleJa || master.title
      case 'zh-TW':
        return master.title || master.titleEn  // 修复：优先显示中文标题
      default:
        return master.titleEn || master.title
    }
  }

  const getDescription = () => {
    switch (locale) {
      case 'ja':
        return master.descriptionJa || master.description
      case 'zh-TW':
        return master.description || master.descriptionEn  // 修复：优先显示中文描述
      default:
        return master.descriptionEn || master.description
    }
  }

  const getBio = () => {
    switch (locale) {
      case 'ja':
        return master.bioJa || master.bio
      case 'zh-TW':
        return master.bio || master.bioEn  // 修复：优先显示中文传记
      default:
        return master.bioEn || master.bio
    }
  }

  const getPhilosophy = () => {
    switch (locale) {
      case 'ja':
        return master.philosophyJa || master.philosophy
      case 'zh-TW':
        return master.philosophy || master.philosophyEn  // 修复：优先显示中文理念
      default:
        return master.philosophyEn || master.philosophy
    }
  }

  const getLocation = () => {
    switch (locale) {
      case 'ja':
        return master.locationJa || master.location
      case 'zh-TW':
        return master.location || master.locationEn  // 修复：优先显示中文位置
      default:
        return master.locationEn || master.location
    }
  }

  return (
    <div className="min-h-screen">
      {/* 英雄区域 */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* 背景图片 */}
        {master.heroImage && (
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${master.heroImage})` }}
          >
            <div className="absolute inset-0 bg-black/40" />
          </div>
        )}

        {/* 内容 */}
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-light mb-4">
              {getName()}
            </h1>
            <p className="text-xl md:text-2xl font-light mb-6 opacity-90">
              {getTitle()}
            </p>
            
            {getLocation() && (
              <div className="flex items-center justify-center space-x-2 mb-8 opacity-80">
                <Icons.mapPin className="h-5 w-5" />
                <span className="text-lg">{getLocation()}</span>
              </div>
            )}

            {getDescription() && (
              <p className="text-lg opacity-80 max-w-2xl mx-auto mb-8">
                {getDescription()}
              </p>
            )}

            {/* 标签 */}
            {master.tags && master.tags.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {master.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="bg-white/20 text-white border-white/30">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* 行动按钮 */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <InterestButton 
                masterId={master.id}
                masterName={getName()}
                interestCount={stats.interestCount}
              />
              
              {master.hasTripProduct && (
                <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-black">
                  Book a Journey
                </Button>
              )}
            </div>
          </motion.div>
        </div>

        {/* 向下滚动指示器 */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Icons.chevronDown className="h-6 w-6 text-white/60" />
        </motion.div>
      </section>

      {/* 视频介绍区域 */}
      {master.profileVideo && (
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <MasterVideoIntro
              videoUrl={master.profileVideo}
              masterName={getName()}
            />
          </div>
        </section>
      )}

      {/* 详细信息区域 */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* 主要内容 */}
            <div className="lg:col-span-2 space-y-12">
              {/* 传记 */}
              {getBio() && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-2xl font-light mb-6">About {getName()}</h2>
                  <div className="prose prose-lg max-w-none">
                    {getBio().split('\n').map((paragraph, index) => (
                      <p key={index} className="text-muted-foreground leading-relaxed mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* 哲学理念 */}
              {getPhilosophy() && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <h2 className="text-2xl font-light mb-6">Philosophy</h2>
                  <div className="bg-muted/50 p-6 rounded-lg">
                    <p className="text-lg font-light leading-relaxed italic">
                      "{getPhilosophy()}"
                    </p>
                  </div>
                </motion.div>
              )}

              {/* 专业领域 */}
              {master.expertise && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <h2 className="text-2xl font-light mb-6">Expertise</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {master.expertise}
                  </p>
                </motion.div>
              )}
            </div>

            {/* 侧边栏 */}
            <div className="space-y-8">
              {/* 统计信息 */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-muted/30 p-6 rounded-lg"
              >
                <h3 className="text-lg font-medium mb-4">Interest</h3>
                <div className="flex items-center space-x-2">
                  <Icons.heart className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-light">{stats.interestCount}</span>
                  <span className="text-muted-foreground">people interested</span>
                </div>
              </motion.div>

              {/* 旅程产品信息 */}
              {master.hasTripProduct && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="bg-primary/5 border border-primary/20 p-6 rounded-lg"
                >
                  <h3 className="text-lg font-medium mb-4">Journey Available</h3>
                  {master.tripPrice && (
                    <div className="mb-2">
                      <span className="text-2xl font-light">${master.tripPrice}</span>
                      <span className="text-muted-foreground ml-2">per person</span>
                    </div>
                  )}
                  {master.tripDuration && (
                    <div className="mb-4">
                      <span className="text-muted-foreground">{master.tripDuration}</span>
                    </div>
                  )}
                  <Button className="w-full">
                    Book Journey
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}