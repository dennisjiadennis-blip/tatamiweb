'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Icons } from '@/components/ui/icons'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface ReferralLink {
  id: string
  code: string
  name?: string
  description?: string
  targetUrl: string
  isActive: boolean
  expiresAt?: Date
  clickCount: number
  conversionCount: number
  totalEarnings: number
  createdAt: Date
  updatedAt: Date
}

interface ReferralFormData {
  name: string
  description: string
  targetUrl: string
  expiresAt: string
  isActive: boolean
}

const DEFAULT_TARGETS = [
  { value: '/', label: 'Home Page' },
  { value: '/masters', label: 'Masters Directory' },
  { value: '/philosophy', label: 'Philosophy Page' },
  { value: '/content', label: 'Content Center' },
  { value: '/community', label: 'Community' }
]

export default function ReferralsPage() {
  const { data: session } = useSession()
  const t = useTranslations('profile')
  const [referralLinks, setReferralLinks] = useState<ReferralLink[]>([])
  const [loading, setLoading] = useState(true)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [editingLink, setEditingLink] = useState<ReferralLink | null>(null)
  const [formData, setFormData] = useState<ReferralFormData>({
    name: '',
    description: '',
    targetUrl: '/',
    expiresAt: '',
    isActive: true
  })
  const [formLoading, setFormLoading] = useState(false)

  useEffect(() => {
    if (session?.user) {
      fetchReferralLinks()
    }
  }, [session])

  const fetchReferralLinks = async () => {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 模拟数据
      const mockLinks: ReferralLink[] = [
        {
          id: '1',
          code: 'WELCOME2024',
          name: 'Welcome Campaign',
          description: 'Special welcome campaign for new users',
          targetUrl: '/',
          isActive: true,
          clickCount: 125,
          conversionCount: 8,
          totalEarnings: 240.50,
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-20')
        },
        {
          id: '2', 
          code: 'MASTERCLASS',
          name: 'Master Class Promotion',
          description: 'Promoting our master class experiences',
          targetUrl: '/masters',
          isActive: true,
          expiresAt: new Date('2024-12-31'),
          clickCount: 67,
          conversionCount: 3,
          totalEarnings: 89.25,
          createdAt: new Date('2024-02-01'),
          updatedAt: new Date('2024-02-01')
        }
      ]
      
      setReferralLinks(mockLinks)
    } catch (error) {
      console.error('Failed to fetch referral links:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof ReferralFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCreateLink = () => {
    setEditingLink(null)
    setFormData({
      name: '',
      description: '',
      targetUrl: '/',
      expiresAt: '',
      isActive: true
    })
    setCreateModalOpen(true)
  }

  const handleEditLink = (link: ReferralLink) => {
    setEditingLink(link)
    setFormData({
      name: link.name || '',
      description: link.description || '',
      targetUrl: link.targetUrl,
      expiresAt: link.expiresAt ? new Date(link.expiresAt).toISOString().split('T')[0] : '',
      isActive: link.isActive
    })
    setCreateModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormLoading(true)

    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      if (editingLink) {
        // 更新现有链接
        setReferralLinks(prev => 
          prev.map(link => 
            link.id === editingLink.id 
              ? { 
                  ...link, 
                  ...formData,
                  expiresAt: formData.expiresAt ? new Date(formData.expiresAt) : undefined,
                  updatedAt: new Date() 
                }
              : link
          )
        )
      } else {
        // 创建新链接
        const newLink: ReferralLink = {
          id: Date.now().toString(),
          code: `REF${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
          ...formData,
          expiresAt: formData.expiresAt ? new Date(formData.expiresAt) : undefined,
          clickCount: 0,
          conversionCount: 0,
          totalEarnings: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        }
        setReferralLinks(prev => [newLink, ...prev])
      }
      
      setCreateModalOpen(false)
    } catch (error) {
      console.error('Failed to save referral link:', error)
    } finally {
      setFormLoading(false)
    }
  }

  const handleToggleActive = async (linkId: string, isActive: boolean) => {
    try {
      // 模拟API调用
      setReferralLinks(prev => 
        prev.map(link => 
          link.id === linkId 
            ? { ...link, isActive, updatedAt: new Date() }
            : link
        )
      )
    } catch (error) {
      console.error('Failed to toggle link status:', error)
    }
  }

  const copyToClipboard = async (code: string) => {
    const referralUrl = `${window.location.origin}?ref=${code}`
    try {
      await navigator.clipboard.writeText(referralUrl)
      // 简单的成功提示 - 实际应用中可以使用toast
      alert('Referral link copied to clipboard!')
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const calculateConversionRate = (clicks: number, conversions: number) => {
    return clicks > 0 ? ((conversions / clicks) * 100).toFixed(1) : '0.0'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Icons.loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 页面头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Referral Links</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage your referral links to earn commissions
          </p>
        </div>
        <Button onClick={handleCreateLink}>
          <Icons.plus className="h-4 w-4 mr-2" />
          Create Link
        </Button>
      </div>

      {/* 统计概览 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Icons.link className="h-4 w-4 text-muted-foreground" />
              <div className="ml-2">
                <p className="text-sm font-medium text-muted-foreground">Total Links</p>
                <p className="text-2xl font-bold">{referralLinks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Icons.mousePointer className="h-4 w-4 text-muted-foreground" />
              <div className="ml-2">
                <p className="text-sm font-medium text-muted-foreground">Total Clicks</p>
                <p className="text-2xl font-bold">
                  {referralLinks.reduce((sum, link) => sum + link.clickCount, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Icons.target className="h-4 w-4 text-muted-foreground" />
              <div className="ml-2">
                <p className="text-sm font-medium text-muted-foreground">Conversions</p>
                <p className="text-2xl font-bold">
                  {referralLinks.reduce((sum, link) => sum + link.conversionCount, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Icons.dollarSign className="h-4 w-4 text-muted-foreground" />
              <div className="ml-2">
                <p className="text-sm font-medium text-muted-foreground">Total Earnings</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(referralLinks.reduce((sum, link) => sum + link.totalEarnings, 0))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 推广链接列表 */}
      <Card>
        <CardHeader>
          <CardTitle>Your Referral Links</CardTitle>
        </CardHeader>
        <CardContent>
          {referralLinks.length === 0 ? (
            <div className="text-center py-12">
              <Icons.link className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No referral links yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first referral link to start earning commissions
              </p>
              <Button onClick={handleCreateLink}>
                <Icons.plus className="h-4 w-4 mr-2" />
                Create Your First Link
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {referralLinks.map((link) => (
                  <motion.div
                    key={link.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{link.name || 'Unnamed Link'}</h3>
                          <Badge variant={link.isActive ? 'default' : 'secondary'}>
                            {link.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                          {link.expiresAt && new Date(link.expiresAt) < new Date() && (
                            <Badge variant="destructive">Expired</Badge>
                          )}
                        </div>
                        {link.description && (
                          <p className="text-sm text-muted-foreground mb-2">{link.description}</p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Code: <code className="bg-muted px-1 rounded">{link.code}</code></span>
                          <span>Target: {link.targetUrl}</span>
                          {link.expiresAt && (
                            <span>Expires: {new Date(link.expiresAt).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(link.code)}
                        >
                          <Icons.copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditLink(link)}
                        >
                          <Icons.edit className="h-4 w-4" />
                        </Button>
                        <Switch
                          checked={link.isActive}
                          onCheckedChange={(checked) => handleToggleActive(link.id, checked)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 pt-2 border-t">
                      <div className="text-center">
                        <p className="text-lg font-semibold">{link.clickCount}</p>
                        <p className="text-xs text-muted-foreground">Clicks</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-semibold">{link.conversionCount}</p>
                        <p className="text-xs text-muted-foreground">Conversions</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-semibold">{calculateConversionRate(link.clickCount, link.conversionCount)}%</p>
                        <p className="text-xs text-muted-foreground">Conversion Rate</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-semibold">{formatCurrency(link.totalEarnings)}</p>
                        <p className="text-xs text-muted-foreground">Earnings</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 创建/编辑链接对话框 */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {editingLink ? 'Edit Referral Link' : 'Create New Referral Link'}
              </DialogTitle>
              <DialogDescription>
                {editingLink 
                  ? 'Update the details of your referral link'
                  : 'Create a new referral link to share with your audience'
                }
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="name">Link Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., Welcome Campaign"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe this referral link..."
                  className="min-h-[80px]"
                />
              </div>
              
              <div>
                <Label htmlFor="targetUrl">Target URL</Label>
                <Select 
                  value={formData.targetUrl} 
                  onValueChange={(value) => handleInputChange('targetUrl', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DEFAULT_TARGETS.map((target) => (
                      <SelectItem key={target.value} value={target.value}>
                        {target.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="expiresAt">Expiration Date (Optional)</Label>
                <Input
                  id="expiresAt"
                  type="date"
                  value={formData.expiresAt}
                  onChange={(e) => handleInputChange('expiresAt', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
            </div>
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={formLoading}>
                {formLoading ? (
                  <>
                    <Icons.loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {editingLink ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    {editingLink ? 'Update Link' : 'Create Link'}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}