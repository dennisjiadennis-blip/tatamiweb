import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser, hasPermission, Permission, logAdminAction, UserRole } from '@/lib/cms/auth'

// 获取单个用户
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 验证权限
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const hasAccess = await hasPermission(Permission.VIEW_USERS)
    if (!hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            contributions: true,
            interests: true
          }
        },
        contributions: {
          take: 10,
          orderBy: { createdAt: 'desc' }
        },
        interests: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            master: {
              select: {
                id: true,
                name: true,
                title: true
              }
            }
          }
        }
      }
    })

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // 隐藏敏感信息
    const { permissions, ...safeUser } = targetUser

    return NextResponse.json({
      ...safeUser,
      permissions: permissions ? JSON.parse(permissions) : []
    })

  } catch (error) {
    console.error('Get User API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// 更新用户
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 验证权限
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const hasAccess = await hasPermission(Permission.UPDATE_USERS)
    if (!hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // 检查用户是否存在
    const existingUser = await prisma.user.findUnique({
      where: { id: params.id }
    })

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    
    // 验证角色权限
    if (body.role && body.role !== existingUser.role) {
      if (body.role === UserRole.SUPER_ADMIN && user.role !== UserRole.SUPER_ADMIN) {
        return NextResponse.json(
          { error: 'Only super admins can grant super admin role' },
          { status: 403 }
        )
      }
      
      if (existingUser.role === UserRole.SUPER_ADMIN && user.role !== UserRole.SUPER_ADMIN) {
        return NextResponse.json(
          { error: 'Only super admins can modify super admin accounts' },
          { status: 403 }
        )
      }
    }

    // 准备更新数据
    const updateData: any = {}
    
    if (body.name !== undefined) updateData.name = body.name
    if (body.role !== undefined) updateData.role = body.role
    if (body.isActive !== undefined) updateData.isActive = body.isActive
    if (body.locale !== undefined) updateData.locale = body.locale
    if (body.permissions !== undefined) {
      updateData.permissions = body.permissions ? JSON.stringify(body.permissions) : null
    }

    // 更新用户
    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        locale: true,
        createdAt: true,
        updatedAt: true
      }
    })

    // 记录更新操作
    await logAdminAction(
      user.id,
      'UPDATE_USER',
      'USER',
      updatedUser.id,
      { 
        email: updatedUser.email,
        changes: getChangedFields(existingUser, updateData)
      },
      request
    )

    return NextResponse.json(updatedUser)

  } catch (error) {
    console.error('Update User API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// 删除用户（软删除）
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

    const hasAccess = await hasPermission(Permission.DELETE_USERS)
    if (!hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // 检查用户是否存在
    const existingUser = await prisma.user.findUnique({
      where: { id: params.id }
    })

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // 防止删除超级管理员
    if (existingUser.role === UserRole.SUPER_ADMIN) {
      return NextResponse.json(
        { error: 'Cannot delete super admin accounts' },
        { status: 403 }
      )
    }

    // 防止自删除
    if (existingUser.id === user.id) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 403 }
      )
    }

    // 软删除：停用账户
    const deletedUser = await prisma.user.update({
      where: { id: params.id },
      data: { isActive: false }
    })

    // 记录删除操作
    await logAdminAction(
      user.id,
      'DELETE_USER',
      'USER',
      deletedUser.id,
      { email: existingUser.email, role: existingUser.role },
      request
    )

    return NextResponse.json({ 
      message: 'User deactivated successfully',
      user: {
        id: deletedUser.id,
        email: deletedUser.email,
        isActive: deletedUser.isActive
      }
    })

  } catch (error) {
    console.error('Delete User API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// 辅助函数：获取变更字段
function getChangedFields(original: any, updated: any): string[] {
  const changes: string[] = []
  
  Object.keys(updated).forEach(key => {
    if (original[key] !== updated[key]) {
      changes.push(key)
    }
  })
  
  return changes
}