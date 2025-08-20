'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Icons } from '@/components/ui/icons'
import { useCurrentLocale } from '@/i18n/hooks'

export default function ContentPage() {
  const locale = useCurrentLocale()
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', label: 'All Content', labelJa: 'すべて', labelZh: '全部內容' },
    { id: 'philosophy', label: 'Philosophy', labelJa: '哲学', labelZh: '哲學' },
    { id: 'arts', label: 'Traditional Arts', labelJa: '伝統芸術', labelZh: '傳統藝術' },
    { id: 'crafts', label: 'Craftsmanship', labelJa: '職人技', labelZh: '工藝技術' },
    { id: 'culture', label: 'Culture', labelJa: '文化', labelZh: '文化' },
    { id: 'lifestyle', label: 'Lifestyle', labelJa: 'ライフスタイル', labelZh: '生活方式' }
  ]

  const content = [
    {
      id: 1,
      title: 'The Art of Tea Ceremony: Finding Peace in Movement',
      titleJa: '茶道の芸術：動きの中に平安を見つける',
      titleZh: '茶道藝術：在動作中尋找寧靜',
      category: 'philosophy',
      author: 'Master Yamamoto Sōtei',
      authorJa: '山本宗貞',
      authorZh: '山本宗貞大師',
      excerpt: 'Discover how the ancient practice of tea ceremony teaches us mindfulness, presence, and the beauty of imperfection through every careful movement.',
      excerptJa: '茶道の古い実践が、丁寧な動き一つ一つを通して、マインドフルネス、存在感、そして不完全さの美しさを教えてくれることを発見してください。',
      excerptZh: '探索古老的茶道實踐如何透過每個謹慎的動作，教導我們正念、臨在感，以及不完美的美。',
      image: '/images/content/tea-ceremony.jpg',
      readTime: '8 min read',
      publishedAt: '2024-01-15',
      featured: true
    },
    {
      id: 2,
      title: 'Forging Excellence: The Soul of Japanese Swordmaking',
      titleJa: '卓越を鍛える：日本刀作りの魂',
      titleZh: '鍛造卓越：日本刀劍製作的靈魂',
      category: 'crafts',
      author: 'Master Takeshi Kobayashi',
      authorJa: '小林武志',
      authorZh: '小林武志大師',
      excerpt: 'Journey into the forge where master swordsmiths transform raw steel into works of art, embodying centuries of tradition and spiritual discipline.',
      excerptJa: '刀鍛冶の達人が生の鋼を芸術作品に変える鍛冶場への旅で、何世紀もの伝統と精神的な規律を体現します。',
      excerptZh: '深入鍛造間，在那裡大師級刀匠將原鋼轉化為藝術作品，體現了數百年的傳統和精神修養。',
      image: '/images/content/swordmaking.jpg',
      readTime: '12 min read',
      publishedAt: '2024-01-10',
      featured: false
    },
    {
      id: 3,
      title: 'Seasons of Reflection: Japanese Garden Philosophy',
      titleJa: '季節の瞑想：日本庭園の哲学',
      titleZh: '反思的季節：日本庭園哲學',
      category: 'philosophy',
      author: 'Master Hiroshi Nakamura',
      authorJa: '中村寛',
      authorZh: '中村寬大師',
      excerpt: 'Learn how Japanese gardens are designed as living meditations, where every stone, plant, and pathway tells a story of harmony with nature.',
      excerptJa: '日本庭園がどのように生きた瞑想として設計され、すべての石、植物、小道が自然との調和の物語を語るかを学びます。',
      excerptZh: '了解日本庭園如何被設計為活生生的冥想，每一塊石頭、植物和小徑都訴說著與自然和諧的故事。',
      image: '/images/content/garden.jpg',
      readTime: '6 min read',
      publishedAt: '2024-01-08',
      featured: true
    },
    {
      id: 4,
      title: 'The Way of Pottery: Embracing Imperfection',
      titleJa: '陶芸の道：不完全さを受け入れる',
      titleZh: '陶藝之道：擁抱不完美',
      category: 'arts',
      author: 'Master Kenji Watanabe',
      authorJa: '渡部健二',
      authorZh: '渡部健二大師',
      excerpt: 'Explore the philosophy of wabi-sabi through pottery, where flaws become features and imperfection reveals the deepest beauty.',
      excerptJa: '陶芸を通して侘寂の哲学を探求し、欠陥が特徴となり、不完全さが最も深い美しさを明らかにします。',
      excerptZh: '透過陶藝探索侘寂哲學，在那裡缺陷成為特色，不完美揭示了最深層的美。',
      image: '/images/content/pottery.jpg',
      readTime: '10 min read',
      publishedAt: '2024-01-05',
      featured: false
    },
    {
      id: 5,
      title: 'Living Minimalism: The Japanese Approach to Space',
      titleJa: 'ミニマリズムに生きる：空間への日本的アプローチ',
      titleZh: '生活極簡主義：日本的空間方法',
      category: 'lifestyle',
      author: 'Master Yuki Tanaka',
      authorJa: '田中雪',
      authorZh: '田中雪大師',
      excerpt: 'Discover how Japanese design principles create spaces that calm the mind and nurture the soul through intentional simplicity.',
      excerptJa: '日本のデザイン原則が、意図的なシンプルさを通して心を落ち着かせ、魂を育む空間をどのように作り出すかを発見してください。',
      excerptZh: '探索日本設計原則如何透過有意的簡約，創造出能平靜心靈、滋養靈魂的空間。',
      image: '/images/content/minimalism.jpg',
      readTime: '7 min read',
      publishedAt: '2024-01-03',
      featured: false
    }
  ]

  const getCategoryLabel = (category: typeof categories[0]) => {
    switch (locale) {
      case 'ja':
        return category.labelJa
      case 'zh-TW':
        return category.labelZh
      default:
        return category.label
    }
  }

  const getContentTitle = (item: typeof content[0]) => {
    switch (locale) {
      case 'ja':
        return item.titleJa
      case 'zh-TW':
        return item.titleZh
      default:
        return item.title
    }
  }

  const getContentExcerpt = (item: typeof content[0]) => {
    switch (locale) {
      case 'ja':
        return item.excerptJa
      case 'zh-TW':
        return item.excerptZh
      default:
        return item.excerpt
    }
  }

  const getAuthorName = (item: typeof content[0]) => {
    switch (locale) {
      case 'ja':
        return item.authorJa
      case 'zh-TW':
        return item.authorZh
      default:
        return item.author
    }
  }

  const filteredContent = selectedCategory === 'all' 
    ? content 
    : content.filter(item => item.category === selectedCategory)

  const featuredContent = content.filter(item => item.featured)

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
              {locale === 'ja' ? 'コンテンツセンター' : 
               locale === 'zh-TW' ? '內容中心' : 
               'Content Center'}
            </h1>
            <p className="text-xl md:text-2xl font-light text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {locale === 'ja' ? 
                '日本の達人たちの深い知恵と洞察を、記事、ビデオ、インタビューで探求してください。' :
                locale === 'zh-TW' ?
                '透過文章、影片和訪談，探索日本大師們的深刻智慧與洞察。' :
                'Explore the profound wisdom and insights of Japan\'s masters through articles, videos, and interviews.'
              }
            </p>
          </motion.div>
        </div>
      </section>

      {/* 特色内容 */}
      {featuredContent.length > 0 && (
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
                {locale === 'ja' ? '注目の記事' : 
                 locale === 'zh-TW' ? '精選文章' : 
                 'Featured Articles'}
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {featuredContent.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer">
                    <div className="aspect-video bg-muted relative overflow-hidden">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={getContentTitle(item)}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                          <Icons.play className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                      <Badge className="absolute top-4 left-4 bg-primary">
                        {locale === 'ja' ? '注目' : 
                         locale === 'zh-TW' ? '精選' : 
                         'Featured'}
                      </Badge>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2 mb-3">
                        <Badge variant="outline" className="text-xs">
                          {getCategoryLabel(categories.find(c => c.id === item.category) || categories[0])}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{item.readTime}</span>
                      </div>
                      <h3 className="text-xl font-medium mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                        {getContentTitle(item)}
                      </h3>
                      <p className="text-muted-foreground mb-4 line-clamp-3">
                        {getContentExcerpt(item)}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                          {getAuthorName(item)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(item.publishedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 内容分类和列表 */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          {/* 分类过滤器 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap justify-center gap-2 mb-16"
          >
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category.id)}
                className="mb-2"
              >
                {getCategoryLabel(category)}
              </Button>
            ))}
          </motion.div>

          {/* 内容网格 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
          >
            {filteredContent.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer">
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={getContentTitle(item)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <Icons.play className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <Badge variant="outline" className="text-xs">
                        {getCategoryLabel(categories.find(c => c.id === item.category) || categories[0])}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{item.readTime}</span>
                    </div>
                    <h3 className="text-lg font-medium mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                      {getContentTitle(item)}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {getContentExcerpt(item)}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{getAuthorName(item)}</span>
                      <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* 空状态 */}
          {filteredContent.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-lg text-muted-foreground mb-4">
                {locale === 'ja' ? 'このカテゴリーのコンテンツは見つかりませんでした。' :
                 locale === 'zh-TW' ? '在此類別中未找到內容。' :
                 'No content found in this category.'}
              </p>
              <Button
                variant="outline"
                onClick={() => setSelectedCategory('all')}
              >
                {locale === 'ja' ? 'すべて表示' :
                 locale === 'zh-TW' ? '顯示全部' :
                 'Show All'}
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      {/* 订阅区域 */}
      <section className="py-24 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-light mb-6">
              {locale === 'ja' ? '最新情報をお届けします' : 
               locale === 'zh-TW' ? '獲取最新資訊' : 
               'Stay Updated'}
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              {locale === 'ja' ? 
                '新しい記事、マスターのインタビュー、独占コンテンツの最新情報を受け取りましょう。' :
                locale === 'zh-TW' ?
                '接收新文章、大師訪談和獨家內容的最新資訊。' :
                'Receive updates on new articles, master interviews, and exclusive content.'
              }
            </p>
            <Button size="lg">
              {locale === 'ja' ? 'ニュースレター登録' : 
               locale === 'zh-TW' ? '訂閱電子報' : 
               'Subscribe to Newsletter'}
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}