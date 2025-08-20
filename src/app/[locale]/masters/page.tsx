'use client'

import { useState, useEffect, useRef } from 'react'
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
  const titleRef = useRef<HTMLHeadingElement>(null)
  
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

  // Staggered letter animation effect for title
  useEffect(() => {
    const title = titleRef.current
    if (title) {
      const text = getLocalizedText('title')
      title.innerHTML = '' // Clear original text
      text.split('').forEach((char, index) => {
        const span = document.createElement('span')
        span.textContent = char === ' ' ? '\u00A0' : char // Non-breaking space for spaces
        span.className = 'page-title-letter'
        span.style.animationDelay = `${index * 0.05}s`
        title.appendChild(span)
      })
    }
  }, [locale]) // Re-run when language changes

  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const handleFilterChange = (newFilter: typeof filter) => {
    setFilter(newFilter)
    setPage(1)
  }

  // Use proper next-intl translation keys
  const mastersT = useTranslations('masters')
  
  // Helper function to get localized master page text
  const getLocalizedText = (key: string) => {
    const textMap = {
      title: locale === 'zh-TW' ? '情報檔案' : locale === 'ja' ? 'インテリジェンス・ドシエ' : 'Intelligence Dossier',
      subtitle: mastersT('subtitle'),
      allMasters: mastersT('filters.all'),
      withTrips: mastersT('filters.trips'), 
      noMastersFound: mastersT('noMastersFound'),
      clearFilters: mastersT('clearFilters')
    }
    return textMap[key as keyof typeof textMap] || key
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
          <h1 ref={titleRef} className="masters-page-title page-title-reveal">
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
            className={`filter-button ${filter === 'all' ? 'active' : ''}`}
          >
            {getLocalizedText('allMasters')}
          </button>
          <button
            onClick={() => handleFilterChange('trips')}
            className={`filter-button ${filter === 'trips' ? 'active' : ''}`}
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
                className="dossier-card"
                onClick={() => window.location.href = `/${locale}/masters/${master.id}`}
              >
                <img
                  src={master.heroImage || '/images/masters/placeholder.jpg'}
                  alt={master.name}
                  className="dossier-card-image"
                />
                <div className="dossier-card-overlay">
                  <h3 className="dossier-card-name">
                    {locale === 'ja' 
                      ? (master.nameJa || master.name)
                      : locale === 'zh-TW'
                      ? (master.name || master.nameEn)
                      : (master.nameEn || master.name)
                    }
                  </h3>
                  <p className="dossier-card-specialty">
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