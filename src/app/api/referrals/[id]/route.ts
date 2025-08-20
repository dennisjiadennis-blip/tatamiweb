import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

// 验证推广链接更新数据
const UpdateReferralLinkSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  targetUrl: z.string().url().optional(),
  expiresAt: z.string().datetime().optional().nullable(),
  isActive: z.boolean().optional()
})

// 获取单个推广链接详情
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const referralLink = await prisma.referralLink.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      },
      include: {
        clicks: {
          orderBy: { createdAt: 'desc' },
          take: 10, // 最近10次点击
          select: {
            id: true,
            ipAddress: true,
            country: true,
            city: true,
            device: true,
            browser: true,
            createdAt: true,
            convertedAt: true
          }
        },
        conversions: {
          orderBy: { createdAt: 'desc' },
          take: 10, // 最近10次转化
          select: {
            id: true,
            orderId: true,
            orderValue: true,
            commission: true,
            status: true,
            productType: true,
            createdAt: true
          }
        }
      }
    })

    if (!referralLink) {
      return NextResponse.json({ error: 'Referral link not found' }, { status: 404 })
    }

    // 计算统计数据
    const totalClicks = await prisma.referralClick.count({
      where: { referralId: referralLink.id }
    })

    const totalConversions = await prisma.conversion.count({
      where: { referralId: referralLink.id }
    })

    const totalEarnings = await prisma.conversion.aggregate({
      where: { 
        referralId: referralLink.id,
        status: 'CONFIRMED'
      },
      _sum: { commission: true }
    })

    const enrichedLink = {
      ...referralLink,
      clickCount: totalClicks,
      conversionCount: totalConversions,
      totalEarnings: totalEarnings._sum.commission || 0
    }

    return NextResponse.json(enrichedLink)

  } catch (error) {
    console.error('Get Referral Link API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// 更新推广链接
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = UpdateReferralLinkSchema.parse(body)

    // 检查推广链接是否存在且属于当前用户
    const existingLink = await prisma.referralLink.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })

    if (!existingLink) {
      return NextResponse.json({ error: 'Referral link not found' }, { status: 404 })
    }

    // 更新推广链接
    const updatedLink = await prisma.referralLink.update({
      where: { id: params.id },
      data: {
        ...validatedData,
        expiresAt: validatedData.expiresAt ? new Date(validatedData.expiresAt) : null
      }
    })

    // 获取统计数据
    const [totalClicks, totalConversions, totalEarnings] = await Promise.all([
      prisma.referralClick.count({
        where: { referralId: updatedLink.id }
      }),
      prisma.conversion.count({
        where: { referralId: updatedLink.id }
      }),
      prisma.conversion.aggregate({
        where: { 
          referralId: updatedLink.id,
          status: 'CONFIRMED'
        },
        _sum: { commission: true }
      })
    ])

    return NextResponse.json({
      ...updatedLink,
      clickCount: totalClicks,
      conversionCount: totalConversions,
      totalEarnings: totalEarnings._sum.commission || 0
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Update Referral Link API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// 删除推广链接
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 检查推广链接是否存在且属于当前用户
    const existingLink = await prisma.referralLink.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })

    if (!existingLink) {
      return NextResponse.json({ error: 'Referral link not found' }, { status: 404 })
    }

    // 检查是否有相关的转化记录
    const hasConversions = await prisma.conversion.findFirst({
      where: { 
        referralId: params.id,
        status: { in: ['PENDING', 'CONFIRMED'] }
      }
    })

    if (hasConversions) {
      return NextResponse.json(
        { error: 'Cannot delete referral link with active conversions' },
        { status: 400 }
      )
    }

    // 删除推广链接（级联删除点击记录）
    await prisma.referralLink.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Referral link deleted successfully' })

  } catch (error) {
    console.error('Delete Referral Link API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}