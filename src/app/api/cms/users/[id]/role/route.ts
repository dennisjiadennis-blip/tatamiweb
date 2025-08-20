import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser, hasPermission, Permission, logAdminAction, UserRole } from '@/lib/cms/auth'

// 更新用户角色
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 验证权限
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { role, permissions } = body

    if (!role) {
      return NextResponse.json({ error: 'Role is required' }, { status: 400 })
    }

    // 检查管理员权限
    if (role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN) {
      const hasManageAdmins = await hasPermission(Permission.MANAGE_ADMINS)
      if (!hasManageAdmins) {
        return NextResponse.json({ error: 'No permission to manage admin roles' }, { status: 403 })
      }
    } else {
      const hasUpdateUsers = await hasPermission(Permission.UPDATE_USERS)
      if (!hasUpdateUsers) {
        return NextResponse.json({ error: 'No permission to update users' }, { status: 403 })
      }
    }

    // 检查用户是否存在
    const existingUser = await prisma.user.findUnique({
      where: { id: params.id }
    })

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // 验证角色权限
    if (role === UserRole.SUPER_ADMIN && user.role !== UserRole.SUPER_ADMIN) {
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

    // 防止自降级
    if (existingUser.id === user.id && role !== existingUser.role) {
      return NextResponse.json(
        { error: 'Cannot change your own role' },
        { status: 403 }
      )
    }

    // 准备更新数据
    const updateData: any = {
      role,
      permissions: permissions ? JSON.stringify(permissions) : null
    }

    // 更新用户角色
    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        permissions: true,
        isActive: true,
        updatedAt: true
      }
    })

    // 记录角色更改操作
    await logAdminAction(
      user.id,
      'CHANGE_USER_ROLE',
      'USER',
      updatedUser.id,
      { 
        email: updatedUser.email,
        oldRole: existingUser.role,
        newRole: role,
        permissions: permissions || []
      },
      request
    )

    return NextResponse.json({
      ...updatedUser,
      permissions: updatedUser.permissions ? JSON.parse(updatedUser.permissions) : []
    })

  } catch (error) {
    console.error('Update User Role API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}