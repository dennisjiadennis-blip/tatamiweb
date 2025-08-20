# 🏯 Tatami Labs

> 连接全球用户与日本达人的深度对话平台

[![Next.js](https://img.shields.io/badge/Next.js-15.4.6-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.14.0-green)](https://prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0+-blue)](https://tailwindcss.com/)

## 🌟 项目概览

Tatami Labs 是一个创新的文化交流平台，致力于通过沉浸式的对话体验，连接全球用户与日本传统文化的大师们。我们相信每一次深度对话都是一次心灵的相遇，每一份传承都值得被珍视和传播。

### ✨ 核心特色

- **🎯 The Glimpse** - 11秒沉浸式首页体验，智能匹配用户与达人
- **📋 The Dossier** - 详细的达人档案页面，展示每位大师的独特故事  
- **🌍 三语支持** - 英语、繁体中文、日语，基于地理位置的智能语言检测
- **🔗 推广系统** - 完整的推广链接和佣金追踪系统
- **🎨 极简设计** - Editorial Minimalism 设计语言，专注内容本质
- **📱 完全响应式** - 完美适配桌面端和移动端，支持手势操作

## 🚀 快速开始

### 环境要求

- Node.js 18.17+
- npm 或 yarn
- SQLite (开发) / PostgreSQL (生产)

### 安装和运行

```bash
# 克隆项目
git clone https://github.com/tatami-labs/tatami-labs.git
cd tatami-labs

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 填入必要的配置

# 初始化数据库
npm run db:push
npm run db:seed

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000 开始探索。

### 🧪 测试账号

- **超级管理员**: admin@tatamilabs.com
- **内容编辑**: editor@tatamilabs.com  
- **普通用户**: user@example.com

## 🏗️ 技术栈

### 前端架构
- **Next.js 15** - React 全栈框架，App Router
- **TypeScript** - 完整的类型安全
- **Tailwind CSS 4** - 原子化CSS框架
- **Framer Motion** - 高性能动画库
- **next-intl** - 国际化和本地化

### 后端和数据库
- **Prisma ORM** - 现代数据库工具
- **NextAuth.js** - 完整的认证解决方案
- **SQLite/PostgreSQL** - 灵活的数据库选择
- **RESTful API** - 标准化API设计

### UI和组件
- **Radix UI** - 可访问性优先的无头组件
- **shadcn/ui** - 现代化UI组件库
- **Lucide React** - 一致的图标系统

## 📁 项目架构

```
tatami-labs/
├── src/
│   ├── app/                    # App Router 路由系统
│   │   ├── [locale]/          # 多语言动态路由
│   │   │   ├── page.tsx       # 首页 "The Glimpse"
│   │   │   ├── masters/       # 达人展示 "The Dossier"  
│   │   │   ├── profile/       # 用户会员中心
│   │   │   └── auth/          # 认证页面
│   │   ├── api/               # API 路由端点
│   │   │   ├── auth/          # 认证相关 API
│   │   │   ├── cms/           # CMS 管理 API
│   │   │   └── referrals/     # 推广系统 API
│   │   └── cms/               # CMS 管理后台
│   ├── components/            # React 组件库
│   │   ├── ui/                # 基础 UI 组件
│   │   ├── layout/            # 布局和导航组件
│   │   ├── auth/              # 认证相关组件
│   │   ├── cms/               # CMS 管理组件
│   │   └── features/          # 业务功能组件
│   ├── lib/                   # 工具库和配置
│   │   ├── cms/               # CMS 权限和认证
│   │   ├── hooks/             # 自定义 React Hooks
│   │   └── utils/             # 通用工具函数
│   ├── i18n/                  # 国际化配置和翻译
│   └── types/                 # TypeScript 类型定义
├── prisma/                    # 数据库配置
│   ├── schema.prisma          # 数据库模式定义
│   └── seed.ts                # 测试数据种子脚本
├── public/                    # 静态资源文件
└── scripts/                   # 部署和维护脚本
```

## 🎯 功能模块

### 🌟 用户端核心功能
- **沉浸式首页**: 11秒视频体验时线，智能达人匹配算法
- **达人档案页**: 详细的大师信息展示，视频介绍，体验预约
- **会员中心**: 个人资料管理，兴趣追踪，积分系统，推广收益
- **推广系统**: 个人推广链接生成，实时数据追踪，佣金结算
- **多语言支持**: 基于地理位置的智能语言检测和切换

### 🛠️ 管理端功能
- **内容管理**: 达人信息管理，文章内容发布，多媒体资源管理  
- **用户管理**: 用户账号管理，角色权限分配，用户活动统计
- **推广监控**: 推广链接效果监控，转化数据分析，佣金管理
- **系统配置**: 网站全局设置，邮件模板配置，安全策略管理

## 🔧 开发命令

### 开发和构建
```bash
npm run dev              # 启动开发服务器 (localhost:3000)
npm run build            # 构建生产版本
npm run start            # 启动生产服务器
npm run type-check       # TypeScript 类型检查
```

### 数据库管理
```bash  
npm run db:generate      # 生成 Prisma 客户端
npm run db:push          # 推送数据库结构变更
npm run db:seed          # 填充测试数据
npm run db:studio        # 打开 Prisma Studio 数据库GUI
npm run db:migrate       # 创建和应用数据库迁移
npm run db:reset         # 重置数据库（开发环境）
```

### 代码质量
```bash
npm run lint             # ESLint 代码检查和格式验证
npm run lint:fix         # 自动修复可修复的 ESLint 问题
npm run format           # Prettier 代码格式化
npm run format:check     # 检查代码格式是否符合标准
```

## ⚙️ 环境配置

创建 `.env.local` 文件并配置以下变量：

```bash
# 数据库配置
DATABASE_URL="file:./dev.db"

# NextAuth 认证配置
NEXTAUTH_URL="http://localhost:3000"  
NEXTAUTH_SECRET="your-nextauth-secret-key"

# Google OAuth 认证
GOOGLE_CLIENT_ID="your-google-oauth-client-id"
GOOGLE_CLIENT_SECRET="your-google-oauth-client-secret"

# 邮件服务配置
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-smtp-username"  
EMAIL_SERVER_PASSWORD="your-smtp-password"
EMAIL_FROM="noreply@tatamilabs.com"
```

## 🚢 部署选项

### 🌐 Vercel 部署 (推荐)

Vercel 是最简单的部署方式：

1. Fork 本仓库到你的 GitHub 账户
2. 在 [Vercel](https://vercel.com) 导入 GitHub 项目
3. 配置环境变量（数据库、认证、邮件等）
4. 部署自动完成

### 🐳 Docker 部署

使用 Docker 进行容器化部署：

```bash
# 构建 Docker 镜像
docker build -t tatami-labs .

# 运行单个容器
docker run -p 3000:3000 \
  -e DATABASE_URL="your-database-url" \
  -e NEXTAUTH_SECRET="your-secret" \
  tatami-labs
```

### 📦 Docker Compose 部署

使用 docker-compose 部署完整堆栈（应用 + 数据库 + 缓存）：

```bash
# 启动所有服务（应用、PostgreSQL、Redis、Nginx）
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看应用日志  
docker-compose logs -f app
```

### 🖥️ 传统服务器部署

```bash
# 安装生产依赖
npm ci --production

# 构建应用
npm run build

# 运行数据库迁移
npx prisma migrate deploy

# 启动应用服务
npm start
```

### 🚀 一键部署脚本

使用内置的部署脚本：

```bash
# 部署到开发/测试环境
./scripts/deploy.sh staging

# 部署到生产环境（包含数据库备份）
./scripts/deploy.sh production
```

详细的部署指南请参考 [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🔍 健康检查

部署后可以通过以下端点检查应用状态：

- **基础健康检查**: `GET /api/health` 或 `/health`
- **数据库连接检查**: `GET /api/health/db`

健康检查返回应用状态、数据库连接、内存使用等信息。

## 🤝 贡献指南

我们欢迎并感谢任何形式的贡献！

### 贡献步骤
1. Fork 项目到你的 GitHub 账户
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的修改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

### 开发规范
- 遵循 ESLint 和 Prettier 配置的代码规范
- 所有新功能需要包含相应的 TypeScript 类型定义
- 提交信息请使用清晰的描述
- 大功能建议先创建 Issue 进行讨论

## 📄 开源许可

本项目采用 MIT 许可证。查看 [LICENSE](LICENSE) 文件了解完整的许可证条款。

## 🙏 致谢和鸣谢

- 🎌 感谢所有参与日本传统文化传承的大师们  
- 🔧 感谢开源社区提供的优秀工具和库
- 👥 感谢每一位贡献者、使用者和支持者
- 🎨 特别感谢 Next.js、Prisma、Tailwind CSS 等技术社区

## 📞 联系方式

- **项目官网**: https://tatamilabs.com
- **技术支持**: hello@tatamilabs.com  
- **GitHub**: https://github.com/tatami-labs
- **问题反馈**: [GitHub Issues](https://github.com/tatami-labs/issues)

---

*用心连接，传承文化。每一次对话，都是文化的传递。* ❤️🏯
