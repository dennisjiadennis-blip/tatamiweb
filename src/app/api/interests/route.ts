import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authConfig } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

// 兴趣表达验证模式
const expressInterestSchema = z.object({
  masterId: z.string().min(1),
  message: z.string().max(500).optional(),
})

// GET - 获取用户兴趣列表
export async function GET() {
  try {
    const session = await getServerSession(authConfig)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } },
        { status: 401 }
      )
    }

    const interests = await db.interest.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    })

    // 获取对应的达人信息
    const masterIds = interests.map(i => i.masterId)
    const masters = await db.master.findMany({
      where: { id: { in: masterIds } },
      select: {
        id: true,
        name: true,
        nameEn: true,
        nameJa: true,
        title: true,
        titleEn: true,
        titleJa: true,
        heroImage: true,
        hasTripProduct: true,
      },
    })

    // 合并兴趣和达人信息
    const enrichedInterests = interests.map(interest => {
      const master = masters.find(m => m.id === interest.masterId)
      return {
        ...interest,
        master,
      }
    })

    return NextResponse.json({
      success: true,
      data: enrichedInterests,
      meta: {
        total: interests.length,
      }
    })
  } catch (error) {
    console.error('Get interests error:', error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    )
  }
}

// POST - 表达兴趣
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { masterId, message } = expressInterestSchema.parse(body)

    // 检查达人是否存在
    const master = await db.master.findUnique({
      where: { id: masterId, isActive: true },
    })

    if (!master) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Master not found' } },
        { status: 404 }
      )
    }

    // 检查是否已经表达过兴趣
    const existingInterest = await db.interest.findUnique({
      where: {
        userId_masterId: {
          userId: session.user.id,
          masterId: masterId,
        }
      }
    })

    if (existingInterest) {
      return NextResponse.json(
        { success: false, error: { code: 'ALREADY_EXISTS', message: 'Interest already expressed' } },
        { status: 409 }
      )
    }

    // 创建兴趣记录
    const interest = await db.interest.create({
      data: {
        userId: session.user.id,
        masterId: masterId,
        status: 'INTERESTED',
      }
    })

    // 创建贡献记录
    await db.contribution.create({
      data: {
        userId: session.user.id,
        type: 'INTEREST',
        value: 5, // 表达兴趣获得5分
        metadata: JSON.stringify({
          masterId: masterId,
          masterName: master.name,
          message: message,
          timestamp: new Date().toISOString(),
        }),
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        interest: {
          id: interest.id,
          masterId: interest.masterId,
          status: interest.status,
          createdAt: interest.createdAt,
        },
        master: {
          id: master.id,
          name: master.name,
          title: master.title,
        }
      },
      message: 'Interest expressed successfully'
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: error.errors } },
        { status: 400 }
      )
    }
    
    console.error('Express interest error:', error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    )
  }
}