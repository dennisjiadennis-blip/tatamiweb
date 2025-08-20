import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser, hasPermission, Permission, logAdminAction, UserRole } from '@/lib/cms/auth'

// 获取用户列表
export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const role = searchParams.get('role') // 'USER', 'ADMIN', 'SUPER_ADMIN'
    const status = searchParams.get('status') // 'active', 'inactive'
    const sortBy = searchParams.get('sortBy') || 'updatedAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    const offset = (page - 1) * limit

    // 构建查询条件
    const where: any = {}

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (role) {
      where.role = role
    }

    if (status === 'active') {
      where.isActive = true
    } else if (status === 'inactive') {
      where.isActive = false
    }

    // 获取数据
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          _count: {
            select: {
              contributions: true,
              interests: true
            }
          }
        },
        orderBy: { [sortBy]: sortOrder },
        take: limit,
        skip: offset,
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
          role: true,
          isActive: true,
          lastLoginAt: true,
          emailVerified: true,
          locale: true,
          createdAt: true,
          updatedAt: true,
          _count: true
        }
      }),
      prisma.user.count({ where })
    ])

    // 记录查看操作
    await logAdminAction(
      user.id,
      'VIEW_USERS',
      'USER',
      undefined,
      { search, role, status, page, limit },
      request
    )

    return NextResponse.json({
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Get Users API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// 创建新用户（管理员创建）
export async function POST(request: NextRequest) {
  try {
    // 验证权限
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const hasAccess = await hasPermission(Permission.CREATE_USERS)
    if (!hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    
    // 验证必需字段
    if (!body.email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // 检查邮箱唯一性
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      )
    }

    // 验证角色权限
    if (body.role === UserRole.SUPER_ADMIN && user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json(
        { error: 'Only super admins can create super admin accounts' },
        { status: 403 }
      )
    }

    // 准备数据
    const userData = {
      email: body.email,
      name: body.name || null,
      role: body.role || UserRole.USER,
      permissions: body.permissions ? JSON.stringify(body.permissions) : null,
      isActive: body.isActive !== undefined ? body.isActive : true,
      locale: body.locale || 'en',
      emailVerified: body.emailVerified ? new Date() : null
    }

    // 创建用户
    const newUser = await prisma.user.create({
      data: userData,
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

    // 记录创建操作
    await logAdminAction(
      user.id,
      'CREATE_USER',
      'USER',
      newUser.id,
      { email: newUser.email, role: newUser.role },
      request
    )

    return NextResponse.json(newUser, { status: 201 })

  } catch (error) {
    console.error('Create User API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}