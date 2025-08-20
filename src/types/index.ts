// 基础数据类型
export interface Master {
  id: string
  name: string
  title: string
  profileVideo?: string
  heroImage?: string
  introVideo?: string
  storyContent?: any
  topClips?: string[]
  missionCard?: MissionCard
  hasTripProduct: boolean
  tripBookingURL?: string
  priority: number
  isActive: boolean
  
  // 多语言支持
  nameEn?: string
  nameJa?: string
  titleEn?: string
  titleJa?: string
  
  createdAt: Date
  updatedAt: Date
}

export interface MissionCard {
  title: string
  description: string
}

export interface User {
  id: string
  email: string
  name?: string
  avatar?: string
  referralCode: string
  locale: string
  emailVerified?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Contribution {
  id: string
  userId: string
  type: ContributionType
  value: number
  metadata?: any
  createdAt: Date
}

export enum ContributionType {
  REFERRAL = 'REFERRAL',
  BOOKING = 'BOOKING',
  CONTENT_SHARE = 'CONTENT_SHARE',
  INTEREST = 'INTEREST'
}

export interface Interest {
  id: string
  userId: string
  masterId: string
  status: InterestStatus
  createdAt: Date
  updatedAt: Date
}

export enum InterestStatus {
  INTERESTED = 'INTERESTED',
  CONTACTED = 'CONTACTED',
  BOOKED = 'BOOKED',
  COMPLETED = 'COMPLETED'
}

export interface Content {
  id: string
  title: string
  slug: string
  excerpt?: string
  content: any
  coverImage?: string
  status: ContentStatus
  type: ContentType
  metaTitle?: string
  metaDescription?: string
  
  // 多语言
  titleEn?: string
  titleJa?: string
  excerptEn?: string
  excerptJa?: string
  
  publishedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export enum ContentStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED'
}

export enum ContentType {
  ARTICLE = 'ARTICLE',
  VIDEO = 'VIDEO',
  INTERVIEW = 'INTERVIEW',
  STORY = 'STORY'
}

// API响应类型
export interface APIResponse<T> {
  success: true
  data: T
  message?: string
  meta?: {
    total?: number
    page?: number
    limit?: number
  }
}

export interface APIError {
  success: false
  error: {
    code: string
    message: string
    details?: any
  }
}

// 页面prop类型
export interface PageProps {
  params: { [key: string]: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export interface LocalePageProps extends PageProps {
  params: { locale: string } & PageProps['params']
}

// 组件prop类型
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

// 首页相关类型
export interface HomepageTimeline {
  LOADING: { start: number; end: number }
  FADE_IN: { start: number; end: number }
  PLAY: { start: number; end: number }
  FADE_OUT: { start: number; end: number }
  TAGLINE: { start: number; end: number }
  BRAND: { start: number }
}

export interface SuspenseTagline {
  en: string
  'zh-TW': string
  ja: string
}

// 达人展示页相关类型
export interface DossierSection {
  id: string
  title: string
  content: any
  order: number
}

// 表单类型
export interface ContactForm {
  name: string
  email: string
  message: string
  masterId?: string
}

export interface InterestForm {
  masterId: string
  message?: string
}

// 搜索和筛选类型
export interface SearchFilters {
  query?: string
  type?: ContentType
  status?: ContentStatus
  page?: number
  limit?: number
}

export interface MasterFilters {
  hasTrip?: boolean
  isActive?: boolean
  search?: string
  page?: number
  limit?: number
}