'use client'

import { Metadata } from 'next'

// SEO 配置类型
export interface SEOConfig {
  title: string
  description: string
  keywords?: string[]
  canonical?: string
  ogImage?: string
  ogType?: 'website' | 'article' | 'profile'
  locale?: string
  alternateLanguages?: Record<string, string>
  author?: string
  publishedTime?: string
  modifiedTime?: string
  section?: string
  tags?: string[]
  robots?: string
  schema?: any
}

// 多语言 SEO 配置
export interface MultilingualSEOConfig {
  en: SEOConfig
  'zh-TW': SEOConfig
  ja: SEOConfig
}

// SEO 优化器类
export class SEOOptimizer {
  private static instance: SEOOptimizer
  private baseUrl: string = process.env.NEXT_PUBLIC_BASE_URL || 'https://tatami-labs.com'
  
  static getInstance(): SEOOptimizer {
    if (!SEOOptimizer.instance) {
      SEOOptimizer.instance = new SEOOptimizer()
    }
    return SEOOptimizer.instance
  }

  // 生成基础页面元数据
  generateBasicMetadata(config: SEOConfig, locale: string = 'en'): Metadata {
    const metadata: Metadata = {
      title: config.title,
      description: config.description,
      keywords: config.keywords,
      authors: config.author ? [{ name: config.author }] : undefined,
      robots: config.robots || 'index, follow',
      canonical: config.canonical || undefined,
      
      openGraph: {
        title: config.title,
        description: config.description,
        type: config.ogType || 'website',
        locale: locale,
        url: config.canonical,
        images: config.ogImage ? [{
          url: config.ogImage,
          width: 1200,
          height: 630,
          alt: config.title
        }] : undefined,
        siteName: 'Tatami Labs'
      },

      twitter: {
        card: 'summary_large_image',
        title: config.title,
        description: config.description,
        images: config.ogImage ? [config.ogImage] : undefined,
        creator: '@tatamilabs'
      },

      alternates: {
        canonical: config.canonical,
        languages: config.alternateLanguages
      }
    }

    // 文章特定元数据
    if (config.ogType === 'article') {
      metadata.openGraph = {
        ...metadata.openGraph,
        type: 'article',
        publishedTime: config.publishedTime,
        modifiedTime: config.modifiedTime,
        section: config.section,
        tags: config.tags
      }
    }

    return metadata
  }

  // 生成多语言页面元数据
  generateMultilingualMetadata(
    configs: MultilingualSEOConfig,
    currentLocale: string,
    pathname: string
  ): Metadata {
    const currentConfig = configs[currentLocale as keyof MultilingualSEOConfig]
    
    // 生成语言替代链接
    const alternateLanguages: Record<string, string> = {}
    Object.keys(configs).forEach(locale => {
      alternateLanguages[locale] = `${this.baseUrl}/${locale}${pathname}`
    })

    const enhancedConfig: SEOConfig = {
      ...currentConfig,
      canonical: `${this.baseUrl}/${currentLocale}${pathname}`,
      alternateLanguages
    }

    return this.generateBasicMetadata(enhancedConfig, currentLocale)
  }

