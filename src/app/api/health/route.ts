import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '0.1.0',
    checks: {
      database: 'unknown',
      memory: 'ok',
    }
  }

  // 检查数据库连接
  try {
    await prisma.$queryRaw`SELECT 1`
    health.checks.database = 'connected'
  } catch (error) {
    health.status = 'degraded'
    health.checks.database = 'disconnected'
    console.error('Database health check failed:', error)
  }

  // 检查内存使用
  const memoryUsage = process.memoryUsage()
  const memoryThreshold = 1024 * 1024 * 1024 // 1GB
  
  if (memoryUsage.heapUsed > memoryThreshold) {
    health.status = 'degraded'
    health.checks.memory = 'high'
  }

  // 返回适当的状态码
  const statusCode = health.status === 'healthy' ? 200 : 503

  return NextResponse.json(health, { status: statusCode })
}