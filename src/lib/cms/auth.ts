// CMS Authentication and Authorization Library

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { User } from '@prisma/client'

// 用户角色定义
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN'
}

// 权限定义
export enum Permission {
  // 用户管理
  VIEW_USERS = 'VIEW_USERS',
  CREATE_USERS = 'CREATE_USERS',
  UPDATE_USERS = 'UPDATE_USERS',
  DELETE_USERS = 'DELETE_USERS',
  
  // 达人管理
  VIEW_MASTERS = 'VIEW_MASTERS',
  CREATE_MASTERS = 'CREATE_MASTERS',
  UPDATE_MASTERS = 'UPDATE_MASTERS',
  DELETE_MASTERS = 'DELETE_MASTERS',
  
  // 内容管理
  VIEW_CONTENT = 'VIEW_CONTENT',
  CREATE_CONTENT = 'CREATE_CONTENT',
  UPDATE_CONTENT = 'UPDATE_CONTENT',
  DELETE_CONTENT = 'DELETE_CONTENT',
  PUBLISH_CONTENT = 'PUBLISH_CONTENT',
  
  // 系统管理
  VIEW_LOGS = 'VIEW_LOGS',
  VIEW_ANALYTICS = 'VIEW_ANALYTICS',
  MANAGE_SETTINGS = 'MANAGE_SETTINGS',
  
  // 超级管理员权限
  MANAGE_ADMINS = 'MANAGE_ADMINS',
  SYSTEM_CONFIG = 'SYSTEM_CONFIG'
}

// 角色权限映射
export const RolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.USER]: [],
  [UserRole.ADMIN]: [
    Permission.VIEW_USERS,
    Permission.VIEW_MASTERS,
    Permission.CREATE_MASTERS,
    Permission.UPDATE_MASTERS,
    Permission.VIEW_CONTENT,
    Permission.CREATE_CONTENT,
    Permission.UPDATE_CONTENT,
    Permission.DELETE_CONTENT,
    Permission.PUBLISH_CONTENT,
    Permission.VIEW_ANALYTICS
  ],
  [UserRole.SUPER_ADMIN]: Object.values(Permission)
}

// 获取当前用户会话和权限
export async function getCurrentUser(): Promise<(User & { permissions: Permission[] }) | null> {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    return null
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  if (!user || !user.isActive) {
    return null
  }

  // 获取权限
  const rolePermissions = RolePermissions[user.role as UserRole] || []
  const customPermissions = user.permissions ? 
    JSON.parse(user.permissions) as Permission[] : []
  
  const allPermissions = [...new Set([...rolePermissions, ...customPermissions])]

  return {
    ...user,
    permissions: allPermissions
  }
}

// 检查用户是否有特定权限
export async function hasPermission(permission: Permission): Promise<boolean> {
  const user = await getCurrentUser()
  
  if (!user) {
    return false
  }

  return user.permissions.includes(permission)
}

// 检查用户是否有管理员权限
export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser()
  
  if (!user) {
    return false
  }

  return user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN
}

// 检查用户是否为超级管理员
export async function isSuperAdmin(): Promise<boolean> {
  const user = await getCurrentUser()
  
  if (!user) {
    return false
  }

  return user.role === UserRole.SUPER_ADMIN
}

// 权限验证中间件
export async function requirePermission(permission: Permission) {
  const hasAccess = await hasPermission(permission)
  
  if (!hasAccess) {
    throw new Error(`Permission denied: ${permission}`)
  }
  
  return true
}

// 角色验证中间件
export async function requireRole(role: UserRole) {
  const user = await getCurrentUser()
  
  if (!user || user.role !== role) {
    throw new Error(`Role required: ${role}`)
  }
  
  return true
}

// 更新用户最后登录时间
export async function updateLastLogin(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: { lastLoginAt: new Date() }
  })
}

// 记录管理员操作日志
export async function logAdminAction(
  userId: string,
  action: string,
  entityType?: string,
  entityId?: string,
  details?: Record<string, any>,
  request?: Request
): Promise<void> {
  const ipAddress = request?.headers.get('x-forwarded-for') || 
                   request?.headers.get('x-real-ip') || 
                   'unknown'
  const userAgent = request?.headers.get('user-agent') || 'unknown'

  await prisma.adminLog.create({
    data: {
      userId,
      action,
      entityType,
      entityId,
      details: details ? JSON.stringify(details) : null,
      ipAddress,
      userAgent
    }
  })
}

// 获取管理员日志
export async function getAdminLogs(
  limit: number = 50,
  offset: number = 0,
  userId?: string,
  action?: string,
  entityType?: string
) {
  const where = {
    ...(userId && { userId }),
    ...(action && { action }),
    ...(entityType && { entityType })
  }

  const [logs, total] = await Promise.all([
    prisma.adminLog.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    }),
    prisma.adminLog.count({ where })
  ])

  return { logs, total }
}

// 创建管理员用户
export async function createAdminUser(
  email: string,
  name: string,
  role: UserRole = UserRole.ADMIN,
  customPermissions?: Permission[]
): Promise<User> {
  const user = await prisma.user.create({
    data: {
      email,
      name,
      role,
      permissions: customPermissions ? JSON.stringify(customPermissions) : null,
      emailVerified: new Date()
    }
  })

  return user
}

// 更新用户权限
export async function updateUserPermissions(
  userId: string,
  role?: UserRole,
  customPermissions?: Permission[]
): Promise<User> {
  const updateData: any = {}
  
  if (role) {
    updateData.role = role
  }
  
  if (customPermissions) {
    updateData.permissions = JSON.stringify(customPermissions)
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: updateData
  })

  return user
}

// 禁用/启用用户
export async function toggleUserStatus(userId: string, isActive: boolean): Promise<User> {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { isActive }
  })

  return user
}

// 验证用户访问权限中间件
export async function verifyAdminAccess() {
  const user = await getCurrentUser()
  
  if (!user) {
    throw new Error('Authentication required')
  }

  if (user.role === UserRole.USER) {
    throw new Error('Admin access required')
  }

  return user
}