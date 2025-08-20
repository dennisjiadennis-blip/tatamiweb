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
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'

interface AdminUser {
  id: string
  email: string
  name?: string
  avatar?: string
  role: string
  permissions: string[]
  isActive: boolean
  lastLoginAt?: string
  createdAt: string
  updatedAt: string
}

interface Permission {
  id: string
  name: string
  description: string
  category: string
}

const permissionCategories = {
  'users': 'User Management',
  'masters': 'Master Management', 
  'content': 'Content Management',
  'analytics': 'Analytics & Reports',
  'system': 'System Administration'
}

const allPermissions: Permission[] = [
  // User Management
  { id: 'VIEW_USERS', name: 'View Users', description: 'Can view user list and profiles', category: 'users' },
  { id: 'CREATE_USERS', name: 'Create Users', description: 'Can create new user accounts', category: 'users' },
  { id: 'UPDATE_USERS', name: 'Update Users', description: 'Can edit user profiles and settings', category: 'users' },
  { id: 'DELETE_USERS', name: 'Delete Users', description: 'Can delete user accounts', category: 'users' },
  
  // Master Management
  { id: 'VIEW_MASTERS', name: 'View Masters', description: 'Can view master profiles', category: 'masters' },
  { id: 'CREATE_MASTERS', name: 'Create Masters', description: 'Can add new masters', category: 'masters' },
  { id: 'UPDATE_MASTERS', name: 'Update Masters', description: 'Can edit master profiles', category: 'masters' },
  { id: 'DELETE_MASTERS', name: 'Delete Masters', description: 'Can remove masters', category: 'masters' },
  
  // Content Management
  { id: 'VIEW_CONTENT', name: 'View Content', description: 'Can view all content', category: 'content' },
  { id: 'CREATE_CONTENT', name: 'Create Content', description: 'Can create new content', category: 'content' },
  { id: 'UPDATE_CONTENT', name: 'Update Content', description: 'Can edit existing content', category: 'content' },
  { id: 'DELETE_CONTENT', name: 'Delete Content', description: 'Can delete content', category: 'content' },
  { id: 'PUBLISH_CONTENT', name: 'Publish Content', description: 'Can publish and unpublish content', category: 'content' },
  
  // Analytics
  { id: 'VIEW_ANALYTICS', name: 'View Analytics', description: 'Can view analytics and reports', category: 'analytics' },
  { id: 'VIEW_LOGS', name: 'View Logs', description: 'Can view system and admin logs', category: 'analytics' },
  
  // System
  { id: 'MANAGE_SETTINGS', name: 'Manage Settings', description: 'Can modify system settings', category: 'system' },
  { id: 'MANAGE_ADMINS', name: 'Manage Admins', description: 'Can create and manage admin accounts', category: 'system' },
  { id: 'SYSTEM_CONFIG', name: 'System Config', description: 'Can modify system configuration', category: 'system' }
]

