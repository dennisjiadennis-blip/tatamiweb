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
    <div style={{ backgroundColor: 'var(--color-charcoal)', minHeight: '100vh', color: 'var(--color-text-primary)' }}>
      <div className="philosophy-section">
        {/* Page Title - Manifesto Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h1 style={{
            fontFamily: 'var(--font-family-heading)',
            fontSize: 'clamp(3rem, 8vw, 5rem)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            fontWeight: 700,
            color: 'var(--color-parchment)',
            marginBottom: 'calc(var(--base-spacing) * 2)',
            textShadow: '0 0 10px rgba(0,0,0,0.5)'
          }}>
            {locale === 'ja' ? '私たちの信念' : 
             locale === 'zh-TW' ? '我們的信念' : 
             'Our Manifesto'}
          </h1>
          <p style={{
            fontFamily: 'var(--font-family-body)',
            fontSize: '1.2rem',
            color: 'var(--color-text-secondary)',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: 1.7
          }}>
            {locale === 'ja' ? 
              '深い対話を通じて、日本の達人の知恵を世界に伝える。これが私たちの使命です。' :
              locale === 'zh-TW' ?
              '透過深度對話，將日本大師的智慧傳遞給世界。這是我們的使命。' :
              'Core tenets that guide our mission to connect the world with Japan\'s ultimate masters.'
            }
          </p>
        </motion.div>

        {/* Four Core Principles - Manifesto Style */}
        {principles.map((principle, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            className="philosophy-principle"
          >
            {/* Large stylized number */}
            <div className="philosophy-principle-number">
              {String(index + 1).padStart(2, '0')}
            </div>
            
            {/* Principle title */}
            <h2 className="philosophy-principle h2">
              {getTitle(principle)}
            </h2>
            
            {/* Principle description */}
            <p className="philosophy-principle p">
              {getDescription(principle)}
            </p>
          </motion.div>
        ))}

        {/* Final Statement - Closing Manifesto */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center"
          style={{ marginTop: 'calc(var(--base-spacing) * 8)' }}
        >
          <div style={{
            width: '80px',
            height: '1px',
            backgroundColor: 'var(--color-vermilion)',
            margin: '0 auto calc(var(--base-spacing) * 3)'
          }}></div>
          
          <p style={{
            fontFamily: 'var(--font-family-body)',
            fontSize: '1.3rem',
            color: 'var(--color-parchment)',
            fontStyle: 'italic',
            maxWidth: '500px',
            margin: '0 auto calc(var(--base-spacing) * 4)',
            lineHeight: 1.8
          }}>
            {locale === 'ja' ? 
              '毎回の対話は、魂と魂の出会いであり、東洋の古い知恵と現代世界の架け橋なのです。' :
              locale === 'zh-TW' ?
              '每次對話都是靈魂與靈魂的相遇，是東方古老智慧與現代世界的橋樑。' :
              'Every conversation is an encounter between souls, a bridge between ancient wisdom and the modern world.'
            }
          </p>

          {/* Single Call to Action */}
          <button
            onClick={() => window.location.href = `/${locale}/masters`}
            style={{
              fontFamily: 'var(--font-family-heading)',
              fontSize: '1.1rem',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: 'var(--color-vermilion)',
              backgroundColor: 'transparent',
              border: '1px solid var(--color-vermilion)',
              padding: 'var(--base-spacing) calc(var(--base-spacing) * 2)',
              cursor: 'pointer',
              transition: 'all var(--duration-fast) var(--ease-suspense)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-vermilion)'
              e.currentTarget.style.color = 'var(--color-charcoal)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = 'var(--color-vermilion)'
            }}
          >
            {locale === 'ja' ? '達人に出会う' : 
             locale === 'zh-TW' ? '遇見大師' : 
             'Meet the Masters'}
          </button>
        </motion.div>
      </div>
    </div>
  )
}