'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
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
  
  const locale = useCurrentLocale()
  const t = useTranslations()

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
      }
    }
    return texts[key as keyof typeof texts]?.[locale as keyof typeof texts.title] || texts[key as keyof typeof texts]?.en
  }

  return (
    <div style={{ backgroundColor: 'var(--color-charcoal)', minHeight: '100vh', color: 'var(--color-text-primary)' }}>
      <div className="container mx-auto px-4 py-16" style={{ maxWidth: 'var(--container-width)' }}>
        {/* Page Title - Dramatic Typography */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
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
            {getLocalizedText('title')}
          </h1>
          <p style={{
            fontFamily: 'var(--font-family-body)',
            fontSize: '1.2rem',
            color: 'var(--color-text-secondary)',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: 1.7
          }}>
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
            style={{
              fontFamily: 'var(--font-family-heading)',
              fontSize: '1rem',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: filter === 'all' ? 'var(--color-vermilion)' : 'var(--color-text-secondary)',
              backgroundColor: 'transparent',
              border: filter === 'all' ? '1px solid var(--color-vermilion)' : '1px solid transparent',
              padding: 'calc(var(--base-spacing) * 0.75) calc(var(--base-spacing) * 1.5)',
              cursor: 'pointer',
              transition: 'all var(--duration-fast) var(--ease-suspense)'
            }}
          >
            {getLocalizedText('allMasters')}
          </button>
          <button
            onClick={() => handleFilterChange('trips')}
            style={{
              fontFamily: 'var(--font-family-heading)',
              fontSize: '1rem',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: filter === 'trips' ? 'var(--color-vermilion)' : 'var(--color-text-secondary)',
              backgroundColor: 'transparent',
              border: filter === 'trips' ? '1px solid var(--color-vermilion)' : '1px solid transparent',
              padding: 'calc(var(--base-spacing) * 0.75) calc(var(--base-spacing) * 1.5)',
              cursor: 'pointer',
              transition: 'all var(--duration-fast) var(--ease-suspense)'
            }}
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
                  <h3 className="master-card-name">{master.name}</h3>
                  <p className="master-card-specialty">{master.title}</p>
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
              No masters found matching your criteria.
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
              Reset Filters
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