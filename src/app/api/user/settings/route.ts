import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { logger, reportError } from '@/lib/logger'

interface UserSettings {
  name?: string
  email?: string
  bio?: string
  location?: string
  locale?: string
  preferences?: {
    emailNotifications?: boolean
    pushNotifications?: boolean
    marketingEmails?: boolean
    eventReminders?: boolean
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

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        location: true,
        locale: true,
        createdAt: true,
        updatedAt: true,
      }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    // Get user preferences (stored as JSON in metadata or separate preferences table)
    const preferences = {
      emailNotifications: true,
      pushNotifications: false,
      marketingEmails: false,
      eventReminders: true,
    }

    return NextResponse.json({
      success: true,
      data: {
        ...user,
        preferences,
      }
    })

  } catch (error) {
    reportError(error as Error, { context: 'get_user_settings_api' })
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body: UserSettings = await request.json()
    
    // Validate input
    const allowedFields = ['name', 'bio', 'location', 'locale', 'preferences']
    const updateData: any = {}

    for (const [key, value] of Object.entries(body)) {
      if (allowedFields.includes(key) && value !== undefined) {
        if (key === 'name' && typeof value === 'string' && value.trim().length > 0) {
          updateData.name = value.trim()
        } else if (key === 'bio' && typeof value === 'string') {
          updateData.bio = value.trim() || null
        } else if (key === 'location' && typeof value === 'string') {
          updateData.location = value.trim() || null
        } else if (key === 'locale' && ['en', 'ja', 'zh-TW'].includes(value as string)) {
          updateData.locale = value
        }
        // Preferences would be handled separately in a real app
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, message: 'No valid fields to update' },
        { status: 400 }
      )
    }

    const updatedUser = await db.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        location: true,
        locale: true,
        updatedAt: true,
      }
    })

    // Log the settings update
    logger.info('User settings updated', {
      userId: session.user.id,
      updatedFields: Object.keys(updateData),
    })

    // Create contribution record for profile update
    await db.contribution.create({
      data: {
        userId: session.user.id,
        type: 'PROFILE_UPDATE',
        value: 2, // Points for updating profile
        metadata: JSON.stringify({
          updatedFields: Object.keys(updateData),
          timestamp: new Date().toISOString(),
        }),
      },
    }).catch(error => {
      // Don't fail the request if contribution logging fails
      reportError(error, { context: 'profile_update_contribution' })
    })

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
      data: updatedUser
    })

  } catch (error) {
    reportError(error as Error, { context: 'update_user_settings_api' })
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}