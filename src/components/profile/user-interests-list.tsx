'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Icons } from '@/components/ui/icons'
import { useCurrentLocale } from '@/i18n/hooks'

interface Interest {
  id: string
  masterId: string
  status: string
  createdAt: string
  master?: {
    id: string
    name: string
    nameEn?: string
    nameJa?: string
    title: string
    titleEn?: string
    titleJa?: string
    avatar?: string
    category: string
    categoryEn?: string
    categoryJa?: string
  }
}

interface UserInterestsListProps {
  interests: Interest[]
}

export function UserInterestsList({ interests }: UserInterestsListProps) {
  const locale = useCurrentLocale()
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'status'>('newest')

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'expressed':
        return locale === 'ja' ? '興味表明済み' : 
               locale === 'zh-TW' ? '已表達興趣' : 
               'Interest Expressed'
      case 'contacted':
        return locale === 'ja' ? '連絡済み' : 
               locale === 'zh-TW' ? '已聯絡' : 
               'Contacted'
      case 'scheduled':
        return locale === 'ja' ? 'スケジュール済み' : 
               locale === 'zh-TW' ? '已安排' : 
               'Scheduled'
      case 'completed':
        return locale === 'ja' ? '完了' : 
               locale === 'zh-TW' ? '已完成' : 
               'Completed'
      default:
        return locale === 'ja' ? '不明' : 
               locale === 'zh-TW' ? '未知' : 
               'Unknown'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'expressed':
        return 'bg-blue-100 text-blue-800'
      case 'contacted':
        return 'bg-yellow-100 text-yellow-800'
      case 'scheduled':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  const getMasterName = (master: Interest['master']) => {
    if (!master) return 'Unknown Master'
    
    switch (locale) {
      case 'ja':
        return master.nameJa || master.name
      case 'zh-TW':
        return master.name
      default:
        return master.nameEn || master.name
    }
  }

  const getMasterTitle = (master: Interest['master']) => {
    if (!master) return ''
    
    switch (locale) {
      case 'ja':
        return master.titleJa || master.title
      case 'zh-TW':
        return master.title
      default:
        return master.titleEn || master.title
    }
  }

  const getMasterCategory = (master: Interest['master']) => {
    if (!master) return ''
    
    switch (locale) {
      case 'ja':
        return master.categoryJa || master.category
      case 'zh-TW':
        return master.category
      default:
        return master.categoryEn || master.category
    }
  }

  const sortInterests = (interests: Interest[]) => {
    switch (sortBy) {
      case 'newest':
        return [...interests].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      case 'oldest':
        return [...interests].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      case 'status':
        return [...interests].sort((a, b) => a.status.localeCompare(b.status))
      default:
        return interests
    }
  }

  const sortedInterests = sortInterests(interests)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (interests.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Icons.heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">
            {locale === 'ja' ? '興味を表明した達人はまだいません' : 
             locale === 'zh-TW' ? '尚未對任何大師表達興趣' : 
             'No interests expressed yet'}
          </h3>
          <p className="text-muted-foreground mb-6">
            {locale === 'ja' ? 
              '達人を探索して、興味のある方に繋がりましょう。' :
              locale === 'zh-TW' ?
              '探索大師並與感興趣的人建立聯繫。' :
              'Explore masters and connect with those who interest you.'
            }
          </p>
          <Button asChild>
            <a href={`/${locale}/masters`}>
              {locale === 'ja' ? '達人を探索' : 
               locale === 'zh-TW' ? '探索大師' : 
               'Explore Masters'}
            </a>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* 过滤器和排序 */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
            <CardTitle className="text-lg font-light">
              {locale === 'ja' ? '興味を表明した達人' : 
               locale === 'zh-TW' ? '表達興趣的大師' : 
               'Masters of Interest'}
              <span className="ml-2 text-sm text-muted-foreground">
                ({interests.length})
              </span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                {locale === 'ja' ? '並び順：' : 
                 locale === 'zh-TW' ? '排序：' : 
                 'Sort by:'}
              </span>
              <Button 
                variant={sortBy === 'newest' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setSortBy('newest')}
              >
                {locale === 'ja' ? '新しい順' : 
                 locale === 'zh-TW' ? '最新' : 
                 'Newest'}
              </Button>
              <Button 
                variant={sortBy === 'oldest' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setSortBy('oldest')}
              >
                {locale === 'ja' ? '古い順' : 
                 locale === 'zh-TW' ? '最舊' : 
                 'Oldest'}
              </Button>
              <Button 
                variant={sortBy === 'status' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setSortBy('status')}
              >
                {locale === 'ja' ? 'ステータス' : 
                 locale === 'zh-TW' ? '狀態' : 
                 'Status'}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* 兴趣列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sortedInterests.map((interest, index) => (
          <motion.div
            key={interest.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  {/* 达人头像 */}
                  <Avatar className="h-12 w-12 shrink-0">
                    <AvatarImage 
                      src={interest.master?.avatar} 
                      alt={getMasterName(interest.master)} 
                    />
                    <AvatarFallback>
                      {getMasterName(interest.master).slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>

                  {/* 达人信息 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-medium line-clamp-1">
                          {getMasterName(interest.master)}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {getMasterTitle(interest.master)}
                        </p>
                      </div>
                      <Badge 
                        className={`text-xs ${getStatusColor(interest.status)} shrink-0 ml-2`}
                      >
                        {getStatusLabel(interest.status)}
                      </Badge>
                    </div>

                    {/* 分类和日期 */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <Icons.user className="h-3 w-3 mr-1" />
                        <span>{getMasterCategory(interest.master)}</span>
                      </div>
                      <div className="flex items-center">
                        <Icons.calendar className="h-3 w-3 mr-1" />
                        <span>{formatDate(interest.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="mt-4 flex space-x-2">
                  <Button size="sm" variant="outline" className="flex-1" asChild>
                    <a href={`/${locale}/masters/${interest.masterId}`}>
                      {locale === 'ja' ? '詳細を見る' : 
                       locale === 'zh-TW' ? '查看詳情' : 
                       'View Details'}
                    </a>
                  </Button>
                  {interest.status === 'expressed' && (
                    <Button size="sm" className="flex-1">
                      {locale === 'ja' ? '連絡する' : 
                       locale === 'zh-TW' ? '聯絡' : 
                       'Contact'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}