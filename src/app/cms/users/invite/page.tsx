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

interface InviteFormData {
  email: string
  name: string
  role: string
  sendWelcomeEmail: boolean
  customMessage: string
  permissions: string[]
}

export default function InviteUserPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<InviteFormData>({
    email: '',
    name: '',
    role: 'USER',
    sendWelcomeEmail: true,
    customMessage: '',
    permissions: []
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [emailList, setEmailList] = useState<string[]>([''])

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
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

  const handleEmailListChange = (index: number, value: string) => {
    const newEmailList = [...emailList]
    newEmailList[index] = value
    setEmailList(newEmailList)
  }

  const addEmailField = () => {
    setEmailList([...emailList, ''])
  }

  const removeEmailField = (index: number) => {
    if (emailList.length > 1) {
      const newEmailList = emailList.filter((_, i) => i !== index)
      setEmailList(newEmailList)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // 单个邀请验证
    if (formData.email) {
      if (!isValidEmail(formData.email)) {
        newErrors.email = 'Please enter a valid email address'
      }
    }

    // 批量邀请验证
    if (emailList.some(email => email.trim())) {
      const invalidEmails = emailList.filter(email => email.trim() && !isValidEmail(email))
      if (invalidEmails.length > 0) {
        newErrors.emailList = 'Please enter valid email addresses'
      }
    }

    // 至少需要一个邮箱
    const hasEmail = formData.email.trim()
    const hasEmailList = emailList.some(email => email.trim())
    
    if (!hasEmail && !hasEmailList) {
      newErrors.email = 'At least one email address is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      // 准备邀请数据
      const invites = []
      
      // 单个邀请
      if (formData.email.trim()) {
        invites.push({
          email: formData.email,
          name: formData.name,
          role: formData.role,
          permissions: formData.permissions
        })
      }
      
      // 批量邀请
      const validEmails = emailList.filter(email => email.trim() && isValidEmail(email))
      validEmails.forEach(email => {
        if (email !== formData.email) { // 避免重复
          invites.push({
            email: email,
            name: '',
            role: formData.role,
            permissions: formData.permissions
          })
        }
      })

      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      console.log('Sending invites:', {
        invites,
        sendWelcomeEmail: formData.sendWelcomeEmail,
        customMessage: formData.customMessage
      })
      
      // 成功后跳转到用户列表
      router.push('/cms/users?invited=true')
    } catch (error) {
      console.error('Failed to send invites:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel? All entered information will be lost.')) {
      router.back()
    }
  }

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

  return (
    <CMSLayout title="Invite Users" description="Send invitations to new users">
      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 主要表单 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 单个邀请 */}
            <Card>
              <CardHeader>
                <CardTitle>Single Invitation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="user@example.com"
                      className={errors.email ? 'border-destructive' : ''}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive mt-1">{errors.email}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="name">Full Name (Optional)</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="User Name"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USER">User</SelectItem>
                      <SelectItem value="ADMIN">Administrator</SelectItem>
                      <SelectItem value="SUPER_ADMIN">Super Administrator</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="mt-2">
                    {getRoleBadge(formData.role)}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 批量邀请 */}
            <Card>
              <CardHeader>
                <CardTitle>Bulk Invitation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Add multiple email addresses to send invitations in bulk. All users will receive the same role.
                </p>
                
                <div className="space-y-2">
                  {emailList.map((email, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => handleEmailListChange(index, e.target.value)}
                        placeholder={`Email ${index + 1}`}
                        className={errors.emailList ? 'border-destructive' : ''}
                      />
                      {emailList.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeEmailField(index)}
                        >
                          <Icons.trash className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                {errors.emailList && (
                  <p className="text-sm text-destructive">{errors.emailList}</p>
                )}

                <Button
                  type="button"
                  variant="outline"
                  onClick={addEmailField}
                  className="w-full"
                >
                  <Icons.plus className="h-4 w-4 mr-2" />
                  Add Another Email
                </Button>
              </CardContent>
            </Card>

            {/* 邮件设置 */}
            <Card>
              <CardHeader>
                <CardTitle>Email Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="sendWelcomeEmail"
                    checked={formData.sendWelcomeEmail}
                    onCheckedChange={(checked) => handleInputChange('sendWelcomeEmail', checked)}
                  />
                  <Label htmlFor="sendWelcomeEmail">Send welcome email</Label>
                </div>

                <div>
                  <Label htmlFor="customMessage">Custom Message (Optional)</Label>
                  <Textarea
                    id="customMessage"
                    value={formData.customMessage}
                    onChange={(e) => handleInputChange('customMessage', e.target.value)}
                    placeholder="Add a personal message to the invitation email..."
                    className="min-h-[100px]"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    This message will be included in the invitation email
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 侧边栏 */}
          <div className="space-y-6">
            {/* 邀请预览 */}
            <Card>
              <CardHeader>
                <CardTitle>Invitation Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm space-y-2">
                  <div>
                    <strong>Subject:</strong> You're invited to join Tatami Labs
                  </div>
                  <div>
                    <strong>Role:</strong> {getRoleBadge(formData.role)}
                  </div>
                  <div>
                    <strong>From:</strong> Tatami Labs Admin
                  </div>
                </div>

                {formData.customMessage && (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium mb-1">Custom Message:</p>
                    <p className="text-sm text-muted-foreground italic">
                      "{formData.customMessage}"
                    </p>
                  </div>
                )}

                <div className="text-xs text-muted-foreground">
                  Recipients will receive a secure link to set up their account
                </div>
              </CardContent>
            </Card>

            {/* 操作按钮 */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? (
                      <>
                        <Icons.loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sending Invitations...
                      </>
                    ) : (
                      <>
                        <Icons.send className="h-4 w-4 mr-2" />
                        Send Invitations
                      </>
                    )}
                  </Button>
                  
                  <Button type="button" variant="outline" onClick={handleCancel} className="w-full">
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 帮助信息 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">💡 Tips</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-2">
                <p>• Invited users will receive a secure link via email</p>
                <p>• Links expire after 7 days for security</p>
                <p>• Users can set their own passwords during setup</p>
                <p>• You can resend invitations if needed</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </CMSLayout>
  )
}