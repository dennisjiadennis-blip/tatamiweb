'use client'

import { motion } from 'framer-motion'
import { 
  SectionAnimation, 
  StaggerContainer, 
  StaggerItem,
  CountUp,
  FloatingElement,
  ScrollTrigger,
  Typewriter
} from '@/components/animations'
import { AnimatedButton } from '@/components/ui/animated-button'
import { AnimatedCard } from '@/components/animations/enhanced-animations'
import { useCurrentLocale } from '@/i18n/hooks'

interface EnhancedHomepageProps {
  locale: string
}

export function EnhancedHomepage({ locale }: EnhancedHomepageProps) {
  const currentLocale = useCurrentLocale()

  const stats = [
    { 
      value: 127, 
      label: currentLocale === 'ja' ? '達人' : currentLocale === 'zh-TW' ? '位大師' : 'Masters',
      suffix: currentLocale === 'ja' ? '人' : ''
    },
    { 
      value: 2847, 
      label: currentLocale === 'ja' ? '会員' : currentLocale === 'zh-TW' ? '位會員' : 'Members',
      suffix: currentLocale === 'ja' ? '人' : ''
    },
    { 
      value: 1234, 
      label: currentLocale === 'ja' ? '対話' : currentLocale === 'zh-TW' ? '次對話' : 'Conversations',
      suffix: currentLocale === 'ja' ? '回' : ''
    },
    { 
      value: 45, 
      label: currentLocale === 'ja' ? '国' : currentLocale === 'zh-TW' ? '個國家' : 'Countries',
      suffix: currentLocale === 'ja' ? 'カ国' : ''
    }
  ]

  const features = [
    {
      title: currentLocale === 'ja' ? '深いつながり' : currentLocale === 'zh-TW' ? '深度連結' : 'Deep Connection',
      description: currentLocale === 'ja' ? 
        '世界中の人々と日本の達人をつなぐプラットフォーム' :
        currentLocale === 'zh-TW' ?
        '連接世界各地人們與日本大師的平台' :
        'A platform connecting people worldwide with Japanese masters',
      icon: '🤝'
    },
    {
      title: currentLocale === 'ja' ? '本物の熟練' : currentLocale === 'zh-TW' ? '真正的精通' : 'Authentic Mastery',
      description: currentLocale === 'ja' ? 
        '何世代にもわたって継承された真の技術と知識' :
        currentLocale === 'zh-TW' ?
        '世代相傳的真正技術與知識' :
        'True skills and knowledge passed down through generations',
      icon: '🎯'
    },
    {
      title: currentLocale === 'ja' ? '文化的変容' : currentLocale === 'zh-TW' ? '文化轉化' : 'Cultural Transformation',
      description: currentLocale === 'ja' ? 
        '文化を超えた学習で人生を豊かにする体験' :
        currentLocale === 'zh-TW' ?
        '透過跨文化學習豐富人生的體驗' :
        'Life-enriching experiences through cross-cultural learning',
      icon: '🌸'
    }
  ]

  return (
    <div className="relative">
      {/* 背景粒子效果 */}
      <div className="fixed inset-0 pointer-events-none">
        <FloatingElement duration={8} distance={20} className="absolute top-1/4 left-1/4">
          <div className="w-2 h-2 bg-primary/20 rounded-full" />
        </FloatingElement>
        <FloatingElement duration={12} distance={15} className="absolute top-1/3 right-1/4">
          <div className="w-1 h-1 bg-secondary/30 rounded-full" />
        </FloatingElement>
        <FloatingElement duration={10} distance={25} className="absolute bottom-1/4 left-1/3">
          <div className="w-1.5 h-1.5 bg-primary/25 rounded-full" />
        </FloatingElement>
      </div>

      {/* 主标题区域 */}
      <SectionAnimation direction="up" className="pt-32 pb-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl mx-auto space-y-8"
          >
            <Typewriter
              text={currentLocale === 'ja' ? 
                '達人との深い対話で人生を変える' :
                currentLocale === 'zh-TW' ?
                '與大師深度對話，改變人生' :
                'Transform Your Life Through Deep Conversations with Masters'
              }
              className="text-5xl md:text-7xl font-light leading-tight"
              speed={0.03}
            />
            
            <motion.p
              className="text-xl md:text-2xl font-light text-muted-foreground max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {currentLocale === 'ja' ? 
                '世界中の学習者と日本の達人をつなぐ、深い対話の旅へようこそ。' :
                currentLocale === 'zh-TW' ?
                '歡迎踏上連接世界學習者與日本大師的深度對話之旅。' :
                'Welcome to a journey of deep conversations connecting learners worldwide with Japan\'s masters.'
              }
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <AnimatedButton
                size="lg"
                magneticEffect
                variant="magnetic"
                className="px-8 py-4 text-lg"
                onClick={() => window.location.href = `/${locale}/masters`}
              >
                {currentLocale === 'ja' ? '達人を探索' : 
                 currentLocale === 'zh-TW' ? '探索大師' : 
                 'Explore Masters'}
              </AnimatedButton>
              
              <AnimatedButton
                size="lg"
                variant="ghost"
                animation="bounce"
                className="px-8 py-4 text-lg"
                onClick={() => window.location.href = `/${locale}/philosophy`}
              >
                {currentLocale === 'ja' ? '理念を学ぶ' : 
                 currentLocale === 'zh-TW' ? '了解理念' : 
                 'Learn Philosophy'}
              </AnimatedButton>
            </motion.div>
          </motion.div>
        </div>
      </SectionAnimation>

      {/* 统计数据区域 */}
      <ScrollTrigger className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <StaggerItem key={index}>
                <AnimatedCard className="text-center p-6 bg-background rounded-lg" glowEffect>
                  <CountUp
                    end={stat.value}
                    duration={2.5}
                    suffix={stat.suffix}
                    className="text-3xl font-light text-primary mb-2 block"
                  />
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </AnimatedCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </ScrollTrigger>

      {/* 特色功能区域 */}
      <SectionAnimation direction="up" className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-light mb-6">
              {currentLocale === 'ja' ? 'なぜTatami Labsなのか' : 
               currentLocale === 'zh-TW' ? '為什麼選擇Tatami Labs' : 
               'Why Tatami Labs'}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {currentLocale === 'ja' ? 
                '私たちは単なる学習プラットフォーム以上の存在です。文化を超えた真の変容を提供します。' :
                currentLocale === 'zh-TW' ?
                '我們不僅僅是學習平台，更提供跨越文化的真正轉化。' :
                'We are more than a learning platform. We offer true transformation across cultures.'
              }
            </p>
          </motion.div>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <StaggerItem key={index}>
                <AnimatedCard 
                  className="p-8 h-full bg-card rounded-lg border"
                  hoverScale={1.05}
                  glowEffect
                >
                  <div className="text-center">
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-medium mb-4">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </AnimatedCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </SectionAnimation>

      {/* 行动号召区域 */}
      <ScrollTrigger className="py-24 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            className="max-w-3xl mx-auto space-y-8"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-light">
              {currentLocale === 'ja' ? '今すぐ旅を始めませんか？' : 
               currentLocale === 'zh-TW' ? '準備開始您的旅程了嗎？' : 
               'Ready to Begin Your Journey?'}
            </h2>
            <p className="text-lg text-muted-foreground">
              {currentLocale === 'ja' ? 
                '世界中の学習者とつながり、日本の達人から学ぶ変革の旅を始めましょう。' :
                currentLocale === 'zh-TW' ?
                '與世界各地的學習者聯繫，開始向日本大師學習的變革之旅。' :
                'Connect with learners worldwide and begin your transformative journey of learning from Japan\'s masters.'
              }
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <AnimatedButton
                size="lg"
                rippleEffect
                variant="primary"
                className="px-10 py-4 text-lg"
                onClick={() => window.location.href = `/${locale}/auth/signin`}
              >
                {currentLocale === 'ja' ? '今すぐ参加' : 
                 currentLocale === 'zh-TW' ? '立即加入' : 
                 'Join Now'}
              </AnimatedButton>
              
              <AnimatedButton
                size="lg"
                variant="outline"
                animation="pulse"
                className="px-10 py-4 text-lg"
                onClick={() => window.location.href = `/${locale}/community`}
              >
                {currentLocale === 'ja' ? 'コミュニティを見る' : 
                 currentLocale === 'zh-TW' ? '查看社群' : 
                 'View Community'}
              </AnimatedButton>
            </div>
          </motion.div>
        </div>
      </ScrollTrigger>
    </div>
  )
}