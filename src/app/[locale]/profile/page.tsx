'use client'

import { useState, useEffect, lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Icons } from '@/components/ui/icons'
import { AuthGuard } from '@/components/auth/auth-guard'
import { UserInterestsList } from '@/components/profile/user-interests-list'
import { UserContributionStats } from '@/components/profile/user-contribution-stats'
import { UserSettings } from '@/components/profile/user-settings'
import { useAuth, useUserProfile } from '@/lib/hooks/use-auth'
import { useCurrentLocale, useTranslations } from '@/i18n/hooks'

// 懒加载推荐链接组件
const ReferralsPage = lazy(() => import('./referrals/page'))

interface UserProfile {
  user: {
    id: string
    email: string
    name?: string
    avatar?: string
    referralCode: string
    locale?: string
    emailVerified?: Date
    createdAt: string
    updatedAt: string
  }
  contributions: Array<{
    id: string
    type: string
    value: number
    metadata: any
    createdAt: string
  }>
  interests: Array<{
    id: string
    masterId: string
    status: string
    createdAt: string
  }>
  stats: {
    total: number
    referrals: number
    bookings: number
    shares: number
    interests: number
    totalPoints: number
  }
  referralUrl: string
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const { user } = useAuth()
  const { getProfile } = useUserProfile()
  const locale = useCurrentLocale()
  const t = useTranslations()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getProfile()
        setProfile(profileData)
      } catch (err) {
        setError('Failed to load profile')
        console.error('Profile error:', err)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchProfile()
    }
  }, [user, getProfile])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getMembershipDuration = () => {
    if (!profile?.user.createdAt) return ''
    
    const createdDate = new Date(profile.user.createdAt)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - createdDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 30) {
      return `${diffDays} ${locale === 'ja' ? '日' : locale === 'zh-TW' ? '天' : 'days'}`
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30)
      return `${months} ${locale === 'ja' ? 'ヶ月' : locale === 'zh-TW' ? '個月' : 'months'}`
    } else {
      const years = Math.floor(diffDays / 365)
      return `${years} ${locale === 'ja' ? '年' : locale === 'zh-TW' ? '年' : 'years'}`
    }
  }

  if (loading) {
    return (
      <AuthGuard>
        <div className="min-h-screen flex items-center justify-center">
          <Icons.spinner className="h-8 w-8 animate-spin" />
        </div>
      </AuthGuard>
    )
  }

  if (error || !profile) {
    return (
      <AuthGuard>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              {locale === 'ja' ? '再試行' : locale === 'zh-TW' ? '重試' : 'Try Again'}
            </Button>
          </div>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* 个人资料头部 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Card>
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                  {/* 头像 */}
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                      {profile.user.avatar ? (
                        <img 
                          src={profile.user.avatar} 
                          alt={profile.user.name || 'User'} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Icons.user className="h-12 w-12 text-muted-foreground" />
                      )}
                    </div>
                    {profile.user.emailVerified && (
                      <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                        <Icons.check className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>

                  {/* 用户信息 */}
                  <div className="flex-1">
                    <h1 className="text-2xl font-light mb-2">
                      {profile.user.name || 'Anonymous Member'}
                    </h1>
                    <p className="text-muted-foreground mb-4">
                      {profile.user.email}
                    </p>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Icons.calendar className="h-4 w-4" />
                        <span>
                          {locale === 'ja' ? '参加日：' : 
                           locale === 'zh-TW' ? '加入日期：' : 
                           'Joined: '}
                          {formatDate(profile.user.createdAt)}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Icons.heart className="h-4 w-4" />
                        <span>
                          {profile.stats.interests} {' '}
                          {locale === 'ja' ? '人の達人に興味' : 
                           locale === 'zh-TW' ? '位大師有興趣' : 
                           'masters of interest'}
                        </span>
                      </div>

                      <Badge variant="outline">
                        {locale === 'ja' ? 'メンバー歴 ' : 
                         locale === 'zh-TW' ? '會員 ' : 
                         'Member for '}
                        {getMembershipDuration()}
                      </Badge>
                    </div>
                  </div>

                  {/* 积分显示 */}
                  <div className="text-center">
                    <div className="text-3xl font-light text-primary mb-1">
                      {profile.stats.totalPoints}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {locale === 'ja' ? 'ポイント' : 
                       locale === 'zh-TW' ? '積分' : 
                       'Points'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* 标签页内容 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">
                  {locale === 'ja' ? '概要' : 
                   locale === 'zh-TW' ? '概覽' : 
                   'Overview'}
                </TabsTrigger>
                <TabsTrigger value="interests">
                  {locale === 'ja' ? '興味' : 
                   locale === 'zh-TW' ? '興趣' : 
                   'Interests'}
                </TabsTrigger>
                <TabsTrigger value="referrals">
                  {locale === 'ja' ? '紹介' : 
                   locale === 'zh-TW' ? '推薦' : 
                   'Referrals'}
                </TabsTrigger>
                <TabsTrigger value="contributions">
                  {locale === 'ja' ? '貢献' : 
                   locale === 'zh-TW' ? '貢獻' : 
                   'Contributions'}
                </TabsTrigger>
                <TabsTrigger value="settings">
                  {locale === 'ja' ? '設定' : 
                   locale === 'zh-TW' ? '設定' : 
                   'Settings'}
                </TabsTrigger>
              </TabsList>

              {/* 概要标签页 */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* 统计卡片 */}
                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="text-2xl font-light text-primary mb-2">
                        {profile.stats.interests}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {locale === 'ja' ? '表現した興味' : 
                         locale === 'zh-TW' ? '表達的興趣' : 
                         'Interests Expressed'}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="text-2xl font-light text-primary mb-2">
                        {profile.stats.referrals}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {locale === 'ja' ? '紹介' : 
                         locale === 'zh-TW' ? '推薦' : 
                         'Referrals'}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="text-2xl font-light text-primary mb-2">
                        {profile.stats.shares}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {locale === 'ja' ? 'シェア' : 
                         locale === 'zh-TW' ? '分享' : 
                         'Shares'}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="text-2xl font-light text-primary mb-2">
                        {profile.stats.totalPoints}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {locale === 'ja' ? '総ポイント' : 
                         locale === 'zh-TW' ? '總積分' : 
                         'Total Points'}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* 推荐链接 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-light">
                      {locale === 'ja' ? '紹介リンク' : 
                       locale === 'zh-TW' ? '推薦連結' : 
                       'Referral Link'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-4">
                      <div className="flex-1 bg-muted p-3 rounded-md font-mono text-sm">
                        {profile.referralUrl}
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => navigator.clipboard.writeText(profile.referralUrl)}
                      >
                        {locale === 'ja' ? 'コピー' : 
                         locale === 'zh-TW' ? '複製' : 
                         'Copy'}
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      {locale === 'ja' ? 
                        'このリンクを友達とシェアして、彼らがTatami Labsに参加すると5ポイントを獲得します。' :
                        locale === 'zh-TW' ?
                        '與朋友分享此連結，當他們加入Tatami Labs時，您將獲得5積分。' :
                        'Share this link with friends and earn 5 points when they join Tatami Labs.'
                      }
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* 兴趣标签页 */}
              <TabsContent value="interests">
                <UserInterestsList interests={profile.interests} />
              </TabsContent>

              {/* 推荐链接标签页 */}
              <TabsContent value="referrals">
                <Suspense fallback={
                  <div className="flex items-center justify-center py-12">
                    <Icons.spinner className="h-8 w-8 animate-spin" />
                  </div>
                }>
                  <ReferralsPage />
                </Suspense>
              </TabsContent>

              {/* 贡献标签页 */}
              <TabsContent value="contributions">
                <UserContributionStats 
                  contributions={profile.contributions}
                  stats={profile.stats}
                />
              </TabsContent>

              {/* 设置标签页 */}
              <TabsContent value="settings">
                <UserSettings user={profile.user} />
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </AuthGuard>
  )
}