'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Icons } from '@/components/ui/icons'
import { CMSLayout } from '@/components/cms/layout/cms-layout'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  color: string
  contentCount: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface CategoryFormData {
  name: string
  slug: string
  description: string
  color: string
  isActive: boolean
}

export default function CategoriesManagementPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    slug: '',
    description: '',
    color: '#3b82f6',
    isActive: true
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const colorOptions = [
    { value: '#3b82f6', label: 'Blue' },
    { value: '#ef4444', label: 'Red' },
    { value: '#10b981', label: 'Green' },
    { value: '#f59e0b', label: 'Yellow' },
    { value: '#8b5cf6', label: 'Purple' },
    { value: '#ec4899', label: 'Pink' },
    { value: '#6b7280', label: 'Gray' },
    { value: '#f97316', label: 'Orange' }
  ]

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockCategories: Category[] = [
        {
          id: '1',
          name: 'Traditional Arts',
          slug: 'traditional-arts',
          description: 'Traditional Japanese arts and crafts',
          color: '#3b82f6',
          contentCount: 12,
          isActive: true,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-02-10T15:30:00Z'
        },
        {
          id: '2',
          name: 'Philosophy',
          slug: 'philosophy',
          description: 'Japanese philosophy and spiritual practices',
          color: '#8b5cf6',
          contentCount: 8,
          isActive: true,
          createdAt: '2024-01-20T14:00:00Z',
          updatedAt: '2024-02-08T09:15:00Z'
        },
        {
          id: '3',
          name: 'Craftsmanship',
          slug: 'craftsmanship',
          description: 'Traditional Japanese craftsmanship and techniques',
          color: '#f59e0b',
          contentCount: 15,
          isActive: true,
          createdAt: '2024-02-01T08:30:00Z',
          updatedAt: '2024-02-05T16:45:00Z'
        },
        {
          id: '4',
          name: 'Seasonal',
          slug: 'seasonal',
          description: 'Seasonal practices and traditions',
          color: '#10b981',
          contentCount: 5,
          isActive: false,
          createdAt: '2024-01-25T11:20:00Z',
          updatedAt: '2024-01-30T13:10:00Z'
        }
      ]
      
      setCategories(mockCategories)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // 自动生成slug
    if (field === 'name' && typeof value === 'string') {
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
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!formData.name.trim()) {
      errors.name = 'Name is required'
    }

    if (!formData.slug.trim()) {
      errors.slug = 'Slug is required'
    }

    // 检查slug唯一性
    const isDuplicate = categories.some(cat => 
      cat.slug === formData.slug && (!editingCategory || cat.id !== editingCategory.id)
    )
    
    if (isDuplicate) {
      errors.slug = 'Slug already exists'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (editingCategory) {
        console.log('Updating category:', editingCategory.id, formData)
        // 更新逻辑
      } else {
        console.log('Creating category:', formData)
        // 创建逻辑
      }
      
      setDialogOpen(false)
      resetForm()
      fetchCategories()
    } catch (error) {
      console.error('Failed to save category:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      color: '#3b82f6',
      isActive: true
    })
    setEditingCategory(null)
    setFormErrors({})
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      color: category.color,
      isActive: category.isActive
    })
    setDialogOpen(true)
  }

  const handleDelete = async (categoryId: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        console.log('Deleting category:', categoryId)
        // 删除逻辑
        fetchCategories()
      } catch (error) {
        console.error('Failed to delete category:', error)
      }
    }
  }

  const handleToggleStatus = async (categoryId: string) => {
    try {
      console.log('Toggling category status:', categoryId)
      // 状态切换逻辑
      fetchCategories()
    } catch (error) {
      console.error('Failed to toggle category status:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <CMSLayout title="Content Categories" description="Manage content categories and tags">
      <div className="space-y-6">
        {/* 顶部操作栏 */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Categories</h2>
            <p className="text-muted-foreground">
              Organize your content with categories
            </p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Icons.plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>
                    {editingCategory ? 'Edit Category' : 'Create Category'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingCategory 
                      ? 'Update the category details below.'
                      : 'Add a new category to organize your content.'
                    }
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Category name"
                      className={formErrors.name ? 'border-destructive' : ''}
                    />
                    {formErrors.name && (
                      <p className="text-sm text-destructive mt-1">{formErrors.name}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="slug">Slug *</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => handleInputChange('slug', e.target.value)}
                      placeholder="url-friendly-slug"
                      className={formErrors.slug ? 'border-destructive' : ''}
                    />
                    {formErrors.slug && (
                      <p className="text-sm text-destructive mt-1">{formErrors.slug}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Category description..."
                      className="min-h-[80px]"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="color">Color</Label>
                    <div className="flex gap-2 mt-2">
                      {colorOptions.map((color) => (
                        <button
                          key={color.value}
                          type="button"
                          className={`w-8 h-8 rounded-full border-2 ${
                            formData.color === color.value 
                              ? 'border-gray-900 shadow-lg' 
                              : 'border-gray-300'
                          }`}
                          style={{ backgroundColor: color.value }}
                          onClick={() => handleInputChange('color', color.value)}
                          title={color.label}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingCategory ? 'Update Category' : 'Create Category'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{categories.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {categories.filter(c => c.isActive).length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {categories.reduce((sum, c) => sum + c.contentCount, 0)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Avg per Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {categories.length > 0 
                  ? Math.round(categories.reduce((sum, c) => sum + c.contentCount, 0) / categories.length)
                  : 0
                }
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 分类列表 */}
        <Card>
          <CardHeader>
            <CardTitle>Categories ({categories.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Icons.loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Content Count</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-[70px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <motion.tr
                      key={category.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="group"
                    >
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                          <div>
                            <div className="font-medium">{category.name}</div>
                            {category.description && (
                              <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                                {category.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-sm bg-muted px-2 py-1 rounded">
                          {category.slug}
                        </code>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Icons.fileText className="h-4 w-4 text-muted-foreground" />
                          <span>{category.contentCount}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={category.isActive ? "default" : "secondary"}
                          className={category.isActive ? "bg-green-100 text-green-800" : ""}
                        >
                          {category.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(category.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Icons.moreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(category)}>
                              <Icons.edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleStatus(category.id)}>
                              <Icons.toggleLeft className="h-4 w-4 mr-2" />
                              {category.isActive ? 'Deactivate' : 'Activate'}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(category.id)}
                              className="text-destructive"
                              disabled={category.contentCount > 0}
                            >
                              <Icons.trash className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            )}

            {!loading && categories.length === 0 && (
              <div className="text-center py-12">
                <Icons.tag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No categories found</h3>
                <p className="text-muted-foreground mb-4">
                  Get started by creating your first content category.
                </p>
                <Button onClick={() => setDialogOpen(true)}>
                  <Icons.plus className="h-4 w-4 mr-2" />
                  Create Your First Category
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </CMSLayout>
  )
}