'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Icons } from '@/components/ui/icons'
import { useCurrentLocale } from '@/i18n/hooks'
import { useAuth } from '@/lib/hooks/use-auth'
import { useUserSettings } from '@/lib/hooks/use-user-settings'
import { logger } from '@/lib/logger'

interface User {
  id: string
  email: string
  name?: string
  avatar?: string
  referralCode: string
  locale?: string
  emailVerified?: Date
  createdAt: string
  updatedAt: string
}

interface UserSettingsProps {
  user: User
}

export function UserSettings({ user }: UserSettingsProps) {
  const locale = useCurrentLocale()
  const { signOut } = useAuth()
  const { updateSettings } = useUserSettings()
  
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: user.name || '',
    preferredLocale: user.locale || locale,
    bio: '',
    interests: [] as string[],
    notifications: {
      email: true,
      push: false,
      marketing: false,
      community: true
    },
    privacy: {
      showProfile: true,
      showContributions: true,
      allowMessages: true
    }
  })

  const languages = [
    { value: 'en', label: 'English', nativeLabel: 'English' },
    { value: 'ja', label: 'Japanese', nativeLabel: '日本語' },
    { value: 'zh-TW', label: 'Traditional Chinese', nativeLabel: '繁體中文' }
  ]

  const interestOptions = [
    { value: 'tea-ceremony', labelEn: 'Tea Ceremony', labelJa: '茶道', labelZh: '茶道' },
    { value: 'martial-arts', labelEn: 'Martial Arts', labelJa: '武道', labelZh: '武術' },
    { value: 'pottery', labelEn: 'Pottery', labelJa: '陶芸', labelZh: '陶藝' },
    { value: 'calligraphy', labelEn: 'Calligraphy', labelJa: '書道', labelZh: '書法' },
    { value: 'gardening', labelEn: 'Japanese Gardening', labelJa: '庭園', labelZh: '庭園設計' },
    { value: 'cooking', labelEn: 'Japanese Cuisine', labelJa: '料理', labelZh: '日式料理' },
    { value: 'philosophy', labelEn: 'Philosophy', labelJa: '哲学', labelZh: '哲學' },
    { value: 'meditation', labelEn: 'Meditation', labelJa: '瞑想', labelZh: '冥想' }
  ]

  const getInterestLabel = (interest: typeof interestOptions[0]) => {
    switch (locale) {
      case 'ja':
        return interest.labelJa
      case 'zh-TW':
        return interest.labelZh
      default:
        return interest.labelEn
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const result = await updateSettings({
        name: formData.name.trim() || undefined,
        locale: formData.preferredLocale,
        bio: formData.bio.trim() || undefined,
        preferences: {
          emailNotifications: formData.notifications.email,
          pushNotifications: formData.notifications.push,
          marketingEmails: formData.notifications.marketing,
          eventReminders: formData.notifications.community,
        }
      })
      
      if (result.success) {
        setIsEditing(false)
        logger.info('User settings saved successfully')
      } else {
        logger.warn('Failed to save user settings', { message: result.message })
      }
    } catch (error) {
      logger.error('Error saving user settings', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: user.name || '',
      preferredLocale: user.locale || locale,
      bio: '',
      interests: [],
      notifications: {
        email: true,
        push: false,
        marketing: false,
        community: true
      },
      privacy: {
        showProfile: true,
        showContributions: true,
        allowMessages: true
      }
    })
    setIsEditing(false)
  }

  const toggleInterest = (interestValue: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interestValue)
        ? prev.interests.filter(i => i !== interestValue)
        : [...prev.interests, interestValue]
    }))
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      logger.error('Sign out error', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* 个人信息 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-light">
              {locale === 'ja' ? '個人情報' : 
               locale === 'zh-TW' ? '個人資訊' : 
               'Personal Information'}
            </CardTitle>
            {!isEditing && (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Icons.settings className="h-4 w-4 mr-2" />
                {locale === 'ja' ? '編集' : 
                 locale === 'zh-TW' ? '編輯' : 
                 'Edit'}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 头像和基本信息 */}
          <div className="flex items-center space-x-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatar} alt={user.name || 'User'} />
              <AvatarFallback className="text-lg">
                {(user.name || user.email).slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">
                    {locale === 'ja' ? '名前' : 
                     locale === 'zh-TW' ? '姓名' : 
                     'Name'}
                  </Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder={locale === 'ja' ? '名前を入力' : 
                                  locale === 'zh-TW' ? '請輸入姓名' : 
                                  'Enter your name'}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground mt-1">
                      {user.name || locale === 'ja' ? '未設定' : locale === 'zh-TW' ? '未設定' : 'Not set'}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">
                    {locale === 'ja' ? 'メールアドレス' : 
                     locale === 'zh-TW' ? '電子郵件' : 
                     'Email'}
                  </Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    {user.emailVerified && (
                      <Badge variant="secondary" className="text-xs">
                        <Icons.check className="h-3 w-3 mr-1" />
                        {locale === 'ja' ? '認証済み' : 
                         locale === 'zh-TW' ? '已驗證' : 
                         'Verified'}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 语言偏好 */}
          <div>
            <Label htmlFor="language">
              {locale === 'ja' ? '言語設定' : 
               locale === 'zh-TW' ? '語言設定' : 
               'Language Preference'}
            </Label>
            {isEditing ? (
              <Select 
                value={formData.preferredLocale} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, preferredLocale: value }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map(lang => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.nativeLabel} ({lang.label})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="text-sm text-muted-foreground mt-1">
                {languages.find(l => l.value === (user.locale || locale))?.nativeLabel || 'English'}
              </p>
            )}
          </div>

          {/* 个人简介 */}
          {isEditing && (
            <div>
              <Label htmlFor="bio">
                {locale === 'ja' ? '自己紹介' : 
                 locale === 'zh-TW' ? '個人簡介' : 
                 'Bio'}
              </Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder={locale === 'ja' ? 
                  'あなたについて、興味のあることを教えてください...' :
                  locale === 'zh-TW' ?
                  '請介紹一下您自己和您的興趣...' :
                  'Tell us about yourself and your interests...'
                }
                rows={3}
              />
            </div>
          )}

          {/* 兴趣标签 */}
          {isEditing && (
            <div>
              <Label>
                {locale === 'ja' ? '興味のある分野' : 
                 locale === 'zh-TW' ? '感興趣的領域' : 
                 'Areas of Interest'}
              </Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {interestOptions.map(interest => (
                  <Badge
                    key={interest.value}
                    variant={formData.interests.includes(interest.value) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleInterest(interest.value)}
                  >
                    {getInterestLabel(interest)}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* 编辑按钮 */}
          {isEditing && (
            <div className="flex space-x-3">
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving && <Icons.spinner className="h-4 w-4 mr-2 animate-spin" />}
                {locale === 'ja' ? '保存' : 
                 locale === 'zh-TW' ? '儲存' : 
                 'Save Changes'}
              </Button>
              <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                {locale === 'ja' ? 'キャンセル' : 
                 locale === 'zh-TW' ? '取消' : 
                 'Cancel'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 通知设置 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-light">
            {locale === 'ja' ? '通知設定' : 
             locale === 'zh-TW' ? '通知設定' : 
             'Notification Settings'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>
                {locale === 'ja' ? 'メール通知' : 
                 locale === 'zh-TW' ? '電子郵件通知' : 
                 'Email Notifications'}
              </Label>
              <p className="text-sm text-muted-foreground">
                {locale === 'ja' ? '重要な更新をメールで受け取る' : 
                 locale === 'zh-TW' ? '透過電子郵件接收重要更新' : 
                 'Receive important updates via email'}
              </p>
            </div>
            <Switch
              checked={formData.notifications.email}
              onCheckedChange={(checked) => 
                setFormData(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, email: checked }
                }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>
                {locale === 'ja' ? 'コミュニティ通知' : 
                 locale === 'zh-TW' ? '社群通知' : 
                 'Community Notifications'}
              </Label>
              <p className="text-sm text-muted-foreground">
                {locale === 'ja' ? '新しいイベントやコンテンツの通知' : 
                 locale === 'zh-TW' ? '新活動和內容的通知' : 
                 'Get notified about new events and content'}
              </p>
            </div>
            <Switch
              checked={formData.notifications.community}
              onCheckedChange={(checked) => 
                setFormData(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, community: checked }
                }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>
                {locale === 'ja' ? 'マーケティング通知' : 
                 locale === 'zh-TW' ? '行銷通知' : 
                 'Marketing Communications'}
              </Label>
              <p className="text-sm text-muted-foreground">
                {locale === 'ja' ? '特別オファーと製品更新' : 
                 locale === 'zh-TW' ? '特別優惠和產品更新' : 
                 'Special offers and product updates'}
              </p>
            </div>
            <Switch
              checked={formData.notifications.marketing}
              onCheckedChange={(checked) => 
                setFormData(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, marketing: checked }
                }))
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* 隐私设置 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-light">
            {locale === 'ja' ? 'プライバシー設定' : 
             locale === 'zh-TW' ? '隱私設定' : 
             'Privacy Settings'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>
                {locale === 'ja' ? 'プロフィールを公開' : 
                 locale === 'zh-TW' ? '公開個人檔案' : 
                 'Public Profile'}
              </Label>
              <p className="text-sm text-muted-foreground">
                {locale === 'ja' ? '他のユーザーがあなたのプロフィールを見ることができます' : 
                 locale === 'zh-TW' ? '允許其他用戶查看您的個人檔案' : 
                 'Allow other users to view your profile'}
              </p>
            </div>
            <Switch
              checked={formData.privacy.showProfile}
              onCheckedChange={(checked) => 
                setFormData(prev => ({
                  ...prev,
                  privacy: { ...prev.privacy, showProfile: checked }
                }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>
                {locale === 'ja' ? '貢献統計を表示' : 
                 locale === 'zh-TW' ? '顯示貢獻統計' : 
                 'Show Contribution Stats'}
              </Label>
              <p className="text-sm text-muted-foreground">
                {locale === 'ja' ? 'あなたの貢献統計を他のユーザーに表示' : 
                 locale === 'zh-TW' ? '向其他用戶顯示您的貢獻統計' : 
                 'Display your contribution statistics to other users'}
              </p>
            </div>
            <Switch
              checked={formData.privacy.showContributions}
              onCheckedChange={(checked) => 
                setFormData(prev => ({
                  ...prev,
                  privacy: { ...prev.privacy, showContributions: checked }
                }))
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* 账户管理 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-light">
            {locale === 'ja' ? 'アカウント管理' : 
             locale === 'zh-TW' ? '帳戶管理' : 
             'Account Management'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div>
              <Label>
                {locale === 'ja' ? '紹介コード' : 
                 locale === 'zh-TW' ? '推薦代碼' : 
                 'Referral Code'}
              </Label>
              <p className="text-sm text-muted-foreground">
                {user.referralCode}
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigator.clipboard.writeText(user.referralCode)}
            >
              {locale === 'ja' ? 'コピー' : 
               locale === 'zh-TW' ? '複製' : 
               'Copy'}
            </Button>
          </div>

          <div className="pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={handleSignOut}
              className="w-full"
            >
              <Icons.logout className="h-4 w-4 mr-2" />
              {locale === 'ja' ? 'ログアウト' : 
               locale === 'zh-TW' ? '登出' : 
               'Sign Out'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}