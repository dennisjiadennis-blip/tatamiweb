# Tatami Labs 部署指南

## 📋 部署前检查清单

### 1. 环境准备
- [ ] Node.js 18.17+ 或更高版本
- [ ] PostgreSQL 数据库（生产环境）
- [ ] 域名和SSL证书
- [ ] CDN服务（可选，用于静态资源）

### 2. 环境变量配置
复制 `.env.production` 并填写所有必需的值：

```bash
cp .env.production .env.production.local
```

必需的环境变量：
- `DATABASE_URL` - PostgreSQL连接字符串
- `NEXTAUTH_URL` - 生产环境URL
- `NEXTAUTH_SECRET` - 生成安全的密钥：`openssl rand -base64 32`
- `GOOGLE_CLIENT_ID/SECRET` - Google OAuth凭据
- `EMAIL_SERVER_*` - 邮件服务器配置

## 🚀 部署方式

### 选项1：Vercel（推荐）

1. **连接GitHub仓库**
   ```bash
   git remote add origin https://github.com/yourusername/tatami-labs.git
   git push -u origin main
   ```

2. **在Vercel中导入项目**
   - 访问 https://vercel.com/new
   - 导入GitHub仓库
   - 配置环境变量
   - 部署

3. **数据库迁移**
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```

### 选项2：自托管（Docker）

1. **构建Docker镜像**
   ```bash
   docker build -t tatami-labs .
   ```

2. **运行容器**
   ```bash
   docker run -p 3000:3000 \
     -e DATABASE_URL="postgresql://..." \
     -e NEXTAUTH_SECRET="..." \
     tatami-labs
   ```

### 选项3：传统服务器

1. **安装依赖**
   ```bash
   npm ci --production
   ```

2. **构建项目**
   ```bash
   npm run build
   ```

3. **数据库迁移**
   ```bash
   npx prisma migrate deploy
   ```

4. **启动应用**
   ```bash
   npm start
   ```

## 📊 性能优化

### 1. 数据库优化
```sql
-- 添加索引
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_masters_priority ON masters(priority);
CREATE INDEX idx_referral_links_code ON referral_links(code);
```

### 2. 缓存配置
- 配置Redis缓存（可选）
- 启用Next.js ISR（增量静态再生）
- 配置CDN缓存规则

### 3. 监控设置
- 配置错误追踪（Sentry）
- 设置性能监控（Vercel Analytics）
- 配置日志收集（LogDNA/Datadog）

## 🔒 安全配置

### 1. 安全头部
在 `next.config.js` 中配置：
```javascript
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
]
```

### 2. 速率限制
配置API速率限制以防止滥用

### 3. 内容安全策略（CSP）
设置适当的CSP头部

## 📈 监控和维护

### 1. 健康检查端点
- `/api/health` - 基本健康检查
- `/api/health/db` - 数据库连接检查

### 2. 备份策略
- 每日数据库备份
- 用户上传文件备份
- 配置文件版本控制

### 3. 更新流程
```bash
# 1. 备份数据库
pg_dump production_db > backup.sql

# 2. 拉取最新代码
git pull origin main

# 3. 安装依赖
npm ci

# 4. 运行迁移
npx prisma migrate deploy

# 5. 构建项目
npm run build

# 6. 重启服务
pm2 restart tatami-labs
```

## 🆘 故障排除

### 常见问题

1. **数据库连接失败**
   - 检查DATABASE_URL格式
   - 确认数据库服务运行正常
   - 验证网络连接

2. **认证问题**
   - 确认NEXTAUTH_URL正确
   - 检查NEXTAUTH_SECRET设置
   - 验证OAuth回调URL

3. **性能问题**
   - 检查数据库查询性能
   - 优化图片和视频加载
   - 启用缓存机制

## 📞 支持

如需帮助，请联系：
- 技术支持：support@tatamilabs.com
- 文档：https://docs.tatamilabs.com
- GitHub Issues：https://github.com/tatami-labs/issues