  // 生成结构化数据
  generateStructuredData(type: string, data: any): any {
    const baseStructure = {
      '@context': 'https://schema.org',
      '@type': type
    }

    switch (type) {
      case 'Organization':
        return {
          ...baseStructure,
          name: 'Tatami Labs',
          url: this.baseUrl,
          logo: `${this.baseUrl}/logo.png`,
          sameAs: [
            'https://twitter.com/tatamilabs',
            'https://linkedin.com/company/tatamilabs'
          ],
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+1-xxx-xxx-xxxx',
            contactType: 'Customer Service',
            availableLanguage: ['English', 'Japanese', 'Chinese']
          },
          ...data
        }

      case 'Person':
        return {
          ...baseStructure,
          name: data.name,
          url: data.url,
          image: data.image,
          jobTitle: data.jobTitle,
          worksFor: {
            '@type': 'Organization',
            name: 'Tatami Labs'
          },
          nationality: data.nationality,
          knowsLanguage: data.languages,
          ...data
        }

      case 'Article':
        return {
          ...baseStructure,
          headline: data.title,
          description: data.description,
          image: data.image,
          datePublished: data.publishedTime,
          dateModified: data.modifiedTime,
          author: {
            '@type': 'Person',
            name: data.author
          },
          publisher: {
            '@type': 'Organization',
            name: 'Tatami Labs',
            logo: {
              '@type': 'ImageObject',
              url: `${this.baseUrl}/logo.png`
            }
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': data.url
          },
          ...data
        }

      case 'WebSite':
        return {
          ...baseStructure,
          name: 'Tatami Labs',
          url: this.baseUrl,
          potentialAction: {
            '@type': 'SearchAction',
            target: `${this.baseUrl}/search?q={search_term_string}`,
            'query-input': 'required name=search_term_string'
          },
          ...data
        }

      case 'BreadcrumbList':
        return {
          ...baseStructure,
          itemListElement: data.items.map((item: any, index: number) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url
          }))
        }

      default:
        return { ...baseStructure, ...data }
    }
  }

  // 生成站点地图数据
  generateSitemapData(pages: Array<{
    url: string
    lastModified: string
    changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
    priority: number
  }>) {
    return pages.map(page => ({
      url: `${this.baseUrl}${page.url}`,
      lastModified: page.lastModified,
      changeFrequency: page.changeFrequency,
      priority: page.priority
    }))
  }

  // 生成 robots.txt 内容
  generateRobotsTxt(config: {
    userAgent?: string
    allow?: string[]
    disallow?: string[]
    crawlDelay?: number
    sitemap?: string[]
  }) {
    const lines = []
    
    lines.push(`User-agent: ${config.userAgent || '*'}`)
    
    if (config.allow) {
      config.allow.forEach(path => lines.push(`Allow: ${path}`))
    }
    
    if (config.disallow) {
      config.disallow.forEach(path => lines.push(`Disallow: ${path}`))
    }
    
    if (config.crawlDelay) {
      lines.push(`Crawl-delay: ${config.crawlDelay}`)
    }
    
    if (config.sitemap) {
      config.sitemap.forEach(url => lines.push(`Sitemap: ${url}`))
    }
    
    return lines.join('\n')
  }

  // URL 优化
  optimizeUrl(title: string, locale?: string): string {
    // 移除特殊字符，转换为 slug
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // 移除特殊字符
      .replace(/\s+/g, '-') // 空格转换为连字符
      .replace(/--+/g, '-') // 多个连字符合并为一个
      .trim()
      .replace(/^-+|-+$/g, '') // 移除开头和结尾的连字符

    return locale ? `/${locale}/${slug}` : `/${slug}`
  }

  // 图片 SEO 优化
  optimizeImageSEO(src: string, alt: string, title?: string): {
    src: string
    alt: string
    title?: string
    loading: 'lazy' | 'eager'
  } {
    return {
      src: src.includes('?') ? `${src}&seo=1` : `${src}?seo=1`,
      alt: alt.trim(),
      title: title?.trim(),
      loading: 'lazy'
    }
  }
}

// SEO 分析器
export class SEOAnalyzer {
  private static instance: SEOAnalyzer

  static getInstance(): SEOAnalyzer {
    if (!SEOAnalyzer.instance) {
      SEOAnalyzer.instance = new SEOAnalyzer()
    }
    return SEOAnalyzer.instance
  }

