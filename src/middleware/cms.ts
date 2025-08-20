import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { prisma } from '@/lib/db'
import { UserRole } from '@/lib/cms/auth'

// CMS路由保护中间件
export async function withCMSAuth(
  request: NextRequest,
  requiredRole: UserRole = UserRole.ADMIN
) {
  try {
    // 获取JWT token
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET 
    })

    if (!token?.email) {
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }

    // 验证用户权限
    const user = await prisma.user.findUnique({
      where: { email: token.email }
    })

    if (!user || !user.isActive) {
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }

    // 检查角色权限
    const userRole = user.role as UserRole
    
    if (userRole === UserRole.USER) {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }

    if (requiredRole === UserRole.SUPER_ADMIN && userRole !== UserRole.SUPER_ADMIN) {
      return NextResponse.redirect(new URL('/cms/unauthorized', request.url))
    }

    // 添加用户信息到请求头
    const response = NextResponse.next()
    response.headers.set('x-user-id', user.id)
    response.headers.set('x-user-role', user.role)
    response.headers.set('x-user-email', user.email)

    return response

  } catch (error) {
    console.error('CMS Auth Middleware Error:', error)
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }
}

// API路由权限验证
export async function withAPIAuth(
  request: NextRequest,
  requiredRole: UserRole = UserRole.ADMIN
) {
  try {
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET 
    })

    if (!token?.email) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: token.email }
    })

    if (!user || !user.isActive) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const userRole = user.role as UserRole
    
    if (userRole === UserRole.USER) {
      return new NextResponse('Forbidden', { status: 403 })
    }

    if (requiredRole === UserRole.SUPER_ADMIN && userRole !== UserRole.SUPER_ADMIN) {
      return new NextResponse('Forbidden', { status: 403 })
    }

    return null // 继续处理请求

  } catch (error) {
    console.error('API Auth Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}