import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
import EmailProvider from 'next-auth/providers/email'
import { db } from '@/lib/db'
import { nanoid } from 'nanoid'
import { logger, reportError } from '@/lib/logger'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  
  // 认证提供者
  providers: [
    // Google OAuth 登录
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          scope: 'openid email profile',
          prompt: 'select_account',
        }
      }
    }),
    
    // Magic Link 邮件登录
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      maxAge: 10 * 60, // Magic link 有效期 10分钟
      sendVerificationRequest: async ({ identifier: email, url, provider }) => {
        const { createTransport } = await import('nodemailer')
        
        const transport = createTransport(provider.server)
        
        // 自定义邮件模板
        const html = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <title>Sign in to Tatami Labs</title>
              <style>
                body { font-family: 'Playfair Display', Georgia, serif; margin: 0; padding: 0; background-color: #fafafa; }
                .container { max-width: 600px; margin: 0 auto; background-color: white; }
                .header { background-color: #000000; color: white; padding: 40px; text-align: center; }
                .header h1 { font-family: 'Inter', sans-serif; font-size: 32px; margin: 0; font-weight: 700; }
                .content { padding: 40px; }
                .content h2 { font-size: 24px; color: #1a1a1a; margin-bottom: 20px; }
                .content p { font-size: 16px; line-height: 1.6; color: #1a1a1a; margin-bottom: 20px; }
                .button { display: inline-block; background-color: #dc2626; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-family: 'Inter', sans-serif; font-weight: 500; margin: 20px 0; }
                .footer { padding: 40px; background-color: #fafafa; text-align: center; font-size: 14px; color: #666; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Tatami Labs</h1>
                  <p style="margin: 10px 0 0 0; color: #ccc;">The Journey to Weave a Story</p>
                </div>
                <div class="content">
                  <h2>Welcome to your journey</h2>
                  <p>Click the button below to securely sign in to your Tatami Labs account. This link will expire in 10 minutes.</p>
                  <a href="${url}" class="button">Sign in to Tatami Labs</a>
                  <p style="font-size: 14px; color: #666;">If you didn't request this email, please ignore it. This link will only work once.</p>
                </div>
                <div class="footer">
                  <p>© 2025 Tatami Labs. All rights reserved.</p>
                  <p>Connecting global minds with Japan's ultimate masters</p>
                </div>
              </div>
            </body>
          </html>
        `
        
        const text = `Sign in to Tatami Labs\n\nClick the link below to sign in:\n${url}\n\nThis link will expire in 10 minutes.\n\nIf you didn't request this email, please ignore it.`
        
        await transport.sendMail({
          to: email,
          from: provider.from,
          subject: 'Sign in to Tatami Labs',
          text,
          html,
        })
      }
    }),
  ],

  // 会话配置
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // 页面配置
  pages: {
    signIn: '/auth/signin',
    verifyRequest: '/auth/verify-request',
    error: '/auth/error',
  },

  // 回调函数
  callbacks: {
    // JWT 令牌处理
    async jwt({ token, user, account }) {
      if (user && account) {
        token.userId = user.id
        token.referralCode = user.referralCode || nanoid(8)
        
        // 为新用户生成推广代码
        if (!user.referralCode && account.provider === 'google') {
          const updatedUser = await db.user.update({
            where: { id: user.id },
            data: { referralCode: nanoid(8) },
          })
          token.referralCode = updatedUser.referralCode
        }
      }
      return token
    },

    // 会话处理
    async session({ session, token }) {
      if (session.user && token.userId) {
        session.user.id = token.userId as string
        session.user.referralCode = token.referralCode as string
        
        // 获取用户的完整信息
        const user = await db.user.findUnique({
          where: { id: token.userId as string },
          include: {
            contributions: {
              orderBy: { createdAt: 'desc' },
              take: 5, // 最近5个贡献
            },
            interests: {
              orderBy: { createdAt: 'desc' },
              take: 10, // 最近10个兴趣
            },
          },
        })

        if (user) {
          session.user.locale = user.locale
          session.user.contributions = user.contributions
          session.user.interests = user.interests
        }
      }
      return session
    },

    // 登录回调
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        // Google 登录处理
        try {
          if (profile?.email) {
            // 检查是否已存在用户
            const existingUser = await db.user.findUnique({
              where: { email: profile.email }
            })

            if (!existingUser && user.email) {
              // 为新用户生成推广代码
              user.referralCode = nanoid(8)
            }
          }
          return true
        } catch (error) {
          reportError(error as Error, { provider: 'google', context: 'signIn' })
          return false
        }
      }

      if (account?.provider === 'email') {
        // Magic Link 处理
        return true
      }

      return true
    },
  },

  // 事件处理
  events: {
    async signIn(message) {
      // 记录登录事件
      logger.info('User signed in', { email: message.user.email })
      
      // 可以在这里添加用户行为分析
      if (message.user.id) {
        await db.contribution.create({
          data: {
            userId: message.user.id,
            type: 'LOGIN',
            value: 1,
            metadata: JSON.stringify({
              provider: message.account?.provider,
              timestamp: new Date().toISOString(),
            }),
          },
        }).catch(error => {
          reportError(error, { context: 'login_contribution', userId: message.user.id })
        })
      }
    },
    
    async createUser(message) {
      // 新用户注册事件
      logger.info('New user created', { email: message.user.email })
      
      // 为新用户创建欢迎贡献记录
      if (message.user.id) {
        await db.contribution.create({
          data: {
            userId: message.user.id,
            type: 'SIGNUP',
            value: 10, // 注册奖励
            metadata: JSON.stringify({
              welcomeBonus: true,
              timestamp: new Date().toISOString(),
            }),
          },
        }).catch(error => {
          reportError(error, { context: 'welcome_contribution', userId: message.user.id })
        })
      }
    },
  },

  // 调试模式（仅在开发环境）
  debug: process.env.NODE_ENV === 'development',
}