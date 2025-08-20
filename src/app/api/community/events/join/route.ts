import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { logger, reportError } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { eventId } = body

    if (!eventId) {
      return NextResponse.json(
        { success: false, message: 'Event ID is required' },
        { status: 400 }
      )
    }

    // Check if event exists (for now, we'll simulate this)
    // In a real implementation, you'd have an Events table
    const eventData = {
      id: eventId,
      maxSpots: 20,
      currentSpots: 12,
      title: 'Virtual Tea Ceremony Workshop'
    }

    // Check if event is full
    if (eventData.currentSpots >= eventData.maxSpots) {
      return NextResponse.json(
        { success: false, message: 'Event is full' },
        { status: 400 }
      )
    }

    // Check if user is already registered (simulate check)
    // In real implementation: check EventRegistration table
    
    // Create event registration record
    // For now, we'll use the existing Contribution system to track participation
    const contribution = await db.contribution.create({
      data: {
        userId: session.user.id,
        type: 'EVENT_JOIN',
        value: 5, // Points for joining an event
        metadata: JSON.stringify({
          eventId,
          eventTitle: eventData.title,
          joinedAt: new Date().toISOString(),
        }),
      },
    })

    logger.info('User joined event', {
      userId: session.user.id,
      eventId,
      contributionId: contribution.id
    })

    return NextResponse.json({
      success: true,
      message: 'Successfully joined event',
      data: {
        eventId,
        joinedAt: contribution.createdAt,
        points: contribution.value,
      }
    })

  } catch (error) {
    reportError(error as Error, { context: 'event_join_api' })
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user's event registrations
    const eventRegistrations = await db.contribution.findMany({
      where: {
        userId: session.user.id,
        type: 'EVENT_JOIN',
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const events = eventRegistrations.map(reg => {
      const metadata = JSON.parse(reg.metadata || '{}')
      return {
        id: metadata.eventId,
        title: metadata.eventTitle,
        joinedAt: reg.createdAt,
        points: reg.value,
      }
    })

    return NextResponse.json({
      success: true,
      data: { events }
    })

  } catch (error) {
    reportError(error as Error, { context: 'get_user_events_api' })
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}