  // 分析页面 SEO 质量
  analyzePage(content: {
    title: string
    description: string
    headings: { level: number; text: string }[]
    images: { src: string; alt: string }[]
    links: { href: string; text: string; external: boolean }[]
    wordCount: number
    keywords?: string[]
  }) {
    const issues: string[] = []
    const recommendations: string[] = []
    let score = 100

    // 标题分析
    if (content.title.length < 30) {
      issues.push('标题太短，建议30-60字符')
      score -= 10
    } else if (content.title.length > 60) {
      issues.push('标题太长，建议30-60字符')
      score -= 5
    }

    // 描述分析
    if (content.description.length < 120) {
      issues.push('描述太短，建议120-160字符')
      score -= 10
    } else if (content.description.length > 160) {
      issues.push('描述太长，建议120-160字符')
      score -= 5
    }

    // 标题层级分析
    const h1Count = content.headings.filter(h => h.level === 1).length
    if (h1Count === 0) {
      issues.push('缺少H1标题')
      score -= 15
    } else if (h1Count > 1) {
      issues.push('页面有多个H1标题')
      score -= 10
    }

    // 图片分析
    const imagesWithoutAlt = content.images.filter(img => !img.alt.trim())
    if (imagesWithoutAlt.length > 0) {
      issues.push(`${imagesWithoutAlt.length}张图片缺少alt属性`)
      score -= imagesWithoutAlt.length * 2
    }

    // 内容分析
    if (content.wordCount < 300) {
      recommendations.push('内容字数较少，建议增加到300字以上')
      score -= 5
    }

    // 链接分析
    const internalLinks = content.links.filter(link => !link.external).length
    const externalLinks = content.links.filter(link => link.external).length
    
    if (internalLinks < 2) {
      recommendations.push('增加内部链接以提升页面权重')
    }

    if (externalLinks === 0) {
      recommendations.push('适当添加高质量外部链接')
    }

    return {
      score: Math.max(0, score),
      issues,
      recommendations,
      metrics: {
        titleLength: content.title.length,
        descriptionLength: content.description.length,
        h1Count,
        imageCount: content.images.length,
        imagesWithoutAlt: imagesWithoutAlt.length,
        wordCount: content.wordCount,
        internalLinks,
        externalLinks
      }
    }
  }

  // 关键词密度分析
  analyzeKeywordDensity(content: string, keywords: string[]) {
    const words = content.toLowerCase().split(/\s+/)
    const totalWords = words.length

    return keywords.map(keyword => {
      const keywordCount = content.toLowerCase().split(keyword.toLowerCase()).length - 1
      const density = (keywordCount / totalWords) * 100

      return {
        keyword,
        count: keywordCount,
        density: Math.round(density * 100) / 100,
        status: density >= 0.5 && density <= 2.5 ? 'optimal' : density < 0.5 ? 'low' : 'high'
      }
    })
  }
}

// 页面性能和 SEO 指标
export class PagePerformanceTracker {
  private static instance: PagePerformanceTracker
  private metrics: Map<string, any> = new Map()

  static getInstance(): PagePerformanceTracker {
    if (!PagePerformanceTracker.instance) {
      PagePerformanceTracker.instance = new PagePerformanceTracker()
    }
    return PagePerformanceTracker.instance
  }

  // 跟踪核心网络指标
  trackCoreWebVitals() {
    if (typeof window === 'undefined') return

    // Largest Contentful Paint (LCP)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      const lastEntry = entries[entries.length - 1]
      this.metrics.set('LCP', lastEntry.startTime)
    }).observe({ entryTypes: ['largest-contentful-paint'] })

    // First Input Delay (FID)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      entries.forEach(entry => {
        this.metrics.set('FID', entry.processingStart - entry.startTime)
      })
    }).observe({ entryTypes: ['first-input'] })

    // Cumulative Layout Shift (CLS)
    let clsValue = 0
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      entries.forEach(entry => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
          this.metrics.set('CLS', clsValue)
        }
      })
    }).observe({ entryTypes: ['layout-shift'] })

    // First Contentful Paint (FCP)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      entries.forEach(entry => {
        this.metrics.set('FCP', entry.startTime)
      })
    }).observe({ entryTypes: ['paint'] })
  }

  // 获取性能指标
  getMetrics() {
    return Object.fromEntries(this.metrics)
  }

  // 生成性能报告
  generatePerformanceReport() {
    const metrics = this.getMetrics()
    const report = {
      score: 100,
      issues: [] as string[],
      recommendations: [] as string[]
    }

    // LCP 分析
    if (metrics.LCP > 4000) {
      report.score -= 20
      report.issues.push('LCP过高（>4秒）')
      report.recommendations.push('优化图片和视频加载')
    } else if (metrics.LCP > 2500) {
      report.score -= 10
      report.recommendations.push('进一步优化LCP到2.5秒以下')
    }

    // FID 分析
    if (metrics.FID > 300) {
      report.score -= 15
      report.issues.push('FID过高（>300ms）')
      report.recommendations.push('优化JavaScript执行')
    } else if (metrics.FID > 100) {
      report.score -= 5
      report.recommendations.push('继续优化FID到100ms以下')
    }

    // CLS 分析
    if (metrics.CLS > 0.25) {
      report.score -= 15
      report.issues.push('CLS过高（>0.25）')
      report.recommendations.push('修复布局偏移问题')
    } else if (metrics.CLS > 0.1) {
      report.score -= 5
      report.recommendations.push('进一步减少布局偏移')
    }

    return report
  }
}

