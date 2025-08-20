'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Icons } from '@/components/ui/icons'
import { CMSLayout } from '@/components/cms/layout/cms-layout'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface ContentFormData {
  // 基本信息
  title: string
  titleEn: string
  titleJa: string
  slug: string
  type: string
  status: string
  
  // 内容
  excerpt: string
  excerptEn: string
  excerptJa: string
  content: string
  coverImage: string
  
  // SEO
  metaTitle: string
  metaDescription: string
  
  // 设置
  publishedAt: string
  featured: boolean
}

export default function CreateContentPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<ContentFormData>({
    title: '',
    titleEn: '',
    titleJa: '',
    slug: '',
    type: 'article',
    status: 'draft',
    excerpt: '',
    excerptEn: '',
    excerptJa: '',
    content: '',
    coverImage: '',
    metaTitle: '',
    metaDescription: '',
    publishedAt: '',
    featured: false
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const contentTypes = [
    { value: 'article', label: 'Article' },
    { value: 'guide', label: 'Guide' },
    { value: 'tutorial', label: 'Tutorial' },
    { value: 'news', label: 'News' },
    { value: 'interview', label: 'Interview' }
  ]

  const contentStatuses = [
    { value: 'draft', label: 'Draft' },
    { value: 'review', label: 'Review' },
    { value: 'published', label: 'Published' },
    { value: 'archived', label: 'Archived' }
  ]

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // 自动生成slug
    if (field === 'title' && typeof value === 'string') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      
      setFormData(prev => ({
        ...prev,
        slug: slug
      }))
    }
    
    // 清除错误
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }
    
    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required'
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required'
    }

    if (!formData.excerpt.trim()) {
      newErrors.excerpt = 'Excerpt is required'
    }

    if (formData.status === 'published' && !formData.publishedAt) {
      newErrors.publishedAt = 'Published date is required for published content'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      console.log('Creating content:', formData)
      
      // 成功后跳转到列表页
      router.push('/cms/content')
    } catch (error) {
      console.error('Failed to create content:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveDraft = async () => {
    const draftData = { ...formData, status: 'draft' }
    setFormData(draftData)
    
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Saving draft:', draftData)
      // 显示保存成功的提示
    } catch (error) {
      console.error('Failed to save draft:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      router.back()
    }
  }

  const previewContent = () => {
    // 在新窗口打开预览
    window.open(`/preview/content?data=${encodeURIComponent(JSON.stringify(formData))}`, '_blank')
  }

  return (
    <CMSLayout title="Create Content" description="Create a new article, guide, or tutorial">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* 基本信息 */}
          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 标题和slug */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Enter content title"
                      className={errors.title ? 'border-destructive' : ''}
                    />
                    {errors.title && (
                      <p className="text-sm text-destructive mt-1">{errors.title}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="slug">Slug *</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => handleInputChange('slug', e.target.value)}
                      placeholder="url-friendly-slug"
                      className={errors.slug ? 'border-destructive' : ''}
                    />
                    {errors.slug && (
                      <p className="text-sm text-destructive mt-1">{errors.slug}</p>
                    )}
                  </div>
                </div>

                {/* 类型和状态 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Content Type</Label>
                    <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select content type" />
                      </SelectTrigger>
                      <SelectContent>
                        {contentTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {contentStatuses.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* 多语言标题 */}
                <div className="space-y-4">
                  <Label>Multilingual Titles</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="titleEn" className="text-sm">English Title</Label>
                      <Input
                        id="titleEn"
                        value={formData.titleEn}
                        onChange={(e) => handleInputChange('titleEn', e.target.value)}
                        placeholder="English version of title"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="titleJa" className="text-sm">Japanese Title</Label>
                      <Input
                        id="titleJa"
                        value={formData.titleJa}
                        onChange={(e) => handleInputChange('titleJa', e.target.value)}
                        placeholder="日本語のタイトル"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 内容 */}
          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 摘要 */}
                <div>
                  <Label htmlFor="excerpt">Excerpt *</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => handleInputChange('excerpt', e.target.value)}
                    placeholder="Brief description of the content..."
                    className={`min-h-[80px] ${errors.excerpt ? 'border-destructive' : ''}`}
                  />
                  {errors.excerpt && (
                    <p className="text-sm text-destructive mt-1">{errors.excerpt}</p>
                  )}
                </div>

                {/* 主要内容 */}
                <div>
                  <Label htmlFor="content">Main Content *</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    placeholder="Write your content here..."
                    className={`min-h-[300px] ${errors.content ? 'border-destructive' : ''}`}
                  />
                  {errors.content && (
                    <p className="text-sm text-destructive mt-1">{errors.content}</p>
                  )}
                  <p className="text-sm text-muted-foreground mt-1">
                    Rich text editor will be implemented in the actual application
                  </p>
                </div>

                {/* 封面图片 */}
                <div>
                  <Label htmlFor="coverImage">Cover Image URL</Label>
                  <Input
                    id="coverImage"
                    value={formData.coverImage}
                    onChange={(e) => handleInputChange('coverImage', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Multilingual Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="excerptEn">English Excerpt</Label>
                    <Textarea
                      id="excerptEn"
                      value={formData.excerptEn}
                      onChange={(e) => handleInputChange('excerptEn', e.target.value)}
                      placeholder="English version of excerpt..."
                      className="min-h-[80px]"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="excerptJa">Japanese Excerpt</Label>
                    <Textarea
                      id="excerptJa"
                      value={formData.excerptJa}
                      onChange={(e) => handleInputChange('excerptJa', e.target.value)}
                      placeholder="日本語の概要..."
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SEO */}
          <TabsContent value="seo" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="metaTitle">Meta Title</Label>
                  <Input
                    id="metaTitle"
                    value={formData.metaTitle}
                    onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                    placeholder="SEO optimized title (leave empty to use main title)"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Recommended: 50-60 characters
                  </p>
                </div>

                <div>
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Textarea
                    id="metaDescription"
                    value={formData.metaDescription}
                    onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                    placeholder="SEO meta description for search engines..."
                    className="min-h-[80px]"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Recommended: 150-160 characters
                  </p>
                </div>

                {/* SEO预览 */}
                <div className="border rounded-lg p-4 bg-muted/30">
                  <Label className="text-sm font-medium">Search Engine Preview</Label>
                  <div className="mt-2 space-y-1">
                    <div className="text-blue-600 text-lg hover:underline cursor-pointer">
                      {formData.metaTitle || formData.title || 'Your Title Here'}
                    </div>
                    <div className="text-green-700 text-sm">
                      tatami-labs.com/content/{formData.slug || 'your-slug'}
                    </div>
                    <div className="text-gray-600 text-sm">
                      {formData.metaDescription || formData.excerpt || 'Your meta description will appear here...'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 设置 */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Publishing Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="publishedAt">Published Date</Label>
                  <Input
                    id="publishedAt"
                    type="datetime-local"
                    value={formData.publishedAt}
                    onChange={(e) => handleInputChange('publishedAt', e.target.value)}
                    className={errors.publishedAt ? 'border-destructive' : ''}
                  />
                  {errors.publishedAt && (
                    <p className="text-sm text-destructive mt-1">{errors.publishedAt}</p>
                  )}
                  <p className="text-sm text-muted-foreground mt-1">
                    Leave empty to publish immediately
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => handleInputChange('featured', checked)}
                  />
                  <Label htmlFor="featured">Featured Content</Label>
                  <Badge variant={formData.featured ? "default" : "secondary"}>
                    {formData.featured ? 'Featured' : 'Regular'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* 底部操作按钮 */}
        <div className="flex justify-between pt-6 border-t">
          <div className="flex space-x-2">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="button" variant="outline" onClick={previewContent}>
              <Icons.eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
          </div>
          
          <div className="flex space-x-2">
            <Button type="button" variant="outline" onClick={handleSaveDraft} disabled={loading}>
              <Icons.save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Icons.loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Icons.check className="h-4 w-4 mr-2" />
                  Create Content
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </CMSLayout>
  )
}