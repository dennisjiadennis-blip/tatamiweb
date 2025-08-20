'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import { MasterCard } from '@/components/masters/master-card'
import { useCurrentLocale, useTranslations } from '@/i18n/hooks'

interface Master {
  id: string
  name: string
  nameEn?: string
  nameJa?: string
  title: string
  titleEn?: string
  titleJa?: string
  description?: string
  heroImage?: string
  profileVideo?: string
  hasTripProduct: boolean
  location?: string
  locationEn?: string
  locationJa?: string
  tags?: string[]
  _count: {
    interests: number
  }
}

interface MastersResponse {
  masters: Master[]
  pagination: {
    page: number
    limit: number
    totalCount: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export default function MastersPage() {
  const [masters, setMasters] = useState<Master[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'trips' | 'conversations'>('all')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState<MastersResponse['pagination'] | null>(null)
  
  const params = useParams()
  const localeFromHook = useCurrentLocale()
  const localeFromParams = params.locale as string
  
  // Use params locale as fallback if hook fails
  const locale = localeFromHook || localeFromParams || 'en'
  const t = useTranslations()
  
  // Ensure locale is properly detected from URL params as fallback

  const fetchMasters = async (searchTerm = '', filterType = 'all', pageNum = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: '12',
      })
      
      if (searchTerm) params.set('search', searchTerm)
      if (filterType === 'trips') params.set('hasTripProduct', 'true')
      if (filterType === 'conversations') params.set('hasTripProduct', 'false')

      const response = await fetch(`/api/masters?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setMasters(data.data.masters)
        setPagination(data.data.pagination)
      }
    } catch (error) {
      console.error('Failed to fetch masters:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMasters(search, filter, page)
  }, [search, filter, page])

  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const handleFilterChange = (newFilter: typeof filter) => {
    setFilter(newFilter)
    setPage(1)
  }

  // Get localized text for the new design
  const getLocalizedText = (key: string) => {
    const texts = {
      title: {
        en: 'Intelligence Dossier',
        'zh-TW': '情報檔案',
        ja: 'インテリジェンス・ドシエ'
      },
      subtitle: {
        en: 'Discover the masters who will guide your journey',
        'zh-TW': '發現將引導您旅程的大師',
        ja: 'あなたの旅を導く名匠を発見する'
      },
      allMasters: {
        en: 'All Masters',
        'zh-TW': '所有大師',
        ja: '全ての名匠'
      },
      withTrips: {
        en: 'With Trips',
        'zh-TW': '有旅程',
        ja: '旅程あり'
      },
      noMastersFound: {
        en: 'No masters found matching your criteria.',
        'zh-TW': '沒有找到符合條件的大師。',
        ja: '条件に一致する名匠が見つかりません。'
      },
      clearFilters: {
        en: 'Clear Filters',
        'zh-TW': '清除篩選',
        ja: 'フィルターをクリア'
      }
    }
    const result = texts[key as keyof typeof texts]?.[locale as keyof typeof texts.title] || texts[key as keyof typeof texts]?.en
    return result
  }

  return (
    <div className="masters-page-container">
      <div className="masters-content-container">
        {/* Page Title - Dramatic Typography */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="masters-page-title">
            {getLocalizedText('title')}
          </h1>
          <p className="masters-page-subtitle">
            {getLocalizedText('subtitle')}
          </p>
        </motion.div>

        {/* Minimalist Filter Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center gap-8 mb-16"
        >
          <button
            onClick={() => handleFilterChange('all')}
            className={`masters-filter-button ${filter === 'all' ? 'active' : ''}`}
          >
            {getLocalizedText('allMasters')}
          </button>
          <button
            onClick={() => handleFilterChange('trips')}
            className={`masters-filter-button ${filter === 'trips' ? 'active' : ''}`}
          >
            {getLocalizedText('withTrips')}
          </button>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <div style={{
              width: '2rem',
              height: '2rem',
              border: '2px solid var(--color-text-secondary)',
              borderTop: '2px solid var(--color-vermilion)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}>
            </div>
          </div>
        )}

        {/* Masters Grid - Intelligence Dossier Layout */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="masters-grid"
          >
            {masters.map((master, index) => (
              <motion.div
                key={master.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="master-card"
                onClick={() => window.location.href = `/${locale}/masters/${master.id}`}
              >
                <img
                  src={master.heroImage || '/placeholder-master.jpg'}
                  alt={master.name}
                  className="master-card-image"
                />
                <div className="master-card-overlay">
                  <h3 className="master-card-name">
                    {locale === 'ja' 
                      ? (master.nameJa || master.name)
                      : locale === 'zh-TW'
                      ? (master.name || master.nameEn)
                      : (master.nameEn || master.name)
                    }
                  </h3>
                  <p className="master-card-specialty">
                    {locale === 'ja'
                      ? (master.titleJa || master.title)
                      : locale === 'zh-TW'
                      ? (master.title || master.titleEn)
                      : (master.titleEn || master.title)
                    }
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && masters.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p style={{
              fontFamily: 'var(--font-family-body)',
              fontSize: '1.1rem',
              color: 'var(--color-text-secondary)',
              marginBottom: 'calc(var(--base-spacing) * 2)'
            }}>
              {getLocalizedText('noMastersFound')}
            </p>
            <button
              onClick={() => {
                setSearch('')
                setFilter('all')
                setPage(1)
              }}
              style={{
                fontFamily: 'var(--font-family-heading)',
                fontSize: '1rem',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                color: 'var(--color-vermilion)',
                backgroundColor: 'transparent',
                border: '1px solid var(--color-vermilion)',
                padding: 'var(--base-spacing) calc(var(--base-spacing) * 2)',
                cursor: 'pointer',
                transition: 'all var(--duration-fast) var(--ease-suspense)'
              }}
            >
              {getLocalizedText('clearFilters')}
            </button>
          </motion.div>
        )}
      </div>

      {/* Add CSS for spinning animation */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}