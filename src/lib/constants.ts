// 首页时序控制常量
export const HOMEPAGE_TIMELINE = {
  LOADING: { start: 0, end: 1000 },      // 0-1s: 纯黑加载
  FADE_IN: { start: 1000, end: 2500 },  // 1-2.5s: 视频淡入
  PLAY: { start: 2500, end: 9500 },     // 2.5-9.5s: 视频播放
  FADE_OUT: { start: 9500, end: 11000 }, // 9.5-11s: 视频淡出
  TAGLINE: { start: 11000, end: 13000 }, // 11-13s: 悬念标语
  BRAND: { start: 13000 }                // 13s+: 品牌元素出现
} as const

// 悬念标语（多语言）
export const SUSPENSE_TAGLINES = {
  en: [
    "Some stories can only be told face to face...",
    "What takes four centuries to perfect?",
    "Behind every master, there's a secret...",
    "The art of living, passed down through generations.",
    "What would you ask someone who has devoted their life to perfection?"
  ],
  'zh-TW': [
    "有些故事，只能面對面才能說清楚...",
    "什麼需要四百年才能完美？",
    "每個匠人背後，都有一個秘密...",
    "生活的藝術，世代相傳。",
    "如果遇到一生追求完美的人，你會問什麼？"
  ],
  ja: [
    "ある物語は、対面でしか語れない...",
    "四百年かけて完成するものとは？",
    "すべての職人の背後には、秘密がある...",
    "生きる技術、代々受け継がれる。",
    "完璧を追求して生きる人に、あなたは何を聞きますか？"
  ]
} as const

// 地理位置到语言的映射
export const GEO_LOCALE_MAP = {
  TW: 'zh-TW',
  HK: 'zh-TW',
  MO: 'zh-TW',
  JP: 'ja',
  default: 'en'
} as const

// API 响应码
export const API_CODES = {
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR'
} as const

// 贡献类型
export const CONTRIBUTION_TYPES = {
  REFERRAL: 'REFERRAL',
  BOOKING: 'BOOKING', 
  CONTENT_SHARE: 'CONTENT_SHARE',
  INTEREST: 'INTEREST'
} as const

// 兴趣状态
export const INTEREST_STATUS = {
  INTERESTED: 'INTERESTED',
  CONTACTED: 'CONTACTED',
  BOOKED: 'BOOKED', 
  COMPLETED: 'COMPLETED'
} as const

// 内容状态和类型
export const CONTENT_STATUS = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED'
} as const

export const CONTENT_TYPES = {
  ARTICLE: 'ARTICLE',
  VIDEO: 'VIDEO', 
  INTERVIEW: 'INTERVIEW',
  STORY: 'STORY'
} as const

// 分页默认值
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100
} as const

// 媒体配置
export const MEDIA_CONFIG = {
  VIDEO: {
    MAX_SIZE: 100 * 1024 * 1024, // 100MB
    ALLOWED_FORMATS: ['mp4', 'webm', 'mov'],
    THUMBNAIL_QUALITY: 80
  },
  IMAGE: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_FORMATS: ['jpg', 'jpeg', 'png', 'webp'],
    THUMBNAIL_SIZES: [400, 800, 1200]
  }
} as const

// 网站配置
export const SITE_CONFIG = {
  name: 'Tatami Labs',
  description: '通过策划"深度对谈旅行"，连接全球用户与日本的"极致之人"',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  ogImage: '/og-image.jpg',
  links: {
    twitter: 'https://twitter.com/tatami-labs',
    instagram: 'https://instagram.com/tatami.labs'
  }
} as const

// 导航菜单
export const NAVIGATION = {
  main: [
    { key: 'philosophy', href: '/philosophy' },
    { key: 'masters', href: '/masters' },
    { key: 'content', href: '/content' },
    { key: 'community', href: '/community' }
  ],
  footer: [
    { key: 'about', href: '/about' },
    { key: 'privacy', href: '/privacy' },
    { key: 'terms', href: '/terms' },
    { key: 'contact', href: '/contact' }
  ]
} as const

// 语言选项
export const LOCALES = ['en', 'zh-TW', 'ja'] as const
export const DEFAULT_LOCALE = 'en' as const

// 错误消息
export const ERROR_MESSAGES = {
  en: {
    generic: 'Something went wrong. Please try again.',
    notFound: 'The requested resource was not found.',
    unauthorized: 'You need to sign in to access this resource.',
    validation: 'Please check your input and try again.',
    networkError: 'Network error. Please check your connection.'
  },
  'zh-TW': {
    generic: '發生錯誤，請重試。',
    notFound: '找不到請求的資源。',
    unauthorized: '需要登入才能訪問此資源。',
    validation: '請檢查您的輸入並重試。',
    networkError: '網絡錯誤，請檢查您的連接。'
  },
  ja: {
    generic: 'エラーが発生しました。もう一度お試しください。',
    notFound: '要求されたリソースが見つかりません。',
    unauthorized: 'このリソースにアクセスするにはサインインが必要です。',
    validation: '入力内容を確認してもう一度お試しください。',
    networkError: 'ネットワークエラー。接続を確認してください。'
  }
} as const