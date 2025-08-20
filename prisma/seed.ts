import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // 清理现有数据（开发环境）
  if (process.env.NODE_ENV === 'development') {
    console.log('🧹 Cleaning existing data...')
    await prisma.payment.deleteMany()
    await prisma.conversion.deleteMany()
    await prisma.referralClick.deleteMany()
    await prisma.referralLink.deleteMany()
    await prisma.contribution.deleteMany()
    await prisma.interest.deleteMany()
    await prisma.adminLog.deleteMany()
    await prisma.content.deleteMany()
    await prisma.settings.deleteMany()
    await prisma.master.deleteMany()
    await prisma.verificationToken.deleteMany()
    await prisma.session.deleteMany()
    await prisma.account.deleteMany()
    await prisma.user.deleteMany()
  }

  // 创建测试用户
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'admin@tatamilabs.com',
        name: 'Admin User',
        role: 'SUPER_ADMIN',
        emailVerified: new Date(),
        locale: 'en',
        permissions: JSON.stringify([
          'VIEW_USERS', 'CREATE_USERS', 'UPDATE_USERS', 'DELETE_USERS',
          'VIEW_MASTERS', 'CREATE_MASTERS', 'UPDATE_MASTERS', 'DELETE_MASTERS',
          'VIEW_CONTENT', 'CREATE_CONTENT', 'UPDATE_CONTENT', 'DELETE_CONTENT',
          'MANAGE_ADMINS', 'VIEW_ANALYTICS', 'MANAGE_SETTINGS'
        ])
      }
    }),
    prisma.user.create({
      data: {
        email: 'editor@tatamilabs.com',
        name: 'Editor User',
        role: 'ADMIN',
        emailVerified: new Date(),
        locale: 'en',
        permissions: JSON.stringify([
          'VIEW_MASTERS', 'CREATE_MASTERS', 'UPDATE_MASTERS',
          'VIEW_CONTENT', 'CREATE_CONTENT', 'UPDATE_CONTENT'
        ])
      }
    }),
    prisma.user.create({
      data: {
        email: 'user@example.com',
        name: 'Test User',
        role: 'USER',
        emailVerified: new Date(),
        locale: 'en'
      }
    })
  ])

  console.log(`✅ Created ${users.length} users`)

  // 创建示例达人数据
  const masters = await Promise.all([
    prisma.master.create({
      data: {
        name: '田中一郎',
        nameEn: 'Ichiro Tanaka',
        nameJa: '田中一郎',
        title: '第16代酿酒师',
        titleEn: '16th Generation Sake Master',
        titleJa: '第16代酒造師',
        profileVideo: '/videos/masters/tanaka-profile.mp4',
        heroImage: '/images/masters/tanaka-hero.jpg',
        introVideo: '/videos/masters/tanaka-intro.mp4',
        storyContent: JSON.stringify({
          chapters: [
            {
              title: '传承的重量',
              content: '在这个古老的酒造中，每一滴酒都承载着四百年的历史...'
            }
          ]
        }),
        topClips: JSON.stringify([
          '/videos/clips/tanaka-1.mp4',
          '/videos/clips/tanaka-2.mp4',
          '/videos/clips/tanaka-3.mp4',
          '/videos/clips/tanaka-4.mp4',
          '/videos/clips/tanaka-5.mp4'
        ]),
        missionCard: JSON.stringify({
          title: '寻找传承者',
          description: '希望找到真正理解酿酒哲学的年轻人，传承这门古老的技艺。'
        }),
        hasTripProduct: true,
        tripBookingURL: 'https://example.com/book/tanaka-brewery',
        priority: 100,
        isActive: true,
      },
    }),
    
    prisma.master.create({
      data: {
        name: '山田花子',
        nameEn: 'Hanako Yamada',
        nameJa: '山田花子',
        title: '茶道宗师',
        titleEn: 'Tea Ceremony Master',
        titleJa: '茶道宗師',
        profileVideo: '/videos/masters/yamada-profile.mp4',
        heroImage: '/images/masters/yamada-hero.jpg',
        introVideo: '/videos/masters/yamada-intro.mp4',
        storyContent: JSON.stringify({
          chapters: [
            {
              title: '一期一会',
              content: '每一次茶会都是独一无二的相遇，珍惜当下的每一个瞬间...'
            }
          ]
        }),
        topClips: JSON.stringify([
          '/videos/clips/yamada-1.mp4',
          '/videos/clips/yamada-2.mp4',
          '/videos/clips/yamada-3.mp4',
          '/videos/clips/yamada-4.mp4',
          '/videos/clips/yamada-5.mp4'
        ]),
        missionCard: JSON.stringify({
          title: '传播茶道精神',
          description: '希望通过茶道让更多人理解日本文化的精髓。'
        }),
        hasTripProduct: false,
        priority: 90,
        isActive: true,
      },
    }),

    prisma.master.create({
      data: {
        name: '佐藤健',
        nameEn: 'Ken Sato',
        nameJa: '佐藤健',
        title: '刀匠',
        titleEn: 'Sword Smith',
        titleJa: '刀匠',
        profileVideo: '/videos/masters/sato-profile.mp4',
        heroImage: '/images/masters/sato-hero.jpg',
        introVideo: '/videos/masters/sato-intro.mp4',
        storyContent: JSON.stringify({
          chapters: [
            {
              title: '钢铁与火焰的对话',
              content: '每一把刀都有自己的性格，作为刀匠，我只是帮助它找到最好的形态...'
            }
          ]
        }),
        topClips: JSON.stringify([
          '/videos/clips/sato-1.mp4',
          '/videos/clips/sato-2.mp4',
          '/videos/clips/sato-3.mp4',
          '/videos/clips/sato-4.mp4',
          '/videos/clips/sato-5.mp4'
        ]),
        missionCard: JSON.stringify({
          title: '保护传统工艺',
          description: '希望能培养下一代刀匠，让这门技艺不会失传。'
        }),
        hasTripProduct: true,
        tripBookingURL: 'https://example.com/book/sato-workshop',
        priority: 85,
        isActive: true,
      },
    }),
  ])

  console.log(`✅ Created ${masters.length} masters`)

  // 创建用户兴趣关系
  const interests = await Promise.all([
    prisma.interest.create({
      data: {
        userId: users[2].id, // Test User
        masterId: masters[0].id,
        status: 'INTERESTED'
      }
    }),
    prisma.interest.create({
      data: {
        userId: users[2].id,
        masterId: masters[1].id,
        status: 'CONTACTED'
      }
    })
  ])

  console.log(`✅ Created ${interests.length} interests`)

  // 创建贡献记录
  const contributions = await Promise.all([
    prisma.contribution.create({
      data: {
        userId: users[2].id,
        type: 'INTEREST_EXPRESSED',
        value: 10,
        metadata: JSON.stringify({ masterId: masters[0].id })
      }
    }),
    prisma.contribution.create({
      data: {
        userId: users[2].id,
        type: 'PROFILE_SHARED',
        value: 5,
        metadata: JSON.stringify({ masterId: masters[1].id })
      }
    })
  ])

  console.log(`✅ Created ${contributions.length} contributions`)

  // 创建推广链接
  const referralLinks = await Promise.all([
    prisma.referralLink.create({
      data: {
        userId: users[2].id,
        code: 'WELCOME2024',
        name: 'Welcome Campaign',
        description: 'Special welcome offer for new members',
        targetUrl: '/',
        isActive: true,
        clickCount: 125,
        conversionCount: 8,
        totalEarnings: 240.50
      }
    }),
    prisma.referralLink.create({
      data: {
        userId: users[2].id,
        code: 'MASTERS50',
        name: 'Masters Discovery',
        description: 'Discover Japanese masters with special benefits',
        targetUrl: '/masters',
        isActive: true,
        clickCount: 67,
        conversionCount: 3,
        totalEarnings: 89.25,
        expiresAt: new Date('2024-12-31')
      }
    })
  ])

  console.log(`✅ Created ${referralLinks.length} referral links`)

  // 创建示例内容
  const contents = await Promise.all([
    prisma.content.create({
      data: {
        title: '匠心的传承：日本传统工艺的现代意义',
        titleEn: 'The Inheritance of Craftsmanship: Modern Significance of Japanese Traditional Arts',
        titleJa: '匠心の伝承：日本伝統工芸の現代的意義',
        slug: 'inheritance-of-craftsmanship',
        excerpt: '探索日本传统工艺在现代社会中的价值与意义',
        excerptEn: 'Exploring the value and significance of Japanese traditional crafts in modern society',
        excerptJa: '現代社会における日本伝統工芸の価値と意義を探る',
        content: JSON.stringify({
          blocks: [
            {
              type: 'paragraph',
              content: '在快速变化的现代社会中，日本传统工艺承载着独特的文化价值...'
            }
          ]
        }),
        coverImage: '/images/content/craftsmanship-cover.jpg',
        status: 'PUBLISHED',
        type: 'ARTICLE',
        metaTitle: '匠心的传承：日本传统工艺的现代意义 | Tatami Labs',
        metaDescription: '探索日本传统工艺在现代社会中的价值与意义，了解匠人精神的传承之路。',
        publishedAt: new Date(),
      },
    }),
  ])

  console.log(`✅ Created ${contents.length} content items`)

  // 创建系统设置
  const settings = await Promise.all([
    prisma.settings.create({
      data: {
        key: 'site_name',
        value: JSON.stringify({ value: 'Tatami Labs' }),
        description: 'Site name',
        category: 'GENERAL'
      }
    }),
    prisma.settings.create({
      data: {
        key: 'site_description',
        value: JSON.stringify({ 
          en: 'Connect with Japanese masters through deep conversations',
          ja: '深い会話を通じて日本の達人とつながる',
          'zh-TW': '通過深度對話與日本大師連結'
        }),
        description: 'Site description in multiple languages',
        category: 'GENERAL'
      }
    }),
    prisma.settings.create({
      data: {
        key: 'contact_email',
        value: JSON.stringify({ value: 'hello@tatamilabs.com' }),
        description: 'Contact email address',
        category: 'EMAIL'
      }
    }),
    prisma.settings.create({
      data: {
        key: 'commission_rate',
        value: JSON.stringify({ value: 0.15 }),
        description: 'Default commission rate for referrals (15%)',
        category: 'GENERAL'
      }
    })
  ])

  console.log(`✅ Created ${settings.length} settings`)

  console.log('\n🎉 Database seed completed successfully!')
  console.log('\n📊 Summary:')
  console.log(`  - ${users.length} users (admin@tatamilabs.com, editor@tatamilabs.com, user@example.com)`)
  console.log(`  - ${masters.length} masters`)
  console.log(`  - ${interests.length} user interests`)
  console.log(`  - ${contributions.length} contributions`)
  console.log(`  - ${referralLinks.length} referral links`)
  console.log(`  - ${contents.length} content items`)
  console.log(`  - ${settings.length} system settings`)
  console.log('\n💡 Test credentials:')
  console.log('  Admin: admin@tatamilabs.com')
  console.log('  Editor: editor@tatamilabs.com')
  console.log('  User: user@example.com')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })