import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authConfig } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authConfig)
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name,
          image: session.user.image,
          referralCode: session.user.referralCode,
          locale: session.user.locale || 'en',
        },
        expires: session.expires,
      }
    })
  } catch (error) {
    console.error('Session check error:', error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    )
  }
}