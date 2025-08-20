import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser, hasPermission, Permission, logAdminAction } from '@/lib/cms/auth'

// 更新内容状态
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
    const { status } = body

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 })
    }

    // 检查发布权限
    if (status === 'published') {
      const hasPublishAccess = await hasPermission(Permission.PUBLISH_CONTENT)
      if (!hasPublishAccess) {
        return NextResponse.json({ error: 'No permission to publish content' }, { status: 403 })
      }
    } else {
      const hasUpdateAccess = await hasPermission(Permission.UPDATE_CONTENT)
      if (!hasUpdateAccess) {
        return NextResponse.json({ error: 'No permission to update content' }, { status: 403 })
      }
    }

    // 检查内容是否存在
    const existingContent = await prisma.content.findUnique({
      where: { id: params.id }
    })

    if (!existingContent) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 })
    }

    // 准备更新数据
    const updateData: any = {
      status,
      lastEditedBy: user.id
    }

    // 如果发布，设置发布时间
    if (status === 'published' && !existingContent.publishedAt) {
      updateData.publishedAt = new Date()
    } else if (status !== 'published') {
      updateData.publishedAt = null
    }

    // 更新内容状态
    const content = await prisma.content.update({
      where: { id: params.id },
      data: updateData
    })

    // 记录状态更改操作
    await logAdminAction(
      user.id,
      'CHANGE_CONTENT_STATUS',
      'CONTENT',
      content.id,
      { 
        title: content.title,
        oldStatus: existingContent.status,
        newStatus: status
      },
      request
    )

    return NextResponse.json(content)

  } catch (error) {
    console.error('Update Content Status API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}