export default function AdminsManagementPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null)
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    role: 'ADMIN',
    permissions: [] as string[]
  })

  useEffect(() => {
    fetchAdmins()
  }, [])

  const fetchAdmins = async () => {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockAdmins: AdminUser[] = [
        {
          id: '1',
          email: 'admin@tatami.com',
          name: 'System Administrator',
          avatar: '/images/avatars/admin.jpg',
          role: 'SUPER_ADMIN',
          permissions: allPermissions.map(p => p.id),
          isActive: true,
          lastLoginAt: '2024-02-15T09:30:00Z',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-02-15T09:30:00Z'
        },
        {
          id: '2',
          email: 'editor@tatami.com',
          name: 'Content Editor',
          role: 'ADMIN',
          permissions: [
            'VIEW_USERS', 'VIEW_MASTERS', 'CREATE_MASTERS', 'UPDATE_MASTERS',
            'VIEW_CONTENT', 'CREATE_CONTENT', 'UPDATE_CONTENT', 'DELETE_CONTENT', 'PUBLISH_CONTENT',
            'VIEW_ANALYTICS'
          ],
          isActive: true,
          lastLoginAt: '2024-02-14T16:45:00Z',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-02-14T16:45:00Z'
        },
        {
          id: '3',
          email: 'moderator@tatami.com',
          name: 'Content Moderator',
          role: 'ADMIN',
          permissions: [
            'VIEW_USERS', 'VIEW_MASTERS', 'VIEW_CONTENT', 'UPDATE_CONTENT', 'VIEW_ANALYTICS'
          ],
          isActive: true,
          lastLoginAt: '2024-02-13T11:20:00Z',
          createdAt: '2024-02-01T08:30:00Z',
          updatedAt: '2024-02-13T11:20:00Z'
        }
      ]
      
      setAdmins(mockAdmins)
    } catch (error) {
      console.error('Failed to fetch admins:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePermissionToggle = (permissionId: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (editingAdmin) {
        console.log('Updating admin:', editingAdmin.id, formData)
      } else {
        console.log('Creating admin:', formData)
      }
      
      setDialogOpen(false)
      resetForm()
      fetchAdmins()
    } catch (error) {
      console.error('Failed to save admin:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      email: '',
      name: '',
      role: 'ADMIN',
      permissions: []
    })
    setEditingAdmin(null)
  }

  const handleEdit = (admin: AdminUser) => {
    setEditingAdmin(admin)
    setFormData({
      email: admin.email,
      name: admin.name || '',
      role: admin.role,
      permissions: admin.permissions
    })
    setDialogOpen(true)
  }

  const handleDelete = async (adminId: string) => {
    if (confirm('Are you sure you want to remove this administrator?')) {
      console.log('Deleting admin:', adminId)
      // 实现删除逻辑
      fetchAdmins()
    }
  }

  const handleToggleStatus = async (adminId: string) => {
    console.log('Toggling admin status:', adminId)
    // 实现状态切换逻辑
    fetchAdmins()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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
    return `${Math.floor(diffDays / 7)} weeks ago`
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return <Badge className="bg-red-100 text-red-800">Super Admin</Badge>
      case 'ADMIN':
        return <Badge className="bg-blue-100 text-blue-800">Admin</Badge>
      default:
        return <Badge variant="outline">{role}</Badge>
    }
  }

  const groupedPermissions = Object.entries(permissionCategories).map(([category, label]) => ({
    category,
    label,
    permissions: allPermissions.filter(p => p.category === category)
  }))

  return (
    <CMSLayout title="Administrator Management" description="Manage admin users and their permissions">
      <div className="space-y-6">
        {/* 顶部操作栏 */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Administrators</h2>
            <p className="text-muted-foreground">
              Manage admin users and their system permissions
            </p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Icons.userPlus className="h-4 w-4 mr-2" />
                Add Administrator
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>
                    {editingAdmin ? 'Edit Administrator' : 'Add Administrator'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingAdmin 
                      ? 'Update administrator details and permissions.'
                      : 'Create a new administrator account with specific permissions.'
                    }
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-6 py-4">
                  {/* 基本信息 */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="admin@example.com"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Administrator Name"
                      />
                    </div>
                  </div>

                  {/* 角色选择 */}
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ADMIN">Administrator</SelectItem>
                        <SelectItem value="SUPER_ADMIN">Super Administrator</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 权限设置 */}
                  <div>
                    <Label className="text-base font-medium">Permissions</Label>
                    <p className="text-sm text-muted-foreground mb-4">
                      Select the permissions this administrator should have
                    </p>
                    
                    <div className="space-y-6">
                      {groupedPermissions.map(({ category, label, permissions }) => (
                        <div key={category} className="space-y-3">
                          <h4 className="font-medium text-sm">{label}</h4>
                          <div className="grid grid-cols-1 gap-2 pl-4">
                            {permissions.map((permission) => (
                              <div key={permission.id} className="flex items-start space-x-2">
                                <Checkbox
                                  id={permission.id}
                                  checked={formData.permissions.includes(permission.id)}
                                  onCheckedChange={() => handlePermissionToggle(permission.id)}
                                />
                                <div className="grid gap-1.5 leading-none">
                                  <Label 
                                    htmlFor={permission.id}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                  >
                                    {permission.name}
                                  </Label>
                                  <p className="text-xs text-muted-foreground">
                                    {permission.description}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingAdmin ? 'Update Administrator' : 'Create Administrator'}
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
              <CardTitle className="text-sm font-medium">Total Admins</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{admins.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Super Admins</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {admins.filter(a => a.role === 'SUPER_ADMIN').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {admins.filter(a => a.isActive).length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Online Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {admins.filter(a => {
                  if (!a.lastLoginAt) return false
                  const loginDate = new Date(a.lastLoginAt)
                  const today = new Date()
                  return loginDate.toDateString() === today.toDateString()
                }).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 管理员列表 */}
        <Card>
          <CardHeader>
            <CardTitle>Administrators ({admins.length})</CardTitle>
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
                    <TableHead>Administrator</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-[70px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {admins.map((admin) => (
                    <motion.tr
                      key={admin.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="group"
                    >
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={admin.avatar} />
                            <AvatarFallback>
                              {admin.name?.split(' ').map(n => n[0]).join('') || admin.email[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{admin.name || 'Unnamed Admin'}</div>
                            <div className="text-sm text-muted-foreground">{admin.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getRoleBadge(admin.role)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {admin.permissions.length} permissions
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {getRelativeTime(admin.lastLoginAt)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(admin.createdAt)}
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
                            <DropdownMenuItem onClick={() => handleEdit(admin)}>
                              <Icons.edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            {admin.role !== 'SUPER_ADMIN' && (
                              <>
                                <DropdownMenuItem onClick={() => handleToggleStatus(admin.id)}>
                                  <Icons.toggleLeft className="h-4 w-4 mr-2" />
                                  {admin.isActive ? 'Deactivate' : 'Activate'}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDelete(admin.id)}
                                  className="text-destructive"
                                >
                                  <Icons.trash className="h-4 w-4 mr-2" />
                                  Remove
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </CMSLayout>
  )
}