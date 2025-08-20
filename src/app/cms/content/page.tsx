'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Icons } from '@/components/ui/icons'
import { CMSLayout } from '@/components/cms/layout/cms-layout'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useRouter } from 'next/navigation'

interface ContentItem {
  id: string
  title: string
  slug: string
  type: string
  status: string
  excerpt?: string
  coverImage?: string
  authorId?: string
  author?: string
  publishedAt?: string
  createdAt: string
  updatedAt: string
}

export default function ContentManagementPage() {
  const [content, setContent] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')
  const router = useRouter()

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockContent: ContentItem[] = [
        {
          id: '1',
          title: 'The Art of Japanese Tea Ceremony',
          slug: 'japanese-tea-ceremony-art',
          type: 'article',
          status: 'published',
          excerpt: 'Discover the profound philosophy and meticulous practices behind the traditional Japanese tea ceremony...',
          coverImage: '/images/content/tea-ceremony.jpg',
          author: 'Master Yamamoto',
          publishedAt: '2024-02-10T10:00:00Z',
          createdAt: '2024-02-08T14:30:00Z',
          updatedAt: '2024-02-10T10:00:00Z'
        },
        {
          id: '2',
          title: 'Zen Garden Design Principles',
          slug: 'zen-garden-design-principles',
          type: 'guide',
          status: 'published',
          excerpt: 'Learn the fundamental principles of creating peaceful zen gardens that promote meditation and tranquility...',
          coverImage: '/images/content/zen-garden.jpg',
          author: 'Master Nakamura',
          publishedAt: '2024-02-08T15:00:00Z',
          createdAt: '2024-02-05T09:20:00Z',
          updatedAt: '2024-02-08T15:00:00Z'
        },
        {
          id: '3',
          title: 'Traditional Pottery Techniques',
          slug: 'traditional-pottery-techniques',
          type: 'tutorial',
          status: 'draft',
          excerpt: 'Master the ancient techniques of Japanese pottery, from clay preparation to final glazing...',
          author: 'Master Watanabe',
          createdAt: '2024-02-12T11:45:00Z',
          updatedAt: '2024-02-13T16:20:00Z'
        },
        {
          id: '4',
          title: 'The Philosophy of Swordsmithing',
          slug: 'philosophy-of-swordsmithing',
          type: 'article',
          status: 'review',
          excerpt: 'Explore the spiritual and philosophical aspects of traditional Japanese sword making...',
          coverImage: '/images/content/swordsmithing.jpg',
          author: 'Master Kobayashi',
          createdAt: '2024-02-14T08:15:00Z',
          updatedAt: '2024-02-15T12:30:00Z'
        }
      ]
      
      setContent(mockContent)
    } catch (error) {
      console.error('Failed to fetch content:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredContent = content.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.author?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus
    const matchesType = filterType === 'all' || item.type === filterType
    
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-100 text-green-800">Published</Badge>
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>
      case 'review':
        return <Badge className="bg-yellow-100 text-yellow-800">Review</Badge>
      case 'archived':
        return <Badge variant="outline">Archived</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTypeBadge = (type: string) => {
    const typeColors = {
      article: 'bg-blue-100 text-blue-800',
      guide: 'bg-purple-100 text-purple-800',
      tutorial: 'bg-orange-100 text-orange-800',
      news: 'bg-green-100 text-green-800'
    }
    
    return (
      <Badge className={typeColors[type as keyof typeof typeColors] || 'bg-gray-100 text-gray-800'}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    )
  }

  const handleEdit = (contentId: string) => {
    router.push(`/cms/content/${contentId}`)
  }

  const handleDuplicate = async (contentId: string) => {
    console.log('Duplicating content:', contentId)
    // 实现复制逻辑
  }

  const handleChangeStatus = async (contentId: string, newStatus: string) => {
    console.log('Changing status:', contentId, newStatus)
    // 实现状态更改逻辑
  }

  const handleDelete = async (contentId: string) => {
    if (confirm('Are you sure you want to delete this content?')) {
      console.log('Deleting content:', contentId)
      // 实现删除逻辑
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
    <CMSLayout title="Content Management" description="Manage articles, guides, and tutorials">
      <div className="space-y-6">
        {/* 顶部操作栏 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* 搜索框 */}
            <div className="relative flex-1 max-w-sm">
              <Icons.search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* 过滤器 */}
            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="article">Article</SelectItem>
                  <SelectItem value="guide">Guide</SelectItem>
                  <SelectItem value="tutorial">Tutorial</SelectItem>
                  <SelectItem value="news">News</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 添加按钮 */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push('/cms/content/categories')}>
              <Icons.tag className="h-4 w-4 mr-2" />
              Categories
            </Button>
            <Button onClick={() => router.push('/cms/content/create')}>
              <Icons.plus className="h-4 w-4 mr-2" />
              Create Content
            </Button>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{content.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Published</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {content.filter(c => c.status === 'published').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">
                {content.filter(c => c.status === 'draft').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">In Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {content.filter(c => c.status === 'review').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {content.filter(c => {
                  const created = new Date(c.createdAt)
                  const now = new Date()
                  return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
                }).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 主表格 */}
        <Card>
          <CardHeader>
            <CardTitle>Content ({filteredContent.length})</CardTitle>
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
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Published</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="w-[70px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContent.map((item) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="group"
                    >
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          {item.coverImage && (
                            <div className="h-10 w-10 rounded-md overflow-hidden bg-muted">
                              <img 
                                src={item.coverImage} 
                                alt={item.title}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="font-medium truncate">{item.title}</div>
                            {item.excerpt && (
                              <div className="text-sm text-muted-foreground truncate max-w-[300px]">
                                {item.excerpt}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getTypeBadge(item.type)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(item.status)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {item.author || 'Unknown'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {item.publishedAt ? formatDate(item.publishedAt) : 'Not published'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(item.updatedAt)}
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
                            <DropdownMenuItem onClick={() => handleEdit(item.id)}>
                              <Icons.edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDuplicate(item.id)}>
                              <Icons.copy className="h-4 w-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            {item.status === 'draft' && (
                              <DropdownMenuItem onClick={() => handleChangeStatus(item.id, 'review')}>
                                <Icons.send className="h-4 w-4 mr-2" />
                                Submit for Review
                              </DropdownMenuItem>
                            )}
                            {item.status === 'review' && (
                              <DropdownMenuItem onClick={() => handleChangeStatus(item.id, 'published')}>
                                <Icons.check className="h-4 w-4 mr-2" />
                                Publish
                              </DropdownMenuItem>
                            )}
                            {item.status === 'published' && (
                              <DropdownMenuItem onClick={() => handleChangeStatus(item.id, 'archived')}>
                                <Icons.archive className="h-4 w-4 mr-2" />
                                Archive
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => handleDelete(item.id)}
                              className="text-destructive"
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

            {!loading && filteredContent.length === 0 && (
              <div className="text-center py-12">
                <Icons.fileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No content found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || filterStatus !== 'all' || filterType !== 'all'
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Get started by creating your first piece of content.'
                  }
                </p>
                {!searchTerm && filterStatus === 'all' && filterType === 'all' && (
                  <Button onClick={() => router.push('/cms/content/create')}>
                    <Icons.plus className="h-4 w-4 mr-2" />
                    Create Your First Content
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </CMSLayout>
  )
}