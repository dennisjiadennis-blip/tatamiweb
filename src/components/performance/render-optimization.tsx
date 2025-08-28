'use client'

import React, { 
  memo, 
  useMemo, 
  useCallback, 
  useRef, 
  useState, 
  useEffect,
  forwardRef,
  ReactNode,
  ComponentType
} from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useBreakpoint } from '@/lib/responsive'
import { MemoryOptimizer, useThrottle, useDebounce } from '@/lib/mobile-performance'

// 高阶组件：防止不必要的重新渲染
export function withMemoization<P extends object>(
  Component: ComponentType<P>,
  areEqual?: (prevProps: P, nextProps: P) => boolean
) {
  const MemoizedComponent = memo(Component, areEqual)
  MemoizedComponent.displayName = `Memoized(${Component.displayName || Component.name})`
  return MemoizedComponent
}

// 优化的列表组件 - 防止子组件重新渲染
interface OptimizedListProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => ReactNode
  keyExtractor: (item: T, index: number) => string | number
  className?: string
  itemClassName?: string
  emptyState?: ReactNode
  LoadingComponent?: ComponentType
  isLoading?: boolean
}

export function OptimizedList<T>({
  items,
  renderItem,
  keyExtractor,
  className,
  itemClassName,
  emptyState,
  LoadingComponent,
  isLoading = false
}: OptimizedListProps<T>) {
  // 使用 useMemo 缓存渲染的项目
  const renderedItems = useMemo(() => {
    return items.map((item, index) => {
      const key = keyExtractor(item, index)
      return (
        <MemoizedListItem
          key={key}
          className={itemClassName}
          index={index}
        >
          {renderItem(item, index)}
        </MemoizedListItem>
      )
    })
  }, [items, renderItem, keyExtractor, itemClassName])

  if (isLoading && LoadingComponent) {
    return <LoadingComponent />
  }

  if (items.length === 0 && !isLoading) {
    return <>{emptyState}</>
  }

  return (
    <div className={className}>
      {renderedItems}
    </div>
  )
}

// 记忆化的列表项组件
interface MemoizedListItemProps {
  children: ReactNode
  className?: string
  index: number
}

const MemoizedListItem = memo<MemoizedListItemProps>(({ children, className, index }) => {
  return (
    <div className={className} data-index={index}>
      {children}
    </div>
  )
})

MemoizedListItem.displayName = 'MemoizedListItem'

// 优化的搜索组件
interface OptimizedSearchProps {
  placeholder?: string
  onSearch: (query: string) => void
  debounceDelay?: number
  className?: string
  showClearButton?: boolean
  isLoading?: boolean
}

export const OptimizedSearch = memo<OptimizedSearchProps>(({
  placeholder,
  onSearch,
  debounceDelay = 300,
  className,
  showClearButton = true,
  isLoading = false
}) => {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, debounceDelay)
  const { isMobile } = useBreakpoint()

  // 使用 useCallback 缓存搜索函数
  const handleSearch = useCallback((searchQuery: string) => {
    onSearch(searchQuery)
  }, [onSearch])

  // 当 debounced query 变化时触发搜索
  useEffect(() => {
    handleSearch(debouncedQuery)
  }, [debouncedQuery, handleSearch])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }, [])

  const handleClear = useCallback(() => {
    setQuery('')
  }, [])

  return (
    <div className={cn('relative', className)}>
      <input
        type="search"
        value={query}
        onChange={handleInputChange}
        placeholder={placeholder}
        className={cn(
          'w-full px-4 py-2 border border-muted rounded-lg',
          'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
          'pr-10',
          isMobile && 'text-base' // 防止 iOS 缩放
        )}
      />
      
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
        {isLoading && (
          <div className="w-4 h-4 border-2 border-muted-foreground/30 border-t-primary rounded-full animate-spin" />
        )}
        
        {showClearButton && query && !isLoading && (
          <button
            onClick={handleClear}
            className="p-1 hover:bg-muted rounded-full transition-colors"
            type="button"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
})

OptimizedSearch.displayName = 'OptimizedSearch'

// 优化的滚动容器
interface OptimizedScrollContainerProps {
  children: ReactNode
  className?: string
  onScroll?: (scrollTop: number, isScrolling: boolean) => void
  throttleDelay?: number
}

export const OptimizedScrollContainer = memo<OptimizedScrollContainerProps>(({
  children,
  className,
  onScroll,
  throttleDelay = 16
}) => {
  const [isScrolling, setIsScrolling] = useState(false)
  const scrollTimeoutRef = useRef<NodeJS.Timeout>()
  const containerRef = useRef<HTMLDivElement>(null)

  const throttledScrollHandler = useMemo(
    () => MemoryOptimizer.throttle((e: React.UIEvent<HTMLDivElement>) => {
      const scrollTop = e.currentTarget.scrollTop
      setIsScrolling(true)
      onScroll?.(scrollTop, true)

      // 清除之前的超时
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }

      // 设置新的超时来检测滚动结束
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false)
        onScroll?.(scrollTop, false)
      }, 150)
    }, throttleDelay),
    [onScroll, throttleDelay]
  )

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={cn('overflow-auto', className)}
      onScroll={throttledScrollHandler}
      data-scrolling={isScrolling}
    >
      {children}
    </div>
  )
})

OptimizedScrollContainer.displayName = 'OptimizedScrollContainer'

// 优化的条件渲染组件
interface ConditionalRenderProps {
  condition: boolean
  children: ReactNode
  fallback?: ReactNode
  animatePresence?: boolean
  exitBeforeEnter?: boolean
}

