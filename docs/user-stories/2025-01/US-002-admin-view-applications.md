# US-002: 管理员查看加盟申请

## 用户故事

```
作为餐厅管理员
我想要查看所有加盟申请
这样我可以及时跟进潜在加盟商
```

## 业务价值

- 集中管理所有申请
- 提高响应效率
- 跟踪申请处理状态

## 验收标准

- [ ] 管理员登录后可访问申请管理页面 `/admin/franchise`

- [ ] 申请列表显示：
  - 申请人姓名
  - 联系电话
  - 所在城市
  - 申请时间
  - 当前状态（待处理/已联系/已拒绝/已合作）

- [ ] 列表功能：
  - 按时间倒序排列（最新的在前）
  - 分页显示（每页 20 条）
  - 状态筛选功能
  - 搜索功能（按姓名、电话、城市）

- [ ] 查看详情：
  - 点击申请可查看完整信息
  - 显示申请留言
  - 显示联系方式（可复制）

- [ ] 状态管理：
  - 可更新申请状态
  - 添加备注功能
  - 状态变更记录日志

- [ ] 数据导出：
  - 导出为 CSV 格式
  - 可选择导出全部或筛选结果

## 技术实现

### 页面路由
- `/admin/login` - 管理员登录页
- `/admin/dashboard` - 管理后台首页
- `/admin/franchise` - 申请管理页面

### API 端点
- `GET /api/admin/franchise/applications` - 获取申请列表
- `PATCH /api/admin/franchise/applications/:id` - 更新申请状态
- `GET /api/admin/franchise/export` - 导出数据

### 文件创建
- `app/admin/login/page.tsx` - 登录页面
- `app/admin/layout.tsx` - 管理后台布局
- `app/admin/dashboard/page.tsx` - 仪表板
- `app/admin/franchise/page.tsx` - 申请管理页面
- `components/admin/ApplicationTable.tsx` - 申请列表组件
- `components/admin/ApplicationDetail.tsx` - 申请详情组件

## 测试计划

### 功能测试
- [ ] 登录流程测试
- [ ] 列表加载测试
- [ ] 分页功能测试
- [ ] 搜索和筛选测试
- [ ] 状态更新测试
- [ ] 数据导出测试

### 权限测试
- [ ] 非管理员无法访问
- [ ] 未登录自动跳转登录页

## 依赖

- US-001 已完成（有申请数据）
- Supabase Auth 已配置
- 管理员账户已创建

## 时间估算

- 登录页面：1 小时
- 申请列表页：2 小时
- 状态管理：1 小时
- 导出功能：0.5 小时
- **总计：4.5 小时**

## 状态

- [ ] 待开始
- [ ] 开发中
- [ ] 待测试
- [ ] 已完成
