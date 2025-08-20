'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { useTranslations } from '@/i18n/hooks'

interface Master {
  id: string
  name: string
  nameEn?: string
  nameJa?: string
  title: string
  titleEn?: string
  titleJa?: string
  description?: string
  heroImage?: string
  profileVideo?: string
  hasTripProduct: boolean
  location?: string
  locationEn?: string
  locationJa?: string
  tags?: string[]
  _count: {
    interests: number
  }
}

interface MasterCardProps {
  master: Master
  locale: string
}

export function MasterCard({ master, locale }: MasterCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const t = useTranslations()

  // 获取本地化的名称和标题
  const getName = () => {
    switch (locale) {
      case 'ja':
        return master.nameJa || master.name
      case 'zh-TW':
        return master.nameEn || master.name
      default:
        return master.nameEn || master.name
    }
  }

  const getTitle = () => {
    switch (locale) {
      case 'ja':
        return master.titleJa || master.title
      case 'zh-TW':
        return master.titleEn || master.title
      default:
        return master.titleEn || master.title
    }
  }

  const getLocation = () => {
    switch (locale) {
      case 'ja':
        return master.locationJa || master.location
      case 'zh-TW':
        return master.locationEn || master.location
      default:
        return master.locationEn || master.location
    }
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/${locale}/masters/${master.id}`}>
        <Card className="overflow-hidden border-muted hover:border-border transition-colors group">
          <div className="relative">
            <AspectRatio ratio={4 / 3}>
              {master.heroImage && !imageError ? (
                <>
                  <img
                    src={master.heroImage}
                    alt={getName()}
                    className={`object-cover w-full h-full transition-all duration-300 group-hover:scale-105 ${
                      imageLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    onLoad={() => setImageLoaded(true)}
                    onError={() => setImageError(true)}
                  />
                  {!imageLoaded && (
                    <div className="absolute inset-0 bg-muted animate-pulse" />
                  )}
                </>
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <Icons.user className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
            </AspectRatio>

            {/* 覆盖层信息 */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* 右上角标识 */}
            <div className="absolute top-3 right-3 flex gap-2">
              {master.hasTripProduct && (
                <Badge variant="secondary" className="bg-primary/90 text-primary-foreground">
                  {t('masters.tripAvailable')}
                </Badge>
              )}
              {master.profileVideo && (
                <div className="bg-black/50 rounded-full p-2">
                  <Icons.play className="h-3 w-3 text-white" />
                </div>
              )}
            </div>

            {/* 兴趣计数 */}
            <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex items-center space-x-1 bg-black/50 rounded-full px-3 py-1">
                <Icons.heart className="h-3 w-3 text-white" />
                <span className="text-xs text-white">{master._count.interests}</span>
              </div>
            </div>
          </div>

          <CardContent className="p-4">
            <div className="space-y-2">
              {/* 名称 */}
              <h3 className="font-medium text-lg line-clamp-1 group-hover:text-primary transition-colors">
                {getName()}
              </h3>

              {/* 标题 */}
              <p className="text-sm text-muted-foreground line-clamp-1">
                {getTitle()}
              </p>

              {/* 位置 */}
              {getLocation() && (
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <Icons.mapPin className="h-3 w-3" />
                  <span>{getLocation()}</span>
                </div>
              )}

              {/* 描述 */}
              {master.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {master.description}
                </p>
              )}

              {/* 标签 */}
              {master.tags && master.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {master.tags.slice(0, 2).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {master.tags.length > 2 && (
                    <Badge variant="outline" className="text-xs text-muted-foreground">
                      +{master.tags.length - 2}
                    </Badge>
                  )}
                </div>
              )}
            </div>

            {/* 行动按钮 */}
            <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button size="sm" className="w-full">
                {t('masters.viewProfile')}
                <Icons.arrowRight className="ml-2 h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}