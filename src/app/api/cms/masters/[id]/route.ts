import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser, hasPermission, Permission, logAdminAction } from '@/lib/cms/auth'

// 获取单个达人
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

    const hasAccess = await hasPermission(Permission.VIEW_MASTERS)
    if (!hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const master = await prisma.master.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            // Note: 需要在Master模型中添加interests关系
            // interests: true
          }
        }
      }
    })

    if (!master) {
      return NextResponse.json({ error: 'Master not found' }, { status: 404 })
    }

    // 解析JSON字段
    const formattedMaster = {
      ...master,
      storyContent: master.storyContent ? JSON.parse(master.storyContent) : null,
      topClips: master.topClips ? JSON.parse(master.topClips) : [],
      missionCard: master.missionCard ? JSON.parse(master.missionCard) : null
    }

    return NextResponse.json(formattedMaster)

  } catch (error) {
    console.error('Get Master API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// 更新达人
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

    const hasAccess = await hasPermission(Permission.UPDATE_MASTERS)
    if (!hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // 检查达人是否存在
    const existingMaster = await prisma.master.findUnique({
      where: { id: params.id }
    })

    if (!existingMaster) {
      return NextResponse.json({ error: 'Master not found' }, { status: 404 })
    }

    const body = await request.json()
    
    // 验证必需字段
    if (!body.name || !body.title) {
      return NextResponse.json(
        { error: 'Name and title are required' },
        { status: 400 }
      )
    }

    // 准备更新数据
    const updateData: any = {
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
    if (updateData.tripBookingURL && !isValidURL(updateData.tripBookingURL)) {
      return NextResponse.json(
        { error: 'Invalid booking URL format' },
        { status: 400 }
      )
    }

    // 更新达人
    const master = await prisma.master.update({
      where: { id: params.id },
      data: updateData
    })

    // 记录更新操作
    await logAdminAction(
      user.id,
      'UPDATE_MASTER',
      'MASTER',
      master.id,
      { 
        name: master.name, 
        title: master.title,
        changes: getChangedFields(existingMaster, updateData)
      },
      request
    )

    return NextResponse.json(master)

  } catch (error) {
    console.error('Update Master API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// 删除达人
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

    const hasAccess = await hasPermission(Permission.DELETE_MASTERS)
    if (!hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // 检查达人是否存在
    const existingMaster = await prisma.master.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            // Note: 需要在Master模型中添加interests关系来检查依赖
            // interests: true
          }
        }
      }
    })

    if (!existingMaster) {
      return NextResponse.json({ error: 'Master not found' }, { status: 404 })
    }

    // 检查是否有依赖数据（如用户兴趣）
    const interestCount = await prisma.interest.count({
      where: { masterId: params.id }
    })

    if (interestCount > 0) {
      return NextResponse.json(
        { 
          error: 'Cannot delete master with existing user interests',
          details: `${interestCount} users have expressed interest in this master`
        },
        { status: 400 }
      )
    }

    // 软删除：设置为不活跃而不是真正删除
    const master = await prisma.master.update({
      where: { id: params.id },
      data: { isActive: false }
    })

    // 记录删除操作
    await logAdminAction(
      user.id,
      'DELETE_MASTER',
      'MASTER',
      master.id,
      { name: existingMaster.name, title: existingMaster.title },
      request
    )

    return NextResponse.json({ 
      message: 'Master deactivated successfully',
      master 
    })

  } catch (error) {
    console.error('Delete Master API Error:', error)
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