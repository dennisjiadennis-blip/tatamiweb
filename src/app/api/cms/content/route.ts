import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser, hasPermission, Permission, logAdminAction } from '@/lib/cms/auth'

// 获取内容列表
export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') // 'draft', 'published', 'review', 'archived'
    const type = searchParams.get('type') // 'article', 'guide', 'tutorial', etc.
    const sortBy = searchParams.get('sortBy') || 'updatedAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    const offset = (page - 1) * limit

    // 构建查询条件
    const where: any = {}

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { titleEn: { contains: search, mode: 'insensitive' } },
        { titleJa: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (status) {
      where.status = status
    }

    if (type) {
      where.type = type
    }

    // 获取数据
    const [content, total] = await Promise.all([
      prisma.content.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        take: limit,
        skip: offset,
        select: {
          id: true,
          title: true,
          slug: true,
          type: true,
          status: true,
          excerpt: true,
          coverImage: true,
          authorId: true,
          publishedAt: true,
          createdAt: true,
          updatedAt: true
        }
      }),
      prisma.content.count({ where })
    ])

    // 记录查看操作
    await logAdminAction(
      user.id,
      'VIEW_CONTENT',
      'CONTENT',
      undefined,
      { search, status, type, page, limit },
      request
    )

    return NextResponse.json({
      content,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Get Content API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// 创建新内容
export async function POST(request: NextRequest) {
  try {
    // 验证权限
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const hasAccess = await hasPermission(Permission.CREATE_CONTENT)
    if (!hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    
    // 验证必需字段
    if (!body.title || !body.slug || !body.content) {
      return NextResponse.json(
        { error: 'Title, slug, and content are required' },
        { status: 400 }
      )
    }

    // 检查slug唯一性
    const existingContent = await prisma.content.findUnique({
      where: { slug: body.slug }
    })

    if (existingContent) {
      return NextResponse.json(
        { error: 'Slug already exists' },
        { status: 400 }
      )
    }

    // 准备数据
    const contentData = {
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
      authorId: user.id,
      publishedAt: body.status === 'published' && body.publishedAt ? 
        new Date(body.publishedAt) : 
        (body.status === 'published' ? new Date() : null)
    }

    // 创建内容
    const content = await prisma.content.create({
      data: contentData
    })

    // 记录创建操作
    await logAdminAction(
      user.id,
      'CREATE_CONTENT',
      'CONTENT',
      content.id,
      { title: content.title, type: content.type, status: content.status },
      request
    )

    return NextResponse.json(content, { status: 201 })

  } catch (error) {
    console.error('Create Content API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}