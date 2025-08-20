import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { stat } from 'fs/promises'

// 视频文件的MIME类型映射
const mimeTypes: Record<string, string> = {
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.ogg': 'video/ogg',
  '.mov': 'video/quicktime'
}

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const videoPath = params.path.join('/')
    
    // 安全检查：防止路径遍历攻击
    if (videoPath.includes('..') || videoPath.includes('~')) {
      return new NextResponse('Forbidden', { status: 403 })
    }

    // 构建文件路径 - 首先检查项目中的视频文件夹
    let filePath = join(process.cwd(), 'public', 'videos', videoPath)
    let fileExists = false
    
    try {
      await stat(filePath)
      fileExists = true
    } catch {
      // 如果项目中没有，检查外部视频文件夹
      filePath = join('/Users/dennisjia/test/faces', videoPath)
      try {
        await stat(filePath)
        fileExists = true
      } catch {
        fileExists = false
      }
    }

    if (!fileExists) {
      return new NextResponse('Video not found', { status: 404 })
    }

    // 获取文件扩展名和MIME类型
    const extension = '.' + videoPath.split('.').pop()?.toLowerCase()
    const mimeType = mimeTypes[extension] || 'video/mp4'

    // 读取文件
    const buffer = await readFile(filePath)
    const fileSize = buffer.length

    // 处理Range请求（用于视频流式传输）
    const range = request.headers.get('range')
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-')
      const start = parseInt(parts[0], 10)
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
      const chunksize = (end - start) + 1
      const chunk = buffer.slice(start, end + 1)

      return new NextResponse(chunk, {
        status: 206,
        headers: {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize.toString(),
          'Content-Type': mimeType,
          'Cache-Control': 'public, max-age=31536000, immutable'
        }
      })
    }

    // 返回完整文件
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Content-Length': fileSize.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Accept-Ranges': 'bytes'
      }
    })

  } catch (error) {
    console.error('Video serving error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}