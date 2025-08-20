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

  return (
    <div className="container mx-auto px-4 py-12">
      {/* 页面标题 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-light mb-4">
          {t('masters.title')}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {t('masters.description')}
        </p>
      </motion.div>

      {/* 搜索和过滤器 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex flex-col md:flex-row gap-4 mb-8"
      >
        <div className="relative flex-1">
          <Icons.search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('masters.searchPlaceholder')}
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => handleFilterChange('all')}
            size="sm"
          >
            {t('masters.filters.all')}
          </Button>
          <Button
            variant={filter === 'trips' ? 'default' : 'outline'}
            onClick={() => handleFilterChange('trips')}
            size="sm"
          >
            {t('masters.filters.trips')}
          </Button>
          <Button
            variant={filter === 'conversations' ? 'default' : 'outline'}
            onClick={() => handleFilterChange('conversations')}
            size="sm"
          >
            {t('masters.filters.conversations')}
          </Button>
        </div>
      </motion.div>

      {/* 加载状态 */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Icons.spinner className="h-8 w-8 animate-spin" />
        </div>
      )}

      {/* 达人卡片网格 */}
      {!loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12"
        >
          {masters.map((master, index) => (
            <motion.div
              key={master.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <MasterCard master={master} locale={locale} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* 空状态 */}
      {!loading && masters.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-lg text-muted-foreground mb-4">
            {t('masters.noMastersFound')}
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearch('')
              setFilter('all')
              setPage(1)
            }}
          >
            {t('masters.clearFilters')}
          </Button>
        </motion.div>
      )}

      {/* 分页 */}
      {!loading && pagination && pagination.totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center items-center gap-2"
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page - 1)}
            disabled={!pagination.hasPrevPage}
          >
            {t('masters.pagination.previous')}
          </Button>
          
          <span className="px-4 py-2 text-sm text-muted-foreground">
            {t('masters.pagination.pageOf', { page: pagination.page, totalPages: pagination.totalPages })}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page + 1)}
            disabled={!pagination.hasNextPage}
          >
            {t('masters.pagination.next')}
          </Button>
        </motion.div>
      )}
    </div>
  )
}