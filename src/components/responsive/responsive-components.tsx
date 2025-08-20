'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { 
  responsive, 
  ResponsiveContainerProps, 
  ResponsiveGridProps, 
  ResponsiveTextProps 
} from '@/lib/responsive'

// 响应式容器组件
export function ResponsiveContainer({ 
  variant = 'constrained', 
  className = '', 
  children 
}: ResponsiveContainerProps) {
  return (
    <div className={cn(responsive.container(variant), className)}>
      {children}
    </div>
  )
}

// 响应式网格组件
export function ResponsiveGrid({ 
  cols, 
  gap = { mobile: 4 }, 
  className = '', 
  children 
}: ResponsiveGridProps) {
  const gridClasses = cn(
    'grid',
    responsive.grid.cols(cols.mobile, cols.tablet, cols.desktop),
    responsive.grid.gap(gap.mobile, gap.tablet, gap.desktop),
    className
  )

  return (
    <div className={gridClasses}>
      {children}
    </div>
  )
}

// 响应式文本组件
export function ResponsiveText({ 
  size, 
  align = { mobile: 'left' },
  className = '', 
  children, 
  as: Component = 'div' 
}: ResponsiveTextProps) {
  const textClasses = cn(
    responsive.text.size(size.mobile, size.tablet, size.desktop),
    responsive.text.align(align.mobile, align.tablet, align.desktop),
    className
  )

  return (
    <Component className={textClasses}>
      {children}
    </Component>
  )
}

// 响应式间距组件
interface ResponsiveSpacingProps {
  padding?: { mobile: number; tablet?: number; desktop?: number }
  paddingX?: { mobile: number; tablet?: number; desktop?: number }
  paddingY?: { mobile: number; tablet?: number; desktop?: number }
  margin?: { mobile: number; tablet?: number; desktop?: number }
  className?: string
  children: React.ReactNode
}

export function ResponsiveSpacing({
  padding,
  paddingX,
  paddingY,
  margin,
  className = '',
  children
}: ResponsiveSpacingProps) {
  const spacingClasses = cn(
    padding && responsive.spacing.padding(padding.mobile, padding.tablet, padding.desktop),
    paddingX && responsive.spacing.paddingX(paddingX.mobile, paddingX.tablet, paddingX.desktop),
    paddingY && responsive.spacing.paddingY(paddingY.mobile, paddingY.tablet, paddingY.desktop),
    margin && responsive.spacing.margin(margin.mobile, margin.tablet, margin.desktop),
    className
  )

  return (
    <div className={spacingClasses}>
      {children}
    </div>
  )
}

// 响应式显示控制组件
interface ResponsiveShowProps {
  breakpoint: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  mode: 'show' | 'hide'
  className?: string
  children: React.ReactNode
}

export function ResponsiveShow({ 
  breakpoint, 
  mode, 
  className = '', 
  children 
}: ResponsiveShowProps) {
  const displayClass = mode === 'show' 
    ? responsive.display.show(breakpoint)
    : responsive.display.hide(breakpoint)

  return (
    <div className={cn(displayClass, className)}>
      {children}
    </div>
  )
}

// 响应式图片组件
interface ResponsiveImageProps {
  src: string
  alt: string
  sizes?: { mobile?: string; tablet?: string; desktop?: string }
  aspectRatio?: { mobile?: string; tablet?: string; desktop?: string }
  className?: string
  priority?: boolean
}

export function ResponsiveImage({ 
  src, 
  alt, 
  sizes = { mobile: '100vw', tablet: '50vw', desktop: '33vw' },
  aspectRatio = { mobile: 'aspect-video' },
  className = '',
  priority = false
}: ResponsiveImageProps) {
  const aspectClasses = cn(
    aspectRatio.mobile,
    aspectRatio.tablet && `md:${aspectRatio.tablet}`,
    aspectRatio.desktop && `lg:${aspectRatio.desktop}`,
    'relative overflow-hidden rounded-lg'
  )

  const sizesString = Object.entries(sizes)
    .map(([key, value]) => {
      if (key === 'mobile') return value
      if (key === 'tablet') return `(min-width: 768px) ${value}`
      if (key === 'desktop') return `(min-width: 1024px) ${value}`
      return value
    })
    .join(', ')

  return (
    <div className={cn(aspectClasses, className)}>
      <img
        src={src}
        alt={alt}
        sizes={sizesString}
        className="absolute inset-0 w-full h-full object-cover"
        loading={priority ? 'eager' : 'lazy'}
      />
    </div>
  )
}

// 响应式卡片布局组件
interface ResponsiveCardLayoutProps {
  cards: React.ReactNode[]
  cols?: { mobile: number; tablet?: number; desktop?: number }
  gap?: { mobile: number; tablet?: number; desktop?: number }
  className?: string
}

