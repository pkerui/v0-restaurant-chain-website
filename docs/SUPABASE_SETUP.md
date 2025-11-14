# Supabase 设置指南

本文档将指导您完成 Supabase 项目的创建和配置。

## 第一步：创建 Supabase 账户

1. 访问 [https://supabase.com](https://supabase.com)
2. 点击 "Start your project" 或 "Sign up"
3. 使用 GitHub 账号登录（推荐）或邮箱注册

## 第二步：创建新项目

1. 登录后，点击 "New Project"
2. 填写项目信息：
   - **Organization**: 选择或创建组织
   - **Project Name**: `chaolai-restaurant` （或您喜欢的名称）
   - **Database Password**: 设置一个强密码（请妥善保存）
   - **Region**: 选择 `Southeast Asia (Singapore)` 或最近的区域
   - **Pricing Plan**: 选择 `Free` （免费套餐）

3. 点击 "Create new project"
4. 等待 1-2 分钟，项目创建完成

## 第三步：获取项目凭据

项目创建完成后：

1. 在左侧菜单点击 **Settings** (⚙️)
2. 选择 **API**
3. 找到以下信息并保存：

```
Project URL: https://xxxxxxxxxxxxx.supabase.co
anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (仅用于服务器端)
```

⚠️ **重要**: `service_role` 密钥拥有完全权限，切勿暴露到前端！

## 第四步：运行数据库迁移

1. 在左侧菜单点击 **SQL Editor**
2. 点击 **New query**
3. 将项目中的 `migrations/001_initial_schema.sql` 文件内容复制粘贴到编辑器
4. 点击 **Run** 执行 SQL
5. 确认所有表创建成功（应该看到 "Success" 消息）

## 第五步：配置存储桶（Storage）

用于存储菜品和门店图片：

1. 在左侧菜单点击 **Storage**
2. 点击 **Create a new bucket**
3. 配置信息：
   - **Name**: `restaurant-images`
   - **Public bucket**: ✅ 勾选（图片需要公开访问）
4. 点击 **Create bucket**

### 配置存储策略

点击刚创建的 bucket，然后：

1. 切换到 **Policies** 标签
2. 点击 **New Policy**
3. 选择 **Create policy from template**
4. 选择 **Enable read access for all users**
5. 点击 **Review** 然后 **Save policy**

这样所有用户都可以查看图片，但只有管理员可以上传。

## 第六步：配置本地环境变量

在项目根目录创建 `.env.local` 文件：

```bash
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ 替换为您在第三步获取的实际值

## 第七步：创建管理员账户

回到 Supabase 控制台：

1. 点击左侧菜单的 **Authentication**
2. 点击 **Add user** → **Create new user**
3. 填写：
   - **Email**: 您的管理员邮箱
   - **Password**: 设置强密码
   - **Auto Confirm User**: ✅ 勾选
4. 点击 **Create user**
5. 复制生成的 User ID（UUID）

### 设置管理员角色

1. 回到 **SQL Editor**
2. 执行以下 SQL（替换 `YOUR_USER_ID`）：

```sql
-- 将用户设置为管理员
INSERT INTO profiles (id, role, full_name)
VALUES ('YOUR_USER_ID', 'admin', '管理员');
```

## 第八步：验证设置

运行以下检查确保一切正常：

### 检查表是否创建
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';
```

应该看到：
- `profiles`
- `stores`
- `menu_items`
- `franchise_applications`

### 检查 RLS 策略
```sql
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE schemaname = 'public';
```

应该看到多个策略已启用。

## 完成！

✅ Supabase 项目配置完成！

现在您可以：
1. 运行 `npm install` 安装 Supabase 客户端库
2. 启动开发服务器 `npm run dev`
3. 访问管理后台 `http://localhost:3000/admin/login`

## 故障排除

### 问题 1: 无法连接数据库
- 检查 `.env.local` 文件中的 URL 是否正确
- 确保项目已完全启动（等待 2 分钟）

### 问题 2: RLS 错误
- 确保已运行迁移脚本
- 检查策略是否正确创建

### 问题 3: 存储上传失败
- 确保 bucket 已创建并设为 public
- 检查存储策略是否正确配置

## 需要帮助？

- [Supabase 官方文档](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
