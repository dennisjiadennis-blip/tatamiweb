import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    // Return null for unauthenticated users with 200 status
    // This prevents NextAuth client errors while maintaining security
    if (!session) {
      return NextResponse.json(null, { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, max-age=0',
        }
      })
    }

    // Return session data for authenticated users
    return NextResponse.json({
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        image: session.user.image,
        referralCode: session.user.referralCode,
        locale: session.user.locale || 'en',
      },
      expires: session.expires,
    }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0',
      }
    })
  } catch (error) {
    // Return null instead of error to prevent client-side error logs
    return NextResponse.json(null, { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0',
      }
    })
  }
}