// React Hooks

// SEO 数据管理 Hook
import { useState, useEffect } from 'react'

export function useSEOData(pageType: string, data: any) {
  const [seoConfig, setSeoConfig] = useState<SEOConfig | null>(null)
  const [structuredData, setStructuredData] = useState<any>(null)
  
  const optimizer = SEOOptimizer.getInstance()

  useEffect(() => {
    const generateSEO = () => {
      let config: SEOConfig

      switch (pageType) {
        case 'homepage':
          config = {
            title: 'Tatami Labs - Deep Conversations with Japanese Masters',
            description: 'Connect with Japanese masters through immersive conversation journeys. Experience authentic cultural exchange and deep learning.',
            keywords: ['Japanese culture', 'conversation', 'masters', 'cultural exchange'],
            ogType: 'website'
          }
          break

        case 'master':
          config = {
            title: `${data.name} - Japanese Master | Tatami Labs`,
            description: `Learn from ${data.name}, a ${data.expertise} master. ${data.bio}`,
            keywords: [data.expertise, 'Japanese master', data.name],
            ogType: 'profile',
            ogImage: data.image
          }
          break

        case 'article':
          config = {
            title: data.title,
            description: data.excerpt,
            keywords: data.tags,
            ogType: 'article',
            ogImage: data.featuredImage,
            author: data.author,
            publishedTime: data.publishedAt,
            modifiedTime: data.updatedAt
          }
          break

        default:
          config = {
            title: data.title || 'Tatami Labs',
            description: data.description || 'Deep conversations with Japanese masters',
            ogType: 'website'
          }
      }

      setSeoConfig(config)

      // 生成结构化数据
      const schema = optimizer.generateStructuredData(
        pageType === 'master' ? 'Person' : 
        pageType === 'article' ? 'Article' : 'WebSite',
        data
      )
      setStructuredData(schema)
    }

    generateSEO()
  }, [pageType, data, optimizer])

  return { seoConfig, structuredData }
}

// 页面性能监控 Hook
export function usePagePerformance() {
  const [metrics, setMetrics] = useState<any>({})
  const [report, setReport] = useState<any>(null)
  
  const tracker = PagePerformanceTracker.getInstance()

  useEffect(() => {
    tracker.trackCoreWebVitals()

    const updateMetrics = () => {
      setMetrics(tracker.getMetrics())
      setReport(tracker.generatePerformanceReport())
    }

    const interval = setInterval(updateMetrics, 1000)
    
    return () => clearInterval(interval)
  }, [tracker])

  return { metrics, report }
}

// SEO 分析 Hook
export function useSEOAnalysis(content: any) {
  const [analysis, setAnalysis] = useState<any>(null)
  
  const analyzer = SEOAnalyzer.getInstance()

  useEffect(() => {
    if (content) {
      const result = analyzer.analyzePage(content)
      setAnalysis(result)
    }
  }, [content, analyzer])

  return analysis
}