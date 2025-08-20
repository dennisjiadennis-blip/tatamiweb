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

interface MasterFormData {
  // 基本信息
  name: string
  nameEn: string
  nameJa: string
  title: string
  titleEn: string
  titleJa: string
  
  // 媒体文件
  profileVideo: string
  heroImage: string
  introVideo: string
  
  // 内容
  storyContent: string
  topClips: string[]
  missionCard: {
    title: string
    description: string
    image: string
  }
  
  // 产品信息
  hasTripProduct: boolean
  tripBookingURL: string
  
  // 设置
  priority: number
  isActive: boolean
}

export default function CreateMasterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<MasterFormData>({
    name: '',
    nameEn: '',
    nameJa: '',
    title: '',
    titleEn: '',
    titleJa: '',
    profileVideo: '',
    heroImage: '',
    introVideo: '',
    storyContent: '',
    topClips: ['', '', '', '', ''],
    missionCard: {
      title: '',
      description: '',
      image: ''
    },
    hasTripProduct: false,
    tripBookingURL: '',
    priority: 0,
    isActive: true
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // 清除错误
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const handleNestedInputChange = (parentField: string, childField: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [parentField]: {
        ...prev[parentField as keyof MasterFormData] as any,
        [childField]: value
      }
    }))
  }

  const handleArrayInputChange = (field: string, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field as keyof MasterFormData] as string[]).map((item, i) => 
        i === index ? value : item
      )
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (formData.hasTripProduct && !formData.tripBookingURL.trim()) {
      newErrors.tripBookingURL = 'Booking URL is required when trip product is enabled'
    }

    if (formData.tripBookingURL && !isValidURL(formData.tripBookingURL)) {
      newErrors.tripBookingURL = 'Please enter a valid URL'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidURL = (string: string) => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
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
      
      console.log('Creating master:', formData)
      
      // 成功后跳转到列表页
      router.push('/cms/masters')
    } catch (error) {
      console.error('Failed to create master:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      router.back()
    }
  }

  return (
    <CMSLayout title="Create Master" description="Add a new master to the platform">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* 基本信息 */}
          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 主要名称和标题 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Master's full name"
                      className={errors.name ? 'border-destructive' : ''}
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive mt-1">{errors.name}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="e.g., 16th Generation Sake Master"
                      className={errors.title ? 'border-destructive' : ''}
                    />
                    {errors.title && (
                      <p className="text-sm text-destructive mt-1">{errors.title}</p>
                    )}
                  </div>
                </div>

                {/* 多语言名称 */}
                <div className="space-y-4">
                  <Label>Multilingual Names</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nameEn" className="text-sm">English Name</Label>
                      <Input
                        id="nameEn"
                        value={formData.nameEn}
                        onChange={(e) => handleInputChange('nameEn', e.target.value)}
                        placeholder="English version of name"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="nameJa" className="text-sm">Japanese Name</Label>
                      <Input
                        id="nameJa"
                        value={formData.nameJa}
                        onChange={(e) => handleInputChange('nameJa', e.target.value)}
                        placeholder="日本語の名前"
                      />
                    </div>
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

          {/* 媒体文件 */}
          <TabsContent value="media" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Media Files</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="profileVideo">Profile Video URL</Label>
                  <Input
                    id="profileVideo"
                    value={formData.profileVideo}
                    onChange={(e) => handleInputChange('profileVideo', e.target.value)}
                    placeholder="URL for homepage video"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    This video will be shown on the homepage
                  </p>
                </div>

                <div>
                  <Label htmlFor="heroImage">Hero Image URL</Label>
                  <Input
                    id="heroImage"
                    value={formData.heroImage}
                    onChange={(e) => handleInputChange('heroImage', e.target.value)}
                    placeholder="URL for profile page header image"
                  />
                </div>

                <div>
                  <Label htmlFor="introVideo">Introduction Video URL</Label>
                  <Input
                    id="introVideo"
                    value={formData.introVideo}
                    onChange={(e) => handleInputChange('introVideo', e.target.value)}
                    placeholder="URL for 初語 (first words) video"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 内容 */}
          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Story Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="storyContent">Master's Story</Label>
                  <Textarea
                    id="storyContent"
                    value={formData.storyContent}
                    onChange={(e) => handleInputChange('storyContent', e.target.value)}
                    placeholder="Rich text content about the master's story..."
                    className="min-h-[120px]"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    This will support rich text formatting in the actual implementation
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top 5 Video Clips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.topClips.map((clip, index) => (
                  <div key={index}>
                    <Label htmlFor={`clip-${index}`}>Clip {index + 1}</Label>
                    <Input
                      id={`clip-${index}`}
                      value={clip}
                      onChange={(e) => handleArrayInputChange('topClips', index, e.target.value)}
                      placeholder={`URL for video clip ${index + 1}`}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mission Card</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="missionTitle">Mission Title</Label>
                  <Input
                    id="missionTitle"
                    value={formData.missionCard.title}
                    onChange={(e) => handleNestedInputChange('missionCard', 'title', e.target.value)}
                    placeholder="Title for the mission card"
                  />
                </div>

                <div>
                  <Label htmlFor="missionDescription">Mission Description</Label>
                  <Textarea
                    id="missionDescription"
                    value={formData.missionCard.description}
                    onChange={(e) => handleNestedInputChange('missionCard', 'description', e.target.value)}
                    placeholder="Description of the master's mission..."
                  />
                </div>

                <div>
                  <Label htmlFor="missionImage">Mission Image URL</Label>
                  <Input
                    id="missionImage"
                    value={formData.missionCard.image}
                    onChange={(e) => handleNestedInputChange('missionCard', 'image', e.target.value)}
                    placeholder="URL for mission card image"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 设置 */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Display Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select 
                    value={formData.priority.toString()} 
                    onValueChange={(value) => handleInputChange('priority', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">No Priority</SelectItem>
                      <SelectItem value="1">Priority 1 (Highest)</SelectItem>
                      <SelectItem value="2">Priority 2</SelectItem>
                      <SelectItem value="3">Priority 3</SelectItem>
                      <SelectItem value="4">Priority 4</SelectItem>
                      <SelectItem value="5">Priority 5 (Lowest)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground mt-1">
                    Higher priority masters appear first on the homepage
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                  />
                  <Label htmlFor="isActive">Active</Label>
                  <Badge variant={formData.isActive ? "default" : "secondary"}>
                    {formData.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Trip Product</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="hasTripProduct"
                    checked={formData.hasTripProduct}
                    onCheckedChange={(checked) => handleInputChange('hasTripProduct', checked)}
                  />
                  <Label htmlFor="hasTripProduct">Has Trip Product</Label>
                </div>

                {formData.hasTripProduct && (
                  <div>
                    <Label htmlFor="tripBookingURL">Booking URL *</Label>
                    <Input
                      id="tripBookingURL"
                      value={formData.tripBookingURL}
                      onChange={(e) => handleInputChange('tripBookingURL', e.target.value)}
                      placeholder="https://booking-platform.com/master-trip"
                      className={errors.tripBookingURL ? 'border-destructive' : ''}
                    />
                    {errors.tripBookingURL && (
                      <p className="text-sm text-destructive mt-1">{errors.tripBookingURL}</p>
                    )}
                    <p className="text-sm text-muted-foreground mt-1">
                      Third-party booking platform URL
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* 底部操作按钮 */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
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
                Create Master
              </>
            )}
          </Button>
        </div>
      </form>
    </CMSLayout>
  )
}