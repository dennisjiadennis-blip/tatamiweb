'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Icons } from '@/components/ui/icons'
import { useCurrentLocale, useTranslations } from '@/i18n/hooks'
import { useAuth } from '@/lib/hooks/use-auth'
import { logger } from '@/lib/logger'

export default function CommunityPage() {
  const locale = useCurrentLocale()
  const { isAuthenticated, redirectToSignIn } = useAuth()
  const t = useTranslations()

  const communityStats = [
    {
      value: '2,847',
      label: 'Active Members',
      labelJa: 'アクティブメンバー',
      labelZh: '活躍會員',
      icon: '👥'
    },
    {
      value: '127',
      label: 'Masters Connected',
      labelJa: '繋がった達人',
      labelZh: '聯繫的大師',
      icon: '🎯'
    },
    {
      value: '1,234',
      label: 'Conversations',
      labelJa: '対話数',
      labelZh: '對話次數',
      icon: '💬'
    },
    {
      value: '45',
      label: 'Countries',
      labelJa: '国々',
      labelZh: '國家',
      icon: '🌍'
    }
  ]

  const memberSpotlight = [
    {
      id: 1,
      name: 'Sarah Chen',
      nameJa: 'サラ・チェン',
      nameZh: '陳莎拉',
      location: 'San Francisco, USA',
      locationJa: 'サンフランシスコ、アメリカ',
      locationZh: '美國舊金山',
      avatar: '/images/members/sarah.jpg',
      story: 'Discovered the art of Japanese gardening and transformed her backyard into a meditation space.',
      storyJa: '日本庭園の芸術を発見し、裏庭を瞑想の空間に変えました。',
      storyZh: '發現了日本庭園藝術，將後院改造成冥想空間。',
      masterConnected: 'Master Nakamura',
      masterConnectedJa: '中村大師',
      masterConnectedZh: '中村大師',
      badge: 'Garden Enthusiast',
      badgeJa: '庭園愛好家',
      badgeZh: '庭園愛好者'
    },
    {
      id: 2,
      name: 'Marcus Weber',
      nameJa: 'マルクス・ウェーバー',
      nameZh: '馬庫斯·韋伯',
      location: 'Berlin, Germany',
      locationJa: 'ベルリン、ドイツ',
      locationZh: '德國柏林',
      avatar: '/images/members/marcus.jpg',
      story: 'Learning traditional pottery techniques helped him find mindfulness in his busy tech career.',
      storyJa: '伝統的な陶芸技術を学ぶことで、忙しいテック業界でマインドフルネスを見つけました。',
      storyZh: '學習傳統陶藝技術幫助他在繁忙的科技職涯中找到正念。',
      masterConnected: 'Master Watanabe',
      masterConnectedJa: '渡部大師',
      masterConnectedZh: '渡部大師',
      badge: 'Pottery Student',
      badgeJa: '陶芸生',
      badgeZh: '陶藝學生'
    },
    {
      id: 3,
      name: 'Elena Rodriguez',
      nameJa: 'エレナ・ロドリゲス',
      nameZh: '埃琳娜·羅德里格斯',
      location: 'Madrid, Spain',
      locationJa: 'マドリード、スペイン',
      locationZh: '西班牙馬德里',
      avatar: '/images/members/elena.jpg',
      story: 'Through tea ceremony practice, she found a new way to connect with her family and heritage.',
      storyJa: '茶道の実践を通じて、家族や伝統とのつながりの新しい方法を見つけました。',
      storyZh: '透過茶道練習，她找到了與家庭和傳統聯繫的新方式。',
      masterConnected: 'Master Yamamoto',
      masterConnectedJa: '山本大師',
      masterConnectedZh: '山本大師',
      badge: 'Tea Practitioner',
      badgeJa: '茶道実践者',
      badgeZh: '茶道實踐者'
    }
  ]

  const upcomingEvents = [
    {
      id: 1,
      title: 'Virtual Tea Ceremony Workshop',
      titleJa: 'バーチャル茶道ワークショップ',
      titleZh: '虛擬茶道工作坊',
      date: '2024-02-15',
      time: '19:00 JST',
      master: 'Master Yamamoto Sōtei',
      masterJa: '山本宗貞',
      masterZh: '山本宗貞大師',
      type: 'Workshop',
      typeJa: 'ワークショップ',
      typeZh: '工作坊',
      spots: 12,
      maxSpots: 20
    },
    {
      id: 2,
      title: 'Seasonal Garden Design Discussion',
      titleJa: '季節の庭園デザイン談話',
      titleZh: '季節性庭園設計討論',
      date: '2024-02-20',
      time: '20:00 JST',
      master: 'Master Hiroshi Nakamura',
      masterJa: '中村寛',
      masterZh: '中村寬大師',
      type: 'Discussion',
      typeJa: '談話',
      typeZh: '討論',
      spots: 8,
      maxSpots: 15
    },
    {
      id: 3,
      title: 'Swordsmithing Philosophy Q&A',
      titleJa: '刀鍛冶哲学 Q&A',
      titleZh: '刀劍製作哲學問答',
      date: '2024-02-25',
      time: '18:30 JST',
      master: 'Master Takeshi Kobayashi',
      masterJa: '小林武志',
      masterZh: '小林武志大師',
      type: 'Q&A Session',
      typeJa: 'Q&Aセッション',
      typeZh: '問答環節',
      spots: 5,
      maxSpots: 10
    }
  ]

  const getStatLabel = (stat: typeof communityStats[0]) => {
    switch (locale) {
      case 'ja':
        return stat.labelJa
      case 'zh-TW':
        return stat.labelZh
      default:
        return stat.label
    }
  }

  const getMemberName = (member: typeof memberSpotlight[0]) => {
    switch (locale) {
      case 'ja':
        return member.nameJa
      case 'zh-TW':
        return member.nameZh
      default:
        return member.name
    }
  }

  const getMemberLocation = (member: typeof memberSpotlight[0]) => {
    switch (locale) {
      case 'ja':
        return member.locationJa
      case 'zh-TW':
        return member.locationZh
      default:
        return member.location
    }
  }

  const getMemberStory = (member: typeof memberSpotlight[0]) => {
    switch (locale) {
      case 'ja':
        return member.storyJa
      case 'zh-TW':
        return member.storyZh
      default:
        return member.story
    }
  }

  const getMemberBadge = (member: typeof memberSpotlight[0]) => {
    switch (locale) {
      case 'ja':
        return member.badgeJa
      case 'zh-TW':
        return member.badgeZh
      default:
        return member.badge
    }
  }

  const getEventTitle = (event: typeof upcomingEvents[0]) => {
    switch (locale) {
      case 'ja':
        return event.titleJa
      case 'zh-TW':
        return event.titleZh
      default:
        return event.title
    }
  }

  const getEventType = (event: typeof upcomingEvents[0]) => {
    switch (locale) {
      case 'ja':
        return event.typeJa
      case 'zh-TW':
        return event.typeZh
      default:
        return event.type
    }
  }

  const handleJoinEvent = async (eventId: number) => {
    if (!isAuthenticated) {
      redirectToSignIn()
      return
    }
    
    try {
      const response = await fetch('/api/community/events/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventId }),
      })

      const result = await response.json()
      
      if (result.success) {
        logger.info('Successfully joined event', { eventId })
        // You could show a success toast or update UI here
      } else {
        logger.warn('Failed to join event', { eventId, message: result.message })
        // You could show an error toast here
      }
    } catch (error) {
      logger.error('Error joining event', { eventId, error })
    }
  }

  return (
    <div className="min-h-screen">
      {/* 英雄区域 */}
      <section className="relative py-32 overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-light mb-8">
              {locale === 'ja' ? 'コミュニティ' : 
               locale === 'zh-TW' ? '社群' : 
               'Community'}
            </h1>
            <p className="text-xl md:text-2xl font-light text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {locale === 'ja' ? 
                '世界中の学習者とつながり、日本の達人から共に学ぶ旅に参加してください。' :
                locale === 'zh-TW' ?
                '與世界各地的學習者聯繫，加入共同向日本大師學習的旅程。' :
                'Connect with learners worldwide and join the journey of learning from Japan\'s masters together.'
              }
            </p>
          </motion.div>
        </div>
      </section>

      {/* 社区统计 */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-light mb-6">
              {locale === 'ja' ? '私たちのコミュニティ' : 
               locale === 'zh-TW' ? '我們的社群' : 
               'Our Community'}
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {communityStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-light mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{getStatLabel(stat)}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 会员聚焦 */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-light mb-6">
              {locale === 'ja' ? 'メンバースポットライト' : 
               locale === 'zh-TW' ? '會員聚焦' : 
               'Member Spotlight'}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {locale === 'ja' ? 
                'コミュニティメンバーの変革の旅と学習体験をご紹介します。' :
                locale === 'zh-TW' ?
                '分享社群成員的轉化之旅和學習體驗。' :
                'Discover the transformative journeys and learning experiences of our community members.'
              }
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {memberSpotlight.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={member.avatar} alt={getMemberName(member)} />
                        <AvatarFallback>
                          {getMemberName(member).split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{getMemberName(member)}</h3>
                        <p className="text-sm text-muted-foreground">
                          {getMemberLocation(member)}
                        </p>
                      </div>
                    </div>
                    
                    <Badge className="mb-4">{getMemberBadge(member)}</Badge>
                    
                    <blockquote className="text-sm text-muted-foreground mb-4 italic">
                      &ldquo;{getMemberStory(member)}&rdquo;
                    </blockquote>
                    
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Icons.user className="h-3 w-3 mr-1" />
                      <span>
                        {locale === 'ja' ? '繋がった達人：' : 
                         locale === 'zh-TW' ? '聯繫的大師：' : 
                         'Connected with: '}
                        {member.masterConnected}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 即将举行的活动 */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-light mb-6">
              {locale === 'ja' ? '今後のイベント' : 
               locale === 'zh-TW' ? '即將舉行的活動' : 
               'Upcoming Events'}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {locale === 'ja' ? 
                '達人との特別なワークショップ、議論、Q&Aセッションに参加してください。' :
                locale === 'zh-TW' ?
                '參加與大師的特別工作坊、討論和問答環節。' :
                'Join special workshops, discussions, and Q&A sessions with masters.'
              }
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="outline">{getEventType(event)}</Badge>
                      <div className="text-sm text-muted-foreground">
                        {event.spots} / {event.maxSpots}
                        {locale === 'ja' ? ' 席' : 
                         locale === 'zh-TW' ? ' 席位' : 
                         ' spots'}
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-medium mb-3 line-clamp-2">
                      {getEventTitle(event)}
                    </h3>
                    
                    <div className="space-y-2 mb-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Icons.calendar className="h-4 w-4 mr-2" />
                        {new Date(event.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Icons.clock className="h-4 w-4 mr-2" />
                        {event.time}
                      </div>
                      <div className="flex items-center">
                        <Icons.user className="h-4 w-4 mr-2" />
                        {event.master}
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      disabled={event.spots >= event.maxSpots}
                      onClick={() => handleJoinEvent(event.id)}
                    >
                      {event.spots >= event.maxSpots ? (
                        t('community.events.eventFull')
                      ) : (
                        t('community.events.joinEvent')
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 加入社区 */}
      <section className="py-24">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-light mb-6">
              {locale === 'ja' ? 'コミュニティに参加しませんか？' : 
               locale === 'zh-TW' ? '加入我們的社群？' : 
               'Ready to Join Our Community?'}
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              {locale === 'ja' ? 
                '世界中の学習者とつながり、日本の達人から共に学び、あなた自身の変革の旅を始めましょう。' :
                locale === 'zh-TW' ?
                '與世界各地的學習者聯繫，共同向日本大師學習，開始你自己的轉化之旅。' :
                'Connect with learners worldwide, learn from Japan\'s masters together, and begin your own transformative journey.'
              }
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {isAuthenticated ? (
                <>
                  <Button size="lg" asChild>
                    <a href={`/${locale}/masters`}>
                      {locale === 'ja' ? '達人を探索' : 
                       locale === 'zh-TW' ? '探索大師' : 
                       'Explore Masters'}
                    </a>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <a href={`/${locale}/profile`}>
                      {locale === 'ja' ? 'プロフィール' : 
                       locale === 'zh-TW' ? '個人檔案' : 
                       'My Profile'}
                    </a>
                  </Button>
                </>
              ) : (
                <>
                  <Button size="lg" onClick={redirectToSignIn}>
                    {locale === 'ja' ? '参加する' : 
                     locale === 'zh-TW' ? '加入' : 
                     'Join Community'}
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <a href={`/${locale}/masters`}>
                      {locale === 'ja' ? '達人を見る' : 
                       locale === 'zh-TW' ? '查看大師' : 
                       'Browse Masters'}
                    </a>
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}