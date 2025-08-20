import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser, hasPermission, Permission, logAdminAction } from '@/lib/cms/auth'

// 获取达人列表
export async function GET(request: NextRequest) {
  try {
    // 验证权限
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const hasAccess = await hasPermission(Permission.VIEW_MASTERS)
    if (!hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') // 'active', 'inactive', 'all'
    const sortBy = searchParams.get('sortBy') || 'updatedAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    const offset = (page - 1) * limit

    // 构建查询条件
    const where: any = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { title: { contains: search, mode: 'insensitive' } },
        { nameEn: { contains: search, mode: 'insensitive' } },
        { nameJa: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (status === 'active') {
      where.isActive = true
    } else if (status === 'inactive') {
      where.isActive = false
    }

    // 获取数据
    const [masters, total] = await Promise.all([
      prisma.master.findMany({
        where,
        include: {
          _count: {
            select: {
              // Note: 需要在Master模型中添加interests关系
              // interests: true
            }
          }
        },
        orderBy: { [sortBy]: sortOrder },
        take: limit,
        skip: offset
      }),
      prisma.master.count({ where })
    ])

    // 记录查看操作
    await logAdminAction(
      user.id,
      'VIEW_MASTERS',
      'MASTER',
      undefined,
      { search, status, page, limit },
      request
    )

    return NextResponse.json({
      masters,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Get Masters API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// 创建新达人
export async function POST(request: NextRequest) {
  try {
    // 验证权限
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const hasAccess = await hasPermission(Permission.CREATE_MASTERS)
    if (!hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    
    // 验证必需字段
    if (!body.name || !body.title) {
      return NextResponse.json(
        { error: 'Name and title are required' },
        { status: 400 }
      )
    }

    // 准备数据
    const masterData = {
      name: body.name,
      title: body.title,
      nameEn: body.nameEn || null,
      nameJa: body.nameJa || null,
      titleEn: body.titleEn || null,
      titleJa: body.titleJa || null,
      profileVideo: body.profileVideo || null,
      heroImage: body.heroImage || null,
      introVideo: body.introVideo || null,
      storyContent: body.storyContent ? JSON.stringify(body.storyContent) : null,
      topClips: body.topClips ? JSON.stringify(body.topClips) : null,
      missionCard: body.missionCard ? JSON.stringify(body.missionCard) : null,
      hasTripProduct: body.hasTripProduct || false,
      tripBookingURL: body.tripBookingURL || null,
      priority: body.priority || 0,
      isActive: body.isActive !== undefined ? body.isActive : true
    }

    // 验证URL格式
    if (masterData.tripBookingURL && !isValidURL(masterData.tripBookingURL)) {
      return NextResponse.json(
        { error: 'Invalid booking URL format' },
        { status: 400 }
      )
    }

    // 创建达人
    const master = await prisma.master.create({
      data: masterData
    })

    // 记录创建操作
    await logAdminAction(
      user.id,
      'CREATE_MASTER',
      'MASTER',
      master.id,
      { name: master.name, title: master.title },
      request
    )

    return NextResponse.json(master, { status: 201 })

  } catch (error) {
    console.error('Create Master API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// 辅助函数：验证URL格式
function isValidURL(string: string): boolean {
  try {
    new URL(string)
    return true
  } catch (_) {
    return false
  }
}