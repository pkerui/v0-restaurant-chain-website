# 潮来项目部署指南

## 方案 1：Vercel 部署（推荐 - 最简单）

### 步骤 1：准备工作

确保已修改 `next.config.mjs`，注释掉 `output: 'export'`

### 步骤 2：安装 Vercel CLI

```bash
npm i -g vercel
```

### 步骤 3：登录 Vercel

```bash
vercel login
```

### 步骤 4：部署

```bash
# 第一次部署
vercel

# 生产环境部署
vercel --prod
```

### 步骤 5：配置环境变量

在 Vercel Dashboard 中设置：
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**优点**：
- ✅ 自动 HTTPS
- ✅ 全球 CDN
- ✅ 自动构建部署
- ✅ 免费额度充足

**缺点**：
- ⚠️ 国内访问可能不稳定（建议绑定自己的域名）

---

## 方案 2：阿里云/腾讯云部署（国内访问最佳）

### 2.1 使用 Docker 部署

#### 创建 Dockerfile

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

#### 构建并部署

```bash
# 构建镜像
docker build -t chaolai-website .

# 运行容器
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=你的URL \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=你的KEY \
  chaolai-website
```

### 2.2 使用服务器直接部署

```bash
# SSH 登录服务器后

# 1. 克隆/上传项目代码
cd /var/www
git clone 你的仓库 或 上传代码

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.local.example .env.local
# 编辑 .env.local 填入正确的值

# 4. 构建项目
npm run build

# 5. 使用 PM2 运行
npm install -g pm2
pm2 start npm --name "chaolai" -- start
pm2 save
pm2 startup
```

### 2.3 配置 Nginx 反向代理

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 方案 3：Railway 部署（折中方案）

### 步骤 1：安装 Railway CLI

```bash
npm i -g @railway/cli
```

### 步骤 2：登录

```bash
railway login
```

### 步骤 3：初始化并部署

```bash
railway init
railway up
```

### 步骤 4：配置环境变量

在 Railway Dashboard 中设置环境变量

**优点**：
- ✅ 部署简单
- ✅ 国内大部分地区可访问
- ✅ 免费额度 $5/月

---

## 环境变量配置

无论使用哪种方案，都需要配置以下环境变量：

```
NEXT_PUBLIC_SUPABASE_URL=https://你的项目.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的匿名密钥
```

### 获取 Supabase 凭据

1. 登录 Supabase Dashboard
2. 选择你的项目
3. 点击 Settings -> API
4. 复制 Project URL 和 anon public key

---

## 部署前检查清单

- [ ] 修改 `next.config.mjs`（移除 `output: 'export'`）
- [ ] 确保 `.env.local` 配置正确
- [ ] 运行 `npm run build` 测试构建
- [ ] 确认 Supabase 数据库迁移已执行
- [ ] 确认 Supabase RLS 策略已配置

---

## 推荐配置

**个人/小型项目**：Vercel
**企业/商业项目（国内用户为主）**：阿里云/腾讯云 + Docker
**快速测试**：Railway

---

## 域名配置

部署后建议：
1. 购买域名
2. 配置 DNS 解析
3. 启用 HTTPS
4. 配置 CDN（可选，提升速度）

---

## 监控和维护

建议配置：
- 错误监控（Sentry）
- 性能监控（Vercel Analytics 或自建）
- 日志收集
- 定期备份数据库

---

最后更新：2025-11-13
