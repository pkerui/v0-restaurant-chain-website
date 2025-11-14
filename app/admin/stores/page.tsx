"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit, Trash2, Loader2, X, MapPin } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import type { Store, StoreInsert, StoreUpdate } from "@/lib/supabase/types"
import ImageUpload from "@/components/admin/ImageUpload"
import { deleteImage } from "@/lib/supabase/storage"
import { geocodeAddress } from "@/lib/amap/geocoder"

export default function StoresManagementPage() {
  const [stores, setStores] = useState<Store[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingStore, setEditingStore] = useState<Store | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGeocodingAddress, setIsGeocodingAddress] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    hours: "",
    description: "",
    dianping_url: "",
    image_url: "",
    sort_order: 0,
    latitude: null as number | null,
    longitude: null as number | null,
  })

  useEffect(() => {
    loadStores()
  }, [])

  const loadStores = async () => {
    try {
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .order('sort_order', { ascending: true })

      if (error) throw error
      setStores(data || [])
    } catch (error) {
      console.error('加载门店失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'sort_order'
        ? value === '' ? '' : Number(value)
        : name === 'latitude' || name === 'longitude'
        ? value === '' ? null : Number(value)
        : value
    }))
  }

  const handleOpenForm = (store?: Store) => {
    if (store) {
      setEditingStore(store)
      setFormData({
        name: store.name,
        address: store.address,
        phone: store.phone,
        hours: store.hours,
        description: store.description || "",
        dianping_url: store.dianping_url || "",
        image_url: store.image_url || "",
        sort_order: store.sort_order,
        latitude: store.latitude,
        longitude: store.longitude,
      })
    } else {
      setEditingStore(null)
      setFormData({
        name: "",
        address: "",
        phone: "",
        hours: "",
        description: "",
        dianping_url: "",
        image_url: "",
        sort_order: stores.length + 1,
        latitude: null,
        longitude: null,
      })
    }
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingStore(null)
  }

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
      console.error('地理编码失败:', error)
    } finally {
      setIsGeocodingAddress(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // 验证经纬度范围
      if (formData.latitude !== null) {
        if (formData.latitude < -90 || formData.latitude > 90) {
          alert('纬度必须在 -90 到 90 之间')
          setIsSubmitting(false)
          return
        }
      }
      if (formData.longitude !== null) {
        if (formData.longitude < -180 || formData.longitude > 180) {
          alert('经度必须在 -180 到 180 之间')
          setIsSubmitting(false)
          return
        }
      }

      const storeData = {
        name: formData.name,
        address: formData.address,
        phone: formData.phone,
        hours: formData.hours,
        description: formData.description || null,
        latitude: formData.latitude,
        longitude: formData.longitude,
        dianping_url: formData.dianping_url || null,
        image_url: formData.image_url || null,
        sort_order: formData.sort_order,
      }

      console.log('准备保存的数据:', storeData)

      if (editingStore) {
        // 更新
        const { error } = await supabase
          .from('stores')
          .update(storeData as StoreUpdate)
          .eq('id', editingStore.id)

        if (error) throw error
      } else {
        // 新增
        const { error } = await supabase
          .from('stores')
          .insert(storeData as StoreInsert)

        if (error) throw error
      }

      await loadStores()
      handleCloseForm()
    } catch (error: any) {
      console.error('保存失败:', error)
      alert('保存失败: ' + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (store: Store) => {
    if (!confirm(`确定要删除 "${store.name}" 吗？`)) return

    try {
      // 如果有图片，先删除
      if (store.image_url) {
        await deleteImage(store.image_url).catch(console.error)
      }

      const { error } = await supabase
        .from('stores')
        .delete()
        .eq('id', store.id)

      if (error) throw error

      await loadStores()
    } catch (error: any) {
      console.error('删除失败:', error)
      alert('删除失败: ' + error.message)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">门店管理</h1>
          <p className="text-muted-foreground">管理所有门店信息</p>
        </div>
        <Button onClick={() => handleOpenForm()}>
          <Plus className="w-4 h-4 mr-2" />
          添加门店
        </Button>
      </div>

      {/* Stores List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.map((store) => (
          <Card key={store.id} className="p-6">
            {/* Image */}
            {store.image_url && (
              <div className="mb-4 w-full aspect-[4/3] rounded-lg overflow-hidden bg-secondary">
                <img
                  src={store.image_url}
                  alt={store.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Info */}
            <h3 className="text-lg font-bold mb-2">{store.name}</h3>
            <div className="space-y-1 text-sm text-muted-foreground mb-4">
              <p>{store.address}</p>
              <p>{store.phone}</p>
              <p>营业时间: {store.hours}</p>
              {store.latitude && store.longitude ? (
                <p className="text-green-600 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  已设置地图坐标
                </p>
              ) : (
                <p className="text-orange-600 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  未设置地图坐标
                </p>
              )}
              {store.dianping_url && (
                <a
                  href={store.dianping_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  大众点评链接
                </a>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenForm(store)}
                className="flex-1"
              >
                <Edit className="w-4 h-4 mr-1" />
                编辑
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(store)}
                className="flex-1 text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                删除
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">
                {editingStore ? '编辑门店' : '添加门店'}
              </h2>
              <button
                onClick={handleCloseForm}
                className="p-1 hover:bg-secondary rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">门店名称 *</label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">联系电话 *</label>
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">详细地址 *</label>
                <Input
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="例如: 汕头市金平区XX路XX号"
                  required
                />
              </div>

              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-2">
                  <div className="text-blue-600 dark:text-blue-400 font-bold text-lg">ℹ️</div>
                  <div className="text-sm">
                    <p className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                      坐标格式说明（重要！）
                    </p>
                    <p className="text-blue-800 dark:text-blue-200">
                      高德地图坐标拾取器显示的格式是：<span className="font-mono bg-blue-100 dark:bg-blue-900 px-2 py-0.5 rounded">经度,纬度</span>
                    </p>
                    <p className="text-blue-800 dark:text-blue-200 mt-1">
                      例如 <span className="font-mono">106.567746,29.635868</span> 表示：
                      <span className="font-semibold ml-1">经度 106.567746，纬度 29.635868</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    经度（Longitude）⬅️ 第一个数字
                    <a
                      href="https://lbs.amap.com/tools/picker"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-xs text-primary hover:underline"
                    >
                      📍 打开坐标拾取器
                    </a>
                  </label>
                  <Input
                    type="number"
                    step="0.000001"
                    min="-180"
                    max="180"
                    name="longitude"
                    value={formData.longitude || ''}
                    onChange={handleInputChange}
                    placeholder="例如: 106.567746 (范围: -180 到 180)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    纬度（Latitude）⬅️ 第二个数字
                  </label>
                  <Input
                    type="number"
                    step="0.000001"
                    min="-90"
                    max="90"
                    name="latitude"
                    value={formData.latitude || ''}
                    onChange={handleInputChange}
                    placeholder="例如: 29.635868 (范围: -90 到 90)"
                  />
                </div>
              </div>

              <div className="bg-secondary/20 rounded-lg p-4 text-sm">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                  <div className="space-y-1">
                    <p className="font-medium">如何获取坐标？</p>
                    <ol className="text-muted-foreground space-y-1 list-decimal list-inside">
                      <li>点击上方"📍 打开坐标拾取器"链接</li>
                      <li>在地图上搜索或点击门店位置</li>
                      <li>复制显示的经纬度坐标（格式：经度,纬度）</li>
                      <li>分别粘贴到上方对应的输入框中</li>
                    </ol>
                    <p className="text-xs text-muted-foreground mt-2">
                      💡 提示：纬度范围 -90 到 90，经度范围 -180 到 180
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">营业时间 *</label>
                  <Input
                    name="hours"
                    value={formData.hours}
                    onChange={handleInputChange}
                    placeholder="如: 10:00-22:00"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">排序</label>
                  <Input
                    type="number"
                    name="sort_order"
                    value={formData.sort_order}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">门店描述</label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">大众点评链接</label>
                <Input
                  name="dianping_url"
                  value={formData.dianping_url}
                  onChange={handleInputChange}
                  placeholder="https://www.dianping.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">门店图片</label>
                <ImageUpload
                  currentImage={formData.image_url}
                  folder="stores"
                  onUploadComplete={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
                  onRemove={() => setFormData(prev => ({ ...prev, image_url: "" }))}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseForm}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  取消
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      保存中...
                    </>
                  ) : (
                    '保存'
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  )
}