export const ConditionalRender = memo<ConditionalRenderProps>(({
  condition,
  children,
  fallback = null,
  animatePresence = false,
  exitBeforeEnter = false
}) => {
  if (!animatePresence) {
    return condition ? <>{children}</> : <>{fallback}</>
  }

  return (
    <AnimatePresence mode={exitBeforeEnter ? "wait" : "sync"}>
      {condition ? (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      ) : fallback ? (
        <motion.div
          key="fallback"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {fallback}
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
})

ConditionalRender.displayName = 'ConditionalRender'

// 优化的表单字段组件
interface OptimizedFormFieldProps {
  name: string
  value: string | number
  onChange: (value: string) => void
  onBlur?: () => void
  type?: string
  placeholder?: string
  className?: string
  error?: string
  disabled?: boolean
  debounceDelay?: number
}

export const OptimizedFormField = memo<OptimizedFormFieldProps>(({
  name,
  value,
  onChange,
  onBlur,
  type = 'text',
  placeholder,
  className,
  error,
  disabled = false,
  debounceDelay = 0
}) => {
  const [localValue, setLocalValue] = useState(value)
  const debouncedValue = debounceDelay > 0 ? useDebounce(localValue, debounceDelay) : localValue
  const { isMobile } = useBreakpoint()

  // 同步外部 value 到本地状态
  useEffect(() => {
    setLocalValue(value)
  }, [value])

  // 当 debounced value 变化时，通知父组件
  useEffect(() => {
    if (debounceDelay > 0 && debouncedValue !== value) {
      onChange(String(debouncedValue))
    }
  }, [debouncedValue, onChange, value, debounceDelay])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setLocalValue(newValue)
    
    // 如果没有防抖，立即通知父组件
    if (debounceDelay === 0) {
      onChange(newValue)
    }
  }, [onChange, debounceDelay])

  const handleBlur = useCallback(() => {
    onBlur?.()
  }, [onBlur])

  return (
    <div className="space-y-1">
      <input
        name={name}
        type={type}
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          'w-full px-3 py-2 border border-muted rounded-lg',
          'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          error && 'border-destructive focus:ring-destructive/20 focus:border-destructive',
          isMobile && 'text-base', // 防止 iOS 缩放
          className
        )}
      />
      
      {error && (
        <motion.p
          className="text-sm text-destructive"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
        >
          {error}
        </motion.p>
      )}
    </div>
  )
})

OptimizedFormField.displayName = 'OptimizedFormField'

// 优化的图片网格组件
interface OptimizedImageGridProps {
  images: Array<{
    id: string
    src: string
    alt: string
    caption?: string
  }>
  columns?: number
  gap?: number
  aspectRatio?: string
  onImageClick?: (image: any, index: number) => void
  className?: string
}

export const OptimizedImageGrid = memo<OptimizedImageGridProps>(({
  images,
  columns = 3,
  gap = 4,
  aspectRatio = 'aspect-square',
  onImageClick,
  className
}) => {
  const { isMobile } = useBreakpoint()
  const responsiveColumns = isMobile ? Math.min(columns, 2) : columns

  const gridStyle = useMemo(() => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${responsiveColumns}, 1fr)`,
    gap: `${gap * 0.25}rem`
  }), [responsiveColumns, gap])

  const handleImageClick = useCallback((image: any, index: number) => {
    onImageClick?.(image, index)
  }, [onImageClick])

  return (
    <div className={cn(className)} style={gridStyle}>
      {images.map((image, index) => (
        <MemoizedImageGridItem
          key={image.id}
          image={image}
          index={index}
          aspectRatio={aspectRatio}
          onClick={handleImageClick}
        />
      ))}
    </div>
  )
})

OptimizedImageGrid.displayName = 'OptimizedImageGrid'

// 记忆化的图片网格项
interface MemoizedImageGridItemProps {
  image: {
    id: string
    src: string
    alt: string
    caption?: string
  }
  index: number
  aspectRatio: string
  onClick?: (image: any, index: number) => void
}

const MemoizedImageGridItem = memo<MemoizedImageGridItemProps>(({
  image,
  index,
  aspectRatio,
  onClick
}) => {
  const handleClick = useCallback(() => {
    onClick?.(image, index)
  }, [image, index, onClick])

  return (
    <motion.div
      className={cn('relative overflow-hidden rounded-lg cursor-pointer group', aspectRatio)}
      onClick={handleClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <img
        src={image.src}
        alt={image.alt}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
      
      {image.caption && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
          <p className="text-white text-sm truncate">{image.caption}</p>
        </div>
      )}
    </motion.div>
  )
})

MemoizedImageGridItem.displayName = 'MemoizedImageGridItem'

// 性能监控包装器组件
interface PerformanceWrapperProps {
  name: string
  children: ReactNode
  className?: string
  trackRenders?: boolean
}

export const PerformanceWrapper = memo<PerformanceWrapperProps>(({
  name,
  children,
  className,
  trackRenders = process.env.NODE_ENV === 'development'
}) => {
  const renderCountRef = useRef(0)

  useEffect(() => {
    if (trackRenders) {
      renderCountRef.current += 1
      // eslint-disable-next-line no-console
    console.log(`🔄 Component "${name}" rendered ${renderCountRef.current} times`)
    }
  })

  return (
    <div className={className} data-component={name}>
      {children}
    </div>
  )
})

PerformanceWrapper.displayName = 'PerformanceWrapper'

// 使用性能优化的高阶组件
export function withPerformanceTracking<P extends object>(
  Component: ComponentType<P>,
  componentName?: string
) {
  const WrappedComponent = forwardRef<any, P>((props, ref) => {
    return (
      <PerformanceWrapper name={componentName || Component.displayName || Component.name || 'Unknown'}>
        <Component {...props} ref={ref} />
      </PerformanceWrapper>
    )
  })

  WrappedComponent.displayName = `WithPerformanceTracking(${Component.displayName || Component.name})`
  return WrappedComponent
}