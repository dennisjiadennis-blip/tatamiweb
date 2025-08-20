import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

interface RouteContext {
  params: { id: string }
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = params

    const master = await db.master.findUnique({
      where: { 
        id,
        isActive: true
      },
      include: {
        interests: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            }
          }
        },
        _count: {
          select: {
            interests: true
          }
        }
      }
    })

    if (!master) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Master not found' } },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        master: {
          id: master.id,
          name: master.name,
          nameEn: master.nameEn,
          nameJa: master.nameJa,
          title: master.title,
          titleEn: master.titleEn,
          titleJa: master.titleJa,
          description: master.description,
          descriptionEn: master.descriptionEn,
          descriptionJa: master.descriptionJa,
          bio: master.bio,
          bioEn: master.bioEn,
          bioJa: master.bioJa,
          heroImage: master.heroImage,
          profileVideo: master.profileVideo,
          galleryImages: master.galleryImages,
          location: master.location,
          locationEn: master.locationEn,
          locationJa: master.locationJa,
          tags: master.tags,
          philosophy: master.philosophy,
          philosophyEn: master.philosophyEn,
          philosophyJa: master.philosophyJa,
          expertise: master.expertise,
          expertiseEn: master.expertiseEn,
          expertiseJa: master.expertiseJa,
          achievements: master.achievements,
          achievementsEn: master.achievementsEn,
          achievementsJa: master.achievementsJa,
          hasTripProduct: master.hasTripProduct,
          tripPrice: master.tripPrice,
          tripDuration: master.tripDuration,
          tripDescription: master.tripDescription,
          tripDescriptionEn: master.tripDescriptionEn,
          tripDescriptionJa: master.tripDescriptionJa,
          contactEmail: master.contactEmail,
          socialLinks: master.socialLinks,
          availableSlots: master.availableSlots,
          createdAt: master.createdAt,
          updatedAt: master.updatedAt,
        },
        stats: {
          interestCount: master._count.interests,
        },
        recentInterests: master.interests.map(interest => ({
          id: interest.id,
          createdAt: interest.createdAt,
          user: interest.user
        }))
      }
    })
  } catch (error) {
    console.error('Get master error:', error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    )
  }
}