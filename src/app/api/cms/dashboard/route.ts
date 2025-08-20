import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser, hasPermission, Permission } from '@/lib/cms/auth'

export async function GET(request: NextRequest) {
  try {
    // 验证用户权限
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const hasAccess = await hasPermission(Permission.VIEW_ANALYTICS)
    if (!hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // 获取统计数据
    const [
      totalUsers,
      totalMasters,
      totalContent,
      totalInterests,
      recentUsers,
      recentContent,
      recentAdminLogs
    ] = await Promise.all([
      // 总用户数
      prisma.user.count(),
      
      // 总达人数
      prisma.master.count({ where: { isActive: true } }),
      
      // 总内容数
      prisma.content.count(),
      
      // 总兴趣表达数
      prisma.interest.count(),
      
      // 最近注册用户
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, email: true, createdAt: true }
      }),
      
      // 最近发布内容
      prisma.content.findMany({
        take: 5,
        orderBy: { updatedAt: 'desc' },
        select: { id: true, title: true, status: true, updatedAt: true }
      }),
      
      // 最近管理员操作
      prisma.adminLog.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { name: true, email: true }
          }
        }
      })
    ])

    // 计算增长趋势（过去30天 vs 前30天）
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const sixtyDaysAgo = new Date()
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60)

    const [
      usersLast30Days,
      usersPrevious30Days,
      interestsLast30Days,
      interestsPrevious30Days
    ] = await Promise.all([
      prisma.user.count({
        where: { createdAt: { gte: thirtyDaysAgo } }
      }),
      prisma.user.count({
        where: { 
          createdAt: { 
            gte: sixtyDaysAgo,
            lt: thirtyDaysAgo
          }
        }
      }),
      prisma.interest.count({
        where: { createdAt: { gte: thirtyDaysAgo } }
      }),
      prisma.interest.count({
        where: { 
          createdAt: { 
            gte: sixtyDaysAgo,
            lt: thirtyDaysAgo
          }
        }
      })
    ])

    // 计算增长百分比
    const userGrowth = usersPrevious30Days > 0 
      ? ((usersLast30Days - usersPrevious30Days) / usersPrevious30Days * 100).toFixed(1)
      : '0'
    
    const interestGrowth = interestsPrevious30Days > 0
      ? ((interestsLast30Days - interestsPrevious30Days) / interestsPrevious30Days * 100).toFixed(1)
      : '0'

    // 格式化活动数据
    const recentActivity = recentAdminLogs.map(log => ({
      id: log.id,
      action: log.action,
      user: log.user.name || log.user.email,
      entity: log.entityType || 'System',
      timestamp: getRelativeTime(log.createdAt),
      status: getActivityStatus(log.action)
    }))

    // 模拟系统健康状态（实际应用中应该从监控系统获取）
    const systemHealth = {
      uptime: '99.9%',
      responseTime: Math.floor(Math.random() * 50) + 100, // 100-150ms
      errorRate: Number((Math.random() * 0.1).toFixed(3)), // 0-0.1%
      activeUsers: Math.floor(Math.random() * 100) + 200 // 200-300
    }

    const dashboardData = {
      stats: {
        totalUsers,
        totalMasters,
        totalContent,
        totalInterests,
        userGrowth: Number(userGrowth),
        interestGrowth: Number(interestGrowth)
      },
      recentActivity,
      systemHealth,
      recentUsers: recentUsers.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt.toISOString()
      })),
      recentContent: recentContent.map(content => ({
        id: content.id,
        title: content.title,
        status: content.status,
        updatedAt: content.updatedAt.toISOString()
      }))
    }

    return NextResponse.json(dashboardData)

  } catch (error) {
    console.error('Dashboard API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// 辅助函数：获取相对时间
function getRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} minutes ago`
  if (diffHours < 24) return `${diffHours} hours ago`
  if (diffDays < 30) return `${diffDays} days ago`
  
  return date.toLocaleDateString()
}

// 辅助函数：获取活动状态
function getActivityStatus(action: string): 'success' | 'warning' | 'error' {
  if (action.includes('CREATE') || action.includes('UPDATE') || action.includes('LOGIN')) {
    return 'success'
  }
  if (action.includes('DELETE') || action.includes('FAILED')) {
    return 'error'
  }
  return 'warning'
}