# 潮来餐厅连锁网站项目

**项目别名**：潮来项目
**快速指令**：打开潮来项目

## 项目信息

- **项目名称**：潮来餐厅连锁网站
- **项目类型**：餐饮连锁企业官网 + 管理后台
- **技术栈**：Next.js 16 + Supabase + TypeScript + Tailwind CSS
- **项目路径**：`/Users/kerian/v0-restaurant-chain-website`

## 快速启动

```bash
cd /Users/kerian/v0-restaurant-chain-website
npm run dev
```

访问地址：
- 前台：http://localhost:3000
- 后台：http://localhost:3000/admin

## 主要功能模块

### 前台页面
- ✅ 首页
- ✅ 关于我们
- ✅ 门店信息
- ✅ 菜单展示
- ✅ 加盟信息
- ✅ 联系我们
- ✅ 顾客评价

### 管理后台
- ✅ 仪表盘
- ✅ 门店管理
- ✅ 菜单管理
- ✅ 菜单分类
- ✅ 加盟申请管理
- ✅ 加盟信息管理（优势、要求、流程）
- ✅ 联系表单管理
- ✅ 顾客评价管理
- ✅ 品牌风采管理
- ✅ Footer 管理
- ✅ 站点设置（支持分类标签）

## 数据库

- **服务**：Supabase PostgreSQL
- **主要表**：
  - stores（门店）
  - menu_items（菜品）
  - menu_categories（菜单分类）
  - franchise_applications（加盟申请）
  - franchise_benefits（加盟优势）
  - franchise_requirements（加盟要求）
  - franchise_process（加盟流程）
  - contact_submissions（联系表单）
  - testimonials（顾客评价）
  - brand_gallery（品牌风采）
  - footer_links（页脚链接）
  - site_settings（站点设置）

## 迁移脚本

位于 `/migrations` 目录，按序号执行：
- 001-018: 各功能模块数据库架构
- 最新：018_migrate_menu_tips_to_settings.sql

## 部署

- **静态导出**：`npm run build` 生成到 `out/` 目录
- **演示包**：website-demo.zip（已配置 Mac/Windows 启动脚本）

## 环境变量

需要配置 `.env.local`：
```
NEXT_PUBLIC_SUPABASE_URL=你的Supabase URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Supabase匿名密钥
```

## 最后更新

2025-11-13

## 开发者备注

- 所有页面文字支持在"站点设置"中编辑
- 管理后台需要 Supabase 认证
- 前台数据从 Supabase 实时加载