export function ResponsiveCardLayout({ 
  cards, 
  cols = { mobile: 1, tablet: 2, desktop: 3 }, 
  gap = { mobile: 4, tablet: 6, desktop: 8 },
  className = '' 
}: ResponsiveCardLayoutProps) {
  return (
    <ResponsiveGrid cols={cols} gap={gap} className={className}>
      {cards.map((card, index) => (
        <div key={index} className="w-full">
          {card}
        </div>
      ))}
    </ResponsiveGrid>
  )
}

// 响应式导航组件
interface ResponsiveNavProps {
  items: Array<{ label: string; href: string; active?: boolean }>
  mobileMenuOpen: boolean
  onMobileMenuToggle: () => void
  className?: string
}

export function ResponsiveNav({ 
  items, 
  mobileMenuOpen, 
  onMobileMenuToggle, 
  className = '' 
}: ResponsiveNavProps) {
  return (
    <nav className={cn('relative', className)}>
      {/* 桌面端导航 */}
      <ResponsiveShow breakpoint="md" mode="show">
        <div className="flex items-center space-x-8">
          {items.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                item.active ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {item.label}
            </a>
          ))}
        </div>
      </ResponsiveShow>

      {/* 移动端汉堡菜单按钮 */}
      <ResponsiveShow breakpoint="md" mode="hide">
        <button
          onClick={onMobileMenuToggle}
          className="p-2 rounded-md text-muted-foreground hover:text-primary hover:bg-muted"
          aria-label="Toggle menu"
        >
          <div className="w-6 h-6 flex flex-col justify-center space-y-1">
            <span 
              className={cn(
                'block w-full h-0.5 bg-current transition-all duration-300',
                mobileMenuOpen && 'rotate-45 translate-y-1.5'
              )} 
            />
            <span 
              className={cn(
                'block w-full h-0.5 bg-current transition-all duration-300',
                mobileMenuOpen && 'opacity-0'
              )} 
            />
            <span 
              className={cn(
                'block w-full h-0.5 bg-current transition-all duration-300',
                mobileMenuOpen && '-rotate-45 -translate-y-1.5'
              )} 
            />
          </div>
        </button>
      </ResponsiveShow>

      {/* 移动端导航菜单 */}
      {mobileMenuOpen && (
        <ResponsiveShow breakpoint="md" mode="hide">
          <div className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-lg shadow-lg py-2 z-50">
            {items.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className={cn(
                  'block px-4 py-2 text-sm transition-colors hover:bg-muted',
                  item.active ? 'text-primary font-medium' : 'text-muted-foreground'
                )}
                onClick={() => onMobileMenuToggle()}
              >
                {item.label}
              </a>
            ))}
          </div>
        </ResponsiveShow>
      )}
    </nav>
  )
}

// 响应式英雄区域组件
interface ResponsiveHeroProps {
  title: string
  subtitle?: string
  description?: string
  actions?: React.ReactNode
  image?: string
  className?: string
}

export function ResponsiveHero({ 
  title, 
  subtitle, 
  description, 
  actions, 
  image, 
  className = '' 
}: ResponsiveHeroProps) {
  return (
    <ResponsiveSpacing
      paddingY={{ mobile: 12, tablet: 16, desktop: 20 }}
      className={className}
    >
      <ResponsiveContainer>
        <ResponsiveGrid 
          cols={{ mobile: 1, desktop: image ? 2 : 1 }}
          gap={{ mobile: 8, desktop: 12 }}
          className="items-center"
        >
          <div className={cn('space-y-6', image && 'order-2 lg:order-1')}>
            {subtitle && (
              <ResponsiveText
                size={{ mobile: 'sm', tablet: 'base' }}
                className="font-medium text-primary uppercase tracking-wide"
                as="p"
              >
                {subtitle}
              </ResponsiveText>
            )}
            
            <ResponsiveText
              size={{ mobile: '3xl', tablet: '4xl', desktop: '5xl' }}
              className="font-light leading-tight"
              as="h1"
            >
              {title}
            </ResponsiveText>
            
            {description && (
              <ResponsiveText
                size={{ mobile: 'base', tablet: 'lg' }}
                className="text-muted-foreground leading-relaxed max-w-2xl"
                as="p"
              >
                {description}
              </ResponsiveText>
            )}
            
            {actions && (
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                {actions}
              </div>
            )}
          </div>
          
          {image && (
            <div className="order-1 lg:order-2">
              <ResponsiveImage
                src={image}
                alt={title}
                aspectRatio={{ mobile: 'aspect-video', desktop: 'aspect-square' }}
                priority
              />
            </div>
          )}
        </ResponsiveGrid>
      </ResponsiveContainer>
    </ResponsiveSpacing>
  )
}