# US-001: 加盟商提交申请

## 用户故事

```
作为潜在加盟商
我想要填写并提交加盟申请表
这样餐厅总部可以联系我讨论合作细节
```

## 业务价值

- 收集潜在加盟商信息
- 建立加盟商联系渠道
- 数据持久化存储便于后续跟进

## 验收标准

- [ ] 加盟页面表单包含所有必要字段：
  - 姓名（必填）
  - 电话（必填，格式验证）
  - 邮箱（必填，格式验证）
  - 所在城市（必填）
  - 申请留言（可选）

- [ ] 表单验证：
  - 必填字段未填写时显示错误提示
  - 电话号码格式验证
  - 邮箱格式验证

- [ ] 成功提交后：
  - 数据保存到 Supabase `franchise_applications` 表
  - 显示成功提示信息
  - 表单自动清空
  - 默认状态设为 "pending"

- [ ] 错误处理：
  - 网络错误时显示友好提示
  - 重复提交防护（同一邮箱 24 小时内只能提交一次）

## 技术实现

### 数据库表结构
```sql
CREATE TABLE franchise_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  city TEXT NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### API 端点
- `POST /api/franchise/apply` - 提交申请

### 文件修改
- `app/franchise/page.tsx` - 修改表单提交逻辑
- `lib/supabase/client.ts` - Supabase 客户端

## 测试计划

### 单元测试
- [ ] 表单验证逻辑测试
- [ ] 重复提交检测测试

### 集成测试
- [ ] 成功提交流程测试
- [ ] 数据库存储验证
- [ ] 错误场景测试

### 用户测试
- [ ] 填写表单并提交
- [ ] 验证数据在管理后台可见

## 依赖

- Supabase 项目已配置
- `franchise_applications` 表已创建
- Supabase 客户端库已安装

## 时间估算

- 开发：1 小时
- 测试：30 分钟
- **总计：1.5 小时**

## 状态

- [ ] 待开始
- [ ] 开发中
- [ ] 待测试
- [ ] 已完成
