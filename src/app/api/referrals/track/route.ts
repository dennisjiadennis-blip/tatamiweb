import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { headers } from 'next/headers'
import { UAParser } from 'ua-parser-js'

// 追踪推广链接点击
export async function POST(request: NextRequest) {
  try {
    const { referralCode, targetUrl } = await request.json()
    
    if (!referralCode) {
      return NextResponse.json({ error: 'Referral code is required' }, { status: 400 })
    }

    // 查找推广链接
    const referralLink = await prisma.referralLink.findUnique({
      where: { code: referralCode },
      include: { user: true }
    })

    if (!referralLink) {
      return NextResponse.json({ error: 'Invalid referral code' }, { status: 404 })
    }

    // 检查链接是否有效
    if (!referralLink.isActive) {
      return NextResponse.json({ error: 'Referral link is inactive' }, { status: 400 })
    }

    // 检查是否已过期
    if (referralLink.expiresAt && new Date() > referralLink.expiresAt) {
      return NextResponse.json({ error: 'Referral link has expired' }, { status: 400 })
    }

    // 获取请求信息
    const headersList = headers()
    const ipAddress = headersList.get('x-forwarded-for') || 
                     headersList.get('x-real-ip') || 
                     request.ip || 
                     '127.0.0.1'
    const userAgent = headersList.get('user-agent') || ''
    const referer = headersList.get('referer') || ''

    // 解析用户代理
    const parser = new UAParser(userAgent)
    const device = parser.getDevice()
    const browser = parser.getBrowser()
    const os = parser.getOS()

    // 地理位置信息 (需要集成地理位置API服务)
    let country = null
    let city = null
    
    // 这里可以集成如MaxMind GeoIP或ipapi.co等服务
    // 示例实现：
    try {
      // const geoResponse = await fetch(`http://ip-api.com/json/${ipAddress}`)
      // const geoData = await geoResponse.json()
      // country = geoData.country
      // city = geoData.city
    } catch (error) {
      console.warn('Failed to get geolocation:', error)
    }

    // 记录点击
    const clickRecord = await prisma.referralClick.create({
      data: {
        referralId: referralLink.id,
        ipAddress: ipAddress.split(',')[0], // 取第一个IP
        userAgent,
        referer,
        country,
        city,
        device: device.vendor && device.model ? `${device.vendor} ${device.model}` : device.type || 'Unknown',
        browser: browser.name && browser.version ? `${browser.name} ${browser.version}` : 'Unknown'
      }
    })

    // 更新推广链接点击计数
    await prisma.referralLink.update({
      where: { id: referralLink.id },
      data: {
        clickCount: {
          increment: 1
        }
      }
    })

    // 记录贡献
    await prisma.contribution.create({
      data: {
        userId: referralLink.userId,
        type: 'REFERRAL_CLICK',
        value: 1, // 1点击 = 1分
        metadata: JSON.stringify({
          referralCode,
          targetUrl,
          ipAddress: ipAddress.split(',')[0],
          userAgent,
          browser: browser.name,
          device: device.type
        }),
        referralId: referralLink.id
      }
    })

    // 返回重定向URL
    const redirectUrl = targetUrl || referralLink.targetUrl || '/'
    
    return NextResponse.json({
      success: true,
      redirectUrl,
      clickId: clickRecord.id
    })

  } catch (error) {
    console.error('Track Referral Click API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// 获取推广链接统计信息
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const referralCode = searchParams.get('code')
    const days = parseInt(searchParams.get('days') || '30')

    if (!referralCode) {
      return NextResponse.json({ error: 'Referral code is required' }, { status: 400 })
    }

    const referralLink = await prisma.referralLink.findUnique({
      where: { code: referralCode }
    })

    if (!referralLink) {
      return NextResponse.json({ error: 'Invalid referral code' }, { status: 404 })
    }

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // 获取统计数据
    const [totalClicks, totalConversions, recentClicks, clicksByCountry, clicksByDevice] = await Promise.all([
      // 总点击数
      prisma.referralClick.count({
        where: {
          referralId: referralLink.id,
          createdAt: { gte: startDate }
        }
      }),
      
      // 总转化数
      prisma.conversion.count({
        where: {
          referralId: referralLink.id,
          createdAt: { gte: startDate }
        }
      }),
      
      // 按天分组的点击数
      prisma.$queryRaw`
        SELECT DATE(createdAt) as date, COUNT(*) as clicks
        FROM referral_clicks 
        WHERE referralId = ${referralLink.id} 
        AND createdAt >= ${startDate}
        GROUP BY DATE(createdAt)
        ORDER BY date DESC
      `,
      
      // 按国家分组的点击数
      prisma.referralClick.groupBy({
        by: ['country'],
        where: {
          referralId: referralLink.id,
          createdAt: { gte: startDate },
          country: { not: null }
        },
        _count: true,
        orderBy: { _count: { country: 'desc' } }
      }),
      
      // 按设备分组的点击数
      prisma.referralClick.groupBy({
        by: ['device'],
        where: {
          referralId: referralLink.id,
          createdAt: { gte: startDate },
          device: { not: null }
        },
        _count: true,
        orderBy: { _count: { device: 'desc' } }
      })
    ])

    const conversionRate = totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(2) : '0.00'

    return NextResponse.json({
      totalClicks,
      totalConversions,
      conversionRate,
      dailyClicks: recentClicks,
      clicksByCountry: clicksByCountry.map(item => ({
        country: item.country,
        clicks: item._count
      })),
      clicksByDevice: clicksByDevice.map(item => ({
        device: item.device,
        clicks: item._count
      }))
    })

  } catch (error) {
    console.error('Get Referral Stats API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}