'use client'

export default function FeaturesPage() {
  return (
    <div style={{ 
      minHeight: '100vh',
      fontFamily: 'system-ui, sans-serif',
      backgroundColor: '#000',
      color: '#fff',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
            Tatami Labs 功能展示
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#ccc' }}>
            探索我们开发的所有功能模块
          </p>
        </header>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          {/* 用户认证系统 */}
          <div style={{ 
            backgroundColor: '#1a1a1a', 
            border: '1px solid #333', 
            borderRadius: '0.75rem',
            padding: '1.5rem',
            transition: 'all 0.3s ease'
          }}>
            <h3 style={{ color: '#dc2626', fontSize: '1.25rem', marginBottom: '1rem' }}>
              🔐 用户认证系统
            </h3>
            <p style={{ color: '#ccc', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Google OAuth 和 Magic Link 认证，完整的用户管理流程
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <a href="/api/auth/signin" style={{ 
                padding: '0.5rem 1rem', 
                backgroundColor: '#dc2626', 
                color: 'white', 
                textDecoration: 'none',
                borderRadius: '0.25rem',
                fontSize: '0.8rem'
              }}>登录页面</a>
              <a href="/api/auth/session" style={{ 
                padding: '0.5rem 1rem', 
                backgroundColor: '#1e3a8a', 
                color: 'white', 
                textDecoration: 'none',
                borderRadius: '0.25rem',
                fontSize: '0.8rem'
              }}>会话状态</a>
            </div>
          </div>

          {/* CMS后台管理 */}
          <div style={{ 
            backgroundColor: '#1a1a1a', 
            border: '1px solid #333', 
            borderRadius: '0.75rem',
            padding: '1.5rem'
          }}>
            <h3 style={{ color: '#dc2626', fontSize: '1.25rem', marginBottom: '1rem' }}>
              ⚙️ CMS后台管理
            </h3>
            <p style={{ color: '#ccc', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              完整的内容管理系统，支持用户管理、内容发布、权限控制
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <a href="/cms" style={{ 
                padding: '0.5rem 1rem', 
                backgroundColor: '#dc2626', 
                color: 'white', 
                textDecoration: 'none',
                borderRadius: '0.25rem',
                fontSize: '0.8rem'
              }}>CMS首页</a>
              <a href="/cms/masters" style={{ 
                padding: '0.5rem 1rem', 
                backgroundColor: '#1e3a8a', 
                color: 'white', 
                textDecoration: 'none',
                borderRadius: '0.25rem',
                fontSize: '0.8rem'
              }}>达人管理</a>
              <a href="/cms/users" style={{ 
                padding: '0.5rem 1rem', 
                backgroundColor: '#059669', 
                color: 'white', 
                textDecoration: 'none',
                borderRadius: '0.25rem',
                fontSize: '0.8rem'
              }}>用户管理</a>
            </div>
          </div>

          {/* API接口展示 */}
          <div style={{ 
            backgroundColor: '#1a1a1a', 
            border: '1px solid #333', 
            borderRadius: '0.75rem',
            padding: '1.5rem'
          }}>
            <h3 style={{ color: '#dc2626', fontSize: '1.25rem', marginBottom: '1rem' }}>
              🔌 API接口系统
            </h3>
            <p style={{ color: '#ccc', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              RESTful API接口，支持达人数据、用户管理、推广追踪等
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <a href="/api/masters" style={{ 
                padding: '0.5rem 1rem', 
                backgroundColor: '#dc2626', 
                color: 'white', 
                textDecoration: 'none',
                borderRadius: '0.25rem',
                fontSize: '0.8rem'
              }}>达人API</a>
              <a href="/api/health" style={{ 
                padding: '0.5rem 1rem', 
                backgroundColor: '#1e3a8a', 
                color: 'white', 
                textDecoration: 'none',
                borderRadius: '0.25rem',
                fontSize: '0.8rem'
              }}>健康检查</a>
              <a href="/api/referrals" style={{ 
                padding: '0.5rem 1rem', 
                backgroundColor: '#059669', 
                color: 'white', 
                textDecoration: 'none',
                borderRadius: '0.25rem',
                fontSize: '0.8rem'
              }}>推广API</a>
            </div>
          </div>

          {/* 数据库状态 */}
          <div style={{ 
            backgroundColor: '#1a1a1a', 
            border: '1px solid #333', 
            borderRadius: '0.75rem',
            padding: '1.5rem'
          }}>
            <h3 style={{ color: '#dc2626', fontSize: '1.25rem', marginBottom: '1rem' }}>
              🗄️ 数据库系统
            </h3>
            <p style={{ color: '#ccc', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Prisma ORM + SQLite，完整的数据模型设计
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <a href="/api/health/db" style={{ 
                padding: '0.5rem 1rem', 
                backgroundColor: '#dc2626', 
                color: 'white', 
                textDecoration: 'none',
                borderRadius: '0.25rem',
                fontSize: '0.8rem'
              }}>数据库状态</a>
              <button onClick={() => {
                window.open('/api/masters', '_blank');
                window.open('/api/users/profile', '_blank');
              }} style={{ 
                padding: '0.5rem 1rem', 
                backgroundColor: '#1e3a8a', 
                color: 'white', 
                border: 'none',
                borderRadius: '0.25rem',
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}>测试数据</button>
            </div>
          </div>
        </div>

        {/* 功能演示区域 */}
        <section style={{ 
          backgroundColor: '#0f2a0f', 
          border: '1px solid #22c55e', 
          borderRadius: '0.75rem',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{ color: '#22c55e', fontSize: '1.5rem', marginBottom: '1.5rem' }}>
            🎬 核心功能演示
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'center' }}>
            <div>
              <h4 style={{ color: '#fff', marginBottom: '1rem' }}>"The Glimpse" 首页体验</h4>
              <p style={{ color: '#ccc', marginBottom: '1rem', fontSize: '0.9rem' }}>
                11秒沉浸式视频交互体验，智能地理位置检测，情感化内容推荐算法
              </p>
              <div style={{ fontSize: '0.8rem', color: '#22c55e' }}>
                ✨ 功能：视频播放、情感识别、地理位置适配、多语言标语
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                padding: '3rem', 
                backgroundColor: 'rgba(34, 197, 94, 0.1)', 
                borderRadius: '0.5rem',
                border: '2px dashed #22c55e'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎥</div>
                <div style={{ color: '#22c55e', fontSize: '0.9rem' }}>视频交互组件已实现</div>
              </div>
            </div>
          </div>
        </section>

        <section style={{ 
          backgroundColor: '#2a1810', 
          border: '1px solid #f59e0b', 
          borderRadius: '0.75rem',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{ color: '#f59e0b', fontSize: '1.5rem', marginBottom: '1.5rem' }}>
            📖 "The Dossier" 达人档案
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'center' }}>
            <div>
              <h4 style={{ color: '#fff', marginBottom: '1rem' }}>沉浸式达人展示页面</h4>
              <p style={{ color: '#ccc', marginBottom: '1rem', fontSize: '0.9rem' }}>
                全屏英雄区域、视频介绍、实时兴趣统计、多语言内容展示
              </p>
              <div style={{ fontSize: '0.8rem', color: '#f59e0b' }}>
                ✨ 功能：达人卡片、视频播放、兴趣追踪、搜索过滤
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                padding: '3rem', 
                backgroundColor: 'rgba(245, 158, 11, 0.1)', 
                borderRadius: '0.5rem',
                border: '2px dashed #f59e0b'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👨‍🎨</div>
                <div style={{ color: '#f59e0b', fontSize: '0.9rem' }}>达人展示系统已完成</div>
              </div>
            </div>
          </div>
        </section>

        {/* 技术架构展示 */}
        <section style={{ 
          backgroundColor: '#1a1a2e', 
          border: '1px solid #4f46e5', 
          borderRadius: '0.75rem',
          padding: '2rem'
        }}>
          <h2 style={{ color: '#4f46e5', fontSize: '1.5rem', marginBottom: '1.5rem' }}>
            🏗️ 技术架构实现
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            <div>
              <h4 style={{ color: '#fff', marginBottom: '0.5rem' }}>前端技术</h4>
              <ul style={{ color: '#ccc', fontSize: '0.9rem', listStyle: 'none', padding: 0 }}>
                <li>✅ Next.js 15 + App Router</li>
                <li>✅ React 19 + TypeScript</li>
                <li>✅ Tailwind CSS v3</li>
                <li>✅ Framer Motion动画</li>
              </ul>
            </div>
            <div>
              <h4 style={{ color: '#fff', marginBottom: '0.5rem' }}>后端服务</h4>
              <ul style={{ color: '#ccc', fontSize: '0.9rem', listStyle: 'none', padding: 0 }}>
                <li>✅ Prisma ORM</li>
                <li>✅ NextAuth.js</li>
                <li>✅ SQLite数据库</li>
                <li>✅ RESTful API</li>
              </ul>
            </div>
            <div>
              <h4 style={{ color: '#fff', marginBottom: '0.5rem' }}>国际化</h4>
              <ul style={{ color: '#ccc', fontSize: '0.9rem', listStyle: 'none', padding: 0 }}>
                <li>✅ next-intl</li>
                <li>✅ 三语言支持</li>
                <li>✅ 地理位置检测</li>
                <li>✅ 动态路由</li>
              </ul>
            </div>
          </div>
        </section>

        <footer style={{ textAlign: 'center', marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #333' }}>
          <p style={{ color: '#ccc', fontSize: '0.9rem' }}>
            🚀 Tatami Labs - 深度对话体验，连接全球与日本大师
          </p>
          <div style={{ marginTop: '1rem' }}>
            <a href="/" style={{ 
              color: '#dc2626', 
              textDecoration: 'none', 
              marginRight: '2rem' 
            }}>← 返回首页</a>
            <a href="/status" style={{ 
              color: '#1e3a8a', 
              textDecoration: 'none' 
            }}>项目状态 →</a>
          </div>
        </footer>
      </div>
    </div>
  )
}