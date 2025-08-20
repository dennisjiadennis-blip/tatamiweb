import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser, hasPermission, Permission, logAdminAction } from '@/lib/cms/auth'

// 获取单个内容
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

    const hasAccess = await hasPermission(Permission.VIEW_CONTENT)
    if (!hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const content = await prisma.content.findUnique({
      where: { id: params.id }
    })

    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 })
    }

    return NextResponse.json(content)

  } catch (error) {
    console.error('Get Content API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// 更新内容
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

    const hasAccess = await hasPermission(Permission.UPDATE_CONTENT)
    if (!hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // 检查内容是否存在
    const existingContent = await prisma.content.findUnique({
      where: { id: params.id }
    })

    if (!existingContent) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 })
    }

    const body = await request.json()
    
    // 验证必需字段
    if (!body.title || !body.slug || !body.content) {
      return NextResponse.json(
        { error: 'Title, slug, and content are required' },
        { status: 400 }
      )
    }

    // 检查slug唯一性（排除当前内容）
    if (body.slug !== existingContent.slug) {
      const slugExists = await prisma.content.findFirst({
        where: { 
          slug: body.slug,
          id: { not: params.id }
        }
      })

      if (slugExists) {
        return NextResponse.json(
          { error: 'Slug already exists' },
          { status: 400 }
        )
      }
    }

    // 准备更新数据
    const updateData: any = {
      title: body.title,
      slug: body.slug,
      type: body.type || 'article',
      status: body.status || 'draft',
      excerpt: body.excerpt || '',
      content: body.content,
      coverImage: body.coverImage || null,
      metaTitle: body.metaTitle || null,
      metaDescription: body.metaDescription || null,
      titleEn: body.titleEn || null,
      titleJa: body.titleJa || null,
      excerptEn: body.excerptEn || null,
      excerptJa: body.excerptJa || null,
      lastEditedBy: user.id
    }

    // 处理发布时间
    if (body.status === 'published') {
      if (body.publishedAt) {
        updateData.publishedAt = new Date(body.publishedAt)
      } else if (!existingContent.publishedAt) {
        updateData.publishedAt = new Date()
      }
    } else if (body.status !== 'published') {
      updateData.publishedAt = null
    }

    // 更新内容
    const content = await prisma.content.update({
      where: { id: params.id },
      data: updateData
    })

    // 记录更新操作
    await logAdminAction(
      user.id,
      'UPDATE_CONTENT',
      'CONTENT',
      content.id,
      { 
        title: content.title,
        type: content.type,
        status: content.status,
        changes: getChangedFields(existingContent, updateData)
      },
      request
    )

    return NextResponse.json(content)

  } catch (error) {
    console.error('Update Content API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// 删除内容
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

    const hasAccess = await hasPermission(Permission.DELETE_CONTENT)
    if (!hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // 检查内容是否存在
    const existingContent = await prisma.content.findUnique({
      where: { id: params.id }
    })

    if (!existingContent) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 })
    }

    // 软删除：设置状态为archived而不是真正删除
    const content = await prisma.content.update({
      where: { id: params.id },
      data: { 
        status: 'archived',
        lastEditedBy: user.id
      }
    })

    // 记录删除操作
    await logAdminAction(
      user.id,
      'DELETE_CONTENT',
      'CONTENT',
      content.id,
      { title: existingContent.title, type: existingContent.type },
      request
    )

    return NextResponse.json({ 
      message: 'Content archived successfully',
      content 
    })

  } catch (error) {
    console.error('Delete Content API Error:', error)
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