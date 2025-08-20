'use client'

import React from 'react'
import Head from 'next/head'
import { useCurrentLocale } from '@/i18n/hooks'
import { SEOOptimizer, SEOConfig } from '@/lib/seo-optimization'

// SEO Head 组件
interface SEOHeadProps {
  config: SEOConfig
  locale?: string
  structuredData?: any
}

export function SEOHead({ config, locale, structuredData }: SEOHeadProps) {
  const currentLocale = useCurrentLocale()
  const finalLocale = locale || currentLocale

  return (
    <Head>
      {/* 基础标签 */}
      <title>{config.title}</title>
      <meta name="description" content={config.description} />
      {config.keywords && (
        <meta name="keywords" content={config.keywords.join(', ')} />
      )}
      {config.author && <meta name="author" content={config.author} />}
      <meta name="robots" content={config.robots || 'index, follow'} />
      
      {/* 规范链接 */}
      {config.canonical && <link rel="canonical" href={config.canonical} />}
      
      {/* 多语言链接 */}
      {config.alternateLanguages && Object.entries(config.alternateLanguages).map(([lang, url]) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={url} />
      ))}
      
      {/* Open Graph */}
      <meta property="og:title" content={config.title} />
      <meta property="og:description" content={config.description} />
      <meta property="og:type" content={config.ogType || 'website'} />
      <meta property="og:locale" content={finalLocale} />
      <meta property="og:site_name" content="Tatami Labs" />
      {config.canonical && <meta property="og:url" content={config.canonical} />}
      {config.ogImage && <meta property="og:image" content={config.ogImage} />}
      {config.ogImage && <meta property="og:image:alt" content={config.title} />}
      
      {/* 文章特定 Open Graph */}
      {config.ogType === 'article' && (
        <>
          {config.publishedTime && (
            <meta property="article:published_time" content={config.publishedTime} />
          )}
          {config.modifiedTime && (
            <meta property="article:modified_time" content={config.modifiedTime} />
          )}
          {config.author && <meta property="article:author" content={config.author} />}
          {config.section && <meta property="article:section" content={config.section} />}
          {config.tags && config.tags.map(tag => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@tatamilabs" />
      <meta name="twitter:title" content={config.title} />
      <meta name="twitter:description" content={config.description} />
      {config.ogImage && <meta name="twitter:image" content={config.ogImage} />}
      
      {/* 结构化数据 */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
      )}
    </Head>
  )
}

// 面包屑导航组件
interface BreadcrumbItem {
  name: string
  url: string
}

interface SEOBreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function SEOBreadcrumb({ items, className }: SEOBreadcrumbProps) {
  const optimizer = SEOOptimizer.getInstance()
  
  const breadcrumbSchema = optimizer.generateStructuredData('BreadcrumbList', { items })

  return (
    <>
      <nav className={className} aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && <span className="mx-2">/</span>}
              {index === items.length - 1 ? (
                <span className="font-medium text-foreground" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <a
                  href={item.url}
                  className="hover:text-foreground transition-colors"
                >
                  {item.name}
                </a>
              )}
            </li>
          ))}
        </ol>
      </nav>
      
      {/* 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema)
        }}
      />
    </>
  )
}

// 文章结构化数据组件
interface ArticleStructuredDataProps {
  title: string
  description: string
  author: string
  publishedAt: string
  updatedAt?: string
  image?: string
  url: string
  tags?: string[]
}

export function ArticleStructuredData({
  title,
  description,
  author,
  publishedAt,
  updatedAt,
  image,
  url,
  tags
}: ArticleStructuredDataProps) {
  const optimizer = SEOOptimizer.getInstance()
  
  const articleSchema = optimizer.generateStructuredData('Article', {
    title,
    description,
    author,
    publishedTime: publishedAt,
    modifiedTime: updatedAt,
    image,
    url,
    tags
  })

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(articleSchema)
      }}
    />
  )
}

// 人物结构化数据组件
interface PersonStructuredDataProps {
  name: string
  jobTitle?: string
  image?: string
  url?: string
  nationality?: string
  languages?: string[]
  bio?: string
}

export function PersonStructuredData({
  name,
  jobTitle,
  image,
  url,
  nationality,
  languages,
  bio
}: PersonStructuredDataProps) {
  const optimizer = SEOOptimizer.getInstance()
  
  const personSchema = optimizer.generateStructuredData('Person', {
    name,
    jobTitle,
    image,
    url,
    nationality,
    languages,
    description: bio
  })

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(personSchema)
      }}
    />
  )
}

// 搜索框组件（带结构化数据）
interface SEOSearchBoxProps {
  placeholder?: string
  onSearch: (query: string) => void
  className?: string
}

export function SEOSearchBox({ placeholder, onSearch, className }: SEOSearchBoxProps) {
  const optimizer = SEOOptimizer.getInstance()
  
  const searchSchema = optimizer.generateStructuredData('WebSite', {
    potentialAction: {
      '@type': 'SearchAction',
      target: `${process.env.NEXT_PUBLIC_BASE_URL}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const query = formData.get('search') as string
    if (query.trim()) {
      onSearch(query.trim())
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className={className} role="search">
        <div className="relative">
          <input
            type="search"
            name="search"
            placeholder={placeholder || "搜索..."}
            className="w-full px-4 py-2 pr-10 border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            aria-label="搜索内容"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
            aria-label="搜索"
          >
            🔍
          </button>
        </div>
      </form>
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(searchSchema)
        }}
      />
    </>
  )
}

// 文章目录组件（SEO友好）
interface TableOfContentsProps {
  headings: Array<{
    id: string
    text: string
    level: number
  }>
  className?: string
}

export function TableOfContents({ headings, className }: TableOfContentsProps) {
  return (
    <nav className={className} aria-label="Table of contents">
      <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-3">
        目录
      </h2>
      <ul className="space-y-2 text-sm">
        {headings.map((heading) => (
          <li
            key={heading.id}
            style={{ marginLeft: `${(heading.level - 1) * 12}px` }}
          >
            <a
              href={`#${heading.id}`}
              className="text-muted-foreground hover:text-foreground transition-colors block py-1"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

// FAQ 结构化数据组件
interface FAQItem {
  question: string
  answer: string
}

interface FAQStructuredDataProps {
  items: FAQItem[]
  showUI?: boolean
  className?: string
}

export function FAQStructuredData({ items, showUI = true, className }: FAQStructuredDataProps) {
  const optimizer = SEOOptimizer.getInstance()
  
  const faqSchema = optimizer.generateStructuredData('FAQPage', {
    mainEntity: items.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer
      }
    }))
  })

  return (
    <>
      {showUI && (
        <div className={className}>
          <h2 className="text-2xl font-bold mb-6">常见问题</h2>
          <div className="space-y-4">
            {items.map((item, index) => (
              <details key={index} className="border rounded-lg p-4">
                <summary className="font-medium cursor-pointer hover:text-primary">
                  {item.question}
                </summary>
                <div className="mt-3 text-muted-foreground">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      )}
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema)
        }}
      />
    </>
  )
}

// 组织信息结构化数据组件
export function OrganizationStructuredData() {
  const optimizer = SEOOptimizer.getInstance()
  
  const organizationSchema = optimizer.generateStructuredData('Organization', {
    name: 'Tatami Labs',
    alternateName: '畳ラボ',
    description: 'A platform connecting global users with Japanese masters through deep conversations',
    foundingDate: '2024',
    founders: [{
      '@type': 'Person',
      name: 'Founder Name'
    }],
    areaServed: 'Worldwide',
    serviceArea: 'Worldwide',
    knowsLanguage: ['en', 'ja', 'zh-TW']
  })

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(organizationSchema)
      }}
    />
  )
}

// 评论结构化数据组件
interface ReviewStructuredDataProps {
  itemName: string
  reviews: Array<{
    author: string
    rating: number
    reviewBody: string
    datePublished: string
  }>
}

export function ReviewStructuredData({ itemName, reviews }: ReviewStructuredDataProps) {
  const optimizer = SEOOptimizer.getInstance()
  
  const aggregateRating = reviews.length > 0 ? {
    '@type': 'AggregateRating',
    ratingValue: reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length,
    reviewCount: reviews.length,
    bestRating: 5,
    worstRating: 1
  } : undefined

  const reviewSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: itemName,
    aggregateRating,
    review: reviews.map(review => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.author
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating,
        bestRating: 5,
        worstRating: 1
      },
      reviewBody: review.reviewBody,
      datePublished: review.datePublished
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(reviewSchema)
      }}
    />
  )
}

// 事件结构化数据组件
interface EventStructuredDataProps {
  name: string
  description: string
  startDate: string
  endDate?: string
  location?: {
    name: string
    address?: string
  }
  organizer?: string
  url?: string
  image?: string
  offers?: {
    price: string
    currency: string
    availability: string
  }
}

export function EventStructuredData({
  name,
  description,
  startDate,
  endDate,
  location,
  organizer,
  url,
  image,
  offers
}: EventStructuredDataProps) {
  const optimizer = SEOOptimizer.getInstance()
  
  const eventSchema = optimizer.generateStructuredData('Event', {
    name,
    description,
    startDate,
    endDate,
    location: location ? {
      '@type': 'Place',
      name: location.name,
      address: location.address
    } : undefined,
    organizer: organizer ? {
      '@type': 'Organization',
      name: organizer
    } : undefined,
    url,
    image,
    offers: offers ? {
      '@type': 'Offer',
      price: offers.price,
      priceCurrency: offers.currency,
      availability: `https://schema.org/${offers.availability}`
    } : undefined
  })

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(eventSchema)
      }}
    />
  )
}