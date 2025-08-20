'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Icons } from '@/components/ui/icons'
import { CMSLayout } from '@/components/cms/layout/cms-layout'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import { useRouter } from 'next/navigation'

interface Master {
  id: string
  name: string
  title: string
  profileVideo?: string
  heroImage?: string
  isActive: boolean
  priority: number
  hasTripProduct: boolean
  createdAt: string
  updatedAt: string
  _count?: {
    interests: number
  }
}

export default function MastersManagementPage() {
  const [masters, setMasters] = useState<Master[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all')
  const router = useRouter()

  useEffect(() => {
    fetchMasters()
  }, [])

  const fetchMasters = async () => {
    try {
      // 模拟API调用 - 在实际应用中应该调用真实的API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockMasters: Master[] = [
        {
          id: '1',
          name: 'Takeshi Yamamoto',
          title: '16th Generation Sake Master',
          profileVideo: '/videos/yamamoto-intro.mp4',
          heroImage: '/images/masters/yamamoto-hero.jpg',
          isActive: true,
          priority: 1,
          hasTripProduct: true,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-02-10T15:30:00Z',
          _count: { interests: 45 }
        },
        {
          id: '2',
          name: 'Hiroshi Nakamura',
          title: 'Garden Design Master',
          profileVideo: '/videos/nakamura-intro.mp4',
          heroImage: '/images/masters/nakamura-hero.jpg',
          isActive: true,
          priority: 2,
          hasTripProduct: true,
          createdAt: '2024-01-20T14:00:00Z',
          updatedAt: '2024-02-08T09:15:00Z',
          _count: { interests: 32 }
        },
        {
          id: '3',
          name: 'Kenji Watanabe',
          title: 'Pottery Craftsman',
          isActive: true,
          priority: 3,
          hasTripProduct: false,
          createdAt: '2024-02-01T08:30:00Z',
          updatedAt: '2024-02-05T16:45:00Z',
          _count: { interests: 18 }
        },
        {
          id: '4',
          name: 'Satoshi Kobayashi',
          title: 'Swordsmith Master',
          isActive: false,
          priority: 0,
          hasTripProduct: false,
          createdAt: '2024-01-25T11:20:00Z',
          updatedAt: '2024-01-30T13:10:00Z',
          _count: { interests: 8 }
        }
      ]
      
      setMasters(mockMasters)
    } catch (error) {
      console.error('Failed to fetch masters:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredMasters = masters.filter(master => {
    const matchesSearch = master.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         master.title.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterActive === 'all' || 
                         (filterActive === 'active' && master.isActive) ||
                         (filterActive === 'inactive' && !master.isActive)
    
    return matchesSearch && matchesFilter
  })

  const handleEdit = (masterId: string) => {
    router.push(`/cms/masters/${masterId}`)
  }

  const handleDelete = async (masterId: string) => {
    if (confirm('Are you sure you want to delete this master?')) {
      // 实现删除逻辑
      console.log('Deleting master:', masterId)
    }
  }

  const handleToggleStatus = async (masterId: string) => {
    // 实现状态切换逻辑
    console.log('Toggling status for master:', masterId)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <CMSLayout title="Masters Management" description="Manage masters and their profiles">
      <div className="space-y-6">
        {/* 顶部操作栏 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* 搜索框 */}
            <div className="relative flex-1 max-w-sm">
              <Icons.search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search masters..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* 过滤器 */}
            <div className="flex gap-2">
              <Button
                variant={filterActive === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterActive('all')}
              >
                All
              </Button>
              <Button
                variant={filterActive === 'active' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterActive('active')}
              >
                Active
              </Button>
              <Button
                variant={filterActive === 'inactive' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterActive('inactive')}
              >
                Inactive
              </Button>
            </div>
          </div>

          {/* 添加按钮 */}
          <Button onClick={() => router.push('/cms/masters/create')}>
            <Icons.plus className="h-4 w-4 mr-2" />
            Add Master
          </Button>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Masters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{masters.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {masters.filter(m => m.isActive).length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">With Trips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {masters.filter(m => m.hasTripProduct).length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Interests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {masters.reduce((sum, m) => sum + (m._count?.interests || 0), 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 主表格 */}
        <Card>
          <CardHeader>
            <CardTitle>Masters ({filteredMasters.length})</CardTitle>
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
                    <TableHead>Master</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Interests</TableHead>
                    <TableHead>Trip Product</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="w-[70px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMasters.map((master) => (
                    <motion.tr
                      key={master.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="group"
                    >
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={master.heroImage} />
                            <AvatarFallback>
                              {master.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{master.name}</div>
                            <div className="text-sm text-muted-foreground">
                              ID: {master.id}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        <div className="truncate">{master.title}</div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={master.isActive ? "default" : "secondary"}
                          className={master.isActive ? "bg-green-100 text-green-800" : ""}
                        >
                          {master.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {master.priority || 'No Priority'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Icons.heart className="h-4 w-4 text-red-500" />
                          <span>{master._count?.interests || 0}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {master.hasTripProduct ? (
                          <Badge className="bg-blue-100 text-blue-800">
                            Available
                          </Badge>
                        ) : (
                          <Badge variant="outline">None</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(master.updatedAt)}
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
                            <DropdownMenuItem onClick={() => handleEdit(master.id)}>
                              <Icons.edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleStatus(master.id)}>
                              <Icons.toggleLeft className="h-4 w-4 mr-2" />
                              {master.isActive ? 'Deactivate' : 'Activate'}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(master.id)}
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

            {!loading && filteredMasters.length === 0 && (
              <div className="text-center py-12">
                <Icons.userX className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No masters found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || filterActive !== 'all' 
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Get started by adding your first master.'
                  }
                </p>
                {!searchTerm && filterActive === 'all' && (
                  <Button onClick={() => router.push('/cms/masters/create')}>
                    <Icons.plus className="h-4 w-4 mr-2" />
                    Add Your First Master
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