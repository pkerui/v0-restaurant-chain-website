# 地址自动转坐标功能说明

## 功能概述

✅ **已完成**：在门店管理后台中集成了地址自动转坐标功能,无需手动输入经纬度。

## 功能特点

1. **自动获取坐标**
   - 输入门店地址后,点击"自动获取坐标"按钮
   - 系统自动调用高德地图地理编码API
   - 将详细地址转换为经纬度坐标

2. **实时反馈**
   - 显示获取进度(按钮显示"获取中...")
   - 获取成功后显示坐标数值
   - 获取失败时提示错误信息

3. **坐标状态显示**
   - 门店卡片上显示"已设置地图坐标"(绿色)或"未设置地图坐标"(橙色)
   - 编辑表单中显示当前坐标值

4. **自动保存**
   - 坐标会随门店信息一起保存到数据库
   - 前端地图自动显示门店位置

## 使用方法

### 1. 配置高德地图 Key

打开 `lib/amap/config.ts`,替换您的 API Key:

```typescript
export const AMAP_CONFIG = {
  key: '您的高德地图Key',
  securityJsCode: '您的安全密钥',
  webServiceKey: '您的高德地图Key', // 可以与 key 相同
}
```

### 2. 在门店管理中使用

1. 访问 `/admin/stores`
2. 点击"添加门店"或"编辑"已有门店
3. 填写门店的详细地址(例如: 汕头市金平区XX路XX号)
4. 点击"自动获取坐标"按钮
5. 等待系统获取坐标(通常1-2秒)
6. 查看获取结果:
   - 成功: 显示"✅ 坐标获取成功！经度: xxx, 纬度: xxx"
   - 失败: 显示错误提示
7. 点击"保存"按钮保存门店信息

### 3. 查看地图效果

1. 访问前端门店页面 `/stores`
2. 滚动到底部的"门店位置地图"
3. 地图会自动显示所有已设置坐标的门店

## 技术实现

### 文件结构

```
lib/amap/
├── config.ts        # 高德地图配置(API Key)
└── geocoder.ts      # 地理编码工具函数

app/admin/stores/
└── page.tsx         # 门店管理页面(集成了自动获取坐标功能)

components/
└── amap.tsx         # 前端地图组件
```

### 核心功能

#### 1. 地理编码API (`lib/amap/geocoder.ts`)

```typescript
export async function geocodeAddress(
  address: string,
  city: string = '汕头市',
  key: string = AMAP_CONFIG.webServiceKey
): Promise<GeocodeResult>
```

**功能**:
- 调用高德地图 Web 服务 API 的地理编码接口
- 将详细地址转换为经纬度坐标
- 返回格式化的坐标信息

**参数**:
- `address`: 详细地址
- `city`: 城市名称(默认"汕头市",提高准确度)
- `key`: API Key(可选,默认使用配置文件中的 Key)

**返回**:
```typescript
{
  longitude: number   // 经度
  latitude: number    // 纬度
  formattedAddress: string  // 格式化地址
}
```

#### 2. 门店管理页面集成

**新增功能**:
- 添加"自动获取坐标"按钮
- 显示坐标获取状态
- 显示获取到的坐标值
- 门店卡片上显示坐标状态

**代码示例**:
```typescript
const handleGeocodeAddress = async () => {
  if (!formData.address) {
    alert('请先输入门店地址')
    return
  }

  setIsGeocodingAddress(true)
  try {
    const result = await geocodeAddress(formData.address, '汕头市')
    setFormData(prev => ({
      ...prev,
      latitude: result.latitude,
      longitude: result.longitude,
    }))
    alert(`✅ 坐标获取成功！\n经度: ${result.longitude}\n纬度: ${result.latitude}`)
  } catch (error: any) {
    alert('❌ 获取坐标失败: ' + error.message)
  } finally {
    setIsGeocodingAddress(false)
  }
}
```

## API调用限额

### 免费版限额

高德地图免费版的地理编码API:
- **调用次数**: 每天 30万次
- **并发量**: 每秒 200次
- **适用场景**: 个人开发、小型项目

### 如何提升配额

如果调用量不足,可以:
1. 升级为付费版
2. 申请多个 API Key 轮换使用
3. 在后端添加缓存机制(相同地址不重复调用)

## 故障排查

### 1. 坐标获取失败

**可能原因**:
- API Key 未配置或配置错误
- 地址格式不正确或过于模糊
- 超出API调用限额
- 网络连接问题

**解决方法**:
1. 检查 `lib/amap/config.ts` 中的 Key 是否正确
2. 尽量输入完整详细的地址(包含城市、区、街道、门牌号)
3. 查看浏览器控制台的错误信息
4. 检查高德地图控制台的调用统计

### 2. 地图上不显示门店

**可能原因**:
- 门店没有获取坐标
- 坐标未保存到数据库
- 地图组件 API Key 未配置

**解决方法**:
1. 在门店管理中检查是否显示"已设置地图坐标"
2. 检查数据库中 `stores` 表的 `latitude` 和 `longitude` 字段
3. 确认 `lib/amap/config.ts` 中配置了 Key

### 3. 坐标不准确

**可能原因**:
- 地址信息不够详细
- 存在多个同名地址

**解决方法**:
1. 输入更详细的地址(精确到门牌号)
2. 在地址前加上城市区域信息
3. 使用高德地图坐标拾取工具手动查询: https://lbs.amap.com/tools/picker

## 批量处理

如果需要批量为所有门店获取坐标,可以使用 `batchGeocodeAddresses` 函数:

```typescript
import { batchGeocodeAddresses } from '@/lib/amap/geocoder'

const addresses = [
  '汕头市金平区XX路XX号',
  '汕头市龙湖区YY路YY号',
  '汕头市濠江区ZZ路ZZ号',
]

const results = await batchGeocodeAddresses(addresses, '汕头市')
```

**注意**:
- 批量处理会自动添加100ms延迟,避免API限流
- 如果某个地址解析失败,会继续处理下一个
- 建议一次不超过100个地址

## 未来优化建议

1. **缓存机制**
   - 在数据库中缓存地址→坐标的映射
   - 相同地址直接读取缓存,减少API调用

2. **地址智能提示**
   - 集成高德地图的地址输入提示功能
   - 用户输入时显示候选地址

3. **坐标验证**
   - 检查获取的坐标是否在汕头市范围内
   - 超出范围时提示用户确认

4. **可视化选点**
   - 在表单中嵌入小地图
   - 用户可以直接在地图上点击选择位置

## 相关文档

- [高德地图配置说明](./amap-setup.md)
- [高德地图开放平台](https://lbs.amap.com/)
- [地理编码API文档](https://lbs.amap.com/api/webservice/guide/api/georegeo)
