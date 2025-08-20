'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import { CMSLayout } from '@/components/cms/layout/cms-layout'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

interface DashboardStats {
  totalUsers: number
  totalMasters: number
  totalContent: number
  totalInterests: number
  recentActivity: ActivityItem[]
  systemHealth: SystemHealth
}

interface ActivityItem {
  id: string
  action: string
  user: string
  entity: string
  timestamp: string
  status: 'success' | 'warning' | 'error'
}

interface SystemHealth {
  uptime: string
  responseTime: number
  errorRate: number
  activeUsers: number
}

export default function CMSDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setStats({
        totalUsers: 2847,
        totalMasters: 127,
        totalContent: 234,
        totalInterests: 1234,
        recentActivity: [
          {
            id: '1',
            action: 'Master Created',
            user: 'Admin User',
            entity: 'Master Yamamoto',
            timestamp: '2 minutes ago',
            status: 'success'
          },
          {
            id: '2',
            action: 'Content Published',
            user: 'Content Editor',
            entity: 'Tea Ceremony Guide',
            timestamp: '15 minutes ago',
            status: 'success'
          },
          {
            id: '3',
            action: 'User Registration',
            user: 'System',
            entity: 'sarah.chen@example.com',
            timestamp: '1 hour ago',
            status: 'success'
          },
          {
            id: '4',
            action: 'Failed Login Attempt',
            user: 'Unknown',
            entity: 'admin@tatami.com',
            timestamp: '2 hours ago',
            status: 'warning'
          }
        ],
        systemHealth: {
          uptime: '99.9%',
          responseTime: 142,
          errorRate: 0.02,
          activeUsers: 234
        }
      })
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600'
      case 'warning': return 'text-yellow-600'
      case 'error': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return Icons.checkCircle
      case 'warning': return Icons.alertTriangle
      case 'error': return Icons.xCircle
      default: return Icons.info
    }
  }

  if (loading) {
    return (
      <CMSLayout title="Dashboard" description="System overview and statistics">
        <div className="flex items-center justify-center min-h-[400px]">
          <Icons.loader2 className="h-8 w-8 animate-spin" />
        </div>
      </CMSLayout>
    )
  }

  return (
    <CMSLayout title="Dashboard" description="System overview and statistics">
      <div className="space-y-6">
        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Icons.users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalUsers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  +12.5% from last month
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Masters</CardTitle>
                <Icons.star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalMasters}</div>
                <p className="text-xs text-muted-foreground">
                  +3 new this month
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Content</CardTitle>
                <Icons.fileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalContent}</div>
                <p className="text-xs text-muted-foreground">
                  +18 published this week
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Interests</CardTitle>
                <Icons.heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalInterests.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  +8.2% from last week
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* 主要内容区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 最近活动 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Recent Activity
                  <Button variant="outline" size="sm">
                    <Icons.externalLink className="h-4 w-4 mr-2" />
                    View All
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {stats?.recentActivity.map((activity, index) => {
                  const StatusIcon = getStatusIcon(activity.status)
                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex items-center space-x-4 p-3 rounded-lg bg-accent/50"
                    >
                      <StatusIcon className={`h-5 w-5 ${getStatusColor(activity.status)}`} />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">
                          {activity.entity} by {activity.user}
                        </p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {activity.timestamp}
                      </div>
                    </motion.div>
                  )
                })}
              </CardContent>
            </Card>
          </motion.div>

          {/* 系统健康状态 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uptime</span>
                    <Badge variant="secondary">{stats?.systemHealth.uptime}</Badge>
                  </div>
                  <Progress value={99.9} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Response Time</span>
                    <span className="text-green-600">{stats?.systemHealth.responseTime}ms</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Error Rate</span>
                    <span className="text-green-600">{stats?.systemHealth.errorRate}%</span>
                  </div>
                  <Progress value={2} className="h-2" />
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Active Users</span>
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="font-bold">{stats?.systemHealth.activeUsers}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* 快速操作 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button className="h-auto p-4 flex flex-col items-center space-y-2" variant="outline">
                  <Icons.plus className="h-6 w-6" />
                  <span>Add Master</span>
                </Button>
                
                <Button className="h-auto p-4 flex flex-col items-center space-y-2" variant="outline">
                  <Icons.fileText className="h-6 w-6" />
                  <span>Create Content</span>
                </Button>
                
                <Button className="h-auto p-4 flex flex-col items-center space-y-2" variant="outline">
                  <Icons.users className="h-6 w-6" />
                  <span>Manage Users</span>
                </Button>
                
                <Button className="h-auto p-4 flex flex-col items-center space-y-2" variant="outline">
                  <Icons.barChart className="h-6 w-6" />
                  <span>View Analytics</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </CMSLayout>
  )
}