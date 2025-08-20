import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser, hasPermission, Permission, logAdminAction, UserRole } from '@/lib/cms/auth'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// 用户模拟登录
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 验证权限
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 只有超级管理员可以模拟登录
    if (user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ error: 'Only super admins can impersonate users' }, { status: 403 })
    }

    // 检查目标用户是否存在
    const targetUser = await prisma.user.findUnique({
      where: { id: params.id }
    })

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // 防止模拟超级管理员账户
    if (targetUser.role === UserRole.SUPER_ADMIN && targetUser.id !== user.id) {
      return NextResponse.json(
        { error: 'Cannot impersonate other super admin accounts' },
        { status: 403 }
      )
    }

    // 防止模拟已停用的账户
    if (!targetUser.isActive) {
      return NextResponse.json(
        { error: 'Cannot impersonate inactive accounts' },
        { status: 403 }
      )
    }

    // 获取当前会话
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'No active session' }, { status: 401 })
    }

    // 在实际应用中，这里需要：
    // 1. 创建一个临时的模拟会话
    // 2. 存储原始管理员信息以便稍后恢复
    // 3. 重定向到用户界面
    
    // 记录模拟操作
    await logAdminAction(
      user.id,
      'IMPERSONATE_USER',
      'USER',
      targetUser.id,
      { 
        targetEmail: targetUser.email,
        targetRole: targetUser.role
      },
      request
    )

    // 更新用户最后登录时间
    await prisma.user.update({
      where: { id: targetUser.id },
      data: { lastLoginAt: new Date() }
    })

    return NextResponse.json({
      message: 'Impersonation started successfully',
      user: {
        id: targetUser.id,
        email: targetUser.email,
        name: targetUser.name,
        role: targetUser.role
      },
      // 在实际应用中返回重定向URL或会话token
      redirectUrl: '/'
    })

  } catch (error) {
    console.error('Impersonate User API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// 结束模拟登录
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 验证权限
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 在实际应用中，这里需要：
    // 1. 验证当前是否在模拟状态
    // 2. 恢复原始管理员会话
    // 3. 清理模拟会话数据

    // 记录结束模拟操作
    await logAdminAction(
      user.id,
      'END_IMPERSONATION',
      'USER',
      params.id,
      {},
      request
    )

    return NextResponse.json({
      message: 'Impersonation ended successfully',
      redirectUrl: '/cms/users'
    })

  } catch (error) {
    console.error('End Impersonation API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}