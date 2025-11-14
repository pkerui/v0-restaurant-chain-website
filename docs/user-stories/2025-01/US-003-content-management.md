# US-003: 管理员更新展示内容

## 用户故事

```
作为餐厅管理员
我想要更新网站展示内容（菜单、门店信息）
这样网站信息保持最新且准确
```

## 业务价值

- 无需开发人员即可更新内容
- 保持信息实时性
- 提升用户体验

## 验收标准

### 菜单管理 (`/admin/menu`)

- [ ] 查看所有菜单项列表
- [ ] 添加新菜品：
  - 菜品名称
  - 分类（主食/配菜/饮品）
  - 价格
  - 描述
  - 辣度等级（0-3）
  - 是否热销
  - 上传菜品图片

- [ ] 编辑现有菜品
- [ ] 删除菜品（需确认）
- [ ] 排序功能（拖拽排序）

### 门店管理 (`/admin/stores`)

- [ ] 查看所有门店列表
- [ ] 添加新门店：
  - 门店名称
  - 详细地址
  - 联系电话
  - 营业时间
  - 门店描述
  - 经纬度（可选）
  - 大众点评链接
  - 上传门店图片

- [ ] 编辑门店信息
- [ ] 删除门店（需确认）

### 图片管理

- [ ] 支持拖拽上传图片
- [ ] 图片预览功能
- [ ] 自动压缩优化
- [ ] 存储到 Supabase Storage

## 技术实现

### 数据库表结构

```sql
-- 菜单项表
CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  spicy_level INTEGER DEFAULT 0,
  is_bestseller BOOLEAN DEFAULT FALSE,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 门店表
CREATE TABLE stores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  hours TEXT NOT NULL,
  description TEXT,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  dianping_url TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 页面路由
- `/admin/menu` - 菜单管理
- `/admin/stores` - 门店管理

### API 端点

**菜单**
- `GET /api/admin/menu` - 获取所有菜品
- `POST /api/admin/menu` - 创建菜品
- `PATCH /api/admin/menu/:id` - 更新菜品
- `DELETE /api/admin/menu/:id` - 删除菜品

**门店**
- `GET /api/admin/stores` - 获取所有门店
- `POST /api/admin/stores` - 创建门店
- `PATCH /api/admin/stores/:id` - 更新门店
- `DELETE /api/admin/stores/:id` - 删除门店

**上传**
- `POST /api/admin/upload` - 上传图片

### 文件创建
- `app/admin/menu/page.tsx` - 菜单管理页
- `app/admin/stores/page.tsx` - 门店管理页
- `components/admin/MenuForm.tsx` - 菜品表单组件
- `components/admin/StoreForm.tsx` - 门店表单组件
- `components/admin/ImageUpload.tsx` - 图片上传组件
- `lib/supabase/storage.ts` - 存储工具函数

### 文件修改
- `app/menu/page.tsx` - 从数据库加载数据
- `app/stores/page.tsx` - 从数据库加载数据

## 测试计划

### CRUD 测试
- [ ] 创建菜品/门店
- [ ] 读取列表
- [ ] 更新信息
- [ ] 删除项目

### 图片上传测试
- [ ] 上传 JPG/PNG
- [ ] 文件大小限制（5MB）
- [ ] 格式验证
- [ ] 存储和访问

### 前端集成测试
- [ ] 修改后台数据
- [ ] 前台页面立即更新

## 依赖

- US-002 已完成（管理员可登录）
- Supabase Storage 已配置
- 相关表已创建

## 时间估算

- 菜单管理：2.5 小时
- 门店管理：2 小时
- 图片上传：1 小时
- 前端数据加载：1 小时
- **总计：6.5 小时**

## 状态

- [ ] 待开始
- [ ] 开发中
- [ ] 待测试
- [ ] 已完成
