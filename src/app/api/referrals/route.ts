import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

// 验证推广链接创建数据
const CreateReferralLinkSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(), 
  targetUrl: z.string().url(),
  expiresAt: z.string().datetime().optional(),
  isActive: z.boolean().default(true)
})

// 获取用户的推广链接列表
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search')
    const status = searchParams.get('status') // 'active', 'inactive', 'expired'

    const skip = (page - 1) * limit

    // 构建查询条件
    const where: any = {
      userId: session.user.id
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (status === 'active') {
      where.isActive = true
      where.OR = [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } }
      ]
    } else if (status === 'inactive') {
      where.isActive = false
    } else if (status === 'expired') {
      where.expiresAt = { lte: new Date() }
    }

    const [referralLinks, total] = await Promise.all([
      prisma.referralLink.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          clicks: {
            select: {
              id: true,
              createdAt: true,
              convertedAt: true
            }
          },
          conversions: {
            select: {
              id: true,
              orderValue: true,
              commission: true,
              status: true,
              createdAt: true
            }
          }
        }
      }),
      prisma.referralLink.count({ where })
    ])

    // 计算统计数据
    const enrichedLinks = referralLinks.map(link => {
      const totalClicks = link.clicks.length
      const totalConversions = link.conversions.length
      const totalEarnings = link.conversions
        .filter(c => c.status === 'CONFIRMED')
        .reduce((sum, c) => sum + c.commission, 0)
      
      return {
        ...link,
        clickCount: totalClicks,
        conversionCount: totalConversions,
        totalEarnings,
        clicks: undefined, // 不返回详细点击数据
        conversions: undefined // 不返回详细转化数据
      }
    })

    return NextResponse.json({
      referralLinks: enrichedLinks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Get Referral Links API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// 创建新的推广链接
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = CreateReferralLinkSchema.parse(body)

    // 生成唯一的推广代码
    const generateCode = () => {
      return `REF${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    }

    let code = generateCode()
    
    // 确保代码唯一性
    let existingLink = await prisma.referralLink.findUnique({
      where: { code }
    })
    
    while (existingLink) {
      code = generateCode()
      existingLink = await prisma.referralLink.findUnique({
        where: { code }
      })
    }

    // 创建推广链接
    const referralLink = await prisma.referralLink.create({
      data: {
        userId: session.user.id,
        code,
        name: validatedData.name,
        description: validatedData.description,
        targetUrl: validatedData.targetUrl,
        expiresAt: validatedData.expiresAt ? new Date(validatedData.expiresAt) : null,
        isActive: validatedData.isActive
      }
    })

    return NextResponse.json({
      ...referralLink,
      clickCount: 0,
      conversionCount: 0,
      totalEarnings: 0
    }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Create Referral Link API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}