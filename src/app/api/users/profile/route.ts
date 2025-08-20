import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authConfig } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

// 用户资料更新验证模式
const updateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  locale: z.enum(['en', 'zh-TW', 'ja']).optional(),
})

// GET - 获取用户资料
export async function GET() {
  try {
    const session = await getServerSession(authConfig)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } },
        { status: 401 }
      )
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      include: {
        contributions: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
        interests: {
          orderBy: { createdAt: 'desc' },
          take: 50,
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'User not found' } },
        { status: 404 }
      )
    }

    // 计算贡献统计
    const contributionStats = {
      total: user.contributions.length,
      referrals: user.contributions.filter(c => c.type === 'REFERRAL').length,
      bookings: user.contributions.filter(c => c.type === 'BOOKING').length,
      shares: user.contributions.filter(c => c.type === 'CONTENT_SHARE').length,
      interests: user.contributions.filter(c => c.type === 'INTEREST').length,
      totalPoints: user.contributions.reduce((sum, c) => sum + c.value, 0),
    }

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          referralCode: user.referralCode,
          locale: user.locale,
          emailVerified: user.emailVerified,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        contributions: user.contributions,
        interests: user.interests,
        stats: contributionStats,
        referralUrl: `${process.env.NEXT_PUBLIC_APP_URL}?ref=${user.referralCode}`,
      }
    })
  } catch (error) {
    console.error('Get profile error:', error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    )
  }
}

// PUT - 更新用户资料
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = updateProfileSchema.parse(body)

    const updatedUser = await db.user.update({
      where: { id: session.user.id },
      data: validatedData,
    })

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          avatar: updatedUser.avatar,
          referralCode: updatedUser.referralCode,
          locale: updatedUser.locale,
          updatedAt: updatedUser.updatedAt,
        }
      },
      message: 'Profile updated successfully'
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: error.errors } },
        { status: 400 }
      )
    }
    
    console.error('Update profile error:', error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    )
  }
}