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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  name?: string
  avatar?: string
  role: string
  isActive: boolean
  lastLoginAt?: string
  emailVerified?: string
  locale: string
  createdAt: string
  updatedAt: string
  _count?: {
    contributions: number
    interests: number
  }
}

export default function UsersManagementPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const router = useRouter()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockUsers: User[] = [
        {
          id: '1',
          email: 'admin@tatami.com',
          name: 'Admin User',
          avatar: '/images/avatars/admin.jpg',
          role: 'SUPER_ADMIN',
          isActive: true,
          lastLoginAt: '2024-02-15T09:30:00Z',
          emailVerified: '2024-01-01T00:00:00Z',
          locale: 'en',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-02-15T09:30:00Z',
          _count: { contributions: 0, interests: 0 }
        },
        {
          id: '2',
          email: 'editor@tatami.com',
          name: 'Content Editor',
          role: 'ADMIN',
          isActive: true,
          lastLoginAt: '2024-02-14T16:45:00Z',
          emailVerified: '2024-01-15T00:00:00Z',
          locale: 'en',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-02-14T16:45:00Z',
          _count: { contributions: 15, interests: 3 }
        },
        {
          id: '3',
          email: 'sarah.chen@example.com',
          name: 'Sarah Chen',
          avatar: '/images/avatars/sarah.jpg',
          role: 'USER',
          isActive: true,
          lastLoginAt: '2024-02-13T14:20:00Z',
          emailVerified: '2024-01-20T00:00:00Z',
          locale: 'zh-TW',
          createdAt: '2024-01-20T14:30:00Z',
          updatedAt: '2024-02-13T14:20:00Z',
          _count: { contributions: 5, interests: 12 }
        },
        {
          id: '4',
          email: 'marcus.weber@example.com',
          name: 'Marcus Weber',
          role: 'USER',
          isActive: true,
          lastLoginAt: '2024-02-12T11:15:00Z',
          emailVerified: '2024-01-25T00:00:00Z',
          locale: 'en',
          createdAt: '2024-01-25T11:20:00Z',
          updatedAt: '2024-02-12T11:15:00Z',
          _count: { contributions: 3, interests: 8 }
        },
        {
          id: '5',
          email: 'elena.rodriguez@example.com',
          name: 'Elena Rodriguez',
          role: 'USER',
          isActive: false,
          emailVerified: '2024-02-01T00:00:00Z',
          locale: 'ja',
          createdAt: '2024-02-01T08:30:00Z',
          updatedAt: '2024-02-05T16:45:00Z',
          _count: { contributions: 1, interests: 2 }
        }
      ]
      
      setUsers(mockUsers)
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.name?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRole = filterRole === 'all' || user.role === filterRole
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && user.isActive) ||
                         (filterStatus === 'inactive' && !user.isActive)
    
    return matchesSearch && matchesRole && matchesStatus
  })

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return <Badge className="bg-red-100 text-red-800">Super Admin</Badge>
      case 'ADMIN':
        return <Badge className="bg-blue-100 text-blue-800">Admin</Badge>
      case 'USER':
        return <Badge variant="secondary">User</Badge>
      default:
        return <Badge variant="outline">{role}</Badge>
    }
  }

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge className="bg-green-100 text-green-800">Active</Badge>
    ) : (
      <Badge variant="secondary">Inactive</Badge>
    )
  }

  const getLocaleBadge = (locale: string) => {
    const localeMap = {
      'en': '🇺🇸 EN',
      'zh-TW': '🇹🇼 中文',
      'ja': '🇯🇵 日本語'
    }
    return localeMap[locale as keyof typeof localeMap] || locale
  }

  const handleEdit = (userId: string) => {
    router.push(`/cms/users/${userId}`)
  }

  const handleChangeRole = async (userId: string, newRole: string) => {
    if (confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      console.log('Changing role:', userId, newRole)
      // 实现角色更改逻辑
    }
  }

  const handleToggleStatus = async (userId: string) => {
    const user = users.find(u => u.id === userId)
    if (user && confirm(`Are you sure you want to ${user.isActive ? 'deactivate' : 'activate'} this user?`)) {
      console.log('Toggling status:', userId)
      // 实现状态切换逻辑
    }
  }

  const handleImpersonate = (userId: string) => {
    if (confirm('Are you sure you want to impersonate this user? This will log you in as them.')) {
      console.log('Impersonating user:', userId)
      // 实现用户模拟逻辑
    }
  }

  const handleSendPasswordReset = async (userId: string) => {
    console.log('Sending password reset:', userId)
    // 实现密码重置逻辑
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getRelativeTime = (dateString?: string) => {
    if (!dateString) return 'Never'
    
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return `${Math.floor(diffDays / 30)} months ago`
  }

  return (
    <CMSLayout title="Users Management" description="Manage users, roles, and permissions">
      <div className="space-y-6">
        {/* 顶部操作栏 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* 搜索框 */}
            <div className="relative flex-1 max-w-sm">
              <Icons.search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* 过滤器 */}
            <div className="flex gap-2">
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="USER">User</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 添加按钮 */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push('/cms/users/admins')}>
              <Icons.shield className="h-4 w-4 mr-2" />
              Administrators
            </Button>
            <Button onClick={() => router.push('/cms/users/invite')}>
              <Icons.userPlus className="h-4 w-4 mr-2" />
              Invite User
            </Button>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {users.filter(u => u.isActive).length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Administrators</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {users.filter(u => u.role === 'ADMIN' || u.role === 'SUPER_ADMIN').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Verified</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {users.filter(u => u.emailVerified).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {users.filter(u => {
                  const created = new Date(u.createdAt)
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
            <CardTitle>Users ({filteredUsers.length})</CardTitle>
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
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Language</TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="w-[70px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="group"
                    >
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>
                              {user.name?.split(' ').map(n => n[0]).join('') || user.email[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name || 'Unnamed User'}</div>
                            <div className="text-sm text-muted-foreground flex items-center">
                              {user.email}
                              {user.emailVerified && (
                                <Icons.checkCircle className="h-3 w-3 ml-1 text-green-500" />
                              )}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getRoleBadge(user.role)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(user.isActive)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {getLocaleBadge(user.locale)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Icons.heart className="h-3 w-3 mr-1" />
                            {user._count?.interests || 0}
                          </div>
                          <div className="flex items-center">
                            <Icons.star className="h-3 w-3 mr-1" />
                            {user._count?.contributions || 0}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {getRelativeTime(user.lastLoginAt)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(user.createdAt).split(',')[0]}
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
                            <DropdownMenuItem onClick={() => handleEdit(user.id)}>
                              <Icons.edit className="h-4 w-4 mr-2" />
                              Edit Profile
                            </DropdownMenuItem>
                            {user.role !== 'SUPER_ADMIN' && (
                              <>
                                <DropdownMenuItem onClick={() => handleChangeRole(user.id, user.role === 'ADMIN' ? 'USER' : 'ADMIN')}>
                                  <Icons.shield className="h-4 w-4 mr-2" />
                                  {user.role === 'ADMIN' ? 'Remove Admin' : 'Make Admin'}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleToggleStatus(user.id)}>
                                  <Icons.toggleLeft className="h-4 w-4 mr-2" />
                                  {user.isActive ? 'Deactivate' : 'Activate'}
                                </DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuItem onClick={() => handleImpersonate(user.id)}>
                              <Icons.user className="h-4 w-4 mr-2" />
                              Impersonate
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSendPasswordReset(user.id)}>
                              <Icons.mail className="h-4 w-4 mr-2" />
                              Send Password Reset
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            )}

            {!loading && filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <Icons.users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No users found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || filterRole !== 'all' || filterStatus !== 'all'
                    ? 'Try adjusting your search or filter criteria.'
                    : 'No users have joined the platform yet.'
                  }
                </p>
                {!searchTerm && filterRole === 'all' && filterStatus === 'all' && (
                  <Button onClick={() => router.push('/cms/users/invite')}>
                    <Icons.userPlus className="h-4 w-4 mr-2" />
                    Invite Your First User
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