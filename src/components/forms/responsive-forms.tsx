'use client'

import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useBreakpoint } from '@/lib/responsive'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Icons } from '@/components/ui/icons'

// 响应式表单容器
interface ResponsiveFormProps {
  children: React.ReactNode
  className?: string
  onSubmit?: (e: React.FormEvent) => void
}

export function ResponsiveForm({ children, className, onSubmit }: ResponsiveFormProps) {
  const { isMobile } = useBreakpoint()

  return (
    <motion.form
      className={cn(
        'space-y-6',
        isMobile ? 'space-y-4' : 'space-y-6',
        className
      )}
      onSubmit={onSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.form>
  )
}

// 响应式表单字段组
interface ResponsiveFormGroupProps {
  children: React.ReactNode
  className?: string
  direction?: 'vertical' | 'horizontal'
}

export function ResponsiveFormGroup({ 
  children, 
  className, 
  direction = 'vertical' 
}: ResponsiveFormGroupProps) {
  const { isMobile } = useBreakpoint()
  
  // 移动端强制垂直布局
  const finalDirection = isMobile ? 'vertical' : direction

  return (
    <div className={cn(
      'space-y-4',
      finalDirection === 'horizontal' && 'md:flex md:space-y-0 md:space-x-6 md:items-end',
      className
    )}>
      {children}
    </div>
  )
}

// 响应式表单字段
interface ResponsiveFormFieldProps {
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
  className?: string
  flex?: boolean
}

export function ResponsiveFormField({
  label,
  error,
  required,
  children,
  className,
  flex = false
}: ResponsiveFormFieldProps) {
  const { isMobile } = useBreakpoint()

  return (
    <div className={cn(
      'space-y-2',
      flex && !isMobile && 'flex-1',
      className
    )}>
      <Label className={cn(
        'block text-sm font-medium',
        error && 'text-destructive',
        isMobile && 'text-base' // 移动端更大的标签文字
      )}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      
      {children}
      
      {error && (
        <motion.p
          className={cn(
            'text-sm text-destructive flex items-center space-x-1',
            isMobile && 'text-base'
          )}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Icons.alertCircle className="w-4 h-4" />
          <span>{error}</span>
        </motion.p>
      )}
    </div>
  )
}

// 响应式输入框
interface ResponsiveInputProps 
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  error?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
}

export const ResponsiveInput = forwardRef<HTMLInputElement, ResponsiveInputProps>(
  ({ className, error, leftIcon, rightIcon, size = 'md', ...props }, ref) => {
    const { isMobile } = useBreakpoint()
    
    // 移动端使用更大的尺寸
    const finalSize = isMobile ? 'lg' : size
    
    const sizeClasses = {
      sm: 'h-9 px-3 text-sm',
      md: 'h-10 px-3 text-sm',
      lg: 'h-12 px-4 text-base'
    }

    return (
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            {leftIcon}
          </div>
        )}
        
        <Input
          className={cn(
            sizeClasses[finalSize],
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            error && 'border-destructive focus-visible:ring-destructive',
            isMobile && 'text-base', // 防止iOS缩放
            className
          )}
          ref={ref}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            {rightIcon}
          </div>
        )}
      </div>
    )
  }
)

ResponsiveInput.displayName = 'ResponsiveInput'

// 响应式文本域
interface ResponsiveTextareaProps 
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
  resize?: boolean
}

export const ResponsiveTextarea = forwardRef<HTMLTextAreaElement, ResponsiveTextareaProps>(
  ({ className, error, resize = true, rows = 4, ...props }, ref) => {
    const { isMobile } = useBreakpoint()
    
    // 移动端更多行数
    const finalRows = isMobile ? Math.max(rows || 4, 4) : rows

    return (
      <Textarea
        className={cn(
          'text-base', // 防止iOS缩放
          !resize && 'resize-none',
          error && 'border-destructive focus-visible:ring-destructive',
          isMobile && 'min-h-[120px]',
          className
        )}
        rows={finalRows}
        ref={ref}
        {...props}
      />
    )
  }
)

ResponsiveTextarea.displayName = 'ResponsiveTextarea'

// 响应式选择器
interface ResponsiveSelectProps {
  placeholder?: string
  children: React.ReactNode
  value?: string
  onValueChange?: (value: string) => void
  error?: boolean
  className?: string
}

export function ResponsiveSelect({
  placeholder,
  children,
  value,
  onValueChange,
  error,
  className
}: ResponsiveSelectProps) {
  const { isMobile } = useBreakpoint()

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={cn(
        isMobile && 'h-12 text-base', // 移动端更大的高度和字体
        error && 'border-destructive focus:ring-destructive',
        className
      )}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {children}
      </SelectContent>
    </Select>
  )
}

// 响应式按钮组
interface ResponsiveButtonGroupProps {
  children: React.ReactNode
  className?: string
  direction?: 'horizontal' | 'vertical'
  fullWidth?: boolean
}

export function ResponsiveButtonGroup({
  children,
  className,
  direction = 'horizontal',
  fullWidth = false
}: ResponsiveButtonGroupProps) {
  const { isMobile } = useBreakpoint()
  
  // 移动端垂直布局，按钮全宽
  const mobileClasses = isMobile 
    ? 'flex-col space-y-3 [&>*]:w-full' 
    : direction === 'horizontal' 
      ? 'flex-row space-x-3' 
      : 'flex-col space-y-3'

  return (
    <div className={cn(
      'flex',
      mobileClasses,
      fullWidth && '[&>*]:flex-1',
      className
    )}>
      {children}
    </div>
  )
}

// 响应式搜索框
interface ResponsiveSearchProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  onSearch?: (value: string) => void
  className?: string
  loading?: boolean
}

export function ResponsiveSearch({
  placeholder,
  value,
  onChange,
  onSearch,
  className,
  loading = false
}: ResponsiveSearchProps) {
  const { isMobile } = useBreakpoint()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value && onSearch) {
      onSearch(value)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn('relative', className)}>
      <ResponsiveInput
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        leftIcon={loading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Icons.spinner className="w-4 h-4" />
          </motion.div>
        ) : (
          <Icons.search className="w-4 h-4" />
        )}
        className={cn(
          'pr-12',
          isMobile && 'h-12 text-base'
        )}
      />
      
      {value && (
        <button
          type="button"
          onClick={() => onChange?.('')}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors"
        >
          <Icons.close className="w-4 h-4" />
        </button>
      )}
    </form>
  )
}

// 响应式文件上传
interface ResponsiveFileUploadProps {
  accept?: string
  multiple?: boolean
  onChange?: (files: FileList | null) => void
  className?: string
  children?: React.ReactNode
}

export function ResponsiveFileUpload({
  accept,
  multiple,
  onChange,
  className,
  children
}: ResponsiveFileUploadProps) {
  const { isMobile } = useBreakpoint()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.files)
  }

  return (
    <div className={cn('relative', className)}>
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      
      <div className={cn(
        'border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors',
        isMobile && 'p-4 min-h-[120px] flex flex-col justify-center'
      )}>
        {children || (
          <div className="space-y-2">
            <Icons.upload className="w-8 h-8 mx-auto text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {isMobile ? '点击上传文件' : '拖拽文件到此处或点击上传'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// 表单验证状态动画
interface FormValidationProps {
  isValid: boolean
  children: React.ReactNode
}

export function FormValidation({ isValid, children }: FormValidationProps) {
  return (
    <motion.div
      animate={{
        scale: isValid ? [1, 1.02, 1] : [1, 0.98, 1],
        borderColor: isValid ? '#22c55e' : '#ef4444'
      }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}