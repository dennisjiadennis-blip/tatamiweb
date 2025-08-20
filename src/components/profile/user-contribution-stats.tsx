'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Icons } from '@/components/ui/icons'
import { useCurrentLocale } from '@/i18n/hooks'

interface Contribution {
  id: string
  type: string
  value: number
  metadata: any
  createdAt: string
}

interface ContributionStats {
  total: number
  referrals: number
  bookings: number
  shares: number
  interests: number
  totalPoints: number
}

interface UserContributionStatsProps {
  contributions: Contribution[]
  stats: ContributionStats
}

export function UserContributionStats({ contributions, stats }: UserContributionStatsProps) {
  const locale = useCurrentLocale()
  const [selectedType, setSelectedType] = useState<string>('all')

  // 计算下一级别所需积分
  const getNextLevelInfo = (currentPoints: number) => {
    const levels = [
      { name: 'Bronze', nameJa: 'ブロンズ', nameZh: '青銅', points: 0, icon: '🥉' },
      { name: 'Silver', nameJa: 'シルバー', nameZh: '白銀', points: 100, icon: '🥈' },
      { name: 'Gold', nameJa: 'ゴールド', nameZh: '黃金', points: 500, icon: '🥇' },
      { name: 'Platinum', nameJa: 'プラチナ', nameZh: '白金', points: 1000, icon: '💎' },
      { name: 'Master', nameJa: 'マスター', nameZh: '大師', points: 2500, icon: '👑' }
    ]

    let currentLevel = levels[0]
    let nextLevel = levels[1]

    for (let i = 0; i < levels.length; i++) {
      if (currentPoints >= levels[i].points) {
        currentLevel = levels[i]
        nextLevel = levels[i + 1] || levels[i]
      } else {
        break
      }
    }

    const progress = nextLevel === currentLevel ? 100 : 
      ((currentPoints - currentLevel.points) / (nextLevel.points - currentLevel.points)) * 100

    return { currentLevel, nextLevel, progress }
  }

  const { currentLevel, nextLevel, progress } = getNextLevelInfo(stats.totalPoints)

  const getLevelName = (level: any) => {
    switch (locale) {
      case 'ja':
        return level.nameJa
      case 'zh-TW':
        return level.nameZh
      default:
        return level.name
    }
  }

  const getContributionTypes = () => [
    { 
      id: 'all', 
      label: 'All', 
      labelJa: 'すべて', 
      labelZh: '全部',
      count: contributions.length
    },
    { 
      id: 'referral', 
      label: 'Referrals', 
      labelJa: '紹介', 
      labelZh: '推薦',
      count: contributions.filter(c => c.type === 'referral').length
    },
    { 
      id: 'interest', 
      label: 'Interests', 
      labelJa: '興味', 
      labelZh: '興趣',
      count: contributions.filter(c => c.type === 'interest').length
    },
    { 
      id: 'share', 
      label: 'Shares', 
      labelJa: 'シェア', 
      labelZh: '分享',
      count: contributions.filter(c => c.type === 'share').length
    },
    { 
      id: 'booking', 
      label: 'Bookings', 
      labelJa: '予約', 
      labelZh: '預訂',
      count: contributions.filter(c => c.type === 'booking').length
    }
  ]

  const getTypeLabel = (type: any) => {
    switch (locale) {
      case 'ja':
        return type.labelJa
      case 'zh-TW':
        return type.labelZh
      default:
        return type.label
    }
  }

  const getContributionTypeLabel = (type: string) => {
    switch (type) {
      case 'referral':
        return locale === 'ja' ? '紹介' : 
               locale === 'zh-TW' ? '推薦' : 
               'Referral'
      case 'interest':
        return locale === 'ja' ? '興味表明' : 
               locale === 'zh-TW' ? '興趣表達' : 
               'Interest'
      case 'share':
        return locale === 'ja' ? 'シェア' : 
               locale === 'zh-TW' ? '分享' : 
               'Share'
      case 'booking':
        return locale === 'ja' ? '予約' : 
               locale === 'zh-TW' ? '預訂' : 
               'Booking'
      default:
        return type
    }
  }

  const getContributionIcon = (type: string) => {
    switch (type) {
      case 'referral':
        return Icons.user
      case 'interest':
        return Icons.heart
      case 'share':
        return Icons.share
      case 'booking':
        return Icons.calendar
      default:
        return Icons.check
    }
  }

  const filteredContributions = selectedType === 'all' 
    ? contributions 
    : contributions.filter(c => c.type === selectedType)

  const sortedContributions = [...filteredContributions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      {/* 等级和积分概览 */}
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="text-4xl mb-2">{currentLevel.icon}</div>
            <h3 className="text-2xl font-light mb-2">
              {getLevelName(currentLevel)} {locale === 'ja' ? 'レベル' : locale === 'zh-TW' ? '等級' : 'Level'}
            </h3>
            <div className="text-3xl font-light text-primary mb-4">
              {stats.totalPoints} {locale === 'ja' ? 'ポイント' : locale === 'zh-TW' ? '積分' : 'Points'}
            </div>
            
            {progress < 100 && (
              <div className="max-w-md mx-auto">
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>{getLevelName(currentLevel)}</span>
                  <span>{getLevelName(nextLevel)}</span>
                </div>
                <Progress value={progress} className="h-2" />
                <p className="text-sm text-muted-foreground mt-2">
                  {nextLevel.points - stats.totalPoints} {' '}
                  {locale === 'ja' ? 'ポイントで次のレベルに到達' : 
                   locale === 'zh-TW' ? '積分即可升級到下一等級' : 
                   'points to next level'}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 统计概览 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Icons.user className="h-6 w-6 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-light">{stats.referrals}</div>
            <div className="text-xs text-muted-foreground">
              {locale === 'ja' ? '紹介' : 
               locale === 'zh-TW' ? '推薦' : 
               'Referrals'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Icons.heart className="h-6 w-6 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-light">{stats.interests}</div>
            <div className="text-xs text-muted-foreground">
              {locale === 'ja' ? '興味表明' : 
               locale === 'zh-TW' ? '興趣表達' : 
               'Interests'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Icons.share className="h-6 w-6 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-light">{stats.shares}</div>
            <div className="text-xs text-muted-foreground">
              {locale === 'ja' ? 'シェア' : 
               locale === 'zh-TW' ? '分享' : 
               'Shares'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Icons.calendar className="h-6 w-6 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-light">{stats.bookings}</div>
            <div className="text-xs text-muted-foreground">
              {locale === 'ja' ? '予約' : 
               locale === 'zh-TW' ? '預訂' : 
               'Bookings'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 贡献历史 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-light">
            {locale === 'ja' ? '貢献履歴' : 
             locale === 'zh-TW' ? '貢獻歷史' : 
             'Contribution History'}
          </CardTitle>
          
          {/* 过滤器 */}
          <div className="flex flex-wrap gap-2">
            {getContributionTypes().map(type => (
              <Button
                key={type.id}
                variant={selectedType === type.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedType(type.id)}
                className="text-xs"
              >
                {getTypeLabel(type)} ({type.count})
              </Button>
            ))}
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {sortedContributions.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              {locale === 'ja' ? '貢献記録がありません' : 
               locale === 'zh-TW' ? '暫無貢獻記錄' : 
               'No contributions yet'}
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {sortedContributions.map((contribution, index) => {
                const Icon = getContributionIcon(contribution.type)
                return (
                  <motion.div
                    key={contribution.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex items-center space-x-4 p-4 border-b last:border-b-0 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge variant="secondary" className="text-xs">
                          {getContributionTypeLabel(contribution.type)}
                        </Badge>
                        <span className="text-sm font-medium text-primary">
                          +{contribution.value} {locale === 'ja' ? 'ポイント' : locale === 'zh-TW' ? '積分' : 'points'}
                        </span>
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        {formatDate(contribution.createdAt)}
                      </div>
                      
                      {contribution.metadata && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {contribution.metadata.description || 
                           contribution.metadata.masterName ||
                           contribution.metadata.referredUser}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 积分获取建议 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-light">
            {locale === 'ja' ? 'ポイント獲得方法' : 
             locale === 'zh-TW' ? '獲得積分方式' : 
             'Earn More Points'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
              <Icons.user className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium text-sm">
                  {locale === 'ja' ? '友達を紹介' : 
                   locale === 'zh-TW' ? '推薦朋友' : 
                   'Refer Friends'}
                </div>
                <div className="text-xs text-muted-foreground">
                  {locale === 'ja' ? '友達の登録で5ポイント' : 
                   locale === 'zh-TW' ? '朋友註冊獲得5積分' : 
                   'Earn 5 points per signup'}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
              <Icons.heart className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium text-sm">
                  {locale === 'ja' ? '達人に興味表明' : 
                   locale === 'zh-TW' ? '表達對大師的興趣' : 
                   'Express Interest'}
                </div>
                <div className="text-xs text-muted-foreground">
                  {locale === 'ja' ? '興味表明で2ポイント' : 
                   locale === 'zh-TW' ? '表達興趣獲得2積分' : 
                   'Earn 2 points per interest'}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
              <Icons.share className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium text-sm">
                  {locale === 'ja' ? 'コンテンツをシェア' : 
                   locale === 'zh-TW' ? '分享內容' : 
                   'Share Content'}
                </div>
                <div className="text-xs text-muted-foreground">
                  {locale === 'ja' ? 'シェアで1ポイント' : 
                   locale === 'zh-TW' ? '分享獲得1積分' : 
                   'Earn 1 point per share'}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
              <Icons.calendar className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium text-sm">
                  {locale === 'ja' ? 'セッションを予約' : 
                   locale === 'zh-TW' ? '預訂課程' : 
                   'Book Sessions'}
                </div>
                <div className="text-xs text-muted-foreground">
                  {locale === 'ja' ? '予約完了で10ポイント' : 
                   locale === 'zh-TW' ? '完成預訂獲得10積分' : 
                   'Earn 10 points per booking'}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}