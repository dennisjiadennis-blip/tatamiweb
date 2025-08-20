// 响应式断点定义
export const breakpoints = {
  xs: '0px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const

export type Breakpoint = keyof typeof breakpoints

// 响应式工具函数
export const responsive = {
  // 检查当前屏幕尺寸
  isMobile: () => {
    if (typeof window === 'undefined') return false
    return window.innerWidth < parseInt(breakpoints.md)
  },
  
  isTablet: () => {
    if (typeof window === 'undefined') return false
    return window.innerWidth >= parseInt(breakpoints.md) && window.innerWidth < parseInt(breakpoints.lg)
  },
  
  isDesktop: () => {
    if (typeof window === 'undefined') return false
    return window.innerWidth >= parseInt(breakpoints.lg)
  },

  // 获取当前断点
  getCurrentBreakpoint: (): Breakpoint => {
    if (typeof window === 'undefined') return 'lg'
    const width = window.innerWidth
    
    if (width >= parseInt(breakpoints['2xl'])) return '2xl'
    if (width >= parseInt(breakpoints.xl)) return 'xl'
    if (width >= parseInt(breakpoints.lg)) return 'lg'
    if (width >= parseInt(breakpoints.md)) return 'md'
    if (width >= parseInt(breakpoints.sm)) return 'sm'
    return 'xs'
  },

  // 媒体查询字符串生成
  mediaQuery: (breakpoint: Breakpoint) => `(min-width: ${breakpoints[breakpoint]})`,
  
  // 容器类名生成
  container: (variant: 'fluid' | 'constrained' | 'editorial' = 'constrained') => {
    const base = 'mx-auto px-4 sm:px-6 lg:px-8'
    
    switch (variant) {
      case 'fluid':
        return `${base} w-full`
      case 'editorial':
        return `${base} max-w-4xl`
      case 'constrained':
      default:
        return `${base} max-w-7xl`
    }
  },

  // 网格系统
  grid: {
    cols: (mobile: number, tablet?: number, desktop?: number) => {
      const base = `grid-cols-${mobile}`
      const md = tablet ? ` md:grid-cols-${tablet}` : ''
      const lg = desktop ? ` lg:grid-cols-${desktop}` : ''
      return `${base}${md}${lg}`
    },
    
    gap: (mobile: number, tablet?: number, desktop?: number) => {
      const base = `gap-${mobile}`
      const md = tablet ? ` md:gap-${tablet}` : ''
      const lg = desktop ? ` lg:gap-${desktop}` : ''
      return `${base}${md}${lg}`
    }
  },

  // 间距系统
  spacing: {
    padding: (mobile: number, tablet?: number, desktop?: number) => {
      const base = `p-${mobile}`
      const md = tablet ? ` md:p-${tablet}` : ''
      const lg = desktop ? ` lg:p-${desktop}` : ''
      return `${base}${md}${lg}`
    },
    
    paddingX: (mobile: number, tablet?: number, desktop?: number) => {
      const base = `px-${mobile}`
      const md = tablet ? ` md:px-${tablet}` : ''
      const lg = desktop ? ` lg:px-${desktop}` : ''
      return `${base}${md}${lg}`
    },
    
    paddingY: (mobile: number, tablet?: number, desktop?: number) => {
      const base = `py-${mobile}`
      const md = tablet ? ` md:py-${tablet}` : ''
      const lg = desktop ? ` lg:py-${desktop}` : ''
      return `${base}${md}${lg}`
    },
    
    margin: (mobile: number, tablet?: number, desktop?: number) => {
      const base = `m-${mobile}`
      const md = tablet ? ` md:m-${tablet}` : ''
      const lg = desktop ? ` lg:m-${desktop}` : ''
      return `${base}${md}${lg}`
    }
  },

  // 文字系统
  text: {
    size: (mobile: string, tablet?: string, desktop?: string) => {
      const base = `text-${mobile}`
      const md = tablet ? ` md:text-${tablet}` : ''
      const lg = desktop ? ` lg:text-${desktop}` : ''
      return `${base}${md}${lg}`
    },
    
    align: (mobile: string, tablet?: string, desktop?: string) => {
      const base = `text-${mobile}`
      const md = tablet ? ` md:text-${tablet}` : ''
      const lg = desktop ? ` lg:text-${desktop}` : ''
      return `${base}${md}${lg}`
    }
  },

  // 显示控制
  display: {
    show: (breakpoint: Breakpoint) => {
      if (breakpoint === 'xs') return 'block'
      return `hidden ${breakpoint}:block`
    },
    
    hide: (breakpoint: Breakpoint) => {
      if (breakpoint === 'xs') return 'hidden'
      return `block ${breakpoint}:hidden`
    }
  }
}

// React Hook for responsive behavior
import { useState, useEffect } from 'react'

export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('lg')
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    
    const updateBreakpoint = () => {
      setBreakpoint(responsive.getCurrentBreakpoint())
    }

    updateBreakpoint()
    window.addEventListener('resize', updateBreakpoint)
    
    return () => window.removeEventListener('resize', updateBreakpoint)
  }, [])

  return {
    breakpoint,
    isMobile: isMounted && responsive.isMobile(),
    isTablet: isMounted && responsive.isTablet(),
    isDesktop: isMounted && responsive.isDesktop(),
    isMounted
  }
}

// 响应式容器组件 Props
export interface ResponsiveContainerProps {
  variant?: 'fluid' | 'constrained' | 'editorial'
  className?: string
  children: React.ReactNode
}

// 响应式网格组件 Props
export interface ResponsiveGridProps {
  cols: { mobile: number; tablet?: number; desktop?: number }
  gap?: { mobile: number; tablet?: number; desktop?: number }
  className?: string
  children: React.ReactNode
}

// 响应式文本组件 Props
export interface ResponsiveTextProps {
  size: { mobile: string; tablet?: string; desktop?: string }
  align?: { mobile: string; tablet?: string; desktop?: string }
  className?: string
  children: React.ReactNode
  as?: keyof JSX.IntrinsicElements
}