import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const search = searchParams.get('search') || ''
    const hasTripProduct = searchParams.get('hasTripProduct')
    
    const skip = (page - 1) * limit

    const where: any = {
      isActive: true,
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { nameEn: { contains: search, mode: 'insensitive' } },
        { nameJa: { contains: search, mode: 'insensitive' } },
        { title: { contains: search, mode: 'insensitive' } },
        { titleEn: { contains: search, mode: 'insensitive' } },
        { titleJa: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (hasTripProduct === 'true') {
      where.hasTripProduct = true
    } else if (hasTripProduct === 'false') {
      where.hasTripProduct = false
    }

    const [masters, totalCount] = await Promise.all([
      db.master.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { featuredOrder: 'asc' },
          { createdAt: 'desc' }
        ],
        select: {
          id: true,
          name: true,
          nameEn: true,
          nameJa: true,
          title: true,
          titleEn: true,
          titleJa: true,
          description: true,
          heroImage: true,
          profileVideo: true,
          hasTripProduct: true,
          location: true,
          locationEn: true,
          locationJa: true,
          tags: true,
          _count: {
            select: {
              interests: true
            }
          }
        },
      }),
      db.master.count({ where })
    ])

    const totalPages = Math.ceil(totalCount / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    return NextResponse.json({
      success: true,
      data: {
        masters,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
          hasNextPage,
          hasPrevPage,
        }
      }
    })
  } catch (error) {
    console.error('Get masters error:', error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    )
  }
}