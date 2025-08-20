'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useCurrentLocale, useTranslations } from '@/i18n/hooks'

export default function PhilosophyPage() {
  const locale = useCurrentLocale()
  const t = useTranslations()

  const principles = [
    {
      title: 'Deep Connection',
      titleJa: '深いつながり',
      titleZh: '深度連結',
      description: 'We believe true understanding comes through genuine conversation, not surface-level interaction. Our platform facilitates meaningful exchanges that transcend cultural boundaries.',
      descriptionJa: '真の理解は表面的な相互作用ではなく、真摯な会話を通じて生まれると信じています。私たちのプラットフォームは、文化の境界を超えた意味のある交流を促進します。',
      descriptionZh: '我們相信真正的理解來自於真誠的對話，而非表面的互動。我們的平台促進跨越文化界限的有意義交流。',
      icon: '🤝'
    },
    {
      title: 'Authentic Mastery',
      titleJa: '本物の習熟',
      titleZh: '真正的精通',
      description: 'Every master on our platform has dedicated decades to perfecting their craft. We celebrate the depth of expertise that can only come from lifelong commitment.',
      descriptionJa: 'プラットフォーム上のすべての達人は、何十年もかけて技術を完璧にしてきました。生涯にわたるコミットメントからのみ得られる専門知識の深さを称賛します。',
      descriptionZh: '我們平台上的每位大師都投入數十年完善自己的技藝。我們讚揚只有透過終身承諾才能獲得的專業知識深度。',
      icon: '🎯'
    },
    {
      title: 'Cultural Bridge',
      titleJa: '文化の架け橋',
      titleZh: '文化橋樑',
      description: 'Japan\'s rich traditions offer wisdom that transcends borders. We serve as a bridge, making this profound knowledge accessible to curious minds worldwide.',
      descriptionJa: '日本の豊かな伝統は国境を超えた知恵を提供します。私たちは架け橋として、この深い知識を世界中の好奇心旺盛な心に届けます。',
      descriptionZh: '日本豐富的傳統提供超越國界的智慧。我們充當橋樑，讓全世界好奇的心靈都能接觸到這些深刻的知識。',
      icon: '🌸'
    },
    {
      title: 'Transformative Journey',
      titleJa: '変革の旅',
      titleZh: '轉化之旅',
      description: 'Learning from a master is not just acquiring knowledge—it\'s a personal transformation. We design experiences that change how you see the world.',
      descriptionJa: '達人から学ぶことは単に知識を得ることではなく、個人の変革です。世界の見方を変える体験をデザインします。',
      descriptionZh: '向大師學習不僅是獲得知識，更是個人的轉化。我們設計能改變你看世界方式的體驗。',
      icon: '✨'
    }
  ]

  const getTitle = (principle: typeof principles[0]) => {
    switch (locale) {
      case 'ja':
        return principle.titleJa
      case 'zh-TW':
        return principle.titleZh
      default:
        return principle.title
    }
  }

  const getDescription = (principle: typeof principles[0]) => {
    switch (locale) {
      case 'ja':
        return principle.descriptionJa
      case 'zh-TW':
        return principle.descriptionZh
      default:
        return principle.description
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
              {locale === 'ja' ? '私たちの哲学' : 
               locale === 'zh-TW' ? '我們的哲學' : 
               'Our Philosophy'}
            </h1>
            <p className="text-xl md:text-2xl font-light text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {locale === 'ja' ? 
                '深い対話を通じて、日本の達人の知恵を世界に伝える。これが私たちの使命です。' :
                locale === 'zh-TW' ?
                '透過深度對話，將日本大師的智慧傳遞給世界。這是我們的使命。' :
                'Connecting global minds with Japan\'s ultimate masters through deep conversation journeys that transcend cultural boundaries.'
              }
            </p>
          </motion.div>
        </div>
      </section>

      {/* 核心理念 */}
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
              {locale === 'ja' ? '4つの核心理念' : 
               locale === 'zh-TW' ? '四大核心理念' : 
               'Four Core Principles'}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {locale === 'ja' ? 
                'これらの理念が、私たちのプラットフォームと体験のすべてを導いています。' :
                locale === 'zh-TW' ?
                '這些理念指導著我們平台和體驗的方方面面。' :
                'These principles guide every aspect of our platform and experiences.'
              }
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {principles.map((principle, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full border-muted hover:border-border transition-colors">
                  <CardContent className="p-8">
                    <div className="text-4xl mb-4">{principle.icon}</div>
                    <h3 className="text-xl font-medium mb-4">
                      {getTitle(principle)}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {getDescription(principle)}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 故事区域 */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-light mb-8">
              {locale === 'ja' ? '私たちの物語' : 
               locale === 'zh-TW' ? '我們的故事' : 
               'Our Story'}
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="prose prose-lg max-w-none"
          >
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              {locale === 'ja' ? (
                <>
                  <p>
                    私たちは、真の日本の達人に出会うことがいかに困難かを知っています。言語の壁、文化的な違い、地理的な距離—これらすべてが、世界と日本の深い知恵との間に立ちはだかっています。
                  </p>
                  <p>
                    Tatami Labsは、この gap を埋めるために生まれました。私たちは単なる学習プラットフォームではありません。私たちは、人生を変える出会いの場です。茶道の精神から武道の哲学まで、日本の達人たちが何十年もかけて培った知恵を、世界中の求める心に届けます。
                  </p>
                  <p>
                    毎回の対話は、単なる情報交換を超えています。それは魂と魂の出会いであり、東洋の古い知恵と現代世界の架け橋なのです。
                  </p>
                </>
              ) : locale === 'zh-TW' ? (
                <>
                  <p>
                    我們深知要真正接觸日本大師有多困難。語言障礙、文化差異、地理距離——這些都阻礙了世界與日本深刻智慧的連結。
                  </p>
                  <p>
                    Tatami Labs 因此而誕生。我們不只是一個學習平台，我們是改變人生的相遇之地。從茶道精神到武道哲學，我們將日本大師數十年培養的智慧傳遞給世界各地渴求的心靈。
                  </p>
                  <p>
                    每次對話都超越了簡單的信息交換。那是靈魂與靈魂的相遇，是東方古老智慧與現代世界的橋樑。
                  </p>
                </>
              ) : (
                <>
                  <p>
                    We understand how difficult it can be to truly connect with Japan's masters. Language barriers, cultural differences, geographical distance—all of these stand between the world and Japan's profound wisdom.
                  </p>
                  <p>
                    Tatami Labs was born to bridge this gap. We are not just a learning platform; we are a place where life-changing encounters happen. From the spirit of tea ceremony to the philosophy of martial arts, we bring the wisdom that Japan's masters have cultivated over decades to seeking hearts around the world.
                  </p>
                  <p>
                    Every conversation transcends mere information exchange. It is an encounter between souls, a bridge between ancient Eastern wisdom and the modern world.
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 行动呼吁 */}
      <section className="py-24 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-light mb-6">
              {locale === 'ja' ? '旅を始めませんか？' : 
               locale === 'zh-TW' ? '準備開始你的旅程嗎？' : 
               'Ready to Begin Your Journey?'}
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              {locale === 'ja' ? 
                '日本の達人との深い対話を通じて、あなた自身の変革の旅を始めましょう。' :
                locale === 'zh-TW' ?
                '透過與日本大師的深度對話，開始你自己的轉化之旅。' :
                'Begin your own transformative journey through deep conversations with Japan\'s masters.'
              }
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild>
                <a href={`/${locale}/masters`}>
                  {locale === 'ja' ? '達人に出会う' : 
                   locale === 'zh-TW' ? '遇見大師' : 
                   'Meet the Masters'}
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href={`/${locale}`}>
                  {locale === 'ja' ? 'The Glimpse を体験' : 
                   locale === 'zh-TW' ? '體驗 The Glimpse' : 
                   'Experience The Glimpse'}
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}