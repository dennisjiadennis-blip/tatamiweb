'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { usePagePerformance } from '@/lib/seo-optimization'
import { MobilePerformanceMonitor } from '@/lib/mobile-performance'

// 性能监控仪表板
interface PerformanceMonitorProps {
  show?: boolean
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  className?: string
}

export function PerformanceMonitor({ 
  show = process.env.NODE_ENV === 'development',
  position = 'bottom-right',
  className 
}: PerformanceMonitorProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentTab, setCurrentTab] = useState<'vitals' | 'resources' | 'network'>('vitals')
  const { metrics, report } = usePagePerformance()
  const [mobileMetrics, setMobileMetrics] = useState<any>({})

  useEffect(() => {
    if (show) {
      const monitor = MobilePerformanceMonitor.getInstance()
      const interval = setInterval(() => {
        setMobileMetrics(monitor.getMetrics())
      }, 1000)
      
      return () => clearInterval(interval)
    }
  }, [show])

  if (!show) return null

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500'
    if (score >= 70) return 'text-yellow-500'
    return 'text-red-500'
  }

  const formatTime = (time: number) => {
    return time ? `${Math.round(time)}ms` : 'N/A'
  }

  const formatScore = (score: number) => {
    return Math.round(score) || 0
  }

  return (
    <motion.div
      className={cn(
        'fixed z-50 bg-black/90 text-white rounded-lg shadow-lg backdrop-blur-sm',
        positionClasses[position],
        className
      )}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {!isExpanded ? (
        // 折叠状态
        <button
          onClick={() => setIsExpanded(true)}
          className="p-3 hover:bg-white/10 rounded-lg transition-colors"
        >
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-mono">
              {report ? formatScore(report.score) : '--'}
            </span>
          </div>
        </button>
      ) : (
        // 展开状态
        <div className="w-80 max-h-96 overflow-hidden">
          {/* 标题栏 */}
          <div className="flex items-center justify-between p-3 border-b border-white/10">
            <h3 className="font-semibold text-sm">性能监控</h3>
            <div className="flex items-center space-x-2">
              <div className={cn('text-xs font-mono', getScoreColor(report?.score || 0))}>
                {formatScore(report?.score || 0)}
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="w-5 h-5 hover:bg-white/10 rounded transition-colors flex items-center justify-center"
              >
                ×
              </button>
            </div>
          </div>

          {/* 标签页 */}
          <div className="flex border-b border-white/10">
            {[
              { id: 'vitals', label: '核心指标' },
              { id: 'resources', label: '资源' },
              { id: 'network', label: '网络' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id as any)}
                className={cn(
                  'flex-1 px-3 py-2 text-xs transition-colors',
                  currentTab === tab.id 
                    ? 'bg-white/10 text-white' 
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* 内容区域 */}
          <div className="p-3 max-h-64 overflow-y-auto">
            {currentTab === 'vitals' && (
              <VitalsTab metrics={metrics} report={report} />
            )}
            {currentTab === 'resources' && (
              <ResourcesTab mobileMetrics={mobileMetrics} />
            )}
            {currentTab === 'network' && (
              <NetworkTab />
            )}
          </div>
        </div>
      )}
    </motion.div>
  )
}

// 核心指标标签页
function VitalsTab({ metrics, report }: { metrics: any, report: any }) {
  const vitals = [
    { name: 'LCP', value: metrics.LCP, threshold: [2500, 4000], unit: 'ms' },
    { name: 'FID', value: metrics.FID, threshold: [100, 300], unit: 'ms' },
    { name: 'CLS', value: metrics.CLS, threshold: [0.1, 0.25], unit: '' },
    { name: 'FCP', value: metrics.FCP, threshold: [1800, 3000], unit: 'ms' }
  ]

  const getVitalStatus = (value: number, threshold: number[]) => {
    if (!value) return 'unknown'
    if (value <= threshold[0]) return 'good'
    if (value <= threshold[1]) return 'needs-improvement'
    return 'poor'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-500'
      case 'needs-improvement': return 'text-yellow-500'
      case 'poor': return 'text-red-500'
      default: return 'text-gray-400'
    }
  }

  return (
    <div className="space-y-3">
      {vitals.map(vital => {
        const status = getVitalStatus(vital.value, vital.threshold)
        const displayValue = vital.value ? (
          vital.unit === 'ms' ? Math.round(vital.value) : vital.value.toFixed(3)
        ) : '--'

        return (
          <div key={vital.name} className="flex items-center justify-between">
            <span className="text-xs text-white/70">{vital.name}</span>
            <div className="flex items-center space-x-2">
              <span className={cn('text-xs font-mono', getStatusColor(status))}>
                {displayValue}{vital.unit}
              </span>
              <div className={cn(
                'w-2 h-2 rounded-full',
                status === 'good' ? 'bg-green-500' :
                status === 'needs-improvement' ? 'bg-yellow-500' :
                status === 'poor' ? 'bg-red-500' : 'bg-gray-500'
              )} />
            </div>
          </div>
        )
      })}

      {report?.issues?.length > 0 && (
        <div className="mt-4 pt-3 border-t border-white/10">
          <h4 className="text-xs font-semibold mb-2 text-red-400">问题</h4>
          <ul className="space-y-1">
            {report.issues.slice(0, 3).map((issue: string, index: number) => (
              <li key={index} className="text-xs text-white/70">• {issue}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// 资源标签页
function ResourcesTab({ mobileMetrics }: { mobileMetrics: any }) {
  const [resourceTiming, setResourceTiming] = useState<PerformanceResourceTiming[]>([])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
      setResourceTiming(resources.slice(-10)) // 最近10个资源
    }
  }, [])

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="text-white/70">总请求</span>
          <div className="font-mono">{resourceTiming.length}</div>
        </div>
        <div>
          <span className="text-white/70">移动指标</span>
          <div className="font-mono">{Object.keys(mobileMetrics).length}</div>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-white/70">最近资源</h4>
        <div className="space-y-1 max-h-32 overflow-y-auto">
          {resourceTiming.slice(-5).map((resource, index) => (
            <div key={index} className="flex justify-between text-xs">
              <span className="text-white/70 truncate flex-1 mr-2">
                {resource.name.split('/').pop()}
              </span>
              <span className="font-mono text-white">
                {Math.round(resource.duration)}ms
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// 网络标签页
function NetworkTab() {
  const [networkInfo, setNetworkInfo] = useState<any>({})

  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'connection' in navigator) {
      const connection = (navigator as any).connection
      setNetworkInfo({
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData
      })

      const updateNetworkInfo = () => {
        setNetworkInfo({
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
          saveData: connection.saveData
        })
      }

      connection.addEventListener('change', updateNetworkInfo)
      return () => connection.removeEventListener('change', updateNetworkInfo)
    }
  }, [])

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="text-white/70">连接类型</span>
          <div className="font-mono">{networkInfo.effectiveType || 'Unknown'}</div>
        </div>
        <div>
          <span className="text-white/70">下行速度</span>
          <div className="font-mono">{networkInfo.downlink || '--'} Mbps</div>
        </div>
        <div>
          <span className="text-white/70">RTT</span>
          <div className="font-mono">{networkInfo.rtt || '--'}ms</div>
        </div>
        <div>
          <span className="text-white/70">省流模式</span>
          <div className="font-mono">{networkInfo.saveData ? 'ON' : 'OFF'}</div>
        </div>
      </div>

      <div className="pt-2 border-t border-white/10">
        <div className="flex justify-between text-xs">
          <span className="text-white/70">在线状态</span>
          <span className={cn(
            'font-mono',
            navigator?.onLine ? 'text-green-500' : 'text-red-500'
          )}>
            {navigator?.onLine ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>
    </div>
  )
}

// 性能警告提示
interface PerformanceAlertProps {
  show: boolean
  onDismiss: () => void
  type: 'lcp' | 'fid' | 'cls' | 'memory'
  message: string
}

export function PerformanceAlert({ show, onDismiss, type, message }: PerformanceAlertProps) {
  const alertColors = {
    lcp: 'border-yellow-500 bg-yellow-500/10 text-yellow-200',
    fid: 'border-red-500 bg-red-500/10 text-red-200',
    cls: 'border-orange-500 bg-orange-500/10 text-orange-200',
    memory: 'border-purple-500 bg-purple-500/10 text-purple-200'
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={cn(
            'fixed top-4 right-4 z-50 max-w-sm p-4 rounded-lg border backdrop-blur-sm',
            alertColors[type]
          )}
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
                <span className="font-semibold text-xs uppercase tracking-wide">
                  {type.toUpperCase()} 警告
                </span>
              </div>
              <p className="text-sm opacity-90">{message}</p>
            </div>
            <button
              onClick={onDismiss}
              className="ml-2 opacity-60 hover:opacity-100 transition-opacity"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// 性能优化建议组件
interface OptimizationSuggestionsProps {
  metrics: any
  className?: string
}

export function OptimizationSuggestions({ metrics, className }: OptimizationSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<string[]>([])

  useEffect(() => {
    const generateSuggestions = () => {
      const newSuggestions: string[] = []

      // LCP 优化建议
      if (metrics.LCP > 4000) {
        newSuggestions.push('优化图片和视频加载，考虑使用预加载')
        newSuggestions.push('减少关键渲染路径中的CSS和JavaScript')
      }

      // FID 优化建议
      if (metrics.FID > 300) {
        newSuggestions.push('拆分大型JavaScript包，使用代码分割')
        newSuggestions.push('优化事件处理器，避免长时间阻塞')
      }

      // CLS 优化建议
      if (metrics.CLS > 0.25) {
        newSuggestions.push('为图片和广告设置固定尺寸')
        newSuggestions.push('避免在现有内容上方插入内容')
      }

      setSuggestions(newSuggestions)
    }

    generateSuggestions()
  }, [metrics])

  if (suggestions.length === 0) return null

  return (
    <div className={cn('bg-blue-50 rounded-lg p-4', className)}>
      <h3 className="font-semibold text-blue-900 mb-2">性能优化建议</h3>
      <ul className="space-y-1">
        {suggestions.map((suggestion, index) => (
          <li key={index} className="text-sm text-blue-800 flex items-start">
            <span className="text-blue-500 mr-2 flex-shrink-0">•</span>
            <span>{suggestion}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// 实时性能图表组件
interface PerformanceChartProps {
  metrics: any
  className?: string
}

export function PerformanceChart({ metrics, className }: PerformanceChartProps) {
  const [history, setHistory] = useState<Array<{ time: number, lcp: number, fid: number, cls: number }>>([])

  useEffect(() => {
    if (metrics.LCP || metrics.FID || metrics.CLS) {
      setHistory(prev => [...prev.slice(-19), {
        time: Date.now(),
        lcp: metrics.LCP || 0,
        fid: metrics.FID || 0,
        cls: (metrics.CLS || 0) * 1000 // 放大 CLS 值以便显示
      }])
    }
  }, [metrics])

  if (history.length < 2) return null

  return (
    <div className={cn('bg-gray-50 rounded-lg p-4', className)}>
      <h3 className="font-semibold text-gray-900 mb-2">性能趋势</h3>
      <div className="h-32 flex items-end space-x-1">
        {history.map((point, index) => (
          <div key={index} className="flex-1 flex flex-col items-center space-y-1">
            <div className="w-full bg-gray-200 rounded-sm overflow-hidden">
              <div 
                className="bg-blue-500 transition-all duration-300"
                style={{ height: `${Math.min(point.lcp / 50, 100)}%` }}
              />
            </div>
            <div className="text-xs text-gray-500">{index}</div>
          </div>
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <span>LCP (蓝色)</span>
        <span>最近 {history.length} 个数据点</span>
      </div>
    </div>
